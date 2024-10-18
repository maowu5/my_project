<?php
session_start();

include 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$password = $data['password'];

$sql = "SELECT * FROM users WHERE username = :username";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':username', $username);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password_hash'])) {
    $_SESSION['loggedin'] = true;
    $_SESSION['username'] = $username;
    $_SESSION['balance'] = $user['balance'];
    $_SESSION['user_id'] = $user['user_id']; 
    
    echo json_encode(['success' => true, 'username' => $username]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
}
?>
