let isLoggedIn = false;
let username = "";

window.addEventListener('DOMContentLoaded', function() {
    fetch('/check_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.loggedin) {
            isLoggedIn = true;
            username = data.username;
        } else {
            isLoggedIn = false;
            username = "";
        }
    })
    .catch(error => {
        console.error('Error checking login status:', error);
    });
});

function loadPosts() {
    fetch('/get_posts.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const postsContainer = document.getElementById('posts-container');
                postsContainer.innerHTML = '';
                
                data.posts.forEach(post => {
                    const postHTML = `
                        <div class="post">
                            <h3>${post.title}</h3>
                            <p>${post.content}</p>
                            <p class="author">Author: ${post.author}</p>
                        </div>
                    `;
                    postsContainer.insertAdjacentHTML('beforeend', postHTML);
                });
            } else {
                console.error('Fail');
            }
        })
        .catch(error => {
            console.error('error:', error);
        });
}

window.onload = function () {
    loadPosts();
};

function openPostForm() {
    if (!isLoggedIn) {
        alert('Please login!');
        return;
    }
    document.getElementById('post-modal').style.display = 'block';
}

function closePostForm() {
    document.getElementById('post-modal').style.display = 'none';
}

document.getElementById('post-form').addEventListener('submit', function(event) {
    event.preventDefault();
    if (!isLoggedIn) {
        alert('Please login!');
        return;
    }

    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    fetch('/post_blog.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            content: content,
            author: username
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const postHTML = `
                <div class="post">
                    <h3>${title}</h3>
                    <p>${content}</p>
                    <p class="author">Author: ${username}</p>
                </div>
            `;

            document.getElementById('posts-container').insertAdjacentHTML('beforeend', postHTML);
            document.getElementById('post-form').reset();
            closePostForm();
        } else {
            alert('Fail！');
        }
    })
    .catch(error => {
        console.error('error:', error);
    });
});
