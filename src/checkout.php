<?php
session_start();

include 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$newBalance = $data['newBalance'];

$sql = "UPDATE users SET balance = :balance WHERE username = :username";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':balance', $newBalance);
$stmt->bindParam(':username', $username);

if ($stmt->execute()) {
    $clearCartSql = "DELETE FROM cart WHERE username = :username";
    $clearCartStmt = $pdo->prepare($clearCartSql);
    $clearCartStmt->bindParam(':username', $username);

    if ($clearCartStmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Balance updated and cart cleared successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to clear cart.']);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update balance.']);
}
?>
