'use strict';

// Initializes LiveChatUser.
function LiveChatUser() {

  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.messageList = document.getElementById('messages');
  this.messageForm = document.getElementById('message-form');
  this.messageInput = document.getElementById('message');
  this.submitButton = document.getElementById('submit');
  this.submitImageButton = document.getElementById('submitImage');
  this.imageForm = document.getElementById('image-form');
  this.mediaCapture = document.getElementById('mediaCapture');
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');
  this.chatSlotAvailable = document.getElementById('chat_slot_available_text');
  this.categoryList = document.getElementById('categoryList');
  this.endChatButton = document.getElementById('chat_end_button');
  this.ratingForm = document.getElementById('ratingsForm');
  this.submitRatingButton = document.getElementById('submit-rating-button');
  this.sendEmailForm = document.getElementById('send-email-div');
  this.sendEmailButton = document.getElementById('send-email-button');

  // Saves message on form submit.
  this.messageForm.addEventListener('submit', this.saveMessage.bind(this));
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));

  // Toggle for the button.
  var buttonTogglingHandler = this.toggleButton.bind(this);
  this.messageInput.addEventListener('keyup', buttonTogglingHandler);
  this.messageInput.addEventListener('change', buttonTogglingHandler);

  // Events for image upload.
  this.submitImageButton.addEventListener('click', function(e) {
    e.preventDefault();
    this.mediaCapture.click();
  }.bind(this));
  this.mediaCapture.addEventListener('change', this.saveImageMessage.bind(this));

  this.isSlotAvailable = false;
  this.whichChat = "none";
  this.isChatStarted = false;
  this.isFirstMessage = true;
  this.setChatState();

  this.endChatButton.setAttribute('disabled', 'true');
  this.endChatButton.addEventListener('click', this.endChat.bind(this));
  this.submitRatingButton.addEventListener('click', this.submitRating.bind(this));
  this.sendEmailButton.addEventListener('click', this.submitEmail.bind(this));

  this.initFirebase();
}

LiveChatUser.prototype.setChatState = function(key, ina) {
  console.log("isChatStarted : " + this.isChatStarted + "\n"
              + "isSlotAvailable : " + this.isSlotAvailable + "\n"
              + "whichChat : " + this.whichChat + "\n"
              + "isFirstMessage : " + this.isFirstMessage);
  if (key && !this.isChatStarted) {
    // window.alert(key + "\n" + ina + "\n" + this.whichChat + "\n" + this.isSlotAvailable);
    if (key == this.whichChat) {
      this.isSlotAvailable = !ina;
      if (!ina) {
        this.chatSlotAvailable.innerHTML = "We are online now wih " + key;
      } else {
        this.chatSlotAvailable.innerHTML = "We are offline now";
      }
    } else {
      if (!ina) {
        if (!this.isSlotAvailable) {
          this.isSlotAvailable = true;
          this.whichChat = key;
          this.chatSlotAvailable.innerHTML = "We are online now wih " + key;
        }
      }
    }
  } else if (key && this.isChatStarted && key == this.whichChat && !ina) {
    this.isChatStarted = false;
    this.isSlotAvailable = false;
    this.whichChat = "none";
    this.isFirstMessage = true;
    this.endChatButton.setAttribute('disabled', 'true');
    this.ratingForm.style.display = "block";
  }
};

// Sets up shortcuts to Firebase features and initiate firebase auth.
LiveChatUser.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.

  this.auth = firebase.auth();

  this.database = firebase.database();

  this.storage = firebase.storage();

  // Initiates Firebase auth and listen to auth state changes.

  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));

  this.messagesRef = this.database.ref('none');
};

// Loads chat messages history and listens for upcoming ones.
LiveChatUser.prototype.loadMessages = function() {
  // Reference to the /messeges/ database path
  // this.messagesRef = this.database.ref('demo_messages');

  // Make sure we remove all perious listeners.
  this.messagesRef.off();

  // Loads the last 12 messages and listen for new ones.
  var setMessage = function (data) {
    var val = data.val();
    this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
  }.bind(this);
  this.messagesRef.limitToLast(12).on('child_added', setMessage);
  this.messagesRef.limitToLast(12).on('child_changed', setMessage);
};

LiveChatUser.prototype.loadChatStatus = function() {
  this.activeChatsRef = this.database.ref('active_chats');

  this.activeChatsRef.off();

  var setStatus = function(data) {
    var val = data.val();
    this.setChatState(data.key, val.isActive);
    // window.alert(val.isActive + "\n" + val.topic);
  }.bind(this);
  this.activeChatsRef.on('child_added', setStatus);
  this.activeChatsRef.on('child_changed', setStatus);
}

