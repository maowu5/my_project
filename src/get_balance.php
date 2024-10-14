<?php
// 引入数据库连接文件
include 'db_connection.php';

// 启用错误日志记录
ini_set('display_errors', 0);  // 关闭错误显示
ini_set('log_errors', 1);      // 启用错误日志
error_reporting(E_ALL);        // 报告所有错误

// 获取请求数据
$data = json_decode(file_get_contents('php://input'), true);

// 检查数据是否正确传递
if (!$data || !isset($data['username'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input or missing username.']);
    error_log('Invalid input or missing username in get_balance.php');  // 记录错误日志
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
        error_log('Balance retrieved successfully for user: ' . $username);  // 记录成功日志
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found.']);
        error_log('User not found: ' . $username);  // 记录用户未找到的日志
    }
} else {
    error_log('Failed to execute query in get_balance.php for user: ' . $username);  // 记录SQL执行错误
    echo json_encode(['success' => false, 'message' => 'Failed to fetch balance.']);
}
?>
