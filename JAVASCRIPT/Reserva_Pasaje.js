document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // VARIABLES GLOBALES
    // ==================================================
    let precioUnit = 0;
    let seleccionados = [];
    let currentBusID = null;
    let currentHorarioID = null;

    // ELEMENTOS DEL DOM
    const modulo = document.getElementById("modulo-asientos");
    const cantidadSpan = document.getElementById("cantidadAsientos");
    const btnContinuar = document.getElementById("btnContinuar");
    const listaTarjetas = document.getElementById("listaTarjetas");
    const formBuscar = document.getElementById("formBuscar");

    // ==================================================
    // BUSCAR BUSES
    // ==================================================
    formBuscar.addEventListener("submit", async e => {
        e.preventDefault();
        const origen = formBuscar.origen.value.trim();
        const destino = formBuscar.destino.value.trim();
        const fecha = formBuscar.fecha.value;

        try {
            const res = await fetch(
                `../backend/controllers/buscar_buses.php?origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}&fecha=${encodeURIComponent(fecha)}`
            );

            if (!res.ok) throw new Error("Error en búsqueda");
            const data = await res.json();

            listaTarjetas.innerHTML = "";

            if (!Array.isArray(data) || data.length === 0) {
                listaTarjetas.innerHTML = "<p>No se encontraron buses para esos filtros.</p>";
                return;
            }

            data.forEach(bus => {
                listaTarjetas.insertAdjacentHTML("beforeend", cardBus(bus));
            });
        } catch (err) {
            console.error(err);
            listaTarjetas.innerHTML = "<p>Error al buscar buses.</p>";
        }
    });

    // ==================================================
    // TEMPLATE DE TARJETA BUS
    // ==================================================
    function cardBus(bus) {
        return `
        <article class="tarjeta"
            data-id-horario="${bus.id_horario}"
            data-id-bus="${bus.id_bus}"
            data-salida="${bus.fecha_salida}">
            
            <div class="contenido-tarjeta">
                <div>
                    <strong>Origen:</strong> ${escapeHtml(bus.origen)}
                </div>
                <div>
                    <strong>Destino:</strong> ${escapeHtml(bus.destino)}
                </div>
                <div>
                    <strong>Precio:</strong> 
                    <span class="precio-actual">S/${Number(bus.precio).toFixed(2)}</span>
                </div>

                <button class="boton-comprar">COMPRAR</button>
            </div>
        </article>`;
    }

    function escapeHtml(str){
        return String(str).replace(/[&<>"']/g, s => ({
            '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
        }[s]));
    }

    // ==================================================
    // CLICK EN COMPRAR
    // ==================================================
    document.addEventListener("click", async (e) => {
        const btn = e.target.closest(".boton-comprar");
        if (!btn) return;

        const card = btn.closest(".tarjeta");
        currentBusID = card.dataset.idBus;
        currentHorarioID = card.dataset.idHorario;

        // precio
        precioUnit = parseFloat(
            card.querySelector(".precio-actual").textContent.replace(/[^\d.]/g, "")
        );

        seleccionados = [];
        cantidadSpan.textContent = "0";
        btnContinuar.textContent = "CONTINUAR: S/0";

        // mostrar módulo
        card.insertAdjacentElement("afterend", modulo);
        modulo.style.display = "block";

        // limpiar
        document.querySelectorAll("#modulo-asientos .asiento")
            .forEach(a => a.classList.remove("vendido", "seleccionado"));

        // cargar asientos reales
        await loadSeatsForBus(currentBusID);

        // cargar asientos reservados
        await fetchReservedSeats(card.dataset.salida, currentHorarioID);
    });

    // ==================================================
    // FUNCIÓN: CARGAR ASIENTOS DEL BUS
    // ==================================================
    async function loadSeatsForBus(idBus){
        try {
            const resp = await fetch(`../backend/controllers/asientos_bus.php?id=${encodeURIComponent(idBus)}`);
            const seats = await resp.json();
            renderAsientos(seats);
        } catch (error) {
            console.error("Error loadSeatsForBus:", error);
        }
    }

    // ==================================================
    // FUNCIÓN: ASIENTOS RESERVADOS
    // ==================================================
    async function fetchReservedSeats(salida, idHorario){
        try {
            let url = `../backend/controllers/asientos_reservados.php?id_horario=${encodeURIComponent(idHorario)}`;
            const resp = await fetch(url);
            const data = await resp.json();

            if (data.success && Array.isArray(data.seats)) {
                const usados = new Set(data.seats.map(x => x.toString()));

                document.querySelectorAll("#modulo-asientos .asiento").forEach(a => {
                    const num = a.dataset.num;
                    if (usados.has(num)) {
                        a.classList.add("vendido");
                    }
                });
            }

        } catch (err) {
            console.error("Error fetchReservedSeats:", err);
        }
    }

    // ==================================================
    // PINTAR ASIENTOS EN EL DOM
    // ==================================================
    function renderAsientos(lista){
        const piso1 = document.getElementById("piso1");
        const piso2 = document.getElementById("piso2");

        piso1.innerHTML = "";
        piso2.innerHTML = "";

        lista.forEach(s => {
            const div = document.createElement("div");
            div.className = "asiento";
            div.dataset.num = s.numero_asiento;
            div.textContent = s.numero_asiento;

            if (s.estado == 1) div.classList.add("vendido");
            else div.classList.add("disponible");

            if (s.piso == 1) piso1.appendChild(div);
            else piso2.appendChild(div);
        });
    }

    // ==================================================
    // CLICK EN ASIENTO (SELECCIONAR)
    // ==================================================
    modulo.addEventListener("click", e => {
        const seat = e.target.closest(".asiento");
        if (!seat || seat.classList.contains("vendido")) return;

        const nro = seat.dataset.num;

        if (seat.classList.contains("seleccionado")){
            seat.classList.remove("seleccionado");
            seleccionados = seleccionados.filter(x => x !== nro);
        } else {
            seat.classList.add("seleccionado");
            seleccionados.push(nro);
        }

        actualizarPrecio();
    });

    function actualizarPrecio(){
        const total = (seleccionados.length * precioUnit).toFixed(2);
        cantidadSpan.textContent = seleccionados.length;
        btnContinuar.textContent = `CONTINUAR: S/${total}`;
    }

    // ==================================================
    // BOTÓN CONTINUAR
    // ==================================================
    btnContinuar.addEventListener("click", () => {
        if (seleccionados.length === 0) {
            alert("Selecciona al menos un asiento.");
            return;
        }

        const lista = document.querySelector("#confirmListaAsientos");
        const totalSpan = document.querySelector("#confirmPrecio");

        lista.innerHTML = "";
        seleccionados.forEach(s => lista.innerHTML += `<li>Asiento ${s}</li>`);

        const total = (seleccionados.length * precioUnit).toFixed(2);
        totalSpan.textContent = `S/${total}`;

        document.querySelector("#modalConfirmReserva").style.display = "block";
    });

});
