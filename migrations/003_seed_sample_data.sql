-- Migration: seed sample data for testing buscar_buses and reservations
-- Run this on your MySQL (port 3307 if applicable) in database `busconnect`.

-- 1) Destinos
INSERT INTO destinos (id_destino, nombre, region, descripcion) VALUES
(1, 'Lima', 'Lima', 'Ciudad de Lima'),
(2, 'Piura', 'Piura', 'Ciudad de Piura');

-- 2) Usuario de prueba (cliente)
INSERT INTO usuarios (id_usuario, nombre, apellido, documento, genero, correo, telefono, password, rol)
VALUES (1, 'Prueba', 'Cliente', '12345678', 'Masculino', 'cliente@local.test', '999999999', 'passwordhash', 'cliente');

-- 3) Buses
INSERT INTO buses (id_bus, placa, modelo, capacidad, estado) VALUES
(1, 'ABC-123', 'Mercedes Sprinter', 45, 'Disponible'),
(2, 'DEF-456', 'Volvo 9700', 50, 'Disponible');

-- 4) Ruta
-- nota: rutas.origen y rutas.destino referencian destinos.id_destino
INSERT INTO rutas (id_ruta, origen, destino, duracion_minutos, distancia_km, precio_base, estado)
VALUES (1, 1, 2, 1080, 800.00, 120.00, 'Activa');

-- 5) Horarios (dos salidas diferentes)
INSERT INTO horarios (id_horario, id_ruta, id_bus, id_conductor, fecha_salida, fecha_llegada, estado)
VALUES
(1, 1, 1, NULL, '2025-12-01 12:00:00', '2025-12-02 06:00:00', 'Programado'),
(2, 1, 2, NULL, '2025-12-01 18:00:00', '2025-12-02 12:00:00', 'Programado');

-- 6) Tickets de ejemplo (simulan asientos ya reservados)
-- columnas: id_ticket, id_usuario, id_horario, asiento, precio_pagado, estado, fecha
INSERT INTO tickets (id_ticket, id_usuario, id_horario, asiento, precio_pagado, estado)
VALUES
(1, 1, 1, 5, 120.00, 'Reservado'),
(2, 1, 1, 6, 120.00, 'Reservado'),
(3, 1, 2, 10, 120.00, 'Reservado');

-- Optional: commit point (if using transactional importer)

-- End of seed
