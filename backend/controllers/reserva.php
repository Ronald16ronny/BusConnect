<?php
session_start();
header("Content-Type: application/json");
require_once __DIR__ . '/../config/conexion.php';

// =============================
// Validar usuario logueado
// =============================
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode([
        "success" => false,
        "message" => "Usuario no autenticado"
    ]);
    exit;
}

$id_usuario = $_SESSION['id_usuario'];

// =============================
// Leer JSON
// =============================
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Datos inválidos"
    ]);
    exit;
}

$asientos = $data['asientos'] ?? [];
$id_horario = $data['id_horario'] ?? null;
$precio_total = $data['precio_total'] ?? 0;

if (!$id_horario || empty($asientos)) {
    echo json_encode([
        "success" => false,
        "message" => "Datos incompletos"
    ]);
    exit;
}

// precio por asiento
$precio_unit = $precio_total / count($asientos);

try {
    $conn->begin_transaction();

    // Comprobar cada asiento
    $check = $conn->prepare("
        SELECT id_ticket 
        FROM tickets 
        WHERE id_horario = ? AND asiento = ? 
        AND estado <> 'Cancelado'
        LIMIT 1
    ");

    $insert = $conn->prepare("
        INSERT INTO tickets(id_usuario, id_horario, asiento, precio_pagado, estado)
        VALUES(?, ?, ?, ?, 'Pagado')
    ");

    foreach ($asientos as $seat) {
        $nseat = intval($seat);

        // VALIDAR DUPLICADO
        $check->bind_param("ii", $id_horario, $nseat);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            throw new Exception("El asiento $nseat ya está reservado.");
        }

        // INSERTAR
        $insert->bind_param("iiid", $id_usuario, $id_horario, $nseat, $precio_unit);
        $insert->execute();
    }

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Reserva realizada correctamente",
        "asientos" => $asientos
    ]);
} catch (Exception $e) {

    $conn->rollback();
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
