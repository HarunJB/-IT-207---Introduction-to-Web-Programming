<?php
require_once 'BaseDao.php';

class CustomBuildDao extends BaseDao {
    public function __construct() {
        parent::__construct("custom_builds", "build_id");
    }
    
    public function createCustomBuild($buildData) {
        return $this->insert($buildData);
    }
    
    public function getAllCustomBuilds() {
        return $this->getAll();
    }
    
    public function getCustomBuildById($buildId) {
        return $this->getById($buildId);
    }
    
    public function getCustomBuildsByUserId($userId) {
        $stmt = $this->connection->prepare("SELECT * FROM custom_builds WHERE user_id = :user_id");
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function getSavedBuilds($userId) {
        $stmt = $this->connection->prepare("SELECT * FROM custom_builds WHERE user_id = :user_id AND is_purchased = 0");
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function getPurchasedBuilds($userId) {
        $stmt = $this->connection->prepare("SELECT * FROM custom_builds WHERE user_id = :user_id AND is_purchased = 1");
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function getComponentsBreakdown($buildId) {
        $build = $this->getById($buildId);
        
        if (!$build || empty($build['components'])) {
            return null;
        }
        
        return $build['components']; 
    }
    
    public function updateCustomBuild($buildId, $buildData) {
        return $this->update($buildId, $buildData);
    }
    
    public function markAsPurchased($buildId) {
        $data = ['is_purchased' => 1];
        return $this->update($buildId, $data);
    }
    
    public function updateComponents($buildId, $components, $price) {
        $data = [
            'components' => $components,
            'price' => $price
        ];
        return $this->update($buildId, $data);
    }
    
    public function cloneBuild($buildId, $userId, $newName = null) {
        $originalBuild = $this->getById($buildId);
        
        if (!$originalBuild) {
            return false;
        }
        
        $newBuild = [
            'user_id' => $userId,
            'name' => $newName ?? ($originalBuild['name'] . ' (Copy)'),
            'components' => $originalBuild['components'],
            'price' => $originalBuild['price'],
            'is_purchased' => 0
        ];
        
        $this->insert($newBuild);
        return $this->connection->lastInsertId();
    }
    
    public function deleteCustomBuild($buildId) {
        return $this->delete($buildId);
    }
}
?>