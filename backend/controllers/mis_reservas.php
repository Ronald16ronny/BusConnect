<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../config/conexion.php';

// Verificar usuario en sesión (intentar varias claves compatibles)
$id_usuario = null;
if (isset($_SESSION['id_usuario'])) $id_usuario = intval($_SESSION['id_usuario']);
elseif (isset($_SESSION['usuario']) && is_array($_SESSION['usuario']) && isset($_SESSION['usuario']['id_usuario'])) $id_usuario = intval($_SESSION['usuario']['id_usuario']);

if (!$id_usuario) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit();
}

// Consulta principal: tickets + horario + ruta + destinos + bus
$sql = "SELECT t.id_ticket, t.asiento, t.precio_pagado, t.estado,
               DATE_FORMAT(h.fecha_salida, '%Y-%m-%d %H:%i:%s') AS fecha_salida,
               dor.nombre AS origen, ddes.nombre AS destino,
               b.placa, b.modelo, r.id_ruta
        FROM tickets t
        JOIN horarios h ON t.id_horario = h.id_horario
        JOIN rutas r ON h.id_ruta = r.id_ruta
        LEFT JOIN buses b ON h.id_bus = b.id_bus
        LEFT JOIN destinos dor ON r.origen = dor.id_destino
        LEFT JOIN destinos ddes ON r.destino = ddes.id_destino
        WHERE t.id_usuario = ?
        ORDER BY h.fecha_salida DESC
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en la preparación de la consulta: ' . $conn->error]);
    exit();
}

$stmt->bind_param('i', $id_usuario);
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al ejecutar la consulta: ' . $stmt->error]);
    exit();
}

$res = $stmt->get_result();
$rows = [];
while ($r = $res->fetch_assoc()) {
    $rows[] = $r;
}

echo json_encode(['success' => true, 'reservas' => $rows]);

?>
