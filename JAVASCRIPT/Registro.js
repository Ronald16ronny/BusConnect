// --- SLIDER SIMPLE ---
const contenedor = document.querySelector(".container");
const btnSwitch = document.getElementById("switchBtn");

btnSwitch.addEventListener("click", () => {
    contenedor.classList.toggle("mover-derecha");
});

// --- VALIDACIÓN Y ENVÍO DEL REGISTRO ---
const registroForm = document.getElementById("registroForm");
const inputNombre = document.getElementById("regNombre");
const inputApellido = document.getElementById("regApellido");
const inputDocumento = document.getElementById("regDocumento");
const inputCorreo = document.getElementById("regCorreo");
const inputPassword = document.getElementById("regPassword");
const inputConfirmPassword = document.getElementById("regConfirmPassword");
const mensajeError = document.getElementById("mensajeError");
const inputTelefono = document.getElementById("regTelefono");
const inputGenero = document.getElementById("regGenero");
const btnRegistrarse = document.getElementById("btnRegistrarse");

registroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    mensajeError.textContent = "";
    mensajeError.style.color = "#ff3333";

    const nombre = inputNombre.value.trim();
    const apellido = inputApellido.value.trim();
    const documento = inputDocumento.value.trim();
    const correo = inputCorreo.value.trim();
    const password = inputPassword.value;
    const confirmPassword = inputConfirmPassword.value;
    const telefono = inputTelefono.value.trim();
    const genero = inputGenero.value;

    // Validaciones locales
    if (nombre.length < 2) {
        mensajeError.textContent = "El nombre debe tener al menos 2 caracteres.";
        inputNombre.focus();
        return;
    }

    if (apellido.length < 2) {
        mensajeError.textContent = "El apellido debe tener al menos 2 caracteres.";
        inputApellido.focus();
        return;
    }

    const documentoValido = /^\d{6,15}$/;
    if (!documentoValido.test(documento)) {
        mensajeError.textContent = "Ingresa un documento válido (solo números).";
        inputDocumento.focus();
        return;
    }

    const telValido = /^[0-9()+\-\s]{7,20}$/;
    if (!telValido.test(telefono)) {
        mensajeError.textContent = "Ingresa un teléfono válido.";
        inputTelefono.focus();
        return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(correo)) {
        mensajeError.textContent = "Ingresa un correo válido.";
        inputCorreo.focus();
        return;
    }

    if (password.length < 6) {
        mensajeError.textContent = "La contraseña debe tener mínimo 6 caracteres.";
        inputPassword.focus();
        return;
    }

    if (password !== confirmPassword) {
        mensajeError.textContent = "Las contraseñas no coinciden.";
        inputConfirmPassword.focus();
        return;
    }

    if (!genero) {
        mensajeError.textContent = "Selecciona un género.";
        inputGenero.focus();
        return;
    }

    // Todas las validaciones pasaron, enviar datos al backend
    enviarRegistro(nombre, apellido, documento, correo, telefono, genero, password);
});

// Función para enviar datos al backend
function enviarRegistro(nombre, apellido, documento, correo, telefono, genero, password) {
    // Cambiar estado del botón
    btnRegistrarse.disabled = true;
    btnRegistrarse.textContent = "Registrando...";

    // Preparar datos para envío
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("apellido", apellido);
    formData.append("documento", documento);
    formData.append("correo", correo);
    formData.append("telefono", telefono);
    formData.append("genero", genero);
    formData.append("password", password);

    // Enviar mediante fetch
    fetch("../backend/controllers/registro.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mensajeError.textContent = "¡Registro exitoso! Redirigiendo...";
            mensajeError.style.color = "#00cc00";
            setTimeout(() => {
                window.location.href = "Inicio_Secion.html";
            }, 1500);
        } else {
            mensajeError.textContent = data.message || "Error en el registro";
            mensajeError.style.color = "#ff3333";
            btnRegistrarse.disabled = false;
            btnRegistrarse.textContent = "REGISTRARSE";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        mensajeError.textContent = "Error de conexión con el servidor";
        mensajeError.style.color = "#ff3333";
        btnRegistrarse.disabled = false;
        btnRegistrarse.textContent = "REGISTRARSE";
    });
}
