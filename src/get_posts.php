<?php
session_start();
include('db_connection.php'); // 包含数据库连接

// 准备 SQL 查询，获取所有帖子，按创建时间降序排序
$stmt = $pdo->prepare("SELECT title, content, author, created_at FROM posts ORDER BY created_at DESC");
$stmt->execute();
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC); // 获取所有帖子

echo json_encode(['success' => true, 'posts' => $posts]);
?>
