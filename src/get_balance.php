<?php
// 引入数据库连接文件
include 'db_connection.php';

ini_set('display_errors', 0);  // 关闭错误直接显示
ini_set('log_errors', 1);      // 启用错误日志
error_reporting(E_ALL);        // 报告所有错误

// 获取请求数据
$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['username'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input or missing username.']);
    exit;
}

$username = $data['username'];

// 查询用户余额
$sql = "SELECT balance FROM users WHERE username = :username";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':username', $username);

if ($stmt->execute()) {
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        echo json_encode(['success' => true, 'balance' => $result['balance']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found.']);
    }
} else {
    error_log('Failed to fetch balance for user: ' . $username);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch balance.']);
}
?>
