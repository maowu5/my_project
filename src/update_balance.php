<?php
// 引入数据库连接文件
include 'db_connection.php';

// 启用错误日志记录
ini_set('display_errors', 0);  // 关闭错误显示在页面
ini_set('log_errors', 1);      // 启用错误日志
error_reporting(E_ALL);        // 报告所有错误

// 获取请求数据
$data = json_decode(file_get_contents('php://input'), true);

// 验证数据有效性
if (!isset($data['username']) || !isset($data['rechargeAmount'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    error_log('Invalid input data in update_balance.php');  // 记录错误日志
    exit;
}

$username = $data['username'];
$rechargeAmount = $data['rechargeAmount'];

// 验证充值金额是否有效
if (!is_numeric($rechargeAmount) || empty($username)) {
    echo json_encode(['success' => false, 'message' => 'Invalid recharge amount or username.']);
    error_log('Invalid recharge amount or username in update_balance.php');  // 记录错误日志
    exit;
}

// 更新用户余额
try {
    $sql = "UPDATE users SET balance = balance + :rechargeAmount WHERE username = :username";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':rechargeAmount', $rechargeAmount, PDO::PARAM_INT);
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
        error_log('Balance updated successfully for user: ' . $username);  // 记录成功日志
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update balance.']);
        error_log('Failed to update balance for user: ' . $username);  // 记录失败日志
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    error_log('Error in update_balance.php: ' . $e->getMessage());  // 捕获异常并记录日志
}
?>
