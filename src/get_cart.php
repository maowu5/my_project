<?php
session_start();
include('db_connection.php');

$data = json_decode(file_get_contents('php://input'), true);
$user_id = $data['user_id'] ?? null;
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $stmt = $pdo->prepare("SELECT p.name, p.price, c.quantity, p.image_url FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = ?");
    $stmt->execute([$user_id]);
    $cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if ($cartItems) {
        echo json_encode(['success' => true, 'cartItems' => $cartItems]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No items in cart']);
    }
    echo json_encode(['success' => true, 'cartItems' => $cartItems]);
} else {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
}
?>
