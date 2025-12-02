// Vista_Cliente.js - Versión corregida y optimizada
console.log('🔄 Cargando Vista_Cliente.js...');

// pequeño helper para escapar HTML cuando inyectamos contenido en la tabla
function escapeHtml(str){ return String(str || '').replace(/[&<>"'`]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;",'`':'&#96;'}[s])); }

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
                // cargar reservas al mostrar la sección desde el menú
                loadAndShowReservas();
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

    // Asegurar que el botón "Mis viajes" dentro de Mi cuenta carga reservas
    const botonMisViajesDentro = document.querySelector('.Mis_viajes');
    if (botonMisViajesDentro) {
        botonMisViajesDentro.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔎 Botón Mis_viajes (interno) clickeado — cargando reservas');
            // mostrar sección y cargar reservas
            document.querySelectorAll('.seccion_contenido').forEach(s => s.classList.add('oculto'));
            const seccion = document.getElementById('seccion_mis_viajes');
            if (seccion) seccion.classList.remove('oculto');
            // llamada a la función definida más abajo
            setTimeout(() => { if (typeof loadAndShowReservas === 'function') loadAndShowReservas(); }, 10);
        });
    }

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

// ------------------ Mis viajes: cargar y mostrar tabla ------------------
async function fetchMisReservas() {
    try {
        const resp = await fetch('../backend/controllers/mis_reservas.php', { credentials: 'same-origin' });
        if (!resp.ok) throw new Error('Error al obtener reservas: ' + resp.status);
        const data = await resp.json();
        if (!data.success) throw new Error(data.message || 'Respuesta inválida');
        return data.reservas || [];
    } catch (err) {
        console.error('fetchMisReservas:', err);
        return null;
    }
}

function renderTablaReservas(reservas) {
    const container = document.getElementById('reservasContainer');
    if (!container) return;
    container.innerHTML = '';

    if (!Array.isArray(reservas) || reservas.length === 0) {
        container.innerHTML = '<div class="mensaje_sin_viajes"><h3>No tienes reservas registradas.</h3></div>';
        container.style.display = 'block';
        return;
    }

    const table = document.createElement('table');
    table.className = 'tabla_reservas';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.innerHTML = `
        <thead>
            <tr>
                <th style="text-align:left; padding:8px; border-bottom:2px solid #e6e6e6;">Fecha salida</th>
                <th style="text-align:left; padding:8px; border-bottom:2px solid #e6e6e6;">Origen</th>
                <th style="text-align:left; padding:8px; border-bottom:2px solid #e6e6e6;">Destino</th>
                <th style="text-align:left; padding:8px; border-bottom:2px solid #e6e6e6;">Asiento</th>
                <th style="text-align:right; padding:8px; border-bottom:2px solid #e6e6e6;">Precio</th>
                <th style="text-align:left; padding:8px; border-bottom:2px solid #e6e6e6;">Estado</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    reservas.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="padding:10px; border-bottom:1px solid #f0f0f0;">${escapeHtml(r.fecha_salida || '')}</td>
            <td style="padding:10px; border-bottom:1px solid #f0f0f0;">${escapeHtml(r.origen || '')}</td>
            <td style="padding:10px; border-bottom:1px solid #f0f0f0;">${escapeHtml(r.destino || '')}</td>
            <td style="padding:10px; border-bottom:1px solid #f0f0f0;">${escapeHtml(String(r.asiento))}</td>
            <td style="padding:10px; border-bottom:1px solid #f0f0f0; text-align:right;">S/${Number(r.precio_pagado || 0).toFixed(2)}</td>
            <td style="padding:10px; border-bottom:1px solid #f0f0f0;">${escapeHtml(r.estado || '')}</td>
        `;
        tbody.appendChild(tr);
    });

    container.appendChild(table);
    container.style.display = 'block';
}

// botón dentro de "Mi cuenta"
document.addEventListener('click', async function (e) {
    const btn = e.target.closest('.Mis_viajes');
    if (btn) {
        // mostrar sección de mis viajes y cargar reservas
        const seccion = document.getElementById('seccion_mis_viajes');
        if (seccion) {
            document.querySelectorAll('.seccion_contenido').forEach(s => s.classList.add('oculto'));
            seccion.classList.remove('oculto');
        }
        await loadAndShowReservas();
    }
});

// Función común para cargar y mostrar reservas
async function loadAndShowReservas() {
    const container = document.getElementById('reservasContainer');
    if (container) {
        container.innerHTML = '<p>Cargando tus reservas…</p>';
        container.style.display = 'block';
    }

    const data = await fetchMisReservas();
    if (data === null) {
        if (container) container.innerHTML = '<p>Error al cargar reservas. Intenta recargar la página.</p>';
        return;
    }
    renderTablaReservas(data);
}
