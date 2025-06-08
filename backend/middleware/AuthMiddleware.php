<?php

require_once __DIR__ . '/../rest/config.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware {

    public function verifyToken($token){
        if(!$token)
            Flight::halt(401, "Missing authentication header");

        try {
            $decoded_token = JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));
            Flight::set('user', $decoded_token->user);
            Flight::set('jwt_token', $token);
            return TRUE;
        } catch (Exception $e) {
            Flight::halt(401, "Invalid token: " . $e->getMessage());
        }
    }

public function authorizeRole($requiredRole) {
    $user = Flight::get('user');
    
    error_log("Checking authorization - User: " . json_encode($user));
    error_log("Required role: " . $requiredRole);
    
    if ($requiredRole === 'admin' || $requiredRole === Roles::ADMIN) {
        if (!isset($user->is_admin) || $user->is_admin != 1) {
            error_log("Access denied: User is not admin");
            Flight::halt(403, 'Access denied: admin privileges required');
        }
    }

}

public function authorizeRoles($roles) {
    $user = Flight::get('user');
    
    $hasAccess = false;
    foreach ($roles as $role) {
        if (($role === 'admin' || $role === Roles::ADMIN) && 
            isset($user->is_admin) && $user->is_admin == 1) {
            $hasAccess = true;
            break;
        }
        if ($role === 'user' || $role === Roles::USER) {
            $hasAccess = true; 
            break;
        }
    }
    
    if (!$hasAccess) {
        Flight::halt(403, 'Forbidden: insufficient privileges');
    }
}

    function authorizePermission($permission) {
        $user = Flight::get('user');
        if (!in_array($permission, $user->permissions)) {
            Flight::halt(403, 'Access denied: permission missing');
        }
    }    
}

?>