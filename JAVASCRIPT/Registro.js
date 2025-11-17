// --- FUNCIONALIDAD DEL SLIDER (Efecto visual) ---

const contenedor = document.querySelector(".container");
const btnSwitch = document.getElementById("switchBtn");

btnSwitch.addEventListener("click", () => {
    // Alterna la clase "mover-derecha" para el efecto de transición (TW-S14)
    contenedor.classList.toggle("mover-derecha"); 
});


// --- FUNCIONALIDAD DE REGISTRO Y VALIDACIÓN (Tu parte) ---

// 1. Acceder a los elementos clave del DOM (TW-S13: getElementById)
const registroForm = document.getElementById("registroForm");
const inputNombre = document.getElementById("regNombre");
const inputCorreo = document.getElementById("regCorreo");
const inputPassword = document.getElementById("regPassword");
const inputConfirmPassword = document.getElementById("regConfirmPassword");
const mensajeError = document.getElementById("mensajeError");

// 2. Función principal de validación (TW-S11: Eventos)
const validarRegistro = (e) => {
    // Evita el envío por defecto del formulario para poder validar
    e.preventDefault(); 
    
    // Resetear el estado visual del mensaje
    mensajeError.innerHTML = ""; 
    mensajeError.style.color = "#ff3333"; 

    // Obtener valores
    const nombre = inputNombre.value.trim();
    const correo = inputCorreo.value.trim();
    const password = inputPassword.value;
    const confirmPassword = inputConfirmPassword.value;

    let errores = [];

    // --- Estructuras de Control (TW-S12): Validación ---
    
    // Validación 1: Nombre (mínimo 2 caracteres)
    if (nombre.length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres.");
    }

    // Validación 2: Correo (Formato simple con Expresión Regular)
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(correo)) {
        errores.push("Ingresa un correo electrónico válido.");
    }

    // Validación 3: Contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
        errores.push("La contraseña debe tener al menos 6 caracteres.");
    }

    // Validación 4: Contraseñas Coincidentes
    if (password !== confirmPassword) {
        errores.push("Las contraseñas no coinciden.");
    }

    // --- Manejo de Errores y Éxito (TW-S13: Modificación de contenido) ---
    if (errores.length > 0) {
        // Mostrar el primer error encontrado
        mensajeError.innerHTML = "⚠️ " + errores[0];
        
        // Opcional: enfocar el primer campo con error para ayudar al usuario
        if (nombre.length < 2) inputNombre.focus();
        else if (!regexEmail.test(correo)) inputCorreo.focus();
        else if (password.length < 6) inputPassword.focus();
        else inputConfirmPassword.focus();
        
    } else {
        // Proceso de registro exitoso (simulación)
        mensajeError.innerHTML = "✅ ¡Registro exitoso! Ya puedes iniciar sesión.";
        mensajeError.style.color = "#0099ff"; // Color azul para éxito
        
        // Aquí iría el código real para enviar los datos al servidor (fetch/axios)
        console.log("Datos listos para enviar:", { nombre, correo, password });
        
        // Limpiar el formulario y mensaje después de 3 segundos
        setTimeout(() => {
            registroForm.reset();
            mensajeError.innerHTML = "";
            mensajeError.style.color = "#ff3333";
        }, 3000);
    }
};

// 3. Asignar el evento 'submit' al formulario
registroForm.addEventListener("submit", validarRegistro);