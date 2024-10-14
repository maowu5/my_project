<?php
// 引入数据库连接文件
include 'db_connection.php';

// 获取请求数据
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$rechargeAmount = $data['rechargeAmount'];  // 获取充值金额

if (!isset($rechargeAmount)) {
    echo json_encode(['success' => false, 'message' => 'No recharge amount provided.']);
    exit;
}

// 更新用户余额
$sql = "UPDATE users SET balance = balance + :rechargeAmount WHERE username = :username";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':rechargeAmount', $rechargeAmount);
$stmt->bindParam(':username', $username);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
    error_log('Balance updated successfully for user: ' . $username);  // 记录成功日志
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update balance.']);
    error_log('Failed to update balance for user: ' . $username);  // 记录失败日志
}
?>
