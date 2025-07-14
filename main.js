document.addEventListener("DOMContentLoaded", function () {
  // Establece la fecha y hora automática en formato colombiano
  document.getElementById("fecha").value = new Date().toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const canvas = document.getElementById("firma");
  const ctx = canvas.getContext("2d");
  let pintando = false;

  function getPosicion(evento) {
    const rect = canvas.getBoundingClientRect();
    const x = (evento.clientX || evento.touches[0].clientX) - rect.left;
    const y = (evento.clientY || evento.touches[0].clientY) - rect.top;
    return { x, y };
  }

  canvas.addEventListener("mousedown", (e) => {
    pintando = true;
    const { x, y } = getPosicion(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  });

  canvas.addEventListener("mouseup", () => {
    pintando = false;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!pintando) return;
    const { x, y } = getPosicion(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  });

  canvas.addEventListener("touchstart", (e) => {
    pintando = true;
    const { x, y } = getPosicion(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    e.preventDefault();
  });

  canvas.addEventListener("touchmove", (e) => {
    if (!pintando) return;
    const { x, y } = getPosicion(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    e.preventDefault();
  });

  canvas.addEventListener("touchend", () => {
    pintando = false;
  });

  function borrarFirma() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Hacemos la función visible globalmente para el botón
  window.borrarFirma = borrarFirma;

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
});
