<?php
include 'db_connection.php';

session_start();
ini_set('display_errors', 0); 
ini_set('log_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    error_log('Invalid input data in update_balance.php');
    exit;
}

$username = $_SESSION['username']; 
$rechargeAmount = $data['rechargeAmount'];

if (empty($username)) {
    echo json_encode(['success' => false, 'message' => 'Invalid recharge username.']);
    error_log('Invalid recharge username in update_balance.php'); 
    exit;
}

$sql = "UPDATE users SET balance = balance + :rechargeAmount WHERE username = :username";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':rechargeAmount', $rechargeAmount, PDO::PARAM_INT);
$stmt->bindParam(':username', $username, PDO::PARAM_STR);

if ($stmt->execute()) {
    $sql = "SELECT balance FROM users WHERE username = :username";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        $_SESSION['balance'] = $result['balance'];
        echo json_encode(['success' => true, 'balance' => $result['balance']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update balance.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to recharge.']);
}
?>
