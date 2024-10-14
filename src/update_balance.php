<?php
// 引入数据库连接文件
include 'db_connection.php';

session_start();
// 启用错误日志记录
ini_set('display_errors', 0);  // 关闭错误显示在页面
ini_set('log_errors', 1);      // 启用错误日志
error_reporting(E_ALL);        // 报告所有错误

// 获取请求数据
$data = json_decode(file_get_contents('php://input'), true);

// 验证数据有效性
if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    error_log('Invalid input data in update_balance.php');  // 记录错误日志
    exit;
}

$username = $_SESSION['username'];  // 从会话中获取用户名
$rechargeAmount = $_SESSION['rechargeAmount'];

// 验证充值金额是否有效
if (empty($username)) {
    echo json_encode(['success' => false, 'message' => 'Invalid recharge username.']);
    error_log('Invalid recharge username in update_balance.php');  // 记录错误日志
    exit;
}

// 更新用户余额
$sql = "UPDATE users SET balance = balance + :rechargeAmount WHERE username = :username";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':rechargeAmount', $rechargeAmount, PDO::PARAM_INT);
$stmt->bindParam(':username', $username, PDO::PARAM_STR);

if ($stmt->execute()) {
    // 更新会话中的余额
    $sql = "SELECT balance FROM users WHERE username = :username";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        $_SESSION['balance'] = $result['balance'];  // 更新会话中的余额
        echo json_encode(['success' => true, 'balance' => $result['balance']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update balance.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to recharge.']);
}
?>
