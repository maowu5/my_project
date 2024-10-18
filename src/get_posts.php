<?php
session_start();
include('db_connection.php');

$stmt = $pdo->prepare("SELECT title, content, author, created_at FROM posts ORDER BY created_at DESC");
$stmt->execute();
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['success' => true, 'posts' => $posts]);
?>
