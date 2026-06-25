# Guía de Pruebas y Despliegue de Pet Radar

Esta guía detalla los pasos para probar tu aplicación localmente y las instrucciones para desplegar la API y la base de datos en Render.

## 1. ¿Es viable usar Render?

Sí, **Render es una excelente opción y es 100% viable** para tu proyecto por las siguientes razones:
- Permite desplegar aplicaciones usando el `Dockerfile` que ya tienes creado, por lo que no necesitas configuraciones extras complicadas en la nube.
- Ofrece bases de datos **PostgreSQL** gratuitas que ya tienen soporte nativo para la extensión **PostGIS**.
- Ofrece también instancias gratuitas de **Redis**, el cual vas a necesitar, ya que veo en tu código (`src/app.module.ts`) que utilizas caché con `@nestjs/cache-manager` y `redis`.

---

## 2. Pasos para probar el proyecto localmente

Antes de intentar desplegar, es importante asegurar que todo funcione en tu entorno de desarrollo local.

1. **Instalar dependencias**:
   Abre una terminal en la raíz de tu proyecto y ejecuta:
   ```bash
   npm install
   ```

2. **Configurar las variables de entorno**:
   - Copia el archivo `.env.example` y renómbralo como `.env`.
   - Modifica el archivo `.env` para que tenga los valores de tu conexión a PostgreSQL (que debe tener PostGIS habilitado) y de los otros servicios (como `MAPBOX_TOKEN`).
   - Necesitarás también tener Redis ejecutándose localmente, o podrías usar una URL de Redis pública para las pruebas. Por defecto NestJS intentará conectarse a `redis://localhost:6379`.

3. **Ejecutar la API**:
   ```bash
   npm run start:dev
   ```
   Verás en consola el mensaje `🐾 PetRadar API corriendo en: http://localhost:3000`.

4. **Probar un endpoint**:
   - Para insertar datos: Haz un `POST` desde Postman a `http://localhost:3000/lost-pets` con la estructura necesaria.
   - Para leer datos: Entra desde tu navegador o Postman a `http://localhost:3000/lost-pets` (petición `GET`). Debe devolver un `status 200` y el JSON con la información.

---

## 3. Pasos para desplegar en internet (usando Render)

### Paso 3.1: Desplegar la Base de Datos PostgreSQL
1. Crea una cuenta en [Render.com](https://render.com/).
2. En tu Dashboard, haz clic en **New +** y selecciona **PostgreSQL**.
3. Ponle un nombre a tu base de datos (por ejemplo, `petradar-db`).
4. Selecciona la región que prefieras, la versión gratuita (Free Plan) y haz clic en **Create Database**.
5. Render generará tus credenciales (Host, Usuario, Password y Database Name). Copia estos valores, los necesitarás en tu API.
   - *Nota importante*: La base de datos de Render viene con PostGIS instalado, TypeORM debería ser capaz de usar las columnas geográficas sin problema, pero si algo falla, conéctate a la DB usando DBeaver/PgAdmin con la **External Database URL** y ejecuta el script `CREATE EXTENSION postgis;`.

### Paso 3.2: Desplegar Redis (Caché)
1. En el Dashboard de Render, haz clic en **New +** y selecciona **Key Value** (Render recientemente renombró su servicio de Redis a "Key Value").
2. Dale un nombre (ej. `petradar-redis`), elige el Free Plan y haz clic en **Create Key Value**.
3. Copia la **Internal Connection String** o **Internal Redis URL** (empieza con `redis://...` o `valkey://...`). Esto hará que la API se comunique rapidísimo de forma interna con la caché.

### Paso 3.3: Desplegar la API en un Web Service
1. Asegúrate de hacer un `git push` de tu repositorio a **GitHub**.
2. En el Dashboard de Render, haz clic en **New +** y selecciona **Web Service**.
3. Conecta tu cuenta de GitHub y elige tu repositorio **Pet Radar**.
4. En las opciones de creación:
   - **Environment/Language**: Selecciona **Docker** (Render detectará tu `Dockerfile` y construirá la app solo a partir de él).
   - **Instance Type**: Selecciona el Free Plan.
5. Ve a la sección **Environment Variables** (Variables de Entorno) y agrega las variables que tienes en tu `.env`:
   - `DB_HOST`: El "Internal Database Host" que sacaste del paso 3.1.
   - `DB_PORT`: `5432`
   - `DB_USER`: Tu usuario de BD en Render.
   - `DB_PASSWORD`: Tu contraseña de BD en Render.
   - `DB_NAME`: El nombre de la base de datos.
   - `REDIS_URL`: La Internal Redis URL obtenida en el paso 3.2.
   - Las variables faltantes de correos y Mapbox.
6. Haz clic en **Create Web Service**. Espera unos minutos a que Render descargue tus dependencias y compile (construya la imagen Docker).

---

## 4. Preparación para tu video de entrega

Una vez desplegada tu API, Render te entregará una URL pública similar a `https://petradar-app.onrender.com`.

**Para el video (3-5 mins), asegúrate de:**
1. **Mostrar la petición de lectura en línea:** Abre Postman o un navegador. Realiza un `GET` a tu URL de producción `https://petradar-app.onrender.com/lost-pets`.
2. **Evidenciar que viene de la base de datos en la nube:** Puedes mostrar tu base de datos de Render en el panel de control o mostrar usando DBeaver/PgAdmin que la base de datos externa realmente contiene esos registros.
3. **Explicar brevemente:** Comenta que levantaste un servicio web y servicios de PostgreSQL/Redis desde Render y vinculaste tu proyecto vía Docker usando variables de entorno para que se comuniquen.
