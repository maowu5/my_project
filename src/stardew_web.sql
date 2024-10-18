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
    image_url VARCHAR(255) NOT NULL,
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
('The Legendary Journey of Sun Wukong', 'In Journey to the West, Sun Wukong, also known as the Monkey King, is one of the most beloved characters in Chinese literature. Born from a stone and gifted with incredible strength and abilities, Wukong embarks on a journey of self-discovery. His mischievous nature and rebellious spirit lead him into trouble, but through discipline and wisdom, he evolves into a loyal protector of the monk Xuanzang. His transformation from a chaotic figure to a hero is what makes him such a compelling and timeless character.', 'User1'),
('The Legendary Journey of Sun Wukong', 'In Journey to the West, Sun Wukong, also known as the Monkey King, is one of the most beloved characters in Chinese literature. Born from a stone and gifted with incredible strength and abilities, Wukong embarks on a journey of self-discovery. His mischievous nature and rebellious spirit lead him into trouble, but through discipline and wisdom, he evolves into a loyal protector of the monk Xuanzang. His transformation from a chaotic figure to a hero is what makes him such a compelling and timeless character.', 'User2');

INSERT INTO characters (name, description, image_url) VALUES
('Sun Wukong', 'A mischievous and powerful monkey who becomes the leader of the pilgrims, known for his strength and ability to transform.', './img/Sun.jpg'),
('Tang Sanzang', 'A kind-hearted and devout Buddhist monk tasked with retrieving sacred scriptures from the West.', './img/Tang.jpg'),
('Zhu Bajie', 'A gluttonous and lazy half-man, half-pig creature with a kind heart, known for his comedic personality.', './img/Zhu.jpg'),
('Sha Wujing', 'A quiet and loyal river ogre who helps protect the monk on his journey, often the voice of reason among the disciples.', './img/Sha.jpg'),
('Guan yin', 'A benevolent Buddhist deity who provides guidance and protection to the pilgrims throughout their journey.', './img/Guan.jpg'),
('Buddha', 'The supreme spiritual figure who plays a critical role in the pilgrims quest for enlightenment and scriptures.', './img/Ru.jpg'),
('White Dragon Horse', 'A dragon prince transformed into a white horse who serves as Tang Sanzangs loyal steed.', './img/bai.jpg'),
('Erlang Shen', 'A powerful god with a third eye on his forehead, known for his role in apprehending Sun Wukong.', './img/er.jpg'),
('Niu Mo Wang', 'A fierce demon king and an old acquaintance of Sun Wukong, who poses a significant challenge during the journey.', './img/niu.jpg'),
('Princess Iron Fan', 'A demoness married to the Bull Demon King, she possesses a magical fan that controls the wind and is an enemy of Sun Wukong.', './img/tie.jpg'),
('Hong Hai er', 'The son of the Bull Demon King and Princess Iron Fan, a formidable demon who causes trouble for the pilgrims.', './img/hong.jpg'),
('Jade Emperor', 'The ruler of Heaven, who originally imprisoned Sun Wukong after the monkey rebelled against the celestial order.', './img/Yu.jpg');
