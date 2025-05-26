<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/**
 * @OA\Post(
 *     path="/auth/register",
 *     summary="Register new user.",
 *     description="Add a new user to the database.",
 *     tags={"auth"},
 *     @OA\RequestBody(
 *         description="Add new user",
 *         required=true,
 *         @OA\MediaType(
 *             mediaType="application/json",
 *             @OA\Schema(
 *                 required={"password", "email", "name"},
 *                 @OA\Property(
 *                     property="name",
 *                     type="string",
 *                     example="John Doe",
 *                     description="User full name"
 *                 ),
 *                 @OA\Property(
 *                     property="password",
 *                     type="string",
 *                     example="some_password",
 *                     description="User password"
 *                 ),
 *                 @OA\Property(
 *                     property="email",
 *                     type="string",
 *                     example="demo@gmail.com",
 *                     description="User email"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User has been added."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route("POST /auth/register", function () {
    try {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            Flight::json([
                'success' => false,
                'error' => 'Invalid JSON data: ' . json_last_error_msg()
            ], 400);
            return;
        }
        
        if (empty($data) || !is_array($data)) {
            Flight::json([
                'success' => false,
                'error' => 'No data provided'
            ], 400);
            return;
        }
        
        if (empty($data['email']) || empty($data['password'])) {
            Flight::json([
                'success' => false,
                'error' => 'Email and password are required'
            ], 400);
            return;
        }
        
        $response = Flight::auth_service()->register($data);
 
        if ($response['success']) {
            Flight::json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => $response['data']
            ], 201);
        } else {
            Flight::json([
                'success' => false,
                'error' => $response['error']
            ], 400);
        }
    } catch (Exception $e) {
        Flight::json([
            'success' => false,
            'error' => 'Registration failed: ' . $e->getMessage()
        ], 500);
    }
});

/**
 * @OA\Post(
 *      path="/auth/login",
 *      tags={"auth"},
 *      summary="Login to system using email and password",
 *      @OA\Response(
 *           response=200,
 *           description="User data and JWT"
 *      ),
 *      @OA\RequestBody(
 *          description="Credentials",
 *          @OA\JsonContent(
 *              required={"email","password"},
 *              @OA\Property(property="email", type="string", example="demo@gmail.com", description="User email address"),
 *              @OA\Property(property="password", type="string", example="some_password", description="User password")
 *          )
 *      )
 * )
 */
Flight::route('POST /auth/login', function() {
    try {
        // Get the raw input and decode it
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        // Check if JSON decoding was successful
        if (json_last_error() !== JSON_ERROR_NONE) {
            Flight::json([
                'success' => false,
                'error' => 'Invalid JSON data: ' . json_last_error_msg()
            ], 400);
            return;
        }
        
        // Validate required fields
        if (empty($data) || !is_array($data)) {
            Flight::json([
                'success' => false,
                'error' => 'No data provided'
            ], 400);
            return;
        }
        
        $response = Flight::auth_service()->login($data);
 
        if ($response['success']) {
            Flight::json([
                'success' => true,
                'message' => 'User logged in successfully',
                'data' => $response['data']
            ]);
        } else {
            Flight::json([
                'success' => false,
                'error' => $response['error']
            ], 400);
        }
    } catch (Exception $e) {
        Flight::json([
            'success' => false,
            'error' => 'Login failed: ' . $e->getMessage()
        ], 500);
    }
});

/**
 * @OA\Get(
 *     path="/auth/profile",
 *     tags={"auth"},
 *     summary="Get current user profile",
 *     security={{"bearerAuth": {}}},
 *     @OA\Response(
 *         response=200,
 *         description="User profile data"
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized"
 *     )
 * )
 */
Flight::route('GET /auth/profile', function() {
    // User is already authenticated by global middleware
    $user = Flight::get('user');
    Flight::json(['user' => $user]);
});
?>