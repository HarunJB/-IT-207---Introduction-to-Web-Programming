<?php
require_once 'BaseDao.php';

class OrderDao extends BaseDao {
    public function __construct() {
        parent::__construct("orders", "order_id");
    }
    
    public function createOrder($orderData) {
        return $this->insert($orderData);
    }
    
    public function createOrderWithItems($orderData, $orderItems) {
        try {
            $this->connection->beginTransaction();
            
            $this->insert($orderData);
            $orderId = $this->connection->lastInsertId();
            
            $orderItemDao = new OrderItemDao();
            foreach ($orderItems as $item) {
                $item['order_id'] = $orderId;
                $orderItemDao->createOrderItem($item);
            }
            
            $this->connection->commit();
            return $orderId;
        } catch (Exception $e) {
            $this->connection->rollBack();
            error_log("Error creating order: " . $e->getMessage());
            return false;
        }
    }
    
    public function getAllOrders() {
        return $this->getAll();
    }
    
    public function getOrderById($orderId) {
        return $this->getById($orderId);
    }
    
    public function getOrdersByUserId($userId) {
        $stmt = $this->connection->prepare("SELECT * FROM orders WHERE user_id = :user_id ORDER BY order_date DESC");
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function getOrdersByStatus($status) {
        $stmt = $this->connection->prepare("SELECT * FROM orders WHERE status = :status ORDER BY order_date DESC");
        $stmt->bindParam(':status', $status);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function getOrdersByDateRange($startDate, $endDate) {
        $stmt = $this->connection->prepare("SELECT * FROM orders WHERE DATE(order_date) BETWEEN :start_date AND :end_date ORDER BY order_date DESC");
        $stmt->bindParam(':start_date', $startDate);
        $stmt->bindParam(':end_date', $endDate);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function getOrderWithItems($orderId) {
        $order = $this->getById($orderId);
        
        if (!$order) {
            return null;
        }
        
        $orderItemDao = new OrderItemDao();
        $order['items'] = $orderItemDao->getOrderItemsByOrderId($orderId);
        return $order;
    }
    
    public function updateOrder($orderId, $orderData) {
        return $this->update($orderId, $orderData);
    }
    
    public function updateOrderStatus($orderId, $status) {
        $allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        if (!in_array($status, $allowedStatuses)) {
            return false;
        }
        
        $data = ['status' => $status];
        return $this->update($orderId, $data);
    }
    
    public function deleteOrder($orderId) {
        try {
            $this->connection->beginTransaction();
            
            $this->connection->exec("DELETE FROM order_items WHERE order_id = $orderId");
            $result = $this->delete($orderId);
            
            $this->connection->commit();
            return $result;
        } catch (Exception $e) {
            $this->connection->rollBack();
            return false;
        }
    }
}
?>