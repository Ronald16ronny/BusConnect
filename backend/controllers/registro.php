<?php
header('Content-Type: application/json');
require_once "../config/conexion.php";

// Asegurar charset utf8mb4
$conn->set_charset('utf8mb4');

// Obtener datos del POST
$nombre     = isset($_POST["nombre"]) ? trim($_POST["nombre"]) : "";
$apellido   = isset($_POST["apellido"]) ? trim($_POST["apellido"]) : "";
$documento   = isset($_POST["documento"]) ? trim($_POST["documento"]) : "";
$genero     = isset($_POST["genero"]) ? trim($_POST["genero"]) : "";
$correo     = isset($_POST["correo"]) ? trim($_POST["correo"]) : "";
$telefono   = isset($_POST["telefono"]) ? trim($_POST["telefono"]) : "";
$pass       = isset($_POST["password"]) ? trim($_POST["password"]) : "";

// Validar que no estén vacíos
if (empty($nombre) || empty($apellido) || empty($documento) || empty($correo) || empty($telefono) || empty($genero) || empty($pass)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Todos los campos son requeridos"]);
    exit();
}

// Hashear contraseña
$pass_hash = password_hash($pass, PASSWORD_BCRYPT);

$checkEmail = "SELECT id_usuario FROM usuarios WHERE correo = ?";
$stmtCheck = $conn->prepare($checkEmail);
if (!$stmtCheck) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error en la consulta"]);
    exit();
}
$stmtCheck->bind_param("s", $correo);
$stmtCheck->execute();
$stmtCheck->store_result();

if ($stmtCheck->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "El correo ya está registrado"]);
    $stmtCheck->close();
    exit();
}
$stmtCheck->close();

// Insertar nuevo usuario
$sql = "INSERT INTO usuarios (nombre, apellido, documento, genero, correo, telefono, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error en la preparación de la consulta"]);
    exit();
}

$stmt->bind_param("sssssss", $nombre, $apellido, $documento, $genero, $correo, $telefono, $pass_hash);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Registro exitoso"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al registrar: " . $stmt->error]);
}

$stmt->close();
