<?php
session_start();
include('db_connection.php');

// 检查用户是否已经登录
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id']; // 获取当前登录用户的 ID

// 删除该用户购物车中的所有商品
$stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
$stmt->execute([$user_id]);

echo json_encode(['success' => true, 'message' => 'Cart cleared']);
?>
