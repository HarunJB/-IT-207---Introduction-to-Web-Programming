create database pc_store;

use pc_store;

CREATE TABLE users (
    user_id INT PRIMARY key AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT null,
    address TEXT,        
    phone VARCHAR(20),
    is_admin BOOLEAN DEFAULT 0
);


CREATE INDEX idx_user_email ON users(email);

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(50) NOT NULL,
    description TEXT,
    type ENUM('component', 'prebuilt', 'peripheral', 'accessory') NOT NULL,    
    category VARCHAR(50),          
    brand VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2),
    stock INT NOT NULL DEFAULT 0,
    specs TEXT                  
);

CREATE UNIQUE INDEX idx_product_sku ON products(sku);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL,
    order_date DATETIME,
    shipping_address TEXT,
    payment_method VARCHAR(50),
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    is_custom_build BOOLEAN DEFAULT 0,
    custom_details TEXT,        
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE custom_builds (
    build_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    name VARCHAR(100),
    components TEXT NOT NULL,      
    price DECIMAL(10, 2) NOT NULL,
    is_purchased BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


INSERT INTO users (email, password_hash, first_name, last_name, address, phone, is_admin)
VALUES 
('john.doe@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John', 'Doe', '123 Main St, Springfield, IL 62701', '555-123-4567', 0),
('jane.smith@example.com', '$2a$10$IgMneSD6zMewMH/4bnX7XuQeZ/5oVY1qlvMQJCFTLICpYhEAGrOey', 'Jane', 'Smith', '456 Oak Ave, Springfield, IL 62702', '555-987-6543', 0),
('admin@pcstore.com', '$2a$10$3euPcmQFCiblsZiGoeK1UeYHLeJWLAn7/ygVZP8hOhbF6.Z94zQ2a', 'Admin', 'User', '789 Tech Blvd, Springfield, IL 62703', '555-789-0123', 1);

INSERT INTO products (name, sku, description, type, category, brand, price, sale_price, stock, specs)
VALUES 
('NVIDIA GeForce RTX 4080', 'GPU-RTX4080-001', 'High-end graphics card for gaming and content creation', 'component', 'GPU', 'NVIDIA', 1199.99, 1099.99, 15, 'CUDA Cores: 9728, Memory: 16GB GDDR6X, Ray Tracing Cores: 48'),
('AMD Ryzen 9 7950X', 'CPU-R9-7950X-001', 'Flagship desktop processor with 16 cores and 32 threads', 'component', 'CPU', 'AMD', 699.99, NULL, 22, 'Cores: 16, Threads: 32, Base Clock: 4.5GHz, Boost Clock: 5.7GHz, TDP: 170W'),
('Alienware Aurora R15', 'PC-AURORA-R15-001', 'Prebuilt gaming desktop with RTX 4080 and i9-13900K', 'prebuilt', 'Desktop', 'Alienware', 2999.99, 2799.99, 5, 'CPU: Intel i9-13900K, GPU: RTX 4080, RAM: 32GB DDR5, Storage: 2TB NVMe SSD, OS: Windows 11 Pro');

INSERT INTO orders (user_id, status, order_date, shipping_address, payment_method, subtotal, shipping, tax, total)
VALUES 
(1, 'delivered', '2025-03-15 14:23:11', '123 Main St, Springfield, IL 62701', 'Credit Card', 1099.99, 25.00, 68.75, 1193.74),
(2, 'shipped', '2025-03-28 09:45:32', '456 Oak Ave, Springfield, IL 62702', 'PayPal', 699.99, 25.00, 43.75, 768.74),
(1, 'processing', '2025-04-02 16:12:05', '123 Main St, Springfield, IL 62701', 'Credit Card', 2799.99, 0.00, 175.00, 2974.99);

INSERT INTO order_items (order_id, product_id, quantity, price, is_custom_build)
VALUES 
(1, 1, 1, 1099.99, 0),
(2, 2, 1, 699.99, 0),
(3, 3, 1, 2799.99, 0);

INSERT INTO custom_builds (user_id, name, components, price, is_purchased)
VALUES 
(1, 'John\'s Gaming Rig', 'CPU: AMD Ryzen 9 7950X, GPU: NVIDIA RTX 4080, RAM: 32GB DDR5-6000, Motherboard: ASUS ROG X670E, Storage: 2TB Samsung 990 Pro, PSU: Corsair RM1000x, Case: Lian Li O11 Dynamic', 2499.99, 1),
(2, 'Jane\'s Workstation', 'CPU: Intel i9-13900K, GPU: NVIDIA RTX 4090, RAM: 64GB DDR5-5600, Motherboard: MSI MEG Z790 ACE, Storage: 4TB Samsung 990 Pro, PSU: be quiet! Dark Power 13 1000W, Case: Fractal Design Meshify 2', 3299.99, 0),
(1, 'John\'s Streaming PC', 'CPU: AMD Ryzen 7 7800X3D, GPU: NVIDIA RTX 4070 Ti, RAM: 32GB DDR5-5600, Motherboard: Gigabyte X670 AORUS ELITE, Storage: 1TB WD Black SN850X, PSU: Corsair RM850x, Case: NZXT H7 Flow', 1899.99, 0);

