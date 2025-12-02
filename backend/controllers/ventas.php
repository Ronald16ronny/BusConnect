<?php
require "../conexion.php";

$id_usuario = $_POST['usuario'];
$id_bus = $_POST['bus'];
$asientos = $_POST['asientos']; // Array
$metodo = $_POST['metodo'];
$total = $_POST['total'];

foreach($asientos as $a){
  $sql = "INSERT INTO ventas(id_usuario,id_bus,numero_asiento,metodo,total,fecha_compra)
          VALUES(?,?,?,?,?,NOW())";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("iiisi", $id_usuario, $id_bus, $a, $metodo, $total);
  $stmt->execute();
}

echo "OK";
