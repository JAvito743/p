MANOS QUE HABLAN - VERSIÓN ENTRENABLE CON MEDIAPIPE

1. CARPETAS AGREGADAS

modelos/
- Aquí va el modelo entrenado: modelo_senas.task

dataset_senas/
- Carpeta guía para organizar imágenes por seña.
- Cada subcarpeta es una etiqueta: hola, gracias, agua, ayuda, etc.

colab/
- Contiene el cuaderno entrenar_modelo_senas_imagenes.ipynb.
- Sirve para entrenar el modelo en Google Colab.

config/
- Contiene configuracion_modelo.json con las rutas y señas iniciales.

exportado/
- Carpeta opcional para guardar resultados antes de pasar el modelo final a modelos/.

2. RUTA DEL MODELO EN LA APP

La app busca primero:
modelos/modelo_senas.task

Si no lo encuentra, usa el modelo básico de MediaPipe como respaldo.

3. FLUJO DE TRABAJO

A. Abrir la app.
B. Capturar imágenes por seña.
C. Descargar dataset_senas.zip.
D. Abrir el cuaderno de Google Colab.
E. Subir dataset_senas.zip.
F. Entrenar.
G. Descargar modelo_senas.task.
H. Copiar modelo_senas.task en la carpeta modelos/.
I. Subir nuevamente la app a GitHub Pages.

4. SEÑAS INICIALES CONFIGURADAS

hola
gracias
agua
ayuda
si
no
bano
comida
profesor
estudiante

5. IMPORTANTE

Los nombres de las carpetas del dataset deben coincidir con las claves configuradas en app.js.
Ejemplo:
dataset_senas/agua/  =>  "agua": "Quiero agua"
