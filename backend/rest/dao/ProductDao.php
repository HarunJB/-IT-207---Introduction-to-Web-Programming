<?php
require_once 'BaseDao.php';

class ProductDao extends BaseDao {
    public function __construct() {
        parent::__construct("products", "product_id");
    }
    
    public function createProduct($productData) {
        return $this->insert($productData);
    }
    
    public function getAllProducts() {
        return $this->getAll();
    }
    
    public function getProductById($productId) {
        return $this->getById($productId);
    }
    
    public function getProductBySku($sku) {
        $stmt = $this->connection->prepare("SELECT * FROM products WHERE sku = :sku");
        $stmt->bindParam(':sku', $sku);
        $stmt->execute();
        return $stmt->fetch();
    }
    
    public function getProductsByType($type) {
        $stmt = $this->connection->prepare("SELECT * FROM products WHERE type = :type");
        $stmt->bindParam(':type', $type);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function getProductsByCategory($category) {
        $stmt = $this->connection->prepare("SELECT * FROM products WHERE category = :category");
        $stmt->bindParam(':category', $category);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function getProductsByBrand($brand) {
        $stmt = $this->connection->prepare("SELECT * FROM products WHERE brand = :brand");
        $stmt->bindParam(':brand', $brand);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function getProductsOnSale() {
        $stmt = $this->connection->prepare("SELECT * FROM products WHERE sale_price IS NOT NULL AND sale_price < price");
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function searchProducts($searchTerm) {
        $searchTerm = "%{$searchTerm}%";
        $stmt = $this->connection->prepare("SELECT * FROM products WHERE name LIKE :term OR description LIKE :term");
        $stmt->bindParam(':term', $searchTerm);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function updateProduct($productId, $productData) {
        return $this->update($productId, $productData);
    }
    
    public function updateStock($productId, $newStock) {
        $data = ['stock' => $newStock];
        return $this->update($productId, $data);
    }
    
    public function updatePrice($productId, $price, $salePrice = null) {
        $data = ['price' => $price];
        if ($salePrice !== null) {
            $data['sale_price'] = $salePrice;
        }
        return $this->update($productId, $data);
    }
    
    public function deleteProduct($productId) {
        return $this->delete($productId);
    }
}
?>