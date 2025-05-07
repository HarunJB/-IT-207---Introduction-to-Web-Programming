<?php
/**
 * @OA\Get(
 *     path="/custom-builds",
 *     tags={"custom-builds"},
 *     summary="Get all custom builds",
 *     @OA\Response(
 *         response=200,
 *         description="List of all custom PC builds",
 *         @OA\JsonContent(type="array", @OA\Items(type="object"))
 *     )
 * )
 */
Flight::route('GET ' . BASE_URL . '/custom-builds', function() {
    $builds = Flight::customBuildService()->getAllCustomBuilds();
    Flight::json($builds);
});

/**
 * @OA\Get(
 *     path="/custom-builds/{id}",
 *     tags={"custom-builds"},
 *     summary="Get custom build by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the custom build to retrieve",
 *         @OA\Schema(type="integer", format="int64", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Custom build details",
 *         @OA\JsonContent(type="object")
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Custom build not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Custom build not found")
 *         )
 *     )
 * )
 */
Flight::route('GET ' . BASE_URL . '/custom-builds/@id', function($id) {
    $build = Flight::customBuildService()->getCustomBuildById($id);
    if (!$build) {
        Flight::json(['error' => 'Custom build not found'], 404);
        return;
    }
    Flight::json($build);
});

/**
 * @OA\Post(
 *     path="/custom-builds",
 *     tags={"custom-builds"},
 *     summary="Create a new custom build",
 *     @OA\RequestBody(
 *         required=true,
 *         description="Custom build data",
 *         @OA\JsonContent(
 *             required={"name", "components"},
 *             @OA\Property(property="name", type="string", example="Gaming PC Build"),
 *             @OA\Property(property="components", type="array", @OA\Items(type="integer")),
 *             @OA\Property(property="description", type="string", example="High-end gaming PC build"),
 *             @OA\Property(property="price", type="number", format="float", example=1599.99)
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Custom build created successfully",
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
 *             @OA\Property(property="error", type="string", example="Failed to create custom build")
 *         )
 *     )
 * )
 */
Flight::route('POST ' . BASE_URL . '/custom-builds', function() {
    $data = Flight::request()->data->getData();
    try {
        $buildId = Flight::customBuildService()->createCustomBuild($data);
        if (!$buildId) {
            Flight::json(['error' => 'Failed to create custom build'], 500);
            return;
        }
        $build = Flight::customBuildService()->getCustomBuildById($buildId);
        Flight::json($build, 201);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});

/**
 * @OA\Put(
 *     path="/custom-builds/{id}",
 *     tags={"custom-builds"},
 *     summary="Update an existing custom build",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the custom build to update",
 *         @OA\Schema(type="integer", format="int64", example=1)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         description="Updated custom build data",
 *         @OA\JsonContent(
 *             required={"name", "components"},
 *             @OA\Property(property="name", type="string", example="Updated Gaming PC"),
 *             @OA\Property(property="components", type="array", @OA\Items(type="integer")),
 *             @OA\Property(property="description", type="string", example="Updated high-end gaming PC"),
 *             @OA\Property(property="price", type="number", format="float", example=1899.99)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Custom build updated successfully",
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
 *             @OA\Property(property="error", type="string", example="Failed to update custom build")
 *         )
 *     )
 * )
 */
Flight::route('PUT ' . BASE_URL . '/custom-builds/@id', function($id) {
    $data = Flight::request()->data->getData();
    try {
        $success = Flight::customBuildService()->updateCustomBuild($id, $data);
        if (!$success) {
            Flight::json(['error' => 'Failed to update custom build'], 500);
            return;
        }
        $build = Flight::customBuildService()->getCustomBuildById($id);
        Flight::json($build);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});

/**
 * @OA\Delete(
 *     path="/custom-builds/{id}",
 *     tags={"custom-builds"},
 *     summary="Delete a custom build",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the custom build to delete",
 *         @OA\Schema(type="integer", format="int64", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Custom build deleted successfully",
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
 *             @OA\Property(property="error", type="string", example="Failed to delete custom build")
 *         )
 *     )
 * )
 */
Flight::route('DELETE ' . BASE_URL . '/custom-builds/@id', function($id) {
    try {
        $success = Flight::customBuildService()->deleteCustomBuild($id);
        if (!$success) {
            Flight::json(['error' => 'Failed to delete custom build'], 500);
            return;
        }
        Flight::json(['success' => true]);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});