LiveChatUser.prototype.promptUserToSendEmail = function() {
  this.sendEmailForm.style.display = "block";
  document.getElementById('send-email-name').value = this.auth.currentUser.displayName;
  document.getElementById('send-email-email').value = this.auth.currentUser.email;
};

// Saves a new message on the Firebase DB.
LiveChatUser.prototype.saveMessage = function(e) {
  // console.log("insavemessage isSlotAvailable : " + this.isSlotAvailable);
  if (!this.isSlotAvailable) {
    if (this.checkSignedInWithMessage()) {
      this.promptUserToSendEmail();
    }
    return;
  }
  this.isChatStarted = true;
  this.endChatButton.removeAttribute('disabled');
  e.preventDefault();

  switch (this.whichChat) {
    case "chat1":
      this.messagesRef = this.database.ref('messages1');
      break;
    case "chat2":
      this.messagesRef = this.database.ref('messages2');
      break;
    case "chat3":
      this.messagesRef = this.database.ref('messages3');
      break;
    case "chat4":
      this.messagesRef = this.database.ref('messages4');
      break;
    default:

  }

  var e = this.categoryList;

  if (this.isFirstMessage) {
    this.database.ref('active_chats').child(this.whichChat).set({
      isActive: true,
      topic: e.options[e.selectedIndex].text
    });
    this.isFirstMessage = false;
    this.loadMessages();
  }

  // Check that the user entered a message and is signed in.
  if (this.messageInput.value && this.checkSignedInWithMessage()) {
    var currentUser = this.auth.currentUser;
    // Add a new message entry to the Firebase Database.
    this.messagesRef.push({
      name: currentUser.displayName,
      text: this.messageInput.value,
      photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
    }).then(function() {
      // Clear message text field and SEND button state.
      LiveChatUser.resetMaterialTextfield(this.messageInput);
      this.toggleButton();
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  }
};

// Sets the URL of the given img element with the URL of the image stored in Cloud Storage.
LiveChatUser.prototype.setImageUrl = function(imageUri, imgElement) {
  // If the image is a Cloud Storage URI we fetch the URL.
  if (imageUri.startsWith('gs://')) {
    imgElement.src = LiveChatUser.LOADING_IMAGE_URL; // Display a loading image first.
    this.storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
      imgElement.src = metadata.downloadURLs[0];
    });
  } else {
    imgElement.src = imageUri;
  }
};

// Saves a new message containing an image URI in Firebase.
// This first saves the image in Firebase storage.
LiveChatUser.prototype.saveImageMessage = function(event) {
  event.preventDefault();
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  this.imageForm.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return;
  }
  // Check if the user is signed-in
  if (this.checkSignedInWithMessage()) {

    // We add a message with a loading icon that will get updated with the shared image.
    var currentUser = this.auth.currentUser;
    this.messagesRef.push({
      name: currentUser.displayName,
      imageUrl: LiveChatUser.LOADING_IMAGE_URL,
      photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
    }).then(function (data) {
      // Upload the image to Cloud Storage.
      var filePath = 'demo_messages/' + currentUser.uid + '/'+ data.key + '/'+ file.name;
      return this.storage.ref(filePath).put(file).then(function (snapshot) {
        // Get the file's Storage URI and update the chat message placeholder.
        var fullPath = snapshot.metadata.fullPath;
        return data.update({imageUrl: this.storage.ref(fullPath).toString()});
      }.bind(this));
    }.bind(this)).catch(function (error) {
      console.error('There was an error uploading a file to cloud storage:', error);
    });

  }
};

// Signs-in LiveChatUser Chat.
LiveChatUser.prototype.signIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);

};

