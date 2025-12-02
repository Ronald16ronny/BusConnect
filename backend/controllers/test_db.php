<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/conexion.php';

$result = ['success' => false];

try {
    if (!isset($conn) || !$conn) {
        throw new Exception('Variable $conn no definida. Revisa backend/config/conexion.php');
    }

    // prueba simple: ping y SELECT 1
    if (method_exists($conn, 'ping')) {
        $isAlive = $conn->ping();
    } else {
        $isAlive = (bool) $conn->connect_error === false;
    }

    $result['db_ping'] = $isAlive ? true : false;

    // tratar de obtener nombre de BD
    $dbName = null;
    $res = $conn->query('SELECT DATABASE() AS dbname');
    if ($res) {
        $row = $res->fetch_assoc();
        $dbName = $row['dbname'] ?? null;
    }
    $result['database'] = $dbName;

    // ejecutar una consulta simple para ver si hay acceso (SELECT 1)
    $res2 = $conn->query('SELECT 1 AS ok');
    if ($res2 && $res2->fetch_assoc()) {
        $result['query_ok'] = true;
    } else {
        $result['query_ok'] = false;
        $result['query_error'] = $conn->error;
    }

    $result['success'] = ($isAlive && $result['query_ok']);
    $result['time'] = date(DATE_ATOM);

    echo json_encode($result);
    exit();

} catch (Exception $ex) {
    http_response_code(500);
    $result['success'] = false;
    $result['message'] = $ex->getMessage();
    echo json_encode($result);
    exit();
}
?>