<?php

require_once "BaseService.php";
require_once __DIR__ . "/../dao/AuthDao.php";
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService extends BaseService {

    private $auth_dao;

    public function __construct() {
        $this->auth_dao = new AuthDao();
        parent::__construct(new AuthDao);
    }

   public function get_user_by_email($email){
       return $this->auth_dao->get_user_by_email($email);
   }


   public function register($entity) {  
       if (empty($entity['email']) || empty($entity['password'])) {
           return ['success' => false, 'error' => 'Email and password are required.'];
       }

        // Check if email exists
        $email_exists = $this->auth_dao->get_user_by_email($entity['email']);
        if($email_exists){
            return ['success' => false, 'error' => 'Email already registered.'];
        }

        // Prepare data for database using snake_case fields
        $databaseEntity = [
            'first_name' => $entity['first_name'],
            'last_name' => $entity['last_name'],
            'email' => $entity['email'],
            'phone' => $entity['phone'],
            'address' => $entity['address'],
            'password_hash' => password_hash($entity['password'], PASSWORD_BCRYPT)
        ];

        $result = parent::add($databaseEntity);
        
        return ['success' => true, 'data' => $result];             
   }


   public function login($entity) {  
        if (empty($entity['email']) || empty($entity['password'])) {
            return ['success' => false, 'error' => 'Email and password are required.'];
        }

        // Get user by email
        $user = $this->auth_dao->get_user_by_email($entity['email']);
        if(!$user){
            return ['success' => false, 'error' => 'Invalid username or password.'];
        }

        // Try to verify password - works for both plain text and hashed passwords
        if($entity['password'] === $user['password_hash'] || 
           password_verify($entity['password'], $user['password_hash'])) {
            // Remove sensitive fields
            unset($user['password_hash']);
      
            $jwt_payload = [
                'user' => $user,
                'iat' => time(),
                // If this parameter is not set, JWT will be valid for life. This is not a good approach
                'exp' => time() + (60 * 60 * 24) // valid for 1 minute
            ];

            $token = JWT::encode(
                $jwt_payload,
                Config::JWT_SECRET(),
                'HS256'
            );

            return ['success' => true, 'data' => array_merge($user, ['token' => $token])];
        }
        
        return ['success' => false, 'error' => 'Invalid username or password.'];


       return ['success' => true, 'data' => array_merge($user, ['token' => $token])];             
   }

}

?>