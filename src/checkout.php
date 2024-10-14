<?php
session_start();
// 引入数据库连接文件
include 'db_connection.php';

// 获取请求数据
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$newBalance = $data['newBalance'];

// 更新用户余额
$sql = "UPDATE users SET balance = :balance WHERE username = :username";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':balance', $newBalance);
$stmt->bindParam(':username', $username);

if ($stmt->execute()) {
    $clearCartSql = "DELETE FROM cart WHERE username = :username";
    $clearCartStmt = $pdo->prepare($clearCartSql);
    $clearCartStmt->bindParam(':username', $username);

    if ($clearCartStmt->execute()) {
        // 余额更新和清空购物车都成功
        echo json_encode(['success' => true, 'message' => 'Balance updated and cart cleared successfully.']);
    } else {
        // 余额更新成功，但清空购物车失败
        echo json_encode(['success' => false, 'message' => 'Failed to clear cart.']);
    }

} else {
    // 余额更新失败
    echo json_encode(['success' => false, 'message' => 'Failed to update balance.']);
}
?>
