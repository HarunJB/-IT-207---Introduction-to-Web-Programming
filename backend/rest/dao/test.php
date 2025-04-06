<?php
require_once 'UserDao.php';
require_once 'ProductDao.php';
require_once 'OrderDao.php';
require_once 'OrderItemDao.php';
require_once 'CustomBuildDao.php';

$userDao = new UserDao();
$productDao = new ProductDao();
$orderDao = new OrderDao();
$orderItemDao = new OrderItemDao();
$customBuildDao = new CustomBuildDao();

$userDao->insert([
    'email' => 'john@example.com',
    'password_hash' => password_hash('password123', PASSWORD_DEFAULT),
    'first_name' => 'John',
    'last_name' => 'Doe',
    'address' => '123 Main St, Anytown, USA',
    'phone' => '555-123-4567',
    'is_admin' => 0
]);

$productDao->insert([
    'name' => 'Intel Core i5 Processor',
    'sku' => 'CPU-I5-13400',
    'description' => 'High-performance processor for gaming and professional use',
    'type' => 'component',
    'category' => 'CPU',
    'brand' => 'Intel',
    'price' => 399.99,
    'sale_price' => 349.99,
    'stock' => 25,
    'specs' => '{"cores":12,"threads":20,"clock":"3.6GHz"}'
]);

$users = $userDao->getAll();
echo "All Users:\n";
print_r($users);

$products = $productDao->getAll();
echo "All Products:\n";
print_r($products);

$newUser = end($users);
$newProduct = end($products);

$orderId = $orderDao->insert([
    'user_id' => $newUser['user_id'],
    'status' => 'pending',
    'order_date' => date('Y-m-d H:i:s'),
    'shipping_address' => '123 Main St, Anytown, USA',
    'payment_method' => 'Credit Card',
    'subtotal' => 349.99,
    'shipping' => 10.00,
    'tax' => 28.00,
    'total' => 387.99
]);

$orderItemDao->insert([
    'order_id' => $orderId,
    'product_id' => $newProduct['product_id'],
    'quantity' => 6,
    'price' => 349.99,
    'is_custom_build' => 0,
    'custom_details' => null
]);

$orders = $orderDao->getAll();
echo "All Orders:\n";
print_r($orders);

$orderItems = $orderItemDao->getAll();
echo "All Order Items:\n";
print_r($orderItems);

$customBuildDao->insert([
    'user_id' => $newUser['user_id'],
    'name' => 'Gaming PC Build',
    'components' => '{"cpu":{"id":'.$newProduct['product_id'].',"name":"Intel Core i7 Processor","price":349.99},"gpu":{"id":2,"name":"NVIDIA RTX 3080","price":699.99}}',
    'price' => 1049.98,
    'is_purchased' => 0
]);

$customBuilds = $customBuildDao->getAll();
echo "All Custom Builds:\n";
print_r($customBuilds);
?>