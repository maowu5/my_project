<?php
session_start();
include('db_connection.php');

// 检查数据库连接是否成功
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// 检查是否有搜索请求
if (isset($_GET['query']) && !empty($_GET['query'])) {
    // 获取用户输入的搜索词
    $query = $_GET['query'];
    // 查询数据库，模糊匹配搜索词
    $sql = "SELECT * FROM characters WHERE name LIKE '%$query%'";
} else {
    // 如果没有搜索词，查询所有角色
    $sql = "SELECT * FROM characters";
}

$result = $conn->query($sql);

// 开始构建角色卡片的 HTML 结构
if ($result->num_rows > 0) {
    // 输出结果，使用 character-card 结构
    while($row = $result->fetch_assoc()) {
        echo "<div class='character-card'>";
        echo "<img src='" . $row['image_url'] . "' alt='" . $row['name'] . "' class='character-image'>";
        echo "<h3>" . $row['name'] . "</h3>";
        echo "<p>" . $row['description'] . "</p>";
        echo "</div>";
    }
} else {
    // 如果没有结果，显示“无角色找到”
    echo "<p>No characters found.</p>";
}

$conn->close();
?>
