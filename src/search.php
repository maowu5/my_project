<?php
include('db_connection.php');

session_start();  // 开启 session

    // 检查是否有搜索请求
if (isset($_GET['query']) && !empty($_GET['query'])) {
    // 获取用户输入的搜索词
    $query = $_GET['query'];
    // 使用 PDO 执行查询
    $stmt = $pdo->prepare("SELECT * FROM characters WHERE name LIKE ?");
    $stmt->execute(['%'.$query.'%']);
} else {
    // 查询所有角色
    $stmt = $pdo->query("SELECT * FROM characters");
}

$results = $stmt->fetchAll();


// 输出角色卡片
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
