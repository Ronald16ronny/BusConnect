<<<<<<< HEAD
// Reserva_Pasaje.js
document.addEventListener("DOMContentLoaded", () => {
=======
document.addEventListener("DOMContentLoaded", function() {
>>>>>>> 95047ec8a3275d436320350ec63f6ba005f9768c

    let precioBase = 0;
    let seleccionados = [];
    let precioUnit = 0;
    let currentBusID = null;
    let currentHorarioID = null;
    const modulo = document.getElementById("modulo-asientos");
    const cantidadSpan = document.getElementById("cantidadAsientos");
    const btnContinuar = document.getElementById("btnContinuar");
    const listaTarjetas = document.getElementById("listaTarjetas");
    const formBuscar = document.getElementById("formBuscar");

<<<<<<< HEAD
    // -------------- Buscar buses (form) --------------
    formBuscar.addEventListener("submit", async e => {
        e.preventDefault();
        const origen = formBuscar.origen.value.trim();
        const destino = formBuscar.destino.value.trim();
        const fecha = formBuscar.fecha.value;
=======
    // ==================================================
    // CLICK EN COMPRAR —> MOSTRAR MÓDULO
    // ==================================================
    document.addEventListener("click", function(e) {
>>>>>>> 95047ec8a3275d436320350ec63f6ba005f9768c

        // Ajusta la ruta si tu backend la tiene en otro archivo
        try {
            const res = await fetch(`../backend/controllers/buscar_buses.php?origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}&fecha=${encodeURIComponent(fecha)}`);
            if (!res.ok) throw new Error('Error en búsqueda');
            const data = await res.json();

<<<<<<< HEAD
            listaTarjetas.innerHTML = "";
            if (!Array.isArray(data) || data.length === 0) {
                listaTarjetas.innerHTML = "<p>No se encontraron buses para esos filtros.</p>";
                return;
            }

            data.forEach(bus => {
                listaTarjetas.insertAdjacentHTML('beforeend', cardBus(bus));
            });
        } catch (err) {
            console.error(err);
            listaTarjetas.innerHTML = "<p>Error al buscar buses. Revisa la consola.</p>";
        }
    });
=======
            const tarjeta = e.target.closest(".tarjeta");

            // OBTENER PRECIO REAL
            const txt = tarjeta.querySelector(".precio-actual").innerText;
            precioBase = parseFloat(txt.replace("S/ ", ""));

            // reset
            seleccionados = [];
            cantidadSpan.textContent = 0;
            btnContinuar.textContent = "CONTINUAR: S/0";

            // COLOCAR EL MÓDULO DEBAJO DE LA TARJETA
            tarjeta.parentNode.insertBefore(modulo, tarjeta.nextSibling);
            modulo.style.display = "block";
        }

        // Cerrar módulo con la X
        if (e.target.classList.contains("close-asientos")) {
            modulo.style.display = "none";
        }

    });

    // ==================================================
    // SELECCIÓN DE ASIENTOS
    // ==================================================
    const asientos = document.querySelectorAll(".asiento");
    for (let i = 0; i < asientos.length; i++) {
        const a = asientos[i];
        a.addEventListener("click", function() {
            if (a.classList.contains("vendido")) return;

            if (a.classList.contains("seleccionado")) {
                a.classList.remove("seleccionado");
                const index = seleccionados.indexOf(a.textContent);
                if (index > -1) seleccionados.splice(index, 1);
            } else {
                a.classList.add("seleccionado");
                seleccionados.push(a.textContent);
            }

            const total = seleccionados.length * precioBase;

            cantidadSpan.textContent = seleccionados.length;
            btnContinuar.textContent = "CONTINUAR: S/" + total;
        });
    }
>>>>>>> 95047ec8a3275d436320350ec63f6ba005f9768c

    // -------------- Plantilla tarjeta bus --------------
    function cardBus(bus){
             // Se espera que 'bus' tenga: id_horario, id_bus, origen, destino, fecha_salida, precio, duracion_minutos, total_asientos, disponibles, modelo
             const fechaSalida = formatSalida(bus.fecha_salida);
             const tipo = servicioPorPrecio(Number(bus.precio));
             const asientoTexto = `1° • ${bus.total_asientos}°`;
             const duracion = bus.duracion_minutos ? `${Math.floor(bus.duracion_minutos/60)} hrs aprox` : '—';

             return `
             <article class="tarjeta ${tipo.cssClass}" data-id-horario="${bus.id_horario}" data-id-bus="${bus.id_bus}" data-salida="${bus.fecha_salida}">
                    <span class="etiqueta-ubicacion">${escapeHtml(bus.origen || '')}</span>
                    <div class="contenido-tarjeta">
                        <div class="columna-izquierda">
                            <div class="logo-texto">SUPERBUSCONECT</div>
                            <div class="nombre-empresa">BusConnect</div>
                            <div class="tipo-servicio">${escapeHtml(tipo.label)}</div>
                        </div>

                        <div class="columna-centro">
                            <div class="fila"><span class="titulo">Salida</span><span class="dato">${escapeHtml(fechaSalida)}</span></div>
                            <div class="fila"><span class="titulo">Asiento</span><span class="dato">${escapeHtml(asientoTexto)}</span></div>
                            <div class="fila"><span class="titulo">Disponibles</span><span class="dato">${escapeHtml(String(bus.disponibles || 0))} asientos</span></div>
                            <div class="fila"><span class="titulo">Duración</span><span class="dato">${escapeHtml(duracion)}</span></div>
                        </div>

                        <div class="columna-derecha">
                            <div class="precios">
                                <span class="precio-actual">S/ ${Number(bus.precio).toFixed(0)}</span>
                            </div>
                            <button class="boton-comprar">COMPRAR</button>
                        </div>
                    </div>
                </article>
             `;
    }

        function servicioPorPrecio(precio){
                // Simple mapping: económicas, exclusivo, súper exclusivo
                if (isNaN(precio)) return {label: 'Económico', cssClass: 'economico'};
                if (precio < 80) return {label: 'Económico', cssClass: 'economico'};
                if (precio < 100) return {label: 'Exclusivo', cssClass: 'exclusivo'};
                return {label: 'Súper Exclusivo', cssClass: 'super-exclusivo'};
        }

        function formatSalida(fechaStr){
                if (!fechaStr) return '';
                // fechaStr expected like 'YYYY-MM-DD HH:ii:ss'
                const d = new Date(fechaStr.replace(' ', 'T'));
                if (isNaN(d)) return fechaStr;
                const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
                const dia = dias[d.getDay()];
                const DD = String(d.getDate()).padStart(2,'0');
                const MM = String(d.getMonth()+1).padStart(2,'0');
                let hours = d.getHours();
                const minutes = String(d.getMinutes()).padStart(2,'0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12; if (hours === 0) hours = 12;
                return `${dia}, ${DD}/${MM} • ${hours}:${minutes} ${ampm}`;
        }

    // escape simple
    function escapeHtml(str){ return String(str).replace(/[&<>"'`]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[s])); }

    // -------------- Click global (abrir módulo / comprar) --------------
    document.addEventListener("click", async (e) => {
        const comprarBtn = e.target.closest('.boton-comprar');
        if (comprarBtn) {
            const tarjeta = comprarBtn.closest(".tarjeta");
            // read bus and horario from the article dataset (set by cardBus)
            currentBusID = tarjeta.dataset.idBus || comprarBtn.dataset.bus || null;
            // precio may be shown in .precio-actual; parse numeric part
            const precioElem = tarjeta.querySelector('.precio-actual');
            if (precioElem) {
                const txt = precioElem.textContent || '';
                const num = txt.replace(/[^0-9.,]/g, '').replace(',', '.');
                precioUnit = parseFloat(num) || 0;
            } else {
                precioUnit = parseFloat(comprarBtn.dataset.precio || '0');
            }
            precioBase = precioUnit;
            seleccionados = [];
            cantidadSpan.textContent = '0';
            btnContinuar.textContent = "CONTINUAR: S/0";

            // mueve módulo debajo de la tarjeta
            tarjeta.insertAdjacentElement("afterend", modulo);
            modulo.style.display = "block";

            // limpia asientos en DOM y coloca plantilla vacía (evita restos)
            // Mantuvimos elementos de ejemplo en HTML; limpia las clases
            document.querySelectorAll('#modulo-asientos .asiento').forEach(a => a.classList.remove('vendido', 'seleccionado'));

            // cargar asientos físicos del bus (asientos_bus.php)
            await loadSeatsForBus(currentBusID);

            // marcar asientos reservados por tickets/reservas
            // intentamos capturar idHorario (si la tarjeta lo incluye como data-id-horario)
            const idHorario = tarjeta.dataset.idHorario || tarjeta.dataset.idHorario || tarjeta.dataset.idHorario || tarjeta.dataset.idHorario || tarjeta.dataset.idHorario || tarjeta.dataset.idHorario || tarjeta.dataset.idHorario || tarjeta.dataset.idHorario || tarjeta.dataset.idHorario || tarjeta.dataset.idHorario || tarjeta.dataset.idHorario || tarjeta.dataset.idHorario || tarjeta.dataset.id || tarjeta.dataset.idHorario || tarjeta.dataset.idHorario || tarjeta.dataset.idHorario || tarjeta.dataset.idHorario;
            // normalize from dataset names (some older browsers convert dashed names differently)
            currentHorarioID = tarjeta.dataset.idHorario || tarjeta.dataset['idHorario'] || tarjeta.dataset.id || tarjeta.getAttribute('data-id-horario') || tarjeta.getAttribute('data-id') || null;
            const salidaText = tarjeta.dataset.salida || (tarjeta.querySelector('.columna-centro .fila .dato') || {}).innerText || '';
            modulo.dataset.loading = '1';
            await fetchReservedSeats(salidaText, idHorario);
            modulo.dataset.loading = '0';
            return;
        }

        // cerrar módulo
        if (e.target.closest('.close-asientos')) {
            modulo.style.display = "none";
            return;
        }
    });

    // -------------- Cargar asientos por bus (desde DB) --------------
    // Endpoint: ../backend/controllers/asientos_bus.php?id=ID_BUS
    async function loadSeatsForBus(idBus){
        try {
            const resp = await fetch(`../backend/controllers/asientos_bus.php?id=${encodeURIComponent(idBus)}`);
            if (!resp.ok) throw new Error('No se pudo obtener asientos');
            const seats = await resp.json();
            renderAsientos(seats);
        } catch (err) {
            console.error('Error loadSeatsForBus', err);
        }
    }

    // renderAsientos: construye elementos con data-num y classes; espera array de objetos {numero_asiento, piso, estado}
    function renderAsientos(asientos){
        const cont1 = document.querySelector("#piso1");
        const cont2 = document.querySelector("#piso2");

        // vaciar filas actuales
        cont1.innerHTML = '';
        cont2.innerHTML = '';

        // crear filas simples: agrupamos 4 por fila para mostrar bonito
        const perRow = 4;
        let rows1 = [], rows2 = [];
        asientos.forEach(item => {
            const obj = { num: String(item.numero_asiento), piso: Number(item.piso), estado: item.estado };
            if (obj.piso === 1) rows1.push(obj); else rows2.push(obj);
        });

        function buildRows(arr){
            const frag = document.createDocumentFragment();
            for (let i=0;i<arr.length;i+=perRow){
                const fila = document.createElement('div');
                fila.className = 'fila-asientos';
                const slice = arr.slice(i, i+perRow);
                slice.forEach(s => {
                    const div = document.createElement('div');
                    div.className = 'asiento';
                    div.dataset.num = s.num;
                    div.textContent = s.num;
                    if (s.estado == 1 || s.estado === "1") div.classList.add('vendido');
                    else div.classList.add('disponible');
                    fila.appendChild(div);
                });
                frag.appendChild(fila);
            }
            return frag;
        }

        cont1.appendChild(buildRows(rows1));
        cont2.appendChild(buildRows(rows2));
    }

    // -------------- Click en asientos (delegación sobre módulo) --------------
    modulo.addEventListener('click', function(e){
        if (modulo.dataset.loading === '1') return;
        const seat = e.target.closest('.asiento');
        if (!seat || !modulo.contains(seat)) return;
        if (seat.classList.contains('vendido')) return;

        const nro = seat.dataset.num || seat.textContent.trim();
        if (seat.classList.contains('seleccionado')){
            seat.classList.remove('seleccionado');
            seleccionados = seleccionados.filter(x => x !== nro);
        } else {
            seat.classList.add('seleccionado');
            seleccionados.push(nro);
        }
        actualizarUI();
    });

    function actualizarUI(){
        cantidadSpan.textContent = seleccionados.length;
        const total = (seleccionados.length * precioUnit);
        btnContinuar.textContent = `CONTINUAR: S/${Number(total).toFixed(2)}`;
    }

    // -------------- Obtener asientos reservados (tickets/reserva_asiento) --------------
    async function fetchReservedSeats(salida, idHorario) {
        try {
            let url = '../backend/controllers/asientos_reservados.php';
            const params = [];
            if (idHorario) params.push('id_horario=' + encodeURIComponent(idHorario));
            if (salida) params.push('salida=' + encodeURIComponent(salida));
            if (params.length) url += '?' + params.join('&');

            const resp = await fetch(url);
            if (!resp.ok) throw new Error('Error al obtener asientos reservados');
            const data = await resp.json();

            // data may have key 'seats' or 'seats' array
            const reserved = new Set(Array.isArray(data.seats) ? data.seats.map(s => String(s).trim()) : []);

            document.querySelectorAll('#modulo-asientos .asiento').forEach(a => {
                const txt = (a.dataset.num || a.textContent || '').toString().trim();
                if (reserved.has(txt)) {
                    a.classList.add('vendido');
                    a.classList.remove('seleccionado');
                    seleccionados = seleccionados.filter(n => n !== txt);
                }
            });

            actualizarUI();
            return reserved;
        } catch (err) {
            console.error('Error cargando asientos reservados:', err);
            return new Set();
        }
    }

    // -------------- Cambio pisos --------------
    const tabs = document.querySelectorAll(".tab-piso");
    const piso1 = document.getElementById("piso1");
    const piso2 = document.getElementById("piso2");
<<<<<<< HEAD
    tabs.forEach(btn => {
        btn.addEventListener("click", () => {
            tabs.forEach(b => b.classList.remove("activo"));
=======

    for (let i = 0; i < tabs.length; i++) {
        const btn = tabs[i];
        btn.addEventListener("click", function() {
            for (let j = 0; j < tabs.length; j++) {
                tabs[j].classList.remove("activo");
            }
>>>>>>> 95047ec8a3275d436320350ec63f6ba005f9768c
            btn.classList.add("activo");
            piso1.style.display = btn.dataset.piso === "1" ? "block" : "none";
            piso2.style.display = btn.dataset.piso === "2" ? "block" : "none";
        });
    }

<<<<<<< HEAD
    // -------------- Botón Continuar -> abrir modal de confirmación previa --------------
    const modalConfirmar = document.getElementById('modalConfirmarReserva');
    const listaAsientosElem = document.getElementById('confirmListaAsientos');
    const precioElem = document.getElementById('confirmPrecio');
    const btnConfirmEnviar = document.getElementById('confirmEnviar');
    const btnConfirmCancelar = document.getElementById('confirmCancelar');
=======
    // ==================================================
    // BOTÓN CONTINUAR
    // ==================================================
    btnContinuar.addEventListener("click", function() {
        if (seleccionados.length === 0) {
            alert("Selecciona al menos un asiento");
            return;
        }
>>>>>>> 95047ec8a3275d436320350ec63f6ba005f9768c

    btnContinuar.addEventListener('click', () => {
        if (seleccionados.length === 0) return alert('Selecciona al menos un asiento');

        listaAsientosElem.innerHTML = '';
        seleccionados.forEach(s => {
            const li = document.createElement('li');
            li.textContent = s;
            listaAsientosElem.appendChild(li);
        });

        const precioTotal = seleccionados.length * precioUnit;
        precioElem.textContent = `S/${Number(precioTotal).toFixed(2)}`;

        modalConfirmar.dataset.payload = JSON.stringify({
            asientos: seleccionados,
            precio_total: precioTotal,
            id_bus: currentBusID,
            id_horario: currentHorarioID
        });

        modalConfirmar.style.display = 'block';
    });

    btnConfirmCancelar.addEventListener('click', () => {
        modalConfirmar.style.display = 'none';
    });

    // When user confirms in the confirmation modal, open the payment modal instead of sending directly
    btnConfirmEnviar.addEventListener('click', () => {
        // open payment modal and pass payload
        let payload = {};
        try { payload = JSON.parse(modalConfirmar.dataset.payload || '{}'); } catch(e){ payload = {}; }

        // show payment modal
        totalPagoElem.textContent = `S/${Number(payload.precio_total || 0).toFixed(2)}`;
        modalPago.dataset.payload = JSON.stringify(payload);
        modalConfirmar.style.display = 'none';
        modalPago.style.display = 'block';
    });

    // result modal handlers
    (function() {
        var modal = document.getElementById('modalConfirmReserva');
        if (!modal) return;
        var btnCerrar = document.getElementById('modalConfirmCerrar');
        var btnVer = document.getElementById('modalConfirmVer');
        if (btnCerrar) btnCerrar.addEventListener('click', () => modal.style.display = 'none');
        if (btnVer) btnVer.addEventListener('click', () => window.location.href = 'Vista_Cliente.php');
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.style.display = 'none'; });
    })();

    function showReservationModal(message, success, data) {
        var modal = document.getElementById('modalConfirmReserva');
        var msg = document.getElementById('modalConfirmMensaje');
        var title = document.getElementById('modalConfirmTitulo');
        msg.textContent = message;
        title.textContent = success ? 'Reserva exitosa' : 'Error en la reserva';
        modal.style.display = 'block';
    }

    // -------------- Modal de pago (botón confirmar reserva dentro modalPago) --------------
    const modalPago = document.getElementById('modalPago');
    const totalPagoElem = document.getElementById('totalPago');
    const metodoPagoSelect = document.getElementById('metodoPago');
    const confirmarPagoBtn = document.getElementById('confirmarPago');

    confirmarPagoBtn && confirmarPagoBtn.addEventListener('click', async () => {
        const metodo = metodoPagoSelect.value;
        let payload = {};
        try { payload = JSON.parse(modalPago.dataset.payload || '{}'); } catch(e){ payload = {}; }
        // attach payment method
        payload.metodo_pago = metodo;

        try {
            const resp = await fetch('../backend/controllers/reserva.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });
            const data = await resp.json();
            if (data.success) {
                // mark seats as sold in UI using payload.asientos
                (payload.asientos || []).forEach(n => {
                    const el = document.querySelector(`#modulo-asientos .asiento[data-num="${n}"]`);
                    if (el) {
                        el.classList.remove('seleccionado');
                        el.classList.add('vendido');
                    }
                });
                // clear selection and update
                seleccionados = [];
                actualizarUI();
                modalPago.style.display = 'none';
                modulo.style.display = 'none';
                showReservationModal(data.message || 'Reserva y pago completados', true, data);
            } else {
                showReservationModal(data.message || 'Error al crear reserva', false, data);
            }
        } catch (err) {
            console.error(err);
            alert('Error de red al procesar pago');
        }
    });

    // abrir modalPago (ejemplo) - si quieres que CONTINUAR abra directamente modalPago, lo puedes llamar
    // aquí dejamos el flujo: CONTINUAR -> modalConfirmar -> confirmar -> registra -> modalPago opcional
});
