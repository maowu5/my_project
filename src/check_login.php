<?php
session_start();
$response = [];
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    $response['loggedin'] = true;
    $response['username'] = $_SESSION['username'];
    $response['user_id'] = $_SESSION['user_id']; 
    include 'db_connection.php';
    $sql = "SELECT balance FROM users WHERE username = :username";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':username', $_SESSION['username']);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        $response['balance'] = $result['balance'];
        $_SESSION['balance'] = $result['balance'];
    } else {
        $response['balance'] = 0;
    }
} else {
    $response['loggedin'] = false;
}

echo json_encode($response);
?>