// Signs-out of LiveChatUser Chat.
LiveChatUser.prototype.signOut = function() {
  // Sing out of Firebase.
  this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
LiveChatUser.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    var profilePicUrl = user.photoURL;   // TODO(DEVELOPER): Get profile pic.
    var userName = user.displayName;        // TODO(DEVELOPER): Get user's name.

    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    this.signInButton.setAttribute('hidden', 'true');

    // We load currently existing chant messages.
    this.loadMessages();

    this.loadChatStatus();

    // We save the Firebase Messaging Device token and enable notifications.
    // this.saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    this.signInButton.removeAttribute('hidden');
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
LiveChatUser.prototype.checkSignedInWithMessage = function() {
  // Return true if the user is signed in Firebase
  if (this.auth.currentUser) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};

// Saves the messaging device token to the datastore.
// LiveChatUser.prototype.saveMessagingDeviceToken = function() {
//   firebase.messaging().getToken().then(function(currentToken) {
//     if (currentToken) {
//       console.log('Got FCM device token:', currentToken);
//       // Saving the Device Token to the datastore.
//       firebase.database().ref('/fcmTokens').child(currentToken)
//           .set(firebase.auth().currentUser.uid);
//     } else {
//       // Need to request permissions to show notifications.
//       this.requestNotificationsPermissions();
//     }
//   }.bind(this)).catch(function(error){
//     console.error('Unable to get messaging token.', error);
//   });

// };

// Requests permissions to show notifications.
// LiveChatUser.prototype.requestNotificationsPermissions = function() {
//   console.log('Requesting notifications permission...');
//   firebase.messaging().requestPermission().then(function() {
//     // Notification permission granted.
//     this.saveMessagingDeviceToken();
//   }.bind(this)).catch(function(error) {
//     console.error('Unable to get permission to notify.', error);
//   });

// };

// Resets the given MaterialTextField.
LiveChatUser.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

// Template for messages.
LiveChatUser.MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';

// A loading image URL.
LiveChatUser.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Displays a Message in the UI.
LiveChatUser.prototype.displayMessage = function(key, name, text, picUrl, imageUri) {
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = LiveChatUser.MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);
  }
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
  }
  div.querySelector('.name').textContent = name;
  var messageElement = div.querySelector('.message');
  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else if (imageUri) { // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function() {
      this.messageList.scrollTop = this.messageList.scrollHeight;
    }.bind(this));
    this.setImageUrl(imageUri, image);
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }
  // Show the card fading-in.
  setTimeout(function() {div.classList.add('visible')}, 1);
  this.messageList.scrollTop = this.messageList.scrollHeight;
  this.messageInput.focus();
};

// Enables or disables the submit button depending on the values of the input
// fields.
LiveChatUser.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    this.submitButton.removeAttribute('disabled');
  } else {
    this.submitButton.setAttribute('disabled', 'true');
  }
};

LiveChatUser.prototype.endChat = function() {
  if (this.isChatStarted) {
    this.isFirstMessage = true;
    this.isChatStarted = false;
    this.messagesRef.remove();
    this.activeChatsRef.child(this.whichChat).set({
      isActive: false,
      topic: "This chat is off"
    });
    // this.ratingForm.setAttribute('visibility', 'true');
  }
};

LiveChatUser.prototype.submitRating = function() {
  var rating = document.querySelector('input[name="star"]:checked').value;
  var suggestion = document.getElementById('suggestion-text-field').value;
  var email = this.auth.currentUser.email;
  // Create our XMLHttpRequest object
  var hr = new XMLHttpRequest();
  // Create some variables we need to send to our PHP file
  var url = "submit_rating.php";
  var vars = "rating="+rating+"&suggestion="+suggestion+"&user_email="+email;
  hr.open("POST", url, true);
  // Set content type header information for sending url encoded variables in the request
  hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  // Access the onreadystatechange event for the XMLHttpRequest object
  hr.onreadystatechange = function() {
    if(hr.readyState == 4 && hr.status == 200) {
      var return_data = hr.responseText;
      window.alert(return_data);
    }
  }
  // Send the data to PHP now... and wait for response to update the status div
  hr.send(vars); // Actually execute the request
  // document.getElementById("status").innerHTML = "processing...";
};

LiveChatUser.prototype.submitEmail = function() {
  var name = document.getElementById('send-email-name').value;
  var email = document.getElementById('send-email-email').value;
  var query = document.getElementById('send-email-query').value;
  // window.alert(name + " " + email + " " + query);
  // Create our XMLHttpRequest object
  var hr = new XMLHttpRequest();
  // Create some variables we need to send to our PHP file
  var url = "submit_email.php";
  var vars = "name="+name+"&email="+email+"&query="+query;
  hr.open("POST", url, true);
  // Set content type header information for sending url encoded variables in the request
  hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  // Access the onreadystatechange event for the XMLHttpRequest object
  hr.onreadystatechange = function() {
    if(hr.readyState == 4 && hr.status == 200) {
      var return_data = hr.responseText;
      window.alert(return_data);
    }
  }
  // Send the data to PHP now... and wait for response to update the status div
  hr.send(vars); // Actually execute the request
  // document.getElementById("status").innerHTML = "processing...";
  this.sendEmailForm.style.display = "none";
};

// Checks that the Firebase SDK has been correctly setup and configured.
LiveChatUser.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
};

window.onload = function() {
  window.liveChatUser = new LiveChatUser();
};
