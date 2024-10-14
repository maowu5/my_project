<?php
session_start();
$response = array();

if (isset($_SESSION['user_id'])) {
    $response['isLoggedIn'] = true;
    $response['username'] = $_SESSION['username'];
} else {
    $response['isLoggedIn'] = false;
}

echo json_encode($response);
?>
