<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/OrderDao.php';

class OrderService {

    private $dao;

    public function __construct() {
        $this->dao = new OrderDao();
    }

    public function getAllOrders() {
        return $this->dao->getAllOrders();
    }

    public function getOrderById($orderId) {
        return $this->dao->getOrderById($orderId);
    }

    public function getOrdersByUserId($userId) {
        return $this->dao->getOrdersByUserId($userId);
    }

    public function getOrdersByStatus($status) {
        $allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        if (!in_array($status, $allowedStatuses)) {
            throw new Exception('Invalid status');
        }
        
        return $this->dao->getOrdersByStatus($status);
    }

    public function getOrdersByDateRange($startDate, $endDate) {

        if (!$this->isValidDate($startDate) || !$this->isValidDate($endDate)) {
            throw new Exception('Invalid date format. Use YYYY-MM-DD');
        }
        
        if (strtotime($endDate) < strtotime($startDate)) {
            throw new Exception('End date must be after start date');
        }
        
        return $this->dao->getOrdersByDateRange($startDate, $endDate);
    }

    public function getOrderWithItems($orderId) {
        return $this->dao->getOrderWithItems($orderId);
    }

    public function createOrder($orderData) {
        if (!isset($orderData['user_id']) || empty($orderData['user_id'])) {
            throw new Exception('User ID is required');
        }
        
        if (!isset($orderData['status'])) {
            $orderData['status'] = 'pending';
        }
        
        if (!isset($orderData['order_date'])) {
            $orderData['order_date'] = date('Y-m-d H:i:s');
        }
        
        $allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!in_array($orderData['status'], $allowedStatuses)) {
            throw new Exception('Invalid status');
        }
        
        $result = $this->dao->createOrder($orderData);
        
        if ($result) {
            return $this->dao->connection->lastInsertId();
        }
        
        return false;
    }
   
    public function createOrderWithItems($orderData, $orderItems) {
        if (!isset($orderData['user_id']) || empty($orderData['user_id'])) {
            throw new Exception('User ID is required');
        }
        
        if (!isset($orderData['status'])) {
            $orderData['status'] = 'pending';
        }
        
        if (!isset($orderData['order_date'])) {
            $orderData['order_date'] = date('Y-m-d H:i:s');
        }
        
        $allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!in_array($orderData['status'], $allowedStatuses)) {
            throw new Exception('Invalid status');
        }
        
        if (empty($orderItems) || !is_array($orderItems)) {
            throw new Exception('Order must contain at least one item');
        }
        
        return $this->dao->createOrderWithItems($orderData, $orderItems);
    }

    public function updateOrder($orderId, $orderData) {

        if (isset($orderData['status'])) {
            $allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
            if (!in_array($orderData['status'], $allowedStatuses)) {
                throw new Exception('Invalid status');
            }
        }
        
        return $this->dao->updateOrder($orderId, $orderData);
    }
 
    public function updateOrderStatus($orderId, $status) {
        $allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!in_array($status, $allowedStatuses)) {
            throw new Exception('Invalid status: ' . $status);
        }
        
        return $this->dao->updateOrderStatus($orderId, $status);
    }

    public function deleteOrder($orderId) {
        return $this->dao->deleteOrder($orderId);
    }

    private function isValidDate($date) {
        $format = 'Y-m-d';
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) === $date;
    }
}
?>