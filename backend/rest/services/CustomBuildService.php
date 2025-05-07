<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/CustomBuildDao.php';

class CustomBuildService {
    private $dao;
    
    public function __construct() {
        $this->dao = new CustomBuildDao();
    }

    public function createCustomBuild($buildData) {
        if (!isset($buildData['user_id']) || empty($buildData['user_id'])) {
            throw new Exception('User ID is required');
        }
        
        if (!isset($buildData['name']) || empty($buildData['name'])) {
            throw new Exception('Build name is required');
        }
        
        if (!isset($buildData['is_purchased'])) {
            $buildData['is_purchased'] = 0;
        }
        
        if (!isset($buildData['components'])) {
            $buildData['components'] = '[]';
        }
        
        if (!isset($buildData['price'])) {
            $buildData['price'] = 0;
        }
        
        $result = $this->dao->createCustomBuild($buildData);
        if ($result) {
            return $this->dao->connection->lastInsertId();
        }
        
        return false;
    }

    public function getAllCustomBuilds() {
        return $this->dao->getAllCustomBuilds();
    }

    public function getCustomBuildById($buildId) {
        return $this->dao->getCustomBuildById($buildId);
    }
 
    public function getCustomBuildsByUserId($userId) {
        return $this->dao->getCustomBuildsByUserId($userId);
    }

    public function getSavedBuilds($userId) {
        return $this->dao->getSavedBuilds($userId);
    }

    public function getPurchasedBuilds($userId) {
        return $this->dao->getPurchasedBuilds($userId);
    }

    public function getComponentsBreakdown($buildId) {
        return $this->dao->getComponentsBreakdown($buildId);
    }

    public function updateCustomBuild($buildId, $buildData) {
        $build = $this->dao->getCustomBuildById($buildId);
        if (!$build) {
            throw new Exception('Build not found');
        }
        
        if (isset($buildData['name']) && empty($buildData['name'])) {
            throw new Exception('Build name cannot be empty');
        }

        return $this->dao->updateCustomBuild($buildId, $buildData);
    }
    
    public function markAsPurchased($buildId) {

        $build = $this->dao->getCustomBuildById($buildId);
        if (!$build) {
            throw new Exception('Build not found');
        }
        
        if ($build['is_purchased'] == 1) {
            throw new Exception('Build is already marked as purchased');
        }
        
        return $this->dao->markAsPurchased($buildId);
    }

    public function updateComponents($buildId, $components, $price) {
        $build = $this->dao->getCustomBuildById($buildId);
        if (!$build) {
            throw new Exception('Build not found');
        }
        
        if (!is_numeric($price) || $price < 0) {
            throw new Exception('Price must be a non-negative number');
        }
        
        if (is_array($components)) {
            $components = json_encode($components);
        }

        return $this->dao->updateComponents($buildId, $components, $price);
    }
    
    public function cloneBuild($buildId, $userId, $newName = null) {
        $build = $this->dao->getCustomBuildById($buildId);
        if (!$build) {
            throw new Exception('Build not found');
        }

        return $this->dao->cloneBuild($buildId, $userId, $newName);
    }
    

    public function deleteCustomBuild($buildId) {
        $build = $this->dao->getCustomBuildById($buildId);
        if (!$build) {
            throw new Exception('Build not found');
        }

        return $this->dao->deleteCustomBuild($buildId);
    }
}
?>