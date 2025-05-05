<?php
/**
 * @OA\Get(
 *     path="/users",
 *     tags={"users"},
 *     summary="Get all users",
 *     @OA\Response(
 *         response=200,
 *         description="List of all users with password data removed",
 *         @OA\JsonContent(type="array", @OA\Items(type="object"))
 *     )
 * )
 */
Flight::route('GET ' . BASE_URL . '/users', function() {
    $users = Flight::userService()->getAllUsers();
    foreach ($users as &$user) {
        if (isset($user['password_hash'])) {
            unset($user['password_hash']);
        }
    }
    Flight::json($users);
});

/**
 * @OA\Get(
 *     path="/users/{id}",
 *     tags={"users"},
 *     summary="Get user by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the user to retrieve",
 *         @OA\Schema(type="integer", format="int64", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User details with password data removed",
 *         @OA\JsonContent(type="object")
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="User not found")
 *         )
 *     )
 * )
 */
Flight::route('GET ' . BASE_URL . '/users/@id', function($id) {
    $user = Flight::userService()->getUserById($id);
    if (!$user) {
        Flight::json(['error' => 'User not found'], 404);
        return;
    }
    if (isset($user['password_hash'])) {
        unset($user['password_hash']);
    }
    Flight::json($user);
});

/**
 * @OA\Post(
 *     path="/users",
 *     tags={"users"},
 *     summary="Create a new user",
 *     @OA\RequestBody(
 *         required=true,
 *         description="User data",
 *         @OA\JsonContent(
 *             required={"username", "email", "password"},
 *             @OA\Property(property="username", type="string", example="johndoe"),
 *             @OA\Property(property="email", type="string", format="email", example="john.doe@example.com"),
 *             @OA\Property(property="password", type="string", format="password", example="SecurePassword123"),
 *             @OA\Property(property="first_name", type="string", example="John"),
 *             @OA\Property(property="last_name", type="string", example="Doe"),
 *             @OA\Property(property="address", type="string", example="123 Main St, Anytown, USA"),
 *             @OA\Property(property="phone", type="string", example="+1-555-123-4567")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="User created successfully",
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
 *             @OA\Property(property="error", type="string", example="Failed to create user")
 *         )
 *     )
 * )
 */
Flight::route('POST ' . BASE_URL . '/users', function() {
    $data = Flight::request()->data->getData();
    try {
        $userId = Flight::userService()->createUser($data);
        if (!$userId) {
            Flight::json(['error' => 'Failed to create user'], 500);
            return;
        }
        $user = Flight::userService()->getUserById($userId);
        if (isset($user['password_hash'])) {
            unset($user['password_hash']);
        }
        Flight::json($user, 201);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});

/**
 * @OA\Put(
 *     path="/users/{id}",
 *     tags={"users"},
 *     summary="Update an existing user",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the user to update",
 *         @OA\Schema(type="integer", format="int64", example=1)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         description="Updated user data",
 *         @OA\JsonContent(
 *             @OA\Property(property="username", type="string", example="johndoe_updated"),
 *             @OA\Property(property="email", type="string", format="email", example="john.updated@example.com"),
 *             @OA\Property(property="password", type="string", format="password", example="NewSecurePassword456"),
 *             @OA\Property(property="first_name", type="string", example="Johnny"),
 *             @OA\Property(property="last_name", type="string", example="Doe"),
 *             @OA\Property(property="address", type="string", example="456 Oak St, Anytown, USA"),
 *             @OA\Property(property="phone", type="string", example="+1-555-987-6543")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User updated successfully",
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
 *             @OA\Property(property="error", type="string", example="Failed to update user")
 *         )
 *     )
 * )
 */
Flight::route('PUT ' . BASE_URL . '/users/@id', function($id) {
    $data = Flight::request()->data->getData();
    try {
        $success = Flight::userService()->updateUser($id, $data);
        if (!$success) {
            Flight::json(['error' => 'Failed to update user'], 500);
            return;
        }
        $user = Flight::userService()->getUserById($id);
        if (isset($user['password_hash'])) {
            unset($user['password_hash']);
        }
        Flight::json($user);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});

/**
 * @OA\Delete(
 *     path="/users/{id}",
 *     tags={"users"},
 *     summary="Delete a user",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the user to delete",
 *         @OA\Schema(type="integer", format="int64", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User deleted successfully",
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
 *             @OA\Property(property="error", type="string", example="Failed to delete user")
 *         )
 *     )
 * )
 */
Flight::route('DELETE ' . BASE_URL . '/users/@id', function($id) {
    try {
        $success = Flight::userService()->deleteUser($id);
        if (!$success) {
            Flight::json(['error' => 'Failed to delete user'], 500);
            return;
        }
        Flight::json(['success' => true]);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});