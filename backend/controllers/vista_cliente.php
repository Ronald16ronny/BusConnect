<?php
session_start();

if(!isset($_SESSION['usuario'])){
    header("Location: Inicio_Secion.html");
    exit();
}

$u = $_SESSION['usuario'];



?>
