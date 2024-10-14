<?php
session_start();
include('db_connection.php');

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$password = $data['password'];

// 检查用户名是否已存在
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
if ($stmt->rowCount() > 0) {
    echo json_encode(['success' => false, 'message' => 'Username already exists']);
    exit();
}

// 插入新用户数据
$password_hash = password_hash($password, PASSWORD_BCRYPT);
$stmt = $pdo->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
$stmt->execute([$username, $password_hash]);

echo json_encode(['success' => true]);
?>
