<?php
// 引入数据库连接文件
session_start();
include 'db_connection.php';

$response = [];
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    // 从会话或数据库获取余额
    include 'db_connection.php';
    $username = $_SESSION['username'];
    
    $sql = "SELECT balance FROM users WHERE username = :username";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        $response['success'] = true;
        $response['balance'] = $result['balance'];  // 返回余额
    } else {
        $response['success'] = false;
        $response['message'] = 'User not found or balance retrieval failed.';
    }
} else {
    $response['success'] = false;
    $response['message'] = 'User not logged in.';
}

echo json_encode($response);
?>
