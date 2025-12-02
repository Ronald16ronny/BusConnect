<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/conexion.php';

$origen = isset($_GET['origen']) ? trim($_GET['origen']) : null;
$destino = isset($_GET['destino']) ? trim($_GET['destino']) : null;
$fecha = isset($_GET['fecha']) ? trim($_GET['fecha']) : null;

if (!$origen || !$destino || !$fecha) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Parámetros faltantes: origen, destino y fecha son requeridos']);
    exit();
}

// Query using your schema: horarios, rutas, buses, destinos, tickets
// We'll match destinos.nombre with the provided origen/destino and compare DATE(h.fecha_salida) = ?
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

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en preparación de consulta: ' . $conn->error]);
    exit();
}

$stmt->bind_param('sss', $origen, $destino, $fecha);
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al ejecutar consulta: ' . $stmt->error]);
    exit();
}

$result = $stmt->get_result();
$lista = [];
while ($row = $result->fetch_assoc()) {
    $lista[] = $row;
}
// If no rows found, try to auto-create horarios for the given date when a ruta exists
if (count($lista) === 0) {
    // find ruta id by matching origen/destino names
    $rutaStmt = $conn->prepare("SELECT r.id_ruta, r.duracion_minutos, dor.id_destino AS origen_id, ddes.id_destino AS destino_id
                               FROM rutas r
                               JOIN destinos dor ON r.origen = dor.id_destino
                               JOIN destinos ddes ON r.destino = ddes.id_destino
                               WHERE dor.nombre = ? AND ddes.nombre = ? LIMIT 1");
    if ($rutaStmt) {
        $rutaStmt->bind_param('ss', $origen, $destino);
        $rutaStmt->execute();
        $rr = $rutaStmt->get_result()->fetch_assoc();
        $rutaStmt->close();

        if ($rr && isset($rr['id_ruta'])) {
            $id_ruta = $rr['id_ruta'];
            $duracion = intval($rr['duracion_minutos']) ?: 0;

            // find available buses
            $busesStmt = $conn->prepare("SELECT id_bus FROM buses WHERE estado = 'Disponible' ORDER BY id_bus LIMIT 4");
            $buses = [];
            if ($busesStmt) {
                $busesStmt->execute();
                $bres = $busesStmt->get_result();
                while ($brow = $bres->fetch_assoc()) $buses[] = $brow['id_bus'];
                $busesStmt->close();
            }

            // default times to create on the date (08:00 and 18:00)
            $times = ['08:00:00', '18:00:00'];

            foreach ($buses as $busId) {
                foreach ($times as $time) {
                    // check if a horario already exists for same ruta, bus, date and time
                    $check = $conn->prepare("SELECT COUNT(*) AS c FROM horarios WHERE id_ruta = ? AND id_bus = ? AND DATE(fecha_salida) = ? AND TIME(fecha_salida) = ?");
                    $check->bind_param('iiss', $id_ruta, $busId, $fecha, $time);
                    $check->execute();
                    $cres = $check->get_result()->fetch_assoc();
                    $check->close();
                    if (intval($cres['c']) > 0) continue;

                    // build fecha_salida and fecha_llegada
                    $fecha_salida = $fecha . ' ' . $time;
                    if ($duracion > 0) {
                        $dt = new DateTime($fecha_salida);
                        $dt->modify("+{$duracion} minutes");
                        $fecha_llegada = $dt->format('Y-m-d H:i:s');
                    } else {
                        $fecha_llegada = null;
                    }

                    $ins = $conn->prepare("INSERT INTO horarios (id_ruta, id_bus, id_conductor, fecha_salida, fecha_llegada, estado) VALUES (?, ?, NULL, ?, ?, 'Programado')");
                    if ($ins) {
                        $ins->bind_param('iiss', $id_ruta, $busId, $fecha_salida, $fecha_llegada);
                        $ins->execute();
                        $ins->close();
                    }
                }
            }

            // re-run the main query to fetch the newly created horarios
            $stmt = $conn->prepare($sql);
            if ($stmt) {
                $stmt->bind_param('sss', $origen, $destino, $fecha);
                $stmt->execute();
                $result = $stmt->get_result();
                $lista = [];
                while ($row = $result->fetch_assoc()) {
                    $lista[] = $row;
                }
            }
        }
    }
}

echo json_encode($lista);
