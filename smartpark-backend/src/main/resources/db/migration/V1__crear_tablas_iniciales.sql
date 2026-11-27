CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    run VARCHAR(12) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    region VARCHAR(100),
    comuna VARCHAR(100),
    direccion VARCHAR(200),
    rol VARCHAR(20) NOT NULL DEFAULT 'CLIENTE'
);

CREATE TABLE estacionamientos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500),
    precio DECIMAL(10,2) NOT NULL,
    espacios_disponibles INT NOT NULL,
    imagen VARCHAR(255)
);