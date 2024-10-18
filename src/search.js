document.addEventListener("DOMContentLoaded", function() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'search.php', true);  // 初次加载时，不带任何查询参数

    xhr.onload = function() {
        if (xhr.status === 200) {
            // 更新 characters-grid 区域的内容
            document.getElementById('characters-grid').innerHTML = xhr.responseText;
        } else {
            console.error('Error: ' + xhr.status);  // 打印错误信息到控制台
        }
    };

    xhr.onerror = function() {
        console.error('Request failed.');  // 处理请求错误
    };

    xhr.send();  // 发送请求
});
// 获取搜索输入框
document.getElementById('query').addEventListener('input', function() {
    const query = document.getElementById('query').value;  // 获取输入值

    // 创建一个新的 AJAX 请求
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'search.php?query=' + encodeURIComponent(query), true);  // 使用 GET 请求传递搜索词

    xhr.onload = function() {
        if (xhr.status === 200) {
            // 成功返回后，更新 characters-grid 区域的内容
            document.getElementById('characters-grid').innerHTML = xhr.responseText;
        } else {
            console.error('Error: ' + xhr.status);  // 打印错误信息到控制台
        }
    };

    xhr.onerror = function() {
        console.error('Request failed.');  // 处理请求错误
    };

    xhr.send();  // 发送请求
});
