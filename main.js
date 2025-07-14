document.addEventListener("DOMContentLoaded", function () {
  // Establece fecha y hora actual al cargar
  document.getElementById("fecha").value = new Date().toLocaleString();

  // Configuración del canvas de firma
  const canvas = document.getElementById("firma");
  const ctx = canvas.getContext("2d");
  let pintando = false;

  function iniciarFirma(e) {
    pintando = true;
    dibujar(e);
  }

  function terminarFirma() {
    pintando = false;
    ctx.beginPath();
  }

  function dibujar(e) {
    if (!pintando) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }

  // Soporte táctil
  canvas.addEventListener("mousedown", iniciarFirma);
  canvas.addEventListener("mouseup", terminarFirma);
  canvas.addEventListener("mouseout", terminarFirma);
  canvas.addEventListener("mousemove", dibujar);

  canvas.addEventListener("touchstart", (e) => iniciarFirma(e.touches[0]));
  canvas.addEventListener("touchend", terminarFirma);
  canvas.addEventListener("touchmove", (e) => {
    dibujar(e.touches[0]);
    e.preventDefault();
  });

  function borrarFirma() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Evento de envío del formulario
  document.getElementById("formulario").addEventListener("submit", function (e) {
    e.preventDefault();

    const dataURL = canvas.toDataURL();
    document.getElementById("imagenFirma").value = dataURL;

    const formData = new FormData();
    formData.append("nombre", document.getElementById("nombre").value);
    formData.append("cedula", document.getElementById("cedula").value);
    formData.append("fecha", document.getElementById("fecha").value);
    formData.append("firma", dataURL);

    fetch("https://script.google.com/macros/s/AKfycbxM2XQZgd1Si8ToUQBNZYg8jHzj4CQGbzJvcgmloBIzvYg_4n3w9rv73dGfkw9rE8M/exec", {
      method: "POST",
      body: formData
    })
      .then(res => res.text())
      .then(resp => {
        alert("✅ ¡Formulario enviado correctamente!");
        document.getElementById("formulario").reset();
        borrarFirma();
      })
      .catch(err => {
        alert("❌ Error al enviar el formulario.");
        console.error("Error:", err);
      });
  });

  // Hacemos accesible borrarFirma globalmente
  window.borrarFirma = borrarFirma;
});
