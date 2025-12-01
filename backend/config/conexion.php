<?php
$host = "localhost";
$usuario = "root";
$password = "";
$bd = "busconnect";
$puerto = 3307;

$conn = new mysqli($host, $usuario, $password, $bd, $puerto);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>
