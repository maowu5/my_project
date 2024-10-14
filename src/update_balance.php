<?php
// 引入数据库连接文件
include 'db_connection.php';

// 获取请求体中的 JSON 数据
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$newBalance = $data['balance'];

// 更新数据库中的余额
$sql = "UPDATE users SET balance = :balance WHERE username = :username";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':balance', $newBalance);
$stmt->bindParam(':username', $username);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Balance updated successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update balance.']);
}
?>
