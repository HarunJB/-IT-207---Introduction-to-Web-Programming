<?php
require_once __DIR__ . '/../dao/OrderItemDao.php';

class OrderItemService {
    private $dao;

    public function __construct() {
        $this->dao = new OrderItemDao();
    }

    public function getAllOrderItems() {
        return $this->dao->getAllOrderItems();
    }

    public function getOrderItemById($itemId) {
        return $this->dao->getOrderItemById($itemId);
    }

    public function getOrderItemsByOrderId($orderId) {
        return $this->dao->getOrderItemsByOrderId($orderId);
    }
 
    public function getOrdersByProductId($productId) {
        return $this->dao->getOrdersByProductId($productId);
    }

    public function getCustomBuildItems() {
        return $this->dao->getCustomBuildItems();
    }

    public function getDetailedOrderItems($orderId) {
        return $this->dao->getDetailedOrderItems($orderId);
    }

    public function createOrderItem($orderItemData) {
        if (!isset($orderItemData['order_id']) || empty($orderItemData['order_id'])) {
            throw new Exception('Order ID is required');
        }
        
        if (!isset($orderItemData['product_id']) || empty($orderItemData['product_id'])) {
            throw new Exception('Product ID is required');
        }
        
        if (!isset($orderItemData['quantity']) || empty($orderItemData['quantity'])) {
            throw new Exception('Quantity is required');
        }
        
        if (!is_numeric($orderItemData['quantity']) || $orderItemData['quantity'] <= 0) {
            throw new Exception('Quantity must be a positive number');
        }
        
        $result = $this->dao->createOrderItem($orderItemData);
        
        if ($result) {
            return $this->dao->connection->lastInsertId();
        }
        
        return false;
    }

    public function updateOrderItem($itemId, $orderItemData) {
        if (isset($orderItemData['quantity']) && 
            (!is_numeric($orderItemData['quantity']) || $orderItemData['quantity'] <= 0)) {
            throw new Exception('Quantity must be a positive number');
        }
        
        return $this->dao->updateOrderItem($itemId, $orderItemData);
    }
    
    public function updateQuantity($itemId, $quantity) {
        if (!is_numeric($quantity)) {
            throw new Exception('Quantity must be a number');
        }
        
        return $this->dao->updateQuantity($itemId, $quantity);
    }

    public function deleteOrderItem($itemId) {
        return $this->dao->deleteOrderItem($itemId);
    }

    public function deleteOrderItemsByOrderId($orderId) {
        return $this->dao->deleteOrderItemsByOrderId($orderId);
    }
}
?>