<?php
require_once 'BaseDao.php';

class OrderItemDao extends BaseDao {
    public function __construct() {
        parent::__construct("order_items", "item_id");
    }
    
    public function createOrderItem($orderItemData) {
        return $this->insert($orderItemData);
    }
    
    public function getAllOrderItems() {
        return $this->getAll();
    }
    
    public function getOrderItemById($itemId) {
        return $this->getById($itemId);
    }
    
    public function getOrderItemsByOrderId($orderId) {
        $stmt = $this->connection->prepare("SELECT * FROM order_items WHERE order_id = :order_id");
        $stmt->bindParam(':order_id', $orderId);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function getOrdersByProductId($productId) {
        $stmt = $this->connection->prepare("SELECT DISTINCT order_id FROM order_items WHERE product_id = :product_id");
        $stmt->bindParam(':product_id', $productId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
    
    public function getCustomBuildItems() {
        $stmt = $this->connection->prepare("SELECT * FROM order_items WHERE is_custom_build = 1");
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function getDetailedOrderItems($orderId) {
        $stmt = $this->connection->prepare("
            SELECT oi.*, p.name, p.sku, p.brand, p.type 
            FROM order_items oi
            JOIN products p ON oi.product_id = p.product_id
            WHERE oi.order_id = :order_id
        ");
        $stmt->bindParam(':order_id', $orderId);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function updateOrderItem($itemId, $orderItemData) {
        return $this->update($itemId, $orderItemData);
    }
    
    public function updateQuantity($itemId, $quantity) {
        if ($quantity <= 0) {
            return $this->deleteOrderItem($itemId);
        }
        
        $data = ['quantity' => $quantity];
        return $this->update($itemId, $data);
    }
    
    public function deleteOrderItem($itemId) {
        return $this->delete($itemId);
    }
    
    public function deleteOrderItemsByOrderId($orderId) {
        $stmt = $this->connection->prepare("DELETE FROM order_items WHERE order_id = :order_id");
        $stmt->bindParam(':order_id', $orderId);
        return $stmt->execute();
    }
}
?>