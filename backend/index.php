<?php
require 'vendor/autoload.php'; 
require 'rest/services/CustomBuildService.php';
require 'rest/services/OrderItemService.php';
require 'rest/services/OrderService.php';
require 'rest/services/ProductService.php';
require 'rest/services/UserService.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

define('BASE_URL', '');

Flight::register('customBuildService', 'CustomBuildService');
Flight::register('orderItemService', 'OrderItemService');
Flight::register('orderService', 'OrderService');
Flight::register('productService', 'ProductService');
Flight::register('userService', 'UserService');

require_once __DIR__ . '/rest/routes/CustomBuildRoutes.php';
require_once __DIR__ . '/rest/routes/OrderItemRoutes.php';
require_once __DIR__ . '/rest/routes/OrderRoutes.php';
require_once __DIR__ . '/rest/routes/ProductRoutes.php';
require_once __DIR__ . '/rest/routes/UserRoutes.php';

Flight::route('/test', function(){  
   echo '1984';
});

Flight::start();  
?>