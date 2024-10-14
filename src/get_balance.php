<?php
// 引入数据库连接文件
session_start();
include 'db_connection.php';

// 获取请求数据
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];

// 查询用户余额
$sql = "SELECT balance FROM users WHERE username = :username";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':username', $username);

if ($stmt->execute()) {
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        $balance = (float) $result['balance'];
        echo json_encode(['success' => true, 'balance' => $result['balance']]);
        error_log('Balance retrieved successfully for user: ' . $username);  // 记录成功日志
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found.']);
    }
} else {
    error_log('Failed to fetch balance for user: ' . $username);  // 记录失败日志
    echo json_encode(['success' => false, 'message' => 'Failed to fetch balance.']);
}
?>
