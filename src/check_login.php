<?php
session_start();
$response = [];
$response['loggedin'] = isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true;

if ($response['loggedin']) {
    $response['username'] = $_SESSION['username'];
    $response['balance'] = $_SESSION['balance'];
} 

echo json_encode($response);
?>
