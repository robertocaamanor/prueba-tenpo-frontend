# Prueba Tenpo React

Esta es una aplicación en React para visualizar transacciones. A continuación, se detallan los pasos para montar la aplicación tanto localmente como utilizando Docker.

## Requisitos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)
- Docker (versión 20 o superior)
- Docker Compose (versión 1.27 o superior)

## Instalación y Ejecución Local

1. Clona el repositorio:

    ```sh
    git clone https://github.com/tu-usuario/prueba-tenpo-react.git
    cd prueba-tenpo-react
    ```

2. Instala las dependencias:

    ```sh
    npm install
    ```

3. Inicia la aplicación:

    ```sh
    npm start
    ```

4. Abre tu navegador y navega a `http://localhost:3000` para ver la aplicación en funcionamiento.

## Orquestación con Docker

1. Construye la imagen de Docker:

    ```sh
    docker build -t prueba-tenpo-react .
    ```

2. Inicia los servicios con Docker Compose:

    ```sh
    docker-compose up
    ```

3. Abre tu navegador y navega a `http://localhost:3000` para ver la aplicación en funcionamiento.

## Estructura del Proyecto

- [public](http://_vscodecontentref_/1): Contiene los archivos estáticos y el archivo [index.html](http://_vscodecontentref_/2).
- [src](http://_vscodecontentref_/3): Contiene los archivos fuente de la aplicación React.
  - [App.js](http://_vscodecontentref_/4): Componente principal de la aplicación.
  - [Transaction.js](http://_vscodecontentref_/5): Componente para visualizar y gestionar transacciones.
  - [index.js](http://_vscodecontentref_/6): Punto de entrada de la aplicación.
  - [reportWebVitals.js](http://_vscodecontentref_/7): Archivo para medir el rendimiento de la aplicación.
  - [setupTests.js](http://_vscodecontentref_/8): Archivo de configuración para pruebas.
- [Dockerfile](http://_vscodecontentref_/9): Archivo de configuración para construir la imagen de Docker.
- [docker-compose.yml](http://_vscodecontentref_/10): Archivo de configuración para orquestar los servicios con Docker Compose.
- [package.json](http://_vscodecontentref_/11): Archivo de configuración de npm que incluye las dependencias y scripts del proyecto.

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

- `npm start`: Inicia la aplicación en modo de desarrollo.
- `npm run build`: Construye la aplicación para producción en la carpeta `build`.
- [npm test](http://_vscodecontentref_/12): Ejecuta las pruebas.
- `npm run eject`: Si necesitas configurar el proyecto manualmente, puedes ejecutar este comando. **Nota: Este comando es irreversible.**

## Notas

- Asegúrate de que el backend de la API de transacciones esté corriendo en `http://localhost:8080` para que la aplicación funcione correctamente.
- Si necesitas cambiar la URL del backend, puedes modificar el proxy en el archivo [package.json](http://_vscodecontentref_/13).

```json
"proxy": "http://localhost:8080"