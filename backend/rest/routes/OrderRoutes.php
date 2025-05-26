<?php
/**
 * @OA\Get(
 *     path="/orders",
 *     tags={"orders"},
 *     summary="Get all orders",
 *     @OA\Response(
 *         response=200,
 *         description="List of all orders",
 *         @OA\JsonContent(type="array", @OA\Items(type="object"))
 *     )
 * )
 */
Flight::route('GET ' . BASE_URL . '/orders', function() {
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $orders = Flight::orderService()->getAllOrders();
    Flight::json($orders);
});

/**
 * @OA\Get(
 *     path="/orders/{id}",
 *     tags={"orders"},
 *     summary="Get order by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the order to retrieve",
 *         @OA\Schema(type="integer", format="int64", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Order details",
 *         @OA\JsonContent(type="object")
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Order not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Order not found")
 *         )
 *     )
 * )
 */
Flight::route('GET ' . BASE_URL . '/orders/@id', function($id) {
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $order = Flight::orderService()->getOrderById($id);
    if (!$order) {
        Flight::json(['error' => 'Order not found'], 404);
        return;
    }
    Flight::json($order);
});

/**
 * @OA\Post(
 *     path="/orders",
 *     tags={"orders"},
 *     summary="Create a new order",
 *     @OA\RequestBody(
 *         required=true,
 *         description="Order data",
 *         @OA\JsonContent(
 *             required={"user_id", "status"},
 *             @OA\Property(property="user_id", type="integer", example=1),
 *             @OA\Property(property="status", type="string", example="pending"),
 *             @OA\Property(property="total", type="number", format="float", example=249.99),
 *             @OA\Property(property="shipping_address", type="string", example="123 Main St, Anytown, USA"),
 *             @OA\Property(property="payment_method", type="string", example="credit_card")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Order created successfully",
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
 *             @OA\Property(property="error", type="string", example="Failed to create order")
 *         )
 *     )
 * )
 */
Flight::route('POST ' . BASE_URL . '/orders', function() {
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $data = Flight::request()->data->getData();
    try {
        $orderId = Flight::orderService()->createOrder($data);
        if (!$orderId) {
            Flight::json(['error' => 'Failed to create order'], 500);
            return;
        }
        $order = Flight::orderService()->getOrderById($orderId);
        Flight::json($order, 201);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});

/**
 * @OA\Put(
 *     path="/orders/{id}",
 *     tags={"orders"},
 *     summary="Update an existing order",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the order to update",
 *         @OA\Schema(type="integer", format="int64", example=1)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         description="Updated order data",
 *         @OA\JsonContent(
 *             @OA\Property(property="status", type="string", example="shipped"),
 *             @OA\Property(property="total", type="number", format="float", example=249.99),
 *             @OA\Property(property="shipping_address", type="string", example="456 Oak St, Anytown, USA"),
 *             @OA\Property(property="payment_method", type="string", example="paypal")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Order updated successfully",
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
 *             @OA\Property(property="error", type="string", example="Failed to update order")
 *         )
 *     )
 * )
 */
Flight::route('PUT ' . BASE_URL . '/orders/@id', function($id) {
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $data = Flight::request()->data->getData();
    try {
        $success = Flight::orderService()->updateOrder($id, $data);
        if (!$success) {
            Flight::json(['error' => 'Failed to update order'], 500);
            return;
        }
        $order = Flight::orderService()->getOrderById($id);
        Flight::json($order);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});

/**
 * @OA\Delete(
 *     path="/orders/{id}",
 *     tags={"orders"},
 *     summary="Delete an order",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the order to delete",
 *         @OA\Schema(type="integer", format="int64", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Order deleted successfully",
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
 *             @OA\Property(property="error", type="string", example="Failed to delete order")
 *         )
 *     )
 * )
 */
Flight::route('DELETE ' . BASE_URL . '/orders/@id', function($id) {
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    try {
        $success = Flight::orderService()->deleteOrder($id);
        if (!$success) {
            Flight::json(['error' => 'Failed to delete order'], 500);
            return;
        }
        Flight::json(['success' => true]);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});