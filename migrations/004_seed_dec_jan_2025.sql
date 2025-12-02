-- Migration: seed horarios and tickets for requested dates
-- Dates included:
-- 2025-12-02, 2025-12-03, 2025-12-04, 2025-12-05
-- Special dates: 2025-12-24, 2025-12-25, 2025-12-31, 2026-01-01
-- Assumptions: there is a `rutas` row with id_ruta = 1 and `buses` rows with id_bus = 1 (cap 45) and id_bus = 2 (cap 50).

-- Insert horarios for regular dates (two departures per day)
INSERT INTO horarios (id_horario, id_ruta, id_bus, id_conductor, fecha_salida, fecha_llegada, estado)
VALUES
(3, 1, 1, NULL, '2025-12-02 12:00:00', '2025-12-03 06:00:00', 'Programado'),
(4, 1, 2, NULL, '2025-12-02 18:00:00', '2025-12-03 12:00:00', 'Programado'),
(5, 1, 1, NULL, '2025-12-03 12:00:00', '2025-12-04 06:00:00', 'Programado'),
(6, 1, 2, NULL, '2025-12-03 18:00:00', '2025-12-04 12:00:00', 'Programado'),
(7, 1, 1, NULL, '2025-12-04 12:00:00', '2025-12-05 06:00:00', 'Programado'),
(8, 1, 2, NULL, '2025-12-04 18:00:00', '2025-12-05 12:00:00', 'Programado'),
(9, 1, 1, NULL, '2025-12-05 12:00:00', '2025-12-06 06:00:00', 'Programado'),
(10,1, 2, NULL, '2025-12-05 18:00:00', '2025-12-06 12:00:00', 'Programado');

-- Insert horarios for special dates (two departures per special date)
INSERT INTO horarios (id_horario, id_ruta, id_bus, id_conductor, fecha_salida, fecha_llegada, estado)
VALUES
(11, 1, 1, NULL, '2025-12-24 12:00:00', '2025-12-25 06:00:00', 'Programado'),
(12, 1, 2, NULL, '2025-12-24 18:00:00', '2025-12-25 12:00:00', 'Programado'),
(13, 1, 1, NULL, '2025-12-25 12:00:00', '2025-12-26 06:00:00', 'Programado'),
(14, 1, 2, NULL, '2025-12-25 18:00:00', '2025-12-26 12:00:00', 'Programado'),
(15, 1, 1, NULL, '2025-12-31 12:00:00', '2026-01-01 06:00:00', 'Programado'),
(16, 1, 2, NULL, '2025-12-31 18:00:00', '2026-01-01 12:00:00', 'Programado'),
(17, 1, 1, NULL, '2026-01-01 12:00:00', '2026-01-02 06:00:00', 'Programado'),
(18, 1, 2, NULL, '2026-01-01 18:00:00', '2026-01-02 12:00:00', 'Programado');

-- Sample tickets for regular horarios (small occupancy: seats 1-3)
INSERT INTO tickets (id_usuario, id_horario, asiento, precio_pagado, estado)
VALUES
(1, 3, 1, 120.00, 'Reservado'),
(1, 3, 2, 120.00, 'Reservado'),
(1, 3, 3, 120.00, 'Reservado'),
(1, 4, 1, 120.00, 'Reservado'),
(1, 4, 2, 120.00, 'Reservado'),
(1, 5, 1, 120.00, 'Reservado'),
(1, 5, 2, 120.00, 'Reservado'),
(1, 6, 1, 120.00, 'Reservado');

-- For special dates we seed higher occupancy using a recursive CTE to generate seat numbers.
-- Note: Requires MySQL 8+ (WITH RECURSIVE). If your MySQL is older, let me know and I generate explicit VALUES inserts.

-- Insert seats 1..30 for horarios with bus id 1 (ids 11,13,15,17)
WITH RECURSIVE seq(n) AS (
  SELECT 1
  UNION ALL
  SELECT n+1 FROM seq WHERE n < 30
)
INSERT INTO tickets (id_usuario, id_horario, asiento, precio_pagado, estado)
SELECT 1, 11, n, 120.00, 'Reservado' FROM seq;

WITH RECURSIVE seq2(n) AS (
  SELECT 1
  UNION ALL
  SELECT n+1 FROM seq2 WHERE n < 30
)
INSERT INTO tickets (id_usuario, id_horario, asiento, precio_pagado, estado)
SELECT 1, 13, n, 120.00, 'Reservado' FROM seq2;

WITH RECURSIVE seq3(n) AS (
  SELECT 1
  UNION ALL
  SELECT n+1 FROM seq3 WHERE n < 30
)
INSERT INTO tickets (id_usuario, id_horario, asiento, precio_pagado, estado)
SELECT 1, 15, n, 120.00, 'Reservado' FROM seq3;

WITH RECURSIVE seq4(n) AS (
  SELECT 1
  UNION ALL
  SELECT n+1 FROM seq4 WHERE n < 30
)
INSERT INTO tickets (id_usuario, id_horario, asiento, precio_pagado, estado)
SELECT 1, 17, n, 120.00, 'Reservado' FROM seq4;

-- Insert seats 1..35 for horarios with bus id 2 (ids 12,14,16,18)
WITH RECURSIVE seq5(n) AS (
  SELECT 1
  UNION ALL
  SELECT n+1 FROM seq5 WHERE n < 35
)
INSERT INTO tickets (id_usuario, id_horario, asiento, precio_pagado, estado)
SELECT 1, 12, n, 120.00, 'Reservado' FROM seq5;

WITH RECURSIVE seq6(n) AS (
  SELECT 1
  UNION ALL
  SELECT n+1 FROM seq6 WHERE n < 35
)
INSERT INTO tickets (id_usuario, id_horario, asiento, precio_pagado, estado)
SELECT 1, 14, n, 120.00, 'Reservado' FROM seq6;

WITH RECURSIVE seq7(n) AS (
  SELECT 1
  UNION ALL
  SELECT n+1 FROM seq7 WHERE n < 35
)
INSERT INTO tickets (id_usuario, id_horario, asiento, precio_pagado, estado)
SELECT 1, 16, n, 120.00, 'Reservado' FROM seq7;

WITH RECURSIVE seq8(n) AS (
  SELECT 1
  UNION ALL
  SELECT n+1 FROM seq8 WHERE n < 35
)
INSERT INTO tickets (id_usuario, id_horario, asiento, precio_pagado, estado)
SELECT 1, 18, n, 120.00, 'Reservado' FROM seq8;

-- End of seed for requested dates
