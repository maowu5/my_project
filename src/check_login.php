<?php
session_start();
$response = [];
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    // 用户已登录，返回用户信息
    $response['loggedin'] = true;
    $response['username'] = $_SESSION['username'];
    $response['balance'] = $_SESSION['balance'];
} else {
    // 用户未登录
    $response['loggedin'] = false;
}

echo json_encode($response);
?>
