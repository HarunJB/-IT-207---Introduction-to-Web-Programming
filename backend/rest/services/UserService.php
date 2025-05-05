<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/UserDao.php';

class UserService {
    private $dao;
    
    public function __construct() {
        $this->dao = new UserDao();
    }

    public function createUser($userData) {

        if (!isset($userData['email']) || empty($userData['email'])) {
            throw new Exception('Email is required');
        }
        
        if (!isset($userData['password']) || empty($userData['password'])) {
            throw new Exception('Password is required');
        }
        
        if (!isset($userData['name']) || empty($userData['name'])) {
            throw new Exception('Name is required');
        }

        if (!filter_var($userData['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format');
        }

        $existingUser = $this->dao->getUserByEmail($userData['email']);
        if ($existingUser) {
            throw new Exception('Email already in use');
        }

        if (strlen($userData['password']) < 6) {
            throw new Exception('Password must be at least 6 characters');
        }

        $userData['password_hash'] = password_hash($userData['password'], PASSWORD_DEFAULT);
        unset($userData['password']);

        if (!isset($userData['is_admin'])) {
            $userData['is_admin'] = 0;
        }

        $result = $this->dao->createUser($userData);
        if ($result) {
            return $this->dao->connection->lastInsertId();
        }
        
        return false;
    }

    public function getAllUsers() {
        return $this->dao->getAllUsers();
    }

    public function getUserById($userId) {
        return $this->dao->getUserById($userId);
    }

    public function getUserByEmail($email) {
        return $this->dao->getUserByEmail($email);
    }

    public function getAdminUsers() {
        return $this->dao->getAdminUsers();
    }

    public function updateUser($userId, $userData) {
        $user = $this->dao->getUserById($userId);
        if (!$user) {
            throw new Exception('User not found');
        }
        
        if (isset($userData['email']) && !empty($userData['email'])) {
            if (!filter_var($userData['email'], FILTER_VALIDATE_EMAIL)) {
                throw new Exception('Invalid email format');
            }
            
            $existingUser = $this->dao->getUserByEmail($userData['email']);
            if ($existingUser && $existingUser['user_id'] != $userId) {
                throw new Exception('Email already in use');
            }
        }

        if (isset($userData['password']) && !empty($userData['password'])) {
            if (strlen($userData['password']) < 6) {
                throw new Exception('Password must be at least 6 characters');
            }
            
            $userData['password_hash'] = password_hash($userData['password'], PASSWORD_DEFAULT);
            unset($userData['password']);
        }
        
        return $this->dao->updateUser($userId, $userData);
    }
    
    public function updatePassword($userId, $password) {
        $user = $this->dao->getUserById($userId);
        if (!$user) {
            throw new Exception('User not found');
        }
        
        if (strlen($password) < 6) {
            throw new Exception('Password must be at least 6 characters');
        }
        
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        return $this->dao->updatePassword($userId, $passwordHash);
    }

    public function setAdminStatus($userId, $isAdmin) {
        $user = $this->dao->getUserById($userId);
        if (!$user) {
            throw new Exception('User not found');
        }
 
        return $this->dao->setAdminStatus($userId, $isAdmin);
    }

    public function deleteUser($userId) {
        $user = $this->dao->getUserById($userId);
        if (!$user) {
            throw new Exception('User not found');
        }
        
        return $this->dao->deleteUser($userId);
    }
}
?>