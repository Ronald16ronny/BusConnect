<?php
session_start();
header('Content-Type: application/json');
require_once "../config/conexion.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Solicitud inválida"]);
    exit;
}

$correo = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if (!$correo || !$password) {
    echo json_encode(["success" => false, "message" => "Complete todos los campos"]);
    exit;
}

$sql = "SELECT id_usuario, nombre, apellido, correo, password, rol, documento, genero, telefono
    FROM usuarios
    WHERE correo = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Error SQL: " . $conn->error]);
    exit;
}

$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

if (!$result->num_rows) {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
    exit;
}

$user = $result->fetch_assoc();

// ✔️  Verificar hash
if (!password_verify($password, $user["password"])) {
    echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
    exit;
}

session_regenerate_id(true);

// Guardar datos de usuario en la sesión como array y como variables individuales (compatibilidad)
$_SESSION["usuario"] = [
    'id_usuario' => $user['id_usuario'],
    'nombre'     => $user['nombre'],
    'apellido'   => $user['apellido'],
    'correo'     => $user['correo'],
    // mapear el campo de la BD 'documento' a la clave 'dni' usada en la vista
    'dni'        => $user['documento'] ?? '',
    'genero'     => $user['genero'] ?? '',
    'telefono'   => $user['telefono'] ?? ''
];

// También mantener algunas variables individuales por compatibilidad con código existente
$_SESSION["id_usuario"] = $user["id_usuario"];
$_SESSION["nombre"] = $user["nombre"];
$_SESSION["apellido"] = $user["apellido"];
$_SESSION["correo"] = $user["correo"];
$_SESSION["rol"] = $user["rol"];
$_SESSION["documento"] = $user["documento"] ?? '';
$_SESSION["genero"] = $user["genero"] ?? '';
$_SESSION["telefono"] = $user["telefono"] ?? '';

echo json_encode([
    "success" => true,
    "message" => "Inicio correcto",
    "redirect" => "../HTML/Vista_Cliente.php"
]);
