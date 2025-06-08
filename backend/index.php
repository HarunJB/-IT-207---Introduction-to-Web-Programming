<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require 'vendor/autoload.php'; 
require 'data/Roles.php';
require 'rest/services/AuthService.php';
require 'rest/services/CustomBuildService.php';
require 'rest/services/OrderItemService.php';
require 'rest/services/OrderService.php';
require 'rest/services/ProductService.php';
require 'rest/services/UserService.php';
require 'middleware/AuthMiddleware.php'; 

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


define('BASE_URL', '');

Flight::register('auth_service', 'AuthService');
Flight::register('auth_middleware', 'AuthMiddleware'); 
Flight::register('customBuildService', 'CustomBuildService');
Flight::register('orderItemService', 'OrderItemService');
Flight::register('orderService', 'OrderService');
Flight::register('productService', 'ProductService');
Flight::register('userService', 'UserService');

Flight::route('GET /test', function(){  
    Flight::json(['message' => '1984', 'status' => 'API is working']);
});


Flight::before('start', function () {
    $request = Flight::request();
    $url = $request->url;
    $method = $request->method;
    
    if ($method === 'OPTIONS') {
        return;
    }
    
    $public_routes = [
        '/test',
        '/auth/login',
        '/auth/register'
    ];
    
    foreach ($public_routes as $route) {
        if ($url === $route || strpos($url, $route) === 0) {
            return; 
        }
    }

    try {
        $token = null;
        
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
            if (isset($headers['Authorization'])) {
                $token = str_replace('Bearer ', '', $headers['Authorization']);
            } elseif (isset($headers['authorization'])) {
                $token = str_replace('Bearer ', '', $headers['authorization']);
            }
        }
        
        if (!$token && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
        }
        
        if (!$token && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $token = str_replace('Bearer ', '', $_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
        }
        
        if (!$token) {
            $authHeader = apache_request_headers()['Authorization'] ?? null;
            if ($authHeader) {
                $token = str_replace('Bearer ', '', $authHeader);
            }
        }

        if (!$token) {
            throw new Exception("Missing Authorization header");
        }

        Flight::auth_middleware()->verifyToken($token);
    } catch (Exception $e) {
        Flight::halt(401, json_encode(['error' => 'Unauthorized: ' . $e->getMessage()]));
    }
});

require_once __DIR__ . '/rest/routes/AuthRoutes.php';
require_once __DIR__ . '/rest/routes/CustomBuildRoutes.php';
require_once __DIR__ . '/rest/routes/OrderItemRoutes.php';
require_once __DIR__ . '/rest/routes/OrderRoutes.php';
require_once __DIR__ . '/rest/routes/ProductRoutes.php';
require_once __DIR__ . '/rest/routes/UserRoutes.php';

Flight::start();  
?>