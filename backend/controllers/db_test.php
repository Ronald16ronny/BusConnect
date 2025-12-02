<?php
header('Content-Type: application/json');
require_once __DIR__ . "/../config/conexion.php";

// Probar conexión y una consulta simple
try {
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Conexión fallida: " . $conn->connect_error]);
        exit();
    }

    // Asegurar charset
    $conn->set_charset('utf8mb4');

    $result = $conn->query("SELECT 1 AS ok");
    if ($result && $result->num_rows > 0) {
        echo json_encode(["success" => true, "message" => "Conexión y consulta OK"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Consulta de prueba fallida"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Excepción: " . $e->getMessage()]);
}

$conn->close();
