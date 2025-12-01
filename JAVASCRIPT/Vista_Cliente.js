// Vista_Cliente.js - Versión corregida y optimizada
console.log('🔄 Cargando Vista_Cliente.js...');

function initVistaCliente() {
    console.log('✅ Vista_Cliente.js inicializando...');

    // ==================== MENÚ LATERAL ====================
    const itemsMenu = document.querySelectorAll('.item_menu');
    const seccionMiCuenta = document.getElementById('seccion_mi_cuenta');
    const seccionMisViajes = document.getElementById('seccion_mis_viajes');
    const seccionPromociones = document.getElementById('seccion_promociones');

    function ocultarTodo() {
        if (seccionMiCuenta) seccionMiCuenta.classList.add('oculto');
        if (seccionMisViajes) seccionMisViajes.classList.add('oculto');
        if (seccionPromociones) seccionPromociones.classList.add('oculto');
    }

    function limpiarSeleccionMenu() {
        itemsMenu.forEach(item => item.classList.remove('seleccionado'));
    }

    // Configurar eventos del menú lateral
    itemsMenu.forEach((item, index) => {
        item.addEventListener('click', () => {
            console.log(`📂 Menú clickeado: índice ${index}`);
            limpiarSeleccionMenu();
            item.classList.add('seleccionado');
            ocultarTodo();

            if (index === 0 && seccionMiCuenta) {
                seccionMiCuenta.classList.remove('oculto');
            } else if (index === 1 && seccionMisViajes) {
                seccionMisViajes.classList.remove('oculto');
            } else if (index === 2 && seccionPromociones) {
                seccionPromociones.classList.remove('oculto');
            }
        });
    });

    console.log(`📋 Menú lateral configurado con ${itemsMenu.length} items`);

    // ==================== MODAL EDITAR USUARIO ====================
    const modalEditarEl = document.getElementById('modalEditar');
    const editarMensajeEl = document.getElementById('editarMensaje');
    const cancelarEditarBtn = document.getElementById('cancelarEditar');
    const formEditarEl = document.getElementById('formEditarUsuario');
    const editarUsuarioBtn = document.getElementById('editarUsuarioBtn');

    console.log('🔍 Buscando elementos del modal...');
    console.log('   - Modal:', modalEditarEl ? '✅ Encontrado' : '❌ NO encontrado');
    console.log('   - Formulario:', formEditarEl ? '✅ Encontrado' : '❌ NO encontrado');
    console.log('   - Botón editar:', editarUsuarioBtn ? '✅ Encontrado' : '❌ NO encontrado');
    console.log('   - Botón cancelar:', cancelarEditarBtn ? '✅ Encontrado' : '❌ NO encontrado');

    // Función para abrir el modal
    function abrirModalEditar() {
        console.log('🔓 Intentando abrir modal...');
        
        if (!modalEditarEl) {
            console.error('❌ ERROR: No se encontró el elemento #modalEditar');
            alert('Error: No se puede abrir el formulario de edición');
            return;
        }

        // Mostrar el modal
        modalEditarEl.style.display = 'block';
        console.log('✅ Modal mostrado (display: block)');
        
        // Limpiar mensaje de error previo
        if (editarMensajeEl) {
            editarMensajeEl.style.display = 'none';
            editarMensajeEl.textContent = '';
        }

        // Añadir clase al body para prevenir scroll
        document.body.style.overflow = 'hidden';
    }

    // Función para cerrar el modal
    function cerrarModalEditar() {
        console.log('🔒 Cerrando modal...');
        if (modalEditarEl) {
            modalEditarEl.style.display = 'none';
            document.body.style.overflow = '';
            console.log('✅ Modal cerrado');
        }
    }

    // Event listener para el botón de editar (el lápiz)
    if (editarUsuarioBtn) {
        console.log('✅ Configurando evento click en botón de editar...');
        
        editarUsuarioBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ ¡CLICK DETECTADO EN BOTÓN DE EDITAR!');
            abrirModalEditar();
        });

        console.log('✅ Evento configurado correctamente');
    } else {
        console.error('❌ ERROR CRÍTICO: No se encontró el botón #editarUsuarioBtn');
        console.log('   Verifica que el HTML tenga: <button id="editarUsuarioBtn">');
    }

    // Event listener para el botón cancelar
    if (cancelarEditarBtn) {
        cancelarEditarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('❌ Cancelar edición');
            cerrarModalEditar();
        });
        console.log('✅ Botón cancelar configurado');
    }

    // Cerrar modal al hacer click fuera del contenido
    if (modalEditarEl) {
        modalEditarEl.addEventListener('click', function(e) {
            // Solo cerrar si se hace click en el fondo oscuro (no en el contenido)
            if (e.target === modalEditarEl) {
                console.log('🖱️ Click fuera del modal, cerrando...');
                cerrarModalEditar();
            }
        });
        console.log('✅ Click fuera del modal configurado');
    }

    // Event listener para el formulario de edición
    if (formEditarEl) {
        formEditarEl.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('📤 Enviando formulario de edición...');
            
            // Ocultar mensaje de error previo
            if (editarMensajeEl) {
                editarMensajeEl.style.display = 'none';
            }

            const formData = new FormData(formEditarEl);
            
            // Mostrar datos que se enviarán
            console.log('📋 Datos a enviar:');
            for (let [key, value] of formData.entries()) {
                console.log(`   ${key}: ${value}`);
            }

            try {
                console.log('🌐 Haciendo petición a editar_usuario.php...');
                
                const resp = await fetch('../backend/controllers/editar_usuario.php', {
                    method: 'POST',
                    body: formData
                });

                console.log('📡 Respuesta recibida:', resp.status);

                if (!resp.ok) {
                    throw new Error(`Error HTTP: ${resp.status}`);
                }

                const data = await resp.json();
                console.log('📦 Datos recibidos:', data);

                if (data.success) {
                    console.log('✅ Actualización exitosa, recargando página...');
                    alert('✅ Datos actualizados correctamente');
                    window.location.reload();
                } else {
                    console.error('❌ Error del servidor:', data.message);
                    if (editarMensajeEl) {
                        editarMensajeEl.textContent = data.message || 'Error al guardar los datos';
                        editarMensajeEl.style.display = 'block';
                    } else {
                        alert(data.message || 'Error al guardar los datos');
                    }
                }
            } catch (err) {
                console.error('❌ ERROR DE RED:', err);
                if (editarMensajeEl) {
                    editarMensajeEl.textContent = 'Error de conexión. Intente nuevamente.';
                    editarMensajeEl.style.display = 'block';
                } else {
                    alert('Error de conexión. Intente nuevamente.');
                }
            }
        });
        console.log('✅ Formulario de edición configurado');
    }

    // Exponer función global (por si se necesita desde otro lugar)
    window.abrirModalEditar = abrirModalEditar;
    window.cerrarModalEditar = cerrarModalEditar;

    console.log('🎉 Inicialización completada exitosamente');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    console.log('⏳ DOM cargando, esperando DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initVistaCliente);
} else {
    console.log('✅ DOM ya está listo, inicializando inmediatamente...');
    initVistaCliente();
}