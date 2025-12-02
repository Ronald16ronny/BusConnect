<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/conexion.php';

$id_horario = isset($_GET['id_horario']) ? intval($_GET['id_horario']) : null;
$salida = isset($_GET['salida']) ? trim($_GET['salida']) : null; // expected 'YYYY-MM-DD HH:ii:ss' or date part

$seats = [];

// 1) tickets
if ($id_horario) {
    $stmt = $conn->prepare("SELECT asiento FROM tickets WHERE id_horario = ? AND estado != 'Cancelado'");
    if ($stmt) {
        $stmt->bind_param('i', $id_horario);
        $stmt->execute();
        $res = $stmt->get_result();
        while ($r = $res->fetch_assoc()) $seats[] = intval($r['asiento']);
        $stmt->close();
    }
}

// 2) reserva_asiento table (if exists) - match by salida (exact datetime or date)
$check = $conn->query("SHOW TABLES LIKE 'reserva_asiento'");
if ($check && $check->num_rows > 0) {
    if ($salida) {
        // try exact match first
        $stmt = $conn->prepare("SELECT asiento FROM reserva_asiento WHERE salida = ?");
        if ($stmt) {
            $stmt->bind_param('s', $salida);
            $stmt->execute();
            $res = $stmt->get_result();
            while ($r = $res->fetch_assoc()) $seats[] = intval($r['asiento']);
            $stmt->close();
        }
        // also try matching by DATE(salida) if previous returned nothing
        if (empty($seats)) {
            $dateOnly = substr($salida,0,10);
            $stmt2 = $conn->prepare("SELECT asiento FROM reserva_asiento WHERE DATE(salida) = ?");
            if ($stmt2) {
                $stmt2->bind_param('s', $dateOnly);
                $stmt2->execute();
                $res2 = $stmt2->get_result();
                while ($r2 = $res2->fetch_assoc()) $seats[] = intval($r2['asiento']);
                $stmt2->close();
            }
        }
    }
}

// dedupe and return
$seats = array_values(array_unique($seats));
echo json_encode(['success'=>true, 'seats'=>$seats], JSON_UNESCAPED_UNICODE);
exit;

?>
