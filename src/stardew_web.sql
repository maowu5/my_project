-- 创建 users 表，用于存储用户信息
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建 cart 表，用于存储购物车信息
CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 创建 products 表，用于存储商品信息
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建 posts 表，用于存储博客帖子
CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE characters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255) NOT NULL
);

INSERT INTO posts (title, content, author) VALUES
('Stardew Valley 1.6 Mobile & Console Release date', 'Hello all, The console and mobile ports of the 1.6 update will be released on November 4th, 2024.
Thank you for your patience. The console and mobile ports will release at version 1.6.9, which will also come to PC around that time.
I’m looking forward to having 1.6 fully released on all platforms. Then I would like to finish Haunted Chocolatier next. Thank you', 'Ape'),
('The Stardew Valley Cookbook is now available!', 'The Stardew Valley Cookbook is now available, wherever books are sold!
Featuring over 50 recipes from Stardew Valley, with photos, appearances from Stardew Valley’s characters, and delightful illustrations… this cookbook will make a great addition to your shelf.
Here are a couple of preview recipes, if you’d like try them out before getting the book:
Nerdist (Strange Bun)
Mashable (Seafoam Pudding)
I would like to thank Kari Fry (illustrations), Ryan Novak (writing), Susan Vu (recipes), and everyone at Penguin Random House for helping make this a reality.
I hope you enjoy the book, and I am looking forward to seeing your Stardew Valley cooking creations come to life!', 'Ape');

INSERT INTO characters (name, description, image_url) VALUES
('Sun Wukong', 'A mischievous and powerful monkey who becomes the leader of the pilgrims, known for his strength and ability to transform.', './img/Sun.jpg')
('Tang Sanzang', 'A kind-hearted and devout Buddhist monk tasked with retrieving sacred scriptures from the West.', './img/Tang.jpg')
('Zhu Bajie', 'A gluttonous and lazy half-man, half-pig creature with a kind heart, known for his comedic personality.', './img/Zhu.jpg')
('Sha Wujing', 'A quiet and loyal river ogre who helps protect the monk on his journey, often the voice of reason among the disciples.', './img/Sha.jpg')
('Guan yin', 'A benevolent Buddhist deity who provides guidance and protection to the pilgrims throughout their journey.', './img/Guan.jpg')
('Buddha', 'The supreme spiritual figure who plays a critical role in the pilgrims'' quest for enlightenment and scriptures.', './img/Ru.jpg')
('White Dragon Horse', 'A dragon prince transformed into a white horse who serves as Tang Sanzang’s loyal steed.', './img/bai.jpg')
('Erlang Shen', 'A powerful god with a third eye on his forehead, known for his role in apprehending Sun Wukong.', './img/er.jpg')
('Niu Mo Wang', 'A fierce demon king and an old acquaintance of Sun Wukong, who poses a significant challenge during the journey.', './img/niu.jpg')
('Princess Iron Fan', 'A demoness married to the Bull Demon King, she possesses a magical fan that controls the wind and is an enemy of Sun Wukong.', './img/tie.jpg')
('Hong Hai er', 'The son of the Bull Demon King and Princess Iron Fan, a formidable demon who causes trouble for the pilgrims.', './img/hong.jpg')
('Jade Emperor', 'The ruler of Heaven, who originally imprisoned Sun Wukong after the monkey rebelled against the celestial order.', './img/Yu.jpg')