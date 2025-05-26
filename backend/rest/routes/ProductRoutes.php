<?php
/**
 * @OA\Get(
 *     path="/products",
 *     tags={"products"},
 *     summary="Get all products",
 *     @OA\Response(
 *         response=200,
 *         description="List of all products",
 *         @OA\JsonContent(type="array", @OA\Items(type="object"))
 *     )
 * )
 */
Flight::route('GET ' . BASE_URL . '/products', function() {
    $products = Flight::productService()->getAllProducts();
    Flight::json($products);
});

/**
 * @OA\Get(
 *     path="/products/{id}",
 *     tags={"products"},
 *     summary="Get product by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the product to retrieve",
 *         @OA\Schema(type="integer", format="int64", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Product details",
 *         @OA\JsonContent(type="object")
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Product not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Product not found")
 *         )
 *     )
 * )
 */
Flight::route('GET ' . BASE_URL . '/products/@id', function($id) {
    $product = Flight::productService()->getProductById($id);
    if (!$product) {
        Flight::json(['error' => 'Product not found'], 404);
        return;
    }
    Flight::json($product);
});

/**
 * @OA\Post(
 *     path="/products",
 *     tags={"products"},
 *     summary="Create a new product",
 *     @OA\RequestBody(
 *         required=true,
 *         description="Product data",
 *         @OA\JsonContent(
 *             required={"name", "category", "price"},
 *             @OA\Property(property="name", type="string", example="RTX 4080 Graphics Card"),
 *             @OA\Property(property="category", type="string", example="Graphics Cards"),
 *             @OA\Property(property="price", type="number", format="float", example=799.99),
 *             @OA\Property(property="description", type="string", example="High-performance gaming graphics card"),
 *             @OA\Property(property="stock", type="integer", example=15)
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Product created successfully",
 *         @OA\JsonContent(type="object")
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input data",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Invalid input data")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Failed to create product")
 *         )
 *     )
 * )
 */
Flight::route('POST ' . BASE_URL . '/products', function() {
    $data = Flight::request()->data->getData();
    try {
        $productId = Flight::productService()->createProduct($data);
        if (!$productId) {
            Flight::json(['error' => 'Failed to create product'], 500);
            return;
        }
        $product = Flight::productService()->getProductById($productId);
        Flight::json($product, 201);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});

/**
 * @OA\Put(
 *     path="/products/{id}",
 *     tags={"products"},
 *     summary="Update an existing product",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the product to update",
 *         @OA\Schema(type="integer", format="int64", example=1)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         description="Updated product data",
 *         @OA\JsonContent(
 *             @OA\Property(property="name", type="string", example="RTX 4080 Ti Graphics Card"),
 *             @OA\Property(property="category", type="string", example="Graphics Cards"),
 *             @OA\Property(property="price", type="number", format="float", example=899.99),
 *             @OA\Property(property="description", type="string", example="Updated high-performance gaming graphics card"),
 *             @OA\Property(property="stock", type="integer", example=10)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Product updated successfully",
 *         @OA\JsonContent(type="object")
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input data",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Invalid input data")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Failed to update product")
 *         )
 *     )
 * )
 */
Flight::route('PUT ' . BASE_URL . '/products/@id', function($id) {
    $data = Flight::request()->data->getData();
    try {
        $success = Flight::productService()->updateProduct($id, $data);
        if (!$success) {
            Flight::json(['error' => 'Failed to update product'], 500);
            return;
        }
        $product = Flight::productService()->getProductById($id);
        Flight::json($product);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});

/**
 * @OA\Delete(
 *     path="/products/{id}",
 *     tags={"products"},
 *     summary="Delete a product",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the product to delete",
 *         @OA\Schema(type="integer", format="int64", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Product deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true)
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid request",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Invalid request")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Failed to delete product")
 *         )
 *     )
 * )
 */
Flight::route('DELETE ' . BASE_URL . '/products/@id', function($id) {
    
    try {
        $success = Flight::productService()->deleteProduct($id);
        if (!$success) {
            Flight::json(['error' => 'Failed to delete product'], 500);
            return;
        }
        Flight::json(['success' => true]);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});