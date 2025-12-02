-- Migration: create reservas and reserva_asiento tables
-- Run this on your MySQL (port 3307) in database `busconnect`.

CREATE TABLE IF NOT EXISTS `reservas` (
  `id_reserva` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT NOT NULL,
  `origen` VARCHAR(255) DEFAULT NULL,
  `servicio` VARCHAR(255) DEFAULT NULL,
  `salida` VARCHAR(255) DEFAULT NULL,
  `precio_total` DECIMAL(10,2) DEFAULT 0.00,
  `creado_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `reserva_asiento` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_reserva` INT NOT NULL,
  `salida` VARCHAR(255) DEFAULT NULL,
  `asiento` VARCHAR(64) NOT NULL,
  CONSTRAINT `fk_reserva_asiento_reserva` FOREIGN KEY (`id_reserva`) REFERENCES `reservas`(`id_reserva`) ON DELETE CASCADE,
  UNIQUE KEY `unq_salida_asiento` (`salida`, `asiento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
