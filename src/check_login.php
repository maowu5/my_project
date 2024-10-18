<?php
session_start();
$response = [];
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    // 用户已登录，返回用户信息
    $response['loggedin'] = true;
    $response['username'] = $_SESSION['username'];
    $response['user_id'] = $_SESSION['user_id']; 
    // 确保从数据库或会话中获取余额
    include 'db_connection.php';
    $sql = "SELECT balance FROM users WHERE username = :username";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':username', $_SESSION['username']);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        $response['balance'] = $result['balance'];
        $_SESSION['balance'] = $result['balance'];  // 更新会话中的余额
    } else {
        $response['balance'] = 0;  // 如果查询失败，返回0
    }
} else {
    // 用户未登录
    $response['loggedin'] = false;
}

echo json_encode($response);
?>
