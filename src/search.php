<?php
include('db_connection.php');

session_start(); 

if (isset($_GET['query']) && !empty($_GET['query'])) {
    $query = $_GET['query'];
    $stmt = $pdo->prepare("SELECT * FROM characters WHERE name LIKE ?");
    $stmt->execute(['%'.$query.'%']);
} else {
    $stmt = $pdo->query("SELECT * FROM characters");
}

$results = $stmt->fetchAll();


if ($results) {
    foreach ($results as $row) {
        echo "<div class='character-card'>";
        echo "<img src='" . $row['image_url'] . "' alt='" . $row['name'] . "' class='character-image'>";
        echo "<h3>" . $row['name'] . "</h3>";
        echo "<p>" . $row['description'] . "</p>";
        echo "</div>";
    }
} else {
    echo "<p>No characters found.</p>";
}
?>
