-- Migration: add Arequipa destination, route and sample horarios for testing
-- Inserts destino Arequipa, a route Lima->Arequipa and horarios for requested dates

-- 1) Add Arequipa to destinos (if not exists)
INSERT INTO destinos (nombre, region, descripcion)
SELECT 'Arequipa', 'Arequipa', 'Ciudad de Arequipa'
WHERE NOT EXISTS (SELECT 1 FROM destinos WHERE nombre = 'Arequipa');

-- 2) Find id_destino for Lima and Arequipa (use subselects to be safe)
SET @origen_id = (SELECT id_destino FROM destinos WHERE nombre = 'Lima' LIMIT 1);
SET @destino_id = (SELECT id_destino FROM destinos WHERE nombre = 'Arequipa' LIMIT 1);

-- 3) Insert a route Lima -> Arequipa if not exists
INSERT INTO rutas (origen, destino, duracion_minutos, distancia_km, precio_base, estado)
SELECT @origen_id, @destino_id, 540, 500.00, 150.00, 'Activa'
WHERE NOT EXISTS (SELECT 1 FROM rutas WHERE origen = @origen_id AND destino = @destino_id LIMIT 1);

-- 4) Find id_ruta inserted/exists
SET @ruta_id = (SELECT id_ruta FROM rutas WHERE origen = @origen_id AND destino = @destino_id LIMIT 1);

-- 5) Insert horarios for the route for dates of interest (two per date)
-- Use AUTO_INCREMENT for horarios; do not force id_horario
INSERT INTO horarios (id_ruta, id_bus, id_conductor, fecha_salida, fecha_llegada, estado)
VALUES
(@ruta_id, 1, NULL, '2025-12-02 08:00:00', '2025-12-02 17:00:00', 'Programado'),
(@ruta_id, 2, NULL, '2025-12-02 18:00:00', '2025-12-03 03:00:00', 'Programado'),
(@ruta_id, 1, NULL, '2025-12-03 08:00:00', '2025-12-03 17:00:00', 'Programado'),
(@ruta_id, 2, NULL, '2025-12-03 18:00:00', '2025-12-04 03:00:00', 'Programado'),
(@ruta_id, 1, NULL, '2025-12-04 08:00:00', '2025-12-04 17:00:00', 'Programado'),
(@ruta_id, 2, NULL, '2025-12-04 18:00:00', '2025-12-05 03:00:00', 'Programado'),
(@ruta_id, 1, NULL, '2025-12-05 08:00:00', '2025-12-05 17:00:00', 'Programado'),
(@ruta_id, 2, NULL, '2025-12-05 18:00:00', '2025-12-06 03:00:00', 'Programado'),
(@ruta_id, 1, NULL, '2025-12-24 08:00:00', '2025-12-24 17:00:00', 'Programado'),
(@ruta_id, 2, NULL, '2025-12-24 18:00:00', '2025-12-25 03:00:00', 'Programado'),
(@ruta_id, 1, NULL, '2025-12-25 08:00:00', '2025-12-25 17:00:00', 'Programado'),
(@ruta_id, 2, NULL, '2025-12-25 18:00:00', '2025-12-26 03:00:00', 'Programado'),
(@ruta_id, 1, NULL, '2025-12-31 08:00:00', '2025-12-31 17:00:00', 'Programado'),
(@ruta_id, 2, NULL, '2025-12-31 18:00:00', '2026-01-01 03:00:00', 'Programado'),
(@ruta_id, 1, NULL, '2026-01-01 08:00:00', '2026-01-01 17:00:00', 'Programado'),
(@ruta_id, 2, NULL, '2026-01-01 18:00:00', '2026-01-02 03:00:00', 'Programado');

-- 6) Optionally insert a few tickets to simulate occupancy for one horario (pick the earliest horario for the route)
SET @h = (SELECT id_horario FROM horarios WHERE id_ruta = @ruta_id ORDER BY fecha_salida LIMIT 1);
-- Insert seats 1..3 as reserved for quick verification
INSERT INTO tickets (id_usuario, id_horario, asiento, precio_pagado, estado)
SELECT 1, @h, 1, 150.00, 'Reservado' WHERE @h IS NOT NULL;
INSERT INTO tickets (id_usuario, id_horario, asiento, precio_pagado, estado)
SELECT 1, @h, 2, 150.00, 'Reservado' WHERE @h IS NOT NULL;
INSERT INTO tickets (id_usuario, id_horario, asiento, precio_pagado, estado)
SELECT 1, @h, 3, 150.00, 'Reservado' WHERE @h IS NOT NULL;

-- End of migration
