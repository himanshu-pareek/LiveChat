<?php 
	if (isset($_POST['name']) and isset($_POST['email']) and isset($_POST['query'])) {
		$name = $_POST['name'];
		$email = $_POST['email'];
		$query = $_POST['query'];
		// write query, name and email to the database.
		echo $name . "   " .  $email . "    " . $query;
	} else {
		echo 'Permission denied';
	}
?>
