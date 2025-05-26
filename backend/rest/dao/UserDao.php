<?php
require_once 'BaseDao.php';

class UserDao extends BaseDao {
    public function __construct() {
        parent::__construct("users", "user_id");
    }
    
    public function createUser($userData) {
        // Convert camelCase to snake_case and filter out duplicates
        $userData = array_combine(
            array_map(function($key) {
                return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $key));
            }, array_keys($userData)),
            array_values($userData)
        );
        
        // Filter out duplicate fields, keeping only snake_case versions
        $filteredData = [];
        foreach ($userData as $key => $value) {
            if (!in_array($key, ['firstName', 'lastName', 'name'])) {
                $filteredData[$key] = $value;
            }
        }
        
        return $this->insert($filteredData);
    }
    
    public function getAllUsers() {
        return $this->getAll();
    }
    
    public function getUserById($userId) {
        return $this->getById($userId);
    }
    
    public function getUserByEmail($email) {
        $stmt = $this->connection->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch();
    }
    
    public function getAdminUsers() {
        $stmt = $this->connection->prepare("SELECT * FROM users WHERE is_admin = 1");
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function updateUser($userId, $userData) {
        return $this->update($userId, $userData);
    }
    
    public function updatePassword($userId, $passwordHash) {
        $data = ['password_hash' => $passwordHash];
        return $this->update($userId, $data);
    }
    
    public function setAdminStatus($userId, $isAdmin) {
        $data = ['is_admin' => $isAdmin ? 1 : 0];
        return $this->update($userId, $data);
    }
    
    public function deleteUser($userId) {
        return $this->delete($userId);
    }
}
?>