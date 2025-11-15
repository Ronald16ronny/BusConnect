// Seleccionamos todos los botones del menú lateral
const itemsMenu = document.querySelectorAll('.item_menu');

// Seleccionamos cada sección por ID
const seccionMiCuenta = document.getElementById('seccion_mi_cuenta');
const seccionMisViajes = document.getElementById('seccion_mis_viajes');
const seccionPromociones = document.getElementById('seccion_promociones');

// Función para ocultar todo
function ocultarTodo() {
    seccionMiCuenta.classList.add('oculto');
    seccionMisViajes.classList.add('oculto');
    seccionPromociones.classList.add('oculto');
}

// Función para quitar selección del menú
function limpiarSeleccionMenu() {
    itemsMenu.forEach(item => item.classList.remove('seleccionado'));
}

// Acciones por cada item del menú
itemsMenu.forEach((item, index) => {
    item.addEventListener('click', () => {

        // Limpiamos la selección
        limpiarSeleccionMenu();
        item.classList.add('seleccionado');

        // Ocultamos todo antes de mostrar algo
        ocultarTodo();

        // Mostramos la sección correspondiente
        if (index === 0) {
            seccionMiCuenta.classList.remove('oculto');
        } else if (index === 1) {
            seccionMisViajes.classList.remove('oculto');
        } else if (index === 2) {
            seccionPromociones.classList.remove('oculto');
        }
    });
});
