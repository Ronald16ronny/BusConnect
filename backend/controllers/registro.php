<?php
require_once "../config/conexion.php";

$nombre     = $_POST["nombre"];
$apellido   = $_POST["apellido"];
$doc        = $_POST["documento"];
$genero     = $_POST["genero"];
$correo     = $_POST["correo"];
$telefono   = $_POST["telefono"];
$pass       = $_POST["password"];

$sql = "INSERT INTO usuarios (nombre, apellido, documento, genero, correo, telefono, password)
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss",
    $nombre,
    $apellido,
    $doc,
    $genero,
    $correo,
    $telefono,
    $pass
);

if($stmt->execute()){
    echo "Registro exitoso";
}else{
    echo "Error: " . $stmt->error;
}
