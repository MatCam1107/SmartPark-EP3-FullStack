# SmartPark — Evaluación Parcial 3

**Asignatura:** Desarrollo FullStack II (DSY1104)  
**Institución:** Duoc UC

## Descripción

SmartPark es una aplicación web para consultar estacionamientos, revisar sus características y precios, gestionar un carrito y administrar el catálogo mediante una cuenta con permisos de administrador.

El proyecto integra un frontend desarrollado con React, Vite y TypeScript con una API REST construida en Spring Boot y una base de datos MySQL.

## Tecnologías

**Frontend**
- React
- TypeScript
- Vite
- React Router
- Bootstrap

**Backend**
- Java 21
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT
- Maven
- Flyway
- Swagger / OpenAPI

**Base de datos**
- MySQL 8.4

## Estructura del proyecto

```text
SmartPark-EP3/
├── smartpark-backend/
├── smartpark-frontend/
├── .gitignore
└── README.md
```

## Requisitos previos

Para ejecutar el proyecto localmente se necesita:

- Java JDK 21.
- MySQL Server 8.4.
- Node.js y npm compatibles con la versión de Vite del proyecto.
- Un terminal CMD o equivalente.

## Configuración de MySQL

1. Iniciar MySQL.
2. Abrir MySQL Workbench con una cuenta administradora.
3. Ejecutar las siguientes instrucciones SQL:

```sql
CREATE DATABASE IF NOT EXISTS smartpark_db;

CREATE USER IF NOT EXISTS 'smartpark_user'@'localhost'
IDENTIFIED BY 'REEMPLAZAR_POR_UNA_CLAVE_SEGURA';

GRANT ALL PRIVILEGES ON smartpark_db.*
TO 'smartpark_user'@'localhost';
```

La contraseña del usuario de base de datos debe mantenerse privada. No debe incorporarse al repositorio.

Las migraciones de Flyway crean las tablas y los estacionamientos iniciales cuando se inicia el backend.

## Variables de entorno del backend

El archivo `smartpark-backend/src/main/resources/application.properties` utiliza estas variables:

- `SMARTPARK_DB_PASSWORD`: contraseña del usuario MySQL `smartpark_user`.
- `SMARTPARK_JWT_SECRET`: clave secreta para firmar los tokens JWT.

En una terminal CMD, configurar ambas variables antes de iniciar el backend:

```cmd
set "SMARTPARK_DB_PASSWORD=TU_CLAVE_MYSQL"
set "SMARTPARK_JWT_SECRET=TU_SECRETO_JWT_EN_BASE64"
```

Para generar una clave JWT aleatoria de 32 bytes en Base64 desde CMD:

```cmd
for /f "delims=" %i in ('powershell -NoProfile -Command "$b = New-Object byte[] 32; $r = [System.Security.Cryptography.RandomNumberGenerator]::Create(); $r.GetBytes($b); [Convert]::ToBase64String($b)"') do @set "SMARTPARK_JWT_SECRET=%i"
```

**Importante:** estas variables se configuran en la misma terminal donde se ejecutará el backend. No se deben publicar contraseñas ni claves JWT.

## Ejecutar el backend

Desde la carpeta principal:

```cmd
cd smartpark-backend
mvnw.cmd spring-boot:run
```

El backend utiliza el puerto `8080`.

Swagger estará disponible en:

http://localhost:8080/swagger-ui/index.html

## Ejecutar el frontend

Abrir una segunda terminal:

```cmd
cd C:\Elvira\SmartPark-EP3\smartpark-frontend
npm install
npm run dev
```

Abrir la aplicación en:

http://localhost:5173/

El frontend se comunica con la API REST en `http://localhost:8080`.

## Funcionalidades

### Visitante
- Consultar el catálogo de estacionamientos.
- Revisar el detalle de cada estacionamiento.
- Añadir y quitar estacionamientos del carrito.
- Registrarse e iniciar sesión.

### Usuario autenticado
- Mantener su sesión al actualizar la página.
- Cerrar sesión.

### Administrador
- Crear estacionamientos.
- Consultar estacionamientos.
- Actualizar estacionamientos.
- Eliminar estacionamientos.

Las operaciones administrativas requieren autenticación mediante JWT y el rol `ADMIN`.

El registro público crea cuentas con rol `CLIENTE`. Para preparar una cuenta administradora en un entorno local de pruebas, un administrador de la base de datos debe asignarle el rol `ADMIN` a una cuenta existente.

## API REST

**Autenticación**
- `POST /api/auth/registro`
- `POST /api/auth/login`
- `POST /api/auth/logout`

**Estacionamientos**
- `GET /api/estacionamientos`
- `GET /api/estacionamientos/{id}`
- `GET /api/estacionamientos/codigo/{codigo}`
- `POST /api/estacionamientos`
- `PUT /api/estacionamientos/{id}`
- `DELETE /api/estacionamientos/{id}`

Las operaciones POST, PUT y DELETE de estacionamientos requieren el rol `ADMIN`.

## Seguridad

- Las contraseñas se almacenan mediante hash BCrypt.
- La API utiliza tokens JWT para autenticar solicitudes protegidas.
- Los permisos administrativos se validan en el backend.
- La sesión del frontend se conserva en el almacenamiento local del navegador.
- Los JWT revocados al cerrar sesión se registran temporalmente en memoria del backend.

**Limitaciones del entorno académico:** la revocación en memoria se pierde al reiniciar el backend y no se comparte entre instancias. El almacenamiento local del navegador requiere especial cuidado frente a ataques XSS; para producción se recomienda evaluar cookies seguras y controles adicionales.

## Pruebas

Para ejecutar las pruebas automatizadas del backend, con MySQL configurado y las variables de entorno disponibles:

```cmd
cd smartpark-backend
mvnw.cmd clean test
```

El proyecto cuenta con siete pruebas automatizadas, incluyendo comprobaciones de consulta, autenticación, autorización y revocación de tokens.

Las pruebas de integración existentes dependen de cuentas de prueba previamente registradas en la base de datos:

- `cliente.prueba@gmail.com`, con rol `CLIENTE`.
- `admin.smartpark@gmail.com`, con rol `ADMIN`.

No se incluyen contraseñas de estas cuentas en el repositorio. Para reproducir las pruebas se deben preparar las cuentas correspondientes.

## Manual de usuario

El manual de usuario se entrega por separado e incluye capturas de las principales pantallas, instrucciones de uso, Swagger y resultados de las pruebas automatizadas.
