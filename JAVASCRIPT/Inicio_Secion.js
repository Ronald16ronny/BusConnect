// Inicio_Secion.js - Funcionalidades para el login de BusConnect

document.addEventListener('DOMContentLoaded', function() {

    const formLogin = document.getElementById('formLogin');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const recordarCheckbox = document.getElementById('recordar');
    const eyeIcon = togglePassword?.querySelector('i');

    cargarDatosGuardados();

    // Mostrar / ocultar contraseña
    if (togglePassword && eyeIcon) {
        togglePassword.addEventListener('click', () => {
            const visible = passwordInput.type === 'text';
            passwordInput.type = visible ? 'password' : 'text';

            eyeIcon.classList.toggle('fa-eye');
            eyeIcon.classList.toggle('fa-eye-slash');
        });
    }

    // Validaciones
    if (emailInput) {
        emailInput.addEventListener('blur', validarEmail);
        emailInput.addEventListener('input', () => limpiarError(emailInput));
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', () => limpiarError(passwordInput));
    }

    // Submit
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();

            if (validarFormulario()) procesarLogin();
        });
    }

    // ========= FUNCIONES =========

    function cargarDatosGuardados() {
        const emailGuardado = localStorage.getItem('busconnect_email');
        if (emailGuardado && recordarCheckbox) {
            emailInput.value = emailGuardado;
            recordarCheckbox.checked = true;
        }
    }

    function guardarDatos() {
        if (recordarCheckbox.checked && emailInput.value) {
            localStorage.setItem('busconnect_email', emailInput.value);
        } else {
            localStorage.removeItem('busconnect_email');
        }
    }

    // ---------------- VALIDACIONES ------------------

    function validarEmail() {
        const val = emailInput.value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!val) {
            mostrarError(emailInput, 'El correo es obligatorio');
            return false;
        }
        if (!regex.test(val)) {
            mostrarError(emailInput, 'Formato de correo inválido');
            return false;
        }
        return true;
    }

    function validarPassword() {
        const val = passwordInput.value.trim();
        if (!val) {
            mostrarError(passwordInput, 'La contraseña es obligatoria');
            return false;
        }
        if (val.length < 6) {
            mostrarError(passwordInput, 'Mínimo 6 caracteres');
            return false;
        }
        return true;
    }

    function validarFormulario() {
        return validarEmail() && validarPassword();
    }

    // ---------------- LOGIN ------------------

    function procesarLogin() {
        const btnLogin = document.querySelector('.btn-login');
        const textoOriginal = btnLogin.innerHTML;

        btnLogin.disabled = true;
        btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validando...';

        const datos = new FormData(formLogin);

        fetch('../backend/controllers/login.php', {
            method: 'POST',
            body: datos
        })
        .then(res => res.json())
        .then(data => {

            if (data.success) {
                guardarDatos();
                mostrarMensajeExito(data.message);

                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 1200);
            } else {
                mostrarMensajeError(data.message);
                btnLogin.innerHTML = textoOriginal;
                btnLogin.disabled = false;
            }
        })
        .catch(() => {
            mostrarMensajeError('Error de conexión con el servidor');
            btnLogin.innerHTML = textoOriginal;
            btnLogin.disabled = false;
        });
    }

    // ---------------- MENSAJES ------------------

    function mostrarMensaje(mensaje, tipo) {
        const anterior = document.querySelector('.mensaje-flotante');
        if (anterior) anterior.remove();

        const div = document.createElement('div');
        div.className = 'mensaje-flotante';
        div.textContent = mensaje;

        const colores = {
            success: '#2ecc71',
            error: '#e74c3c',
            info: '#3498db'
        };

        div.style.cssText = `
            position: fixed;
            top: 25px;
            right: 25px;
            background: ${colores[tipo] || '#3498db'};
            padding: 14px 18px;
            color: #fff;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,.25);
            transform: translateX(120%);
            transition: .3s;
        `;
        document.body.appendChild(div);

        setTimeout(() => div.style.transform = 'translateX(0)', 50);

        setTimeout(() => {
            div.style.transform = 'translateX(120%)';
            setTimeout(() => div.remove(), 300);
        }, 4000);
    }

    function mostrarMensajeExito(msg) { mostrarMensaje(msg, 'success'); }
    function mostrarMensajeError(msg) { mostrarMensaje(msg, 'error'); }
    function mostrarMensajeInfo(msg)  { mostrarMensaje(msg, 'info'); }

    // ---------------- ERRORES FORM ------------------

    function mostrarError(input, mensaje) {
        limpiarError(input);

        input.style.borderColor = '#e74c3c';

        const err = document.createElement('div');
        err.className = 'mensaje-error';
        err.style.cssText = `
            font-size: .8rem;
            margin-top: 4px;
            color: #e74c3c;
        `;
        err.textContent = mensaje;

        input.parentElement.appendChild(err);
    }

    function limpiarError(input) {
        input.style.borderColor = '';
        const err = input.parentElement.querySelector('.mensaje-error');
        if (err) err.remove();
    }

});
