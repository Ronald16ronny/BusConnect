<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/conexion.php';

$origen = isset($_GET['origen']) ? trim($_GET['origen']) : null;
$destino = isset($_GET['destino']) ? trim($_GET['destino']) : null;
$fecha = isset($_GET['fecha']) ? trim($_GET['fecha']) : null;

$result = [
    'received' => ['origen' => $origen, 'destino' => $destino, 'fecha' => $fecha],
    'ok' => false,
    'errors' => [],
    'debug' => []
];

if (!$origen || !$destino || !$fecha) {
    http_response_code(400);
    $result['errors'][] = 'Parámetros faltantes: origen, destino y fecha son requeridos';
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit();
}

// Check if origen/destino exist in destinos
try {
    $stmt = $conn->prepare("SELECT id_destino, nombre FROM destinos WHERE nombre = ? LIMIT 5");
    $stmt->bind_param('s', $origen);
    $stmt->execute();
    $res = $stmt->get_result();
    $origenMatches = [];
    while ($r = $res->fetch_assoc()) $origenMatches[] = $r;
    $stmt->close();

    $stmt = $conn->prepare("SELECT id_destino, nombre FROM destinos WHERE nombre = ? LIMIT 5");
    $stmt->bind_param('s', $destino);
    $stmt->execute();
    $res = $stmt->get_result();
    $destinoMatches = [];
    while ($r = $res->fetch_assoc()) $destinoMatches[] = $r;
    $stmt->close();

    $result['debug']['destinos_found'] = ['origen' => $origenMatches, 'destino' => $destinoMatches];
} catch (Exception $e) {
    $result['errors'][] = 'Error comprobando destinos: ' . $e->getMessage();
}

// Run the same query as buscar_buses.php but also capture SQL and rowcount
$sql = "
SELECT h.id_horario,
       b.id_bus,
       b.placa,
       b.modelo,
       dor.nombre AS origen,
       ddes.nombre AS destino,
       DATE_FORMAT(h.fecha_salida, '%Y-%m-%d %H:%i:%s') AS fecha_salida,
       r.precio_base AS precio,
       r.duracion_minutos AS duracion_minutos,
       b.capacidad AS total_asientos,
       (b.capacidad - COUNT(t.id_ticket)) AS disponibles
FROM horarios h
JOIN rutas r ON h.id_ruta = r.id_ruta
JOIN buses b ON h.id_bus = b.id_bus
JOIN destinos dor ON r.origen = dor.id_destino
JOIN destinos ddes ON r.destino = ddes.id_destino
LEFT JOIN tickets t ON t.id_horario = h.id_horario AND t.estado != 'Cancelado'
WHERE dor.nombre = ?
  AND ddes.nombre = ?
  AND DATE(h.fecha_salida) = ?
GROUP BY h.id_horario
ORDER BY h.fecha_salida ASC
";

$result['debug']['sql'] = $sql;
try {
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        $result['errors'][] = 'Error en preparación de consulta: ' . $conn->error;
        echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit();
    }
    $stmt->bind_param('sss', $origen, $destino, $fecha);
    $ok = $stmt->execute();
    if (!$ok) {
        $result['errors'][] = 'Error al ejecutar consulta: ' . $stmt->error;
    } else {
        $res = $stmt->get_result();
        $rows = [];
        while ($row = $res->fetch_assoc()) $rows[] = $row;
        $result['ok'] = true;
        $result['debug']['rows_count'] = count($rows);
        $result['rows'] = $rows;
    }
    $stmt->close();
} catch (Exception $e) {
    $result['errors'][] = 'Excepción: ' . $e->getMessage();
}

// If zero rows, provide quick hints
if (empty($result['rows'])) {
    $result['debug']['hint'] = [];
    if (empty($result['debug']['destinos_found']['origen'])) $result['debug']['hint'][] = "No se encontró el origen con nombre exacto: '{$origen}'";
    if (empty($result['debug']['destinos_found']['destino'])) $result['debug']['hint'][] = "No se encontró el destino con nombre exacto: '{$destino}'";
    // check horarios on date
    try {
        $stmt2 = $conn->prepare("SELECT h.id_horario, DATE_FORMAT(h.fecha_salida, '%Y-%m-%d %H:%i:%s') AS fecha_salida, h.id_ruta FROM horarios h WHERE DATE(h.fecha_salida) = ? LIMIT 20");
        $stmt2->bind_param('s', $fecha);
        $stmt2->execute();
        $r2 = $stmt2->get_result();
        $horarios = [];
        while ($rr = $r2->fetch_assoc()) $horarios[] = $rr;
        $stmt2->close();
        $result['debug']['horarios_on_date'] = $horarios;
        if (empty($horarios)) $result['debug']['hint'][] = "No se encontraron horarios en la fecha {$fecha}.";
    } catch (Exception $e) {
        $result['errors'][] = 'Error comprobando horarios por fecha: ' . $e->getMessage();
    }
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

?>