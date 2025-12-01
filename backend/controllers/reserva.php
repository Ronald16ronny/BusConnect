<?php
session_start();
require_once "../config/conexion.php";

$id_usuario = $_SESSION["id_usuario"];
$id_horario = $_POST["id_horario"];
$asiento    = $_POST["asiento"];
$precio     = $_POST["precio"];

$sql = "INSERT INTO tickets (id_usuario,id_horario,asiento,precio_pagado,estado)
        VALUES (?, ?, ?, ?, 'Reservado')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iiid", $id_usuario, $id_horario, $asiento, $precio);

echo $stmt->execute()
    ? "Ticket reservado"
    : "Error al reservar";
?>