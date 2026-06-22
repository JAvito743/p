const video = document.getElementById("video");
const nombreSena = document.getElementById("nombreSena");
const contador = document.getElementById("contadorMuestras");
const preview = document.getElementById("previewMuestras");
const btnCapturar = document.getElementById("btnCapturar");
const btnDescargar = document.getElementById("btnDescargarDataset");
const btnLimpiar = document.getElementById("btnLimpiarDataset");
const aviso = document.getElementById("avisoCamara");

let muestras = [];

function limpiarNombre(nombre) {
  return (nombre || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function actualizarContador() {
  contador.textContent = "Muestras capturadas: " + muestras.length;
}

async function iniciarCamaraCaptura() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("El navegador no permite usar la cámara.");
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });
    video.srcObject = stream;
    await video.play();
    if (aviso) aviso.textContent = "Cámara activa. Escribe el nombre de la seña y captura varias muestras.";
  } catch (error) {
    console.error(error);
    if (aviso) aviso.textContent = "No se pudo abrir la cámara. Revisa permisos o abre el proyecto desde HTTPS / localhost.";
    alert("No se pudo abrir la cámara. Revisa permisos del navegador.");
  }
}

btnCapturar.addEventListener("click", () => {
  const etiqueta = limpiarNombre(nombreSena.value);
  if (!etiqueta) {
    alert("Escribe el nombre de la seña. Ejemplo: agua, hola, bano");
    return;
  }
  if (!video.videoWidth) {
    alert("La cámara todavía no está lista.");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");

  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    const numero = String(muestras.filter(m => m.etiqueta === etiqueta).length + 1).padStart(4, "0");
    const nombreArchivo = `${etiqueta}/${etiqueta}_${numero}.jpg`;
    muestras.push({ etiqueta, nombreArchivo, blob });

    const img = document.createElement("img");
    img.src = URL.createObjectURL(blob);
    img.alt = nombreArchivo;
    img.title = nombreArchivo;
    preview.prepend(img);
    actualizarContador();
  }, "image/jpeg", 0.9);
});

btnLimpiar.addEventListener("click", () => {
  if (!confirm("¿Quieres borrar las muestras capturadas en esta sesión?")) return;
  muestras = [];
  preview.innerHTML = "";
  actualizarContador();
});

btnDescargar.addEventListener("click", async () => {
  if (muestras.length === 0) {
    alert("Primero captura algunas muestras.");
    return;
  }
  if (!window.JSZip) {
    alert("No se cargó JSZip. Revisa tu conexión a internet.");
    return;
  }

  const zip = new JSZip();
  const resumen = {};
  muestras.forEach((muestra) => {
    zip.file(muestra.nombreArchivo, muestra.blob);
    resumen[muestra.etiqueta] = (resumen[muestra.etiqueta] || 0) + 1;
  });

  const readme = [
    "Dataset generado desde Manos que Hablan.",
    "",
    "Cada carpeta corresponde al nombre de una seña.",
    "Usa este ZIP en Google Colab para entrenar el modelo.",
    "",
    "Muestras capturadas:"
  ];
  Object.entries(resumen).forEach(([etiqueta, cantidad]) => readme.push(`- ${etiqueta}: ${cantidad} imagenes`));
  zip.file("README_dataset.txt", readme.join("\n"));

  const blob = await zip.generateAsync({ type: "blob" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = "dataset_senas.zip";
  enlace.click();
  setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
});

iniciarCamaraCaptura();
