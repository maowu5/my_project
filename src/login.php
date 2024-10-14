<?php
session_start();  // 启动会话

include 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$password = $data['password'];

// 检查用户名和密码是否正确
$sql = "SELECT * FROM users WHERE username = :username";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':username', $username);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password_hash'])) {
    // 登录成功，保存会话状态
    $_SESSION['loggedin'] = true;
    $_SESSION['username'] = $username;
    $_SESSION['balance'] = $user['balance'];  // 保存用户的余额
    
    echo json_encode(['success' => true, 'username' => $username]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
}
?>
