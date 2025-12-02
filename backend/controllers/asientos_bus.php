<?php
// backend/controllers/asientos_bus.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/conexion.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if (!$id) {
    echo json_encode([]);
    exit;
}
// Prefer explicit asiento table; if not present, fallback to generating seats from bus capacidad
// Check if table asientos_detalle exists
$checkTable = $conn->query("SHOW TABLES LIKE 'asientos_detalle'");
$out = [];
if ($checkTable && $checkTable->num_rows > 0) {
    $sql = "SELECT numero_asiento, piso, estado FROM asientos_detalle WHERE id_bus = ? ORDER BY piso, numero_asiento";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $res = $stmt->get_result();
        while ($row = $res->fetch_assoc()) {
            $out[] = [
                'numero_asiento' => $row['numero_asiento'],
                'piso' => $row['piso'],
                'estado' => $row['estado']
            ];
        }
    }
} else {
    // Fallback: read bus capacidad and generate seats 1..capacidad on piso 1
    $stmt = $conn->prepare("SELECT capacidad FROM buses WHERE id_bus = ? LIMIT 1");
    if ($stmt) {
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $res = $stmt->get_result();
        $cap = 0;
        if ($r = $res->fetch_assoc()) $cap = intval($r['capacidad']);
        // default to 40 if unknown
        if ($cap <= 0) $cap = 40;
        for ($i = 1; $i <= $cap; $i++) {
            $out[] = [
                'numero_asiento' => $i,
                'piso' => 1,
                'estado' => 0
            ];
        }
    }
}

echo json_encode($out);
exit;
