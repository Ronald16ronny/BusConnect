SCRIP

// script.js - Funcionalidades mejoradas para el login de BusConnect

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const formLogin = document.getElementById('formLogin');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const recordarCheckbox = document.getElementById('recordar');
    const eyeIcon = togglePassword?.querySelector('i');

    // Cargar datos guardados si existe "Recordar mi cuenta"
    cargarDatosGuardados();

    // Mostrar/Ocultar contraseña
    if (togglePassword && eyeIcon) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Cambiar icono
            if (type === 'text') {
                eyeIcon.classList.remove('fa-eye');
                eyeIcon.classList.add('fa-eye-slash');
                togglePassword.setAttribute('title', 'Ocultar contraseña');
            } else {
                eyeIcon.classList.remove('fa-eye-slash');
                eyeIcon.classList.add('fa-eye');
                togglePassword.setAttribute('title', 'Mostrar contraseña');
            }
        });
    }

    // Validación en tiempo real del email
    if (emailInput) {
        emailInput.addEventListener('blur', validarEmail);
        emailInput.addEventListener('input', function() {
            limpiarError(emailInput);
        });
    }

    // Validación en tiempo real de la contraseña
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            limpiarError(passwordInput);
            verificarFortalezaPassword(this.value);
        });
    }

    // Envío del formulario
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validarFormulario()) {
                procesarLogin();
            }
        });
    }

    // Botones de login social
    const btnGoogle = document.querySelector('.btn-social.google');
    const btnFacebook = document.querySelector('.btn-social.facebook');

    if (btnGoogle) {
        btnGoogle.addEventListener('click', loginConGoogle);
    }

    if (btnFacebook) {
        btnFacebook.addEventListener('click', loginConFacebook);
    }

    // Enlace "Olvidaste tu contraseña"
    const olvidasteLink = document.querySelector('.olvidaste');
    if (olvidasteLink) {
        olvidasteLink.addEventListener('click', function(e) {
            e.preventDefault();
            recuperarContrasena();
        });
    }

    // Efectos de interacción mejorados
    agregarEfectosHover();
    iniciarAnimaciones();

    // FUNCIONES

    function cargarDatosGuardados() {
        const emailGuardado = localStorage.getItem('busconnect_email');
        const recordarGuardado = localStorage.getItem('busconnect_recordar');
        
        if (emailGuardado && recordarGuardado === 'true' && emailInput) {
            emailInput.value = emailGuardado;
            if (recordarCheckbox) {
                recordarCheckbox.checked = true;
            }
        }
    }

    function guardarDatos() {
        if (recordarCheckbox && recordarCheckbox.checked && emailInput.value) {
            localStorage.setItem('busconnect_email', emailInput.value);
            localStorage.setItem('busconnect_recordar', 'true');
        } else {
            localStorage.removeItem('busconnect_email');
            localStorage.removeItem('busconnect_recordar');
        }
    }

    function validarEmail() {
        const email = emailInput.value.trim();
        if (!email) {
            mostrarError(emailInput, 'El correo electrónico es requerido');
            return false;
        }
        
        if (!isValidEmail(email)) {
            mostrarError(emailInput, 'Por favor, ingresa un correo electrónico válido');
            return false;
        }
        
        return true;
    }

    function validarPassword() {
        const password = passwordInput.value.trim();
        if (!password) {
            mostrarError(passwordInput, 'La contraseña es requerida');
            return false;
        }
        
        if (password.length < 6) {
            mostrarError(passwordInput, 'La contraseña debe tener al menos 6 caracteres');
            return false;
        }
        
        return true;
    }

    function validarFormulario() {
        const esEmailValido = validarEmail();
        const esPasswordValido = validarPassword();
        
        return esEmailValido && esPasswordValido;
    }

    function procesarLogin() {
        // Mostrar loading
        const btnLogin = document.querySelector('.btn-login');
        const textoOriginal = btnLogin.innerHTML;
        btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
        btnLogin.disabled = true;

        // Simular proceso de login (en un caso real, aquí iría la llamada a la API)
        setTimeout(() => {
            guardarDatos();
            
            // Simular login exitoso
            mostrarMensajeExito('¡Inicio de sesión exitoso! Redirigiendo...');
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                window.location.href = '../HTML/Inicio.html';
            }, 2000);
            
        }, 1500);
    }

    function loginConGoogle() {
        mostrarMensajeInfo('Iniciando sesión con Google...');
        // Aquí iría la integración con Google OAuth
        console.log('Login con Google - Integración pendiente');
    }

    function loginConFacebook() {
        mostrarMensajeInfo('Iniciando sesión con Facebook...');
        // Aquí iría la integración con Facebook OAuth
        console.log('Login con Facebook - Integración pendiente');
    }

    function recuperarContrasena() {
        const email = prompt('Por favor, ingresa tu correo electrónico para recuperar tu contraseña:');
        
        if (email && isValidEmail(email)) {
            mostrarMensajeExito(`Se ha enviado un enlace de recuperación a: ${email}`);
            // Aquí iría la lógica para enviar el email de recuperación
        } else if (email) {
            mostrarMensajeError('Por favor, ingresa un correo electrónico válido');
        }
    }

    function agregarEfectosHover() {
        // Agregar efectos a los botones sociales
        const botonesSociales = document.querySelectorAll('.btn-social');
        botonesSociales.forEach(boton => {
            boton.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            });
            
            boton.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Efecto en los campos de formulario
        const campos = document.querySelectorAll('.campo-formulario input');
        campos.forEach(campo => {
            campo.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-2px)';
            });
            
            campo.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
        });
    }

    function iniciarAnimaciones() {
        // Animación de entrada para elementos del formulario
        const elementos = document.querySelectorAll('.campo-formulario, .opciones, .btn-login, .separador, .login-social, .registro-link');
        
        elementos.forEach((elemento, index) => {
            elemento.style.opacity = '0';
            elemento.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                elemento.style.transition = 'all 0.6s ease-out';
                elemento.style.opacity = '1';
                elemento.style.transform = 'translateY(0)';
            }, 100 * (index + 1));
        });
    }

    // FUNCIONES DE UTILIDAD

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function mostrarError(elemento, mensaje) {
        limpiarError(elemento);
        elemento.style.borderColor = '#e74c3c';
        elemento.style.background = '#fdf2f2';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'mensaje-error';
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.fontWeight = '500';
        errorDiv.textContent = mensaje;
        
        elemento.parentElement.appendChild(errorDiv);
    }

    function limpiarError(elemento) {
        elemento.style.borderColor = '';
        elemento.style.background = '';
        
        const errorExistente = elemento.parentElement.querySelector('.mensaje-error');
        if (errorExistente) {
            errorExistente.remove();
        }
    }

    function mostrarMensajeExito(mensaje) {
        mostrarMensaje(mensaje, 'success');
    }

    function mostrarMensajeError(mensaje) {
        mostrarMensaje(mensaje, 'error');
    }

    function mostrarMensajeInfo(mensaje) {
        mostrarMensaje(mensaje, 'info');
    }

    function mostrarMensaje(mensaje, tipo) {
        // Remover mensaje anterior si existe
        const mensajeAnterior = document.querySelector('.mensaje-flotante');
        if (mensajeAnterior) {
            mensajeAnterior.remove();
        }

        const colores = {
            success: '#2ecc71',
            error: '#e74c3c',
            info: '#3498db'
        };

        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = 'mensaje-flotante';
        mensajeDiv.textContent = mensaje;
        mensajeDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colores[tipo] || '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            max-width: 300px;
        `;

        document.body.appendChild(mensajeDiv);

        // Animación de entrada
        setTimeout(() => {
            mensajeDiv.style.transform = 'translateX(0)';
        }, 100);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            mensajeDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (mensajeDiv.parentElement) {
                    mensajeDiv.remove();
                }
            }, 300);
        }, 5000);
    }

    // Teclado shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + Enter para enviar el formulario
        if (e.ctrlKey && e.key === 'Enter') {
            if (formLogin) {
                formLogin.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape para limpiar el formulario
        if (e.key === 'Escape') {
            if (formLogin) {
                formLogin.reset();
                limpiarErrores();
            }
        }
    });

    function limpiarErrores() {
        const errores = document.querySelectorAll('.mensaje-error');
        errores.forEach(error => error.remove());
        
        const campos = document.querySelectorAll('.campo-formulario input');
        campos.forEach(campo => {
            campo.style.borderColor = '';
            campo.style.background = '';
        });
    }

    // Prevenir envío con Enter en campos individuales
    if (formLogin) {
        const inputs = formLogin.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Mover al siguiente campo o enviar formulario
                    const formElements = Array.from(formLogin.elements);
                    const currentIndex = formElements.indexOf(this);
                    const nextElement = formElements[currentIndex + 1];
                    
                    if (nextElement) {
                        nextElement.focus();
                    } else {
                        formLogin.dispatchEvent(new Event('submit'));
                    }
                }
            });
        });
    }
});