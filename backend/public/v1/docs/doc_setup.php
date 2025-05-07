<?php
/**
 * @OA\OpenApi(
 *     openapi="3.0.0"
 * )
 */

/**
 * @OA\Info(
 *     title="PC Build API",
 *     description="PC Build Web Service API",
 *     version="1.0",
 *     @OA\Contact(
 *         email="your-email@example.com",
 *         name="Web Programming"
 *     )
 * )
 */

/**
 * @OA\Server(
 *     url="http://localhost/Web Programming/backend",
 *     description="API server"
 * )
 */

/**
 * @OA\SecurityScheme(
 *     securityScheme="ApiKey",
 *     type="apiKey",
 *     in="header",
 *     name="Authentication"
 * )
 */