<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/ProductDao.php';

class ProductService {

    private $dao;
    

    public function __construct() {
        $this->dao = new ProductDao();
    }

    public function createProduct($productData) {
        if (!isset($productData['name']) || empty($productData['name'])) {
            throw new Exception('Product name is required');
        }
        
        if (!isset($productData['price']) || $productData['price'] === '') {
            throw new Exception('Price is required');
        }

        if (!is_numeric($productData['price']) || $productData['price'] <= 0) {
            throw new Exception('Price must be a positive number');
        }

        if (isset($productData['sale_price']) && $productData['sale_price'] !== '') {
            if (!is_numeric($productData['sale_price']) || $productData['sale_price'] < 0) {
                throw new Exception('Sale price must be a non-negative number');
            }
        }

        if (isset($productData['stock'])) {
            if (!is_numeric($productData['stock']) || $productData['stock'] < 0 || floor($productData['stock']) != $productData['stock']) {
                throw new Exception('Stock must be a non-negative integer');
            }
        } else {
            $productData['stock'] = 0;
        }
        
        if (isset($productData['sku']) && !empty($productData['sku'])) {
            $existingProduct = $this->dao->getProductBySku($productData['sku']);
            if ($existingProduct) {
                throw new Exception('A product with this SKU already exists');
            }
        }
        
        $result = $this->dao->createProduct($productData);
        if ($result) {
            return $this->dao->getLastInsertId();
        }
        
        return false;
    }

    public function getAllProducts() {
        return $this->dao->getAllProducts();
    }

    public function getProductById($productId) {
        return $this->dao->getProductById($productId);
    }

    public function getProductBySku($sku) {
        return $this->dao->getProductBySku($sku);
    }

    public function getProductsByType($type) {
        return $this->dao->getProductsByType($type);
    }

    public function getProductsByCategory($category) {
        return $this->dao->getProductsByCategory($category);
    }

    public function getProductsByBrand($brand) {
        return $this->dao->getProductsByBrand($brand);
    }

    public function getProductsOnSale() {
        return $this->dao->getProductsOnSale();
    }

    public function searchProducts($searchTerm) {
        if (empty($searchTerm)) {
            throw new Exception('Search term is required');
        }
        
        return $this->dao->searchProducts($searchTerm);
    }

    public function updateProduct($productId, $productData) {
        $product = $this->dao->getProductById($productId);
        if (!$product) {
            throw new Exception('Product not found');
        }

        if (isset($productData['price']) && $productData['price'] !== '') {
            if (!is_numeric($productData['price']) || $productData['price'] <= 0) {
                throw new Exception('Price must be a positive number');
            }
        }

        if (isset($productData['sale_price']) && $productData['sale_price'] !== '') {
            if (!is_numeric($productData['sale_price']) || $productData['sale_price'] < 0) {
                throw new Exception('Sale price must be a non-negative number');
            }
        }

        if (isset($productData['stock']) && $productData['stock'] !== '') {
            if (!is_numeric($productData['stock']) || $productData['stock'] < 0 || floor($productData['stock']) != $productData['stock']) {
                throw new Exception('Stock must be a non-negative integer');
            }
        }

        if (isset($productData['sku']) && !empty($productData['sku'])) {
            $existingProduct = $this->dao->getProductBySku($productData['sku']);
            if ($existingProduct && $existingProduct['product_id'] != $productId) {
                throw new Exception('A product with this SKU already exists');
            }
        }
        
        return $this->dao->updateProduct($productId, $productData);
    }

    public function updateStock($productId, $newStock) {
        $product = $this->dao->getProductById($productId);
        if (!$product) {
            throw new Exception('Product not found');
        }
        
        if (!is_numeric($newStock) || $newStock < 0 || floor($newStock) != $newStock) {
            throw new Exception('Stock must be a non-negative integer');
        }
        
        return $this->dao->updateStock($productId, $newStock);
    }

    public function updatePrice($productId, $price, $salePrice = null) {
        $product = $this->dao->getProductById($productId);
        if (!$product) {
            throw new Exception('Product not found');
        }
        
        if (!is_numeric($price) || $price <= 0) {
            throw new Exception('Price must be a positive number');
        }
        
        if ($salePrice !== null) {
            if (!is_numeric($salePrice) || $salePrice < 0) {
                throw new Exception('Sale price must be a non-negative number');
            }
        }
      
        return $this->dao->updatePrice($productId, $price, $salePrice);
    }

    public function deleteProduct($productId) {
        $product = $this->dao->getProductById($productId);
        if (!$product) {
            throw new Exception('Product not found');
        }

        return $this->dao->deleteProduct($productId);
    }
}
?>