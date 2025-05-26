<?php

require_once __DIR__ . '/BaseDao.php';

class AuthDao extends BaseDao {
    protected $table_name;

    public function __construct() {
        $this->table_name = "users";
        parent::__construct($this->table_name, "user_id"); 
    }

    public function get_user_by_email($email) {
        try {
            $query = "SELECT * FROM " . $this->table_name . " WHERE email = :email";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            return $stmt->fetch();
        } catch (Exception $e) {
            error_log("Error in get_user_by_email: " . $e->getMessage());
            return false;
        }
    }

    public function insert($data) {
        try {
            return parent::insert($data);
        } catch (Exception $e) {
            error_log("Error in AuthDao insert: " . $e->getMessage());
            throw $e;
        }
    }

    public function getById($id) {
        try {
            return parent::getById($id);
        } catch (Exception $e) {
            error_log("Error in AuthDao getById: " . $e->getMessage());
            return false;
        }
    }
}

?>