// --- SLIDER SIMPLE ---
const contenedor = document.querySelector(".container");
const btnSwitch = document.getElementById("switchBtn");

btnSwitch.addEventListener("click", () => {
    contenedor.classList.toggle("mover-derecha");
});

// --- VALIDACIÓN SIMPLE DEL REGISTRO ---
const registroForm = document.getElementById("registroForm");
const inputNombre = document.getElementById("regNombre");
const inputCorreo = document.getElementById("regCorreo");
const inputPassword = document.getElementById("regPassword");
const inputConfirmPassword = document.getElementById("regConfirmPassword");
const mensajeError = document.getElementById("mensajeError");

registroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    mensajeError.textContent = "";
    mensajeError.style.color = "#ff3333";

    const nombre = inputNombre.value.trim();
    const correo = inputCorreo.value.trim();
    const password = inputPassword.value;
    const confirmPassword = inputConfirmPassword.value;

    if (nombre.length < 2) {
        mensajeError.textContent = "⚠️ El nombre debe tener al menos 2 caracteres.";
        inputNombre.focus();
        return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(correo)) {
        mensajeError.textContent = "⚠️ Ingresa un correo válido.";
        inputCorreo.focus();
        return;
    }

    if (password.length < 6) {
        mensajeError.textContent = "⚠️ La contraseña debe tener mínimo 6 caracteres.";
        inputPassword.focus();
        return;
    }

    if (password !== confirmPassword) {
        mensajeError.textContent = "⚠️ Las contraseñas no coinciden.";
        inputConfirmPassword.focus();
        return;
    }

    // Éxito
    mensajeError.textContent = "✅ ¡Registro exitoso!";
    mensajeError.style.color = "#0099ff";

    setTimeout(() => {
        registroForm.reset();
        mensajeError.textContent = "";
    }, 2500);
});
