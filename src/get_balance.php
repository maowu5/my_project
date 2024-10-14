<?php
// 引入数据库连接文件
include 'db_connection.php';

// 获取请求体中的 JSON 数据
$data = json_decode(file_get_contents('php://input'), true);
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
    echo json_encode(['success' => false, 'message' => 'Failed to fetch balance.']);
}
?>
