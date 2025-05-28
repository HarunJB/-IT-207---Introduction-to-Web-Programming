<?php
/**
 * @OA\Get(
 *     path="/order-items",
 *     tags={"order-items"},
 *     summary="Get all order items",
 *     @OA\Response(
 *         response=200,
 *         description="List of all order items",
 *         @OA\JsonContent(type="array", @OA\Items(type="object"))
 *     )
 * )
 */
Flight::route('GET ' . BASE_URL . '/order-items', function() {
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $items = Flight::orderItemService()->getAllOrderItems();
    Flight::json($items);
});

/**
 * @OA\Get(
 *     path="/order-items/{id}",
 *     tags={"order-items"},
 *     summary="Get order item by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the order item to retrieve",
 *         @OA\Schema(type="integer", format="int64", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Order item details",
 *         @OA\JsonContent(type="object")
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Order item not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Order item not found")
 *         )
 *     )
 * )
 */
Flight::route('GET ' . BASE_URL . '/order-items/@id', function($id) {
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $item = Flight::orderItemService()->getOrderItemById($id);
    if (!$item) {
        Flight::json(['error' => 'Order item not found'], 404);
        return;
    }
    Flight::json($item);
});

/**
 * @OA\Post(
 *     path="/order-items",
 *     tags={"order-items"},
 *     summary="Create a new order item",
 *     @OA\RequestBody(
 *         required=true,
 *         description="Order item data",
 *         @OA\JsonContent(
 *             required={"order_id", "product_id", "quantity"},
 *             @OA\Property(property="order_id", type="integer", example=1),
 *             @OA\Property(property="product_id", type="integer", example=5),
 *             @OA\Property(property="quantity", type="integer", example=2),
 *             @OA\Property(property="price", type="number", format="float", example=99.99)
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Order item created successfully",
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
 *             @OA\Property(property="error", type="string", example="Failed to create order item")
 *         )
 *     )
 * )
 */
Flight::route('POST ' . BASE_URL . '/order-items', function() {
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $data = Flight::request()->data->getData();
    try {
        $itemId = Flight::orderItemService()->createOrderItem($data);
        if (!$itemId) {
            Flight::json(['error' => 'Failed to create order item'], 500);
            return;
        }
        $item = Flight::orderItemService()->getOrderItemById($itemId);
        Flight::json($item, 201);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});

/**
 * @OA\Put(
 *     path="/order-items/{id}",
 *     tags={"order-items"},
 *     summary="Update an existing order item",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the order item to update",
 *         @OA\Schema(type="integer", format="int64", example=1)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         description="Updated order item data",
 *         @OA\JsonContent(
 *             required={"order_id", "product_id", "quantity"},
 *             @OA\Property(property="order_id", type="integer", example=1),
 *             @OA\Property(property="product_id", type="integer", example=5),
 *             @OA\Property(property="quantity", type="integer", example=3),
 *             @OA\Property(property="price", type="number", format="float", example=99.99)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Order item updated successfully",
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
 *             @OA\Property(property="error", type="string", example="Failed to update order item")
 *         )
 *     )
 * )
 */
Flight::route('PUT ' . BASE_URL . '/order-items/@id', function($id) {
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $data = Flight::request()->data->getData();
    try {
        $success = Flight::orderItemService()->updateOrderItem($id, $data);
        if (!$success) {
            Flight::json(['error' => 'Failed to update order item'], 500);
            return;
        }
        $item = Flight::orderItemService()->getOrderItemById($id);
        Flight::json($item);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});

/**
 * @OA\Delete(
 *     path="/order-items/{id}",
 *     tags={"order-items"},
 *     summary="Delete an order item",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the order item to delete",
 *         @OA\Schema(type="integer", format="int64", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Order item deleted successfully",
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
 *             @OA\Property(property="error", type="string", example="Failed to delete order item")
 *         )
 *     )
 * )
 */
Flight::route('DELETE ' . BASE_URL . '/order-items/@id', function($id) {
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    try {
        $success = Flight::orderItemService()->deleteOrderItem($id);
        if (!$success) {
            Flight::json(['error' => 'Failed to delete order item'], 500);
            return;
        }
        Flight::json(['success' => true]);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});