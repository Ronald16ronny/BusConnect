<?php
session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../config/conexion.php';

// Comprobar sesión
if (!isset($_SESSION['id_usuario']) && !isset($_SESSION['usuario']['id_usuario'])) {
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit();
}

$id = $_SESSION['id_usuario'] ?? $_SESSION['usuario']['id_usuario'];

$nombre   = trim($_POST['nombre'] ?? '');
$apellido = trim($_POST['apellido'] ?? '');
$dni      = trim($_POST['dni'] ?? '');
$correo   = trim($_POST['correo'] ?? '');
$telefono = trim($_POST['telefono'] ?? '');
$genero   = trim($_POST['genero'] ?? '');

if ($nombre === '' || $correo === '') {
    echo json_encode(['success' => false, 'message' => 'Nombre y correo son obligatorios']);
    exit();
}

// Actualizar usuario
$sql = "UPDATE usuarios SET nombre = ?, apellido = ?, documento = ?, genero = ?, correo = ?, telefono = ? WHERE id_usuario = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Error en la consulta: ' . $conn->error]);
    exit();
}

$stmt->bind_param('ssssssi', $nombre, $apellido, $dni, $genero, $correo, $telefono, $id);
if ($stmt->execute()) {
    // Actualizar sesión
    if (isset($_SESSION['usuario']) && is_array($_SESSION['usuario'])) {
        $_SESSION['usuario']['nombre'] = $nombre;
        $_SESSION['usuario']['apellido'] = $apellido;
        $_SESSION['usuario']['documento'] = $dni;
        $_SESSION['usuario']['dni'] = $dni;
        $_SESSION['usuario']['correo'] = $correo;
        $_SESSION['usuario']['telefono'] = $telefono;
        $_SESSION['usuario']['genero'] = $genero;
    }
    // Variables individuales
    $_SESSION['nombre'] = $nombre;
    $_SESSION['apellido'] = $apellido;
    $_SESSION['documento'] = $dni;
    $_SESSION['correo'] = $correo;
    $_SESSION['telefono'] = $telefono;
    $_SESSION['genero'] = $genero;

    echo json_encode(['success' => true, 'message' => 'Datos actualizados']);
} else {
    echo json_encode(['success' => false, 'message' => 'No se pudo actualizar: ' . $stmt->error]);
}

?>
