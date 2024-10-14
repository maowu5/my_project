let isLoggedIn = false; // 登录状态
let username = ""; // 当前登录用户的用户名

// 检查登录状态
function checkLoginStatus() {
    fetch('/check_login.php')
        .then(response => response.json())
        .then(data => {
            if (data.isLoggedIn) {
                isLoggedIn = true;
                username = data.username;
                document.getElementById('login-message').innerText = `Welcome, ${username}`;
            } else {
                isLoggedIn = false;
                username = "";
                document.getElementById('login-message').innerText = 'Please Login';
            }
        })
        .catch(error => {
            console.error('error:', error);
        });
}

// 加载数据库中的帖子
function loadPosts() {
    fetch('/get_posts.php')  // 后端接口，用于获取帖子数据
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const postsContainer = document.getElementById('posts-container');
                postsContainer.innerHTML = '';  // 清空容器中的旧内容

                // 遍历帖子并添加到容器中
                data.posts.forEach(post => {
                    const postHTML = `
                        <div class="post">
                            <h3>${post.title}</h3>
                            <p>${post.content}</p>
                            <p class="author">作者: ${post.author}</p>
                        </div>
                    `;
                    postsContainer.insertAdjacentHTML('beforeend', postHTML);
                });
            } else {
                console.error('加载帖子失败');
            }
        })
        .catch(error => {
            console.error('获取帖子错误:', error);
        });
}

// 页面加载时检查登录状态并加载帖子
window.onload = function () {
    checkLoginStatus();
    loadPosts(); // 加载已有帖子
};

// 打开发布帖子浮窗
function openPostForm() {
    if (!isLoggedIn) {
        alert('请登录后再发帖!');
        return;
    }
    document.getElementById('post-modal').style.display = 'block';
}

// 关闭发布帖子浮窗
function closePostForm() {
    document.getElementById('post-modal').style.display = 'none';
}

// 发布帖子
document.getElementById('post-form').addEventListener('submit', function(event) {
    event.preventDefault();

    if (!isLoggedIn) {
        alert('请登录后再发帖!');
        return;
    }

    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    // 发送帖子数据到后端保存到数据库
    fetch('/post_blog.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            content: content,
            author: username // 当前登录的用户
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 生成并添加帖子HTML到页面
            const postHTML = `
                <div class="post">
                    <h3>${title}</h3>
                    <p>${content}</p>
                    <p class="author">作者: ${username}</p>
                </div>
            `;

            document.getElementById('posts-container').insertAdjacentHTML('beforeend', postHTML);
            document.getElementById('post-form').reset(); // 重置表单
            closePostForm(); // 关闭发帖浮窗
        } else {
            alert('发帖失败，请重试！');
        }
    })
    .catch(error => {
        console.error('发帖错误:', error);
    });
});
