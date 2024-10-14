<?php
// 引入数据库连接文件
include 'db_connection.php';

// 获取请求数据
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$rechargeAmount = $data['rechargeAmount'];  // 获取充值金额

// 更新用户余额
$sql = "UPDATE users SET balance = balance + :rechargeAmount WHERE username = :username";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':rechargeAmount', $rechargeAmount);
$stmt->bindParam(':username', $username);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update balance.']);
}
?>
