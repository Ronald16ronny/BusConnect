document.addEventListener("DOMContentLoaded", () => {

    let precioBase = 0;
    let seleccionados = [];

    const modulo = document.getElementById("modulo-asientos");
    const cantidadSpan = document.getElementById("cantidadAsientos");
    const btnContinuar = document.getElementById("btnContinuar");

    // ==================================================
    // CLICK EN COMPRAR —> MOSTRAR MÓDULO
    // ==================================================
    document.addEventListener("click", (e) => {

        if (e.target.classList.contains("boton-comprar")) {

            const tarjeta = e.target.closest(".tarjeta");

            // OBTENER PRECIO REAL
            let txt = tarjeta.querySelector(".precio-actual").innerText;
            precioBase = parseFloat(txt.replace("S/ ", ""));

            // reset
            seleccionados = [];
            cantidadSpan.textContent = 0;
            btnContinuar.textContent = "CONTINUAR: S/0";

            // COLOCAR EL MÓDULO DEBAJO DE LA TARJETA
            tarjeta.insertAdjacentElement("afterend", modulo);
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
    document.querySelectorAll(".asiento").forEach(a => {
        a.addEventListener("click", () => {
            if (a.classList.contains("vendido")) return;

            if (a.classList.contains("seleccionado")) {
                a.classList.remove("seleccionado");
                seleccionados = seleccionados.filter(n => n !== a.textContent);
            } else {
                a.classList.add("seleccionado");
                seleccionados.push(a.textContent);
            }

            let total = seleccionados.length * precioBase;

            cantidadSpan.textContent = seleccionados.length;
            btnContinuar.textContent = `CONTINUAR: S/${total}`;
        });
    });

    // ==================================================
    // CAMBIO DE PISOS
    // ==================================================
    const tabs = document.querySelectorAll(".tab-piso");
    const piso1 = document.getElementById("piso1");
    const piso2 = document.getElementById("piso2");

    tabs.forEach(btn => {
        btn.addEventListener("click", () => {
            tabs.forEach(b => b.classList.remove("activo"));
            btn.classList.add("activo");

            if (btn.dataset.piso === "1") {
                piso1.style.display = "block";
                piso2.style.display = "none";
            } else {
                piso1.style.display = "none";
                piso2.style.display = "block";
            }
        });
    });

    // ==================================================
    // BOTÓN CONTINUAR
    // ==================================================
    btnContinuar.addEventListener("click", () => {
        if (seleccionados.length === 0) {
            alert("Selecciona al menos un asiento");
            return;
        }

        // Aquí va tu redirección real
        window.location.href = "Pago.html";
    });

});
