// Evento al enviar el formulario
document.getElementById("formulario").addEventListener("submit", function(e) {
  e.preventDefault();

  const dataURL = canvas.toDataURL();
  document.getElementById("imagenFirma").value = dataURL;

  // Usamos FormData en lugar de JSON para evitar CORS
  const formData = new FormData();
  formData.append("nombre", document.getElementById("nombre").value);
  formData.append("cedula", document.getElementById("cedula").value);
  formData.append("fecha", document.getElementById("fecha").value);
  formData.append("firma", dataURL);

  // Tu URL del Web App
  fetch("https://script.google.com/macros/s/AKfycbxM2XQZgd1Si8ToUQBNZYg8jHzj4CQGbzJvcgmloBIzvYg_4n3w9rv73dGfkw9rE8M/exec", {
    method: "POST",
    body: formData,
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
