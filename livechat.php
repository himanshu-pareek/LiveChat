<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="description" content="Live Chat of Rankethon">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Chat</title>

  <!-- Disable tap highlight on IE -->
  <meta name="msapplication-tap-highlight" content="no">

  <!-- Web Application Manifest -->
  <link rel="manifest" href="manifest.json">

  <!-- Add to homescreen for Chrome on Android -->
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="application-name" content="Live Chat">
  <meta name="theme-color" content="#303F9F">

  <!-- Add to homescreen for Safari on iOS -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Live Chat">
  <meta name="apple-mobile-web-app-status-bar-style" content="#303F9F">

  <!-- Tile icon for Win8 -->
  <meta name="msapplication-TileColor" content="#3372DF">
  <meta name="msapplication-navbutton-color" content="#303F9F">

  <!-- Material Design Lite -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="https://code.getmdl.io/1.1.3/material.orange-indigo.min.css">
  <script defer src="https://code.getmdl.io/1.1.3/material.min.js"></script>

  <!-- App Styling -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en">
  <link rel="stylesheet" href="LiveChatUser//styles/main2.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/1.11.8/semantic.min.css"/>
<style>input[type=text], select, textarea {
            width: 80%; /* Full width */
            padding: 12px; /* Some padding */
            border: 1px solid #ccc; /* Gray border */
            border-radius: 4px; /* Rounded borders */
            box-sizing: border-box; /* Make sure that padding and width stays in place */
            margin-top: 6px; /* Add a top margin */
            margin-bottom: 16px; /* Bottom margin */
            resize: vertical /* Allow the user to vertically resize the textarea (not horizontally) */
        }
		 .submit-rating-button {
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 0.5vw;
        }

   
        .submit-rating-button:hover {
            background-color: #45a049;
        }

     
        .ratingsForm {
            border-radius: 5px;
            background-color: #f2f2f2;
            padding: 20px;
            width:100%;
            margin:auto;
            padding-left: 10%;
        }
</style>
</head>
<body>
<div class="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-header">

  <!-- Header section containing logo --> 
  
  <header class="ui inverted fixed menu navbar grid">
    <div class="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
      <div class="mdl-layout__header-row mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
        
        <h3><i class="material-icons" style="color: red"><div style="color:white"><img src="img/logo/gud.png" width="60%" /></i> Rankethon Chat</div></h3>
      </div>
     <div id="user-container">
        <div hidden id="user-pic"></div>
        <div hidden id="user-name"></div>
        <button hidden id="sign-out" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
          Sign-out
        </button>
        <button hidden id="sign-in" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
          <i class="material-icons">account_circle</i>Sign-in with Google
        </button>
      </div>
  </div>
  </header> 
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  

  <main class="mdl-layout__content mdl-color--grey-100">
<center>
    <div id="live_chat_info" >
      <div id="chat_slot_available_text" style="color: red!important;">
        We are offline now <a href="contact.php"><u><b> Click to mail us</b></u></a>
      </div>
      <div class="ui form" id='bliss' >
   <input id="categoryList"  lass="ui search dropdown" class="eight wide field" type="text" placeholder="Enter subject of your query" />
        <!--   <select>
		   <option value = "anywhere_robotics">Anywhere Robotics</option>
           <option value = "science_buzz">Science Buzz</option>
           <option value = "app_development">App Development</option> 
           <option value = "web_development">Web Development</option>
         </select> -->
      </div>
    </div>
</center>
    <div id="messages-card-container" class="mdl-cell mdl-cell--12-col mdl-grid" style="width:100%!important;">

      <!-- Messages container -->
      <div id="messages-card" class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--6-col-desktop" style="width:100%!important;">
        <div class="mdl-card__supporting-text mdl-color-text--grey-600">
          <div id="messages">
            <span id="message-filler"></span>
          </div>
          <form id="message-form" action="#">
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input class="mdl-textfield__input" type="text" id="message">
              <label class="mdl-textfield__label" for="message">Message...</label>
            </div>
            <button id="submit" disabled type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
              Send
            </button>
          </form>
          <form id="image-form" action="#">
            <input id="mediaCapture" type="file" accept="image/*,capture=camera">
            <button id="submitImage" title="Add an image" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--amber-400 mdl-color-text--white">
              <i class="material-icons">image</i>
            </button>
          
          </form>

        </div>

        <div class="ui grid" >
  <div class="three column row">
    <div class="column"></div>
    <div class="column"></div>
    <div class="column" > <button id="chat_end_button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" >End Chat</button>
</div>
  </div>

      </div>

      <div id="must-signin-snackbar" class="mdl-js-snackbar mdl-snackbar">
        <div class="mdl-snackbar__text"></div>
        <button class="mdl-snackbar__action" type="button"></button>
      </div>

    </div>
    <br>
    <br>

   
      <div id="ratingsForm" class ="ratingsForm" style="display: none;">
	 <center> <p style="color:red"><b>Please Rate Our Service</b> </p></center><br>
          <div class="stars">
              <input type="radio" name="star" value="1" class="star-1" id="star-1" />
              <label class="star-1" for="star-1">1</label>
              <input type="radio" name="star" value="2" class="star-2" id="star-2" />
              <label class="star-2" for="star-2">2</label>
              <input type="radio" name="star" value="3" class="star-3" id="star-3" />
              <label class="star-3" for="star-3">3</label>
              <input type="radio" name="star" value="4" class="star-4" id="star-4" />
              <label class="star-4" for="star-4">4</label>
              <input type="radio" name="star" value="5" class="star-5" id="star-5" />
              <label class="star-5" for="star-5">5</label>
              <span></span>
          </div>
          <div><input id="suggestion-text-field" type="text" placeholder="Give your suggestions" /></input></div>
          <button id="submit-rating-button" >Submit</button>
      </div>
	  <div id="rForm" class ="ratingsForm" style="display: none;">
	  <center><h1> Thank You! Your response is Valuable for Rankethon Team</h1></center></div>

      <div id="send-email-div" style="display: none;" >
        <p>We are off-line now. Please, send your query to us and we will respond as soon as possible.</p>
        <p><span >Name: <input type="text" id="send-email-name" placeholder="Enter your name here" /></span></p>
        <p><span >Email: <input type="text" id="send-email-email" placeholder="Enter your email address here" /></span></p>
        <p><span >Query: <textarea id="send-email-query" placeholder="Enter your query here" ></textarea> </span></p>
        <button id="send-email-button">Submit</button>
      </div>

  </main>
</div>

<!-- Import and configure the Firebase SDK -->
<!-- These scripts are made available when the app is served or deployed on Firebase Hosting -->
<!-- If you do not want to serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup -->



<script src="https://www.gstatic.com/firebasejs/4.1.1/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBaQ7cdhhz1yIb5YYelxQQfg3zFvnk5Uis",
    authDomain: "livechat-9e40b.firebaseapp.com",
    databaseURL: "https://livechat-9e40b.firebaseio.com",
    projectId: "livechat-9e40b",
    storageBucket: "livechat-9e40b.appspot.com",
    messagingSenderId: "223047828360"
  };
  firebase.initializeApp(config);
</script>

<!--
<script src="/__/firebase/3.8.0/firebase.js"></script>
<script src="/__/firebase/init.js"></script>
-->

<script src="LiveChatUser/scripts/main2.js"></script>
</body>
</html>
