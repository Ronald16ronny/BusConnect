-- Migration: create table `asientos`
-- Ejecutar en la base de datos `busconnect` (puerto 3307 si aplica)

CREATE TABLE IF NOT EXISTS `asientos` (
  `id_asiento_set` INT AUTO_INCREMENT PRIMARY KEY,
  `id_bus` INT NOT NULL,
  `total_asientos` INT NOT NULL DEFAULT 40,
  `descripcion` VARCHAR(255) DEFAULT NULL,
  CONSTRAINT `fk_asientos_bus` FOREIGN KEY (`id_bus`) REFERENCES `buses`(`id_bus`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Opcional: ejemplo de insert (ajusta id_bus existentes)
-- INSERT INTO `asientos` (id_bus, total_asientos, descripcion) VALUES (1, 45, 'Asientos para bus 1');
