<?php 
	if (isset($_POST['rating']) and isset($_POST['suggestion']) and isset($_POST['user_email'])) {
		$rating = $_POST['rating'];
		$suggestion = $_POST['suggestion'];
		$email = $_POST['user_email'];
		// write rating and suggestion to the database.
		echo $rating . "   " .  $suggestion . "    " . $email;
	} else {
		echo 'Permission denied';
	}
?>
