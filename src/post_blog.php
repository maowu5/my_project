<?php
session_start();
include('db_connection.php');

if (isset($_SESSION['username'])) {
    $data = json_decode(file_get_contents('php://input'), true);
    $title = $data['title'];
    $content = $data['content'];
    $author = $_SESSION['username'];

    $stmt = $pdo->prepare("INSERT INTO posts (title, content, author) VALUES (?, ?, ?)");
    $stmt->execute([$title, $content, $author]);

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
}
?>
