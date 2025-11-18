document.querySelector(".buscar").addEventListener("click", function (e) {

  const origen = document.getElementById("origen").value.trim();
  const destino = document.getElementById("destino").value.trim();
  const salida = document.getElementById("salida").value.trim();
  const retorno = document.getElementById("retorno").value.trim();

  if (origen === "") {
    alert("Por favor ingrese el lugar de origen.");
    e.preventDefault();
    return;
  }

  if (destino === "") {
    alert("Por favor ingrese el lugar de destino.");
    e.preventDefault();
    return;
  }

  if (salida === "") {
    alert("Seleccione una fecha de salida.");
    e.preventDefault();
    return;
  }

  if (retorno === "") {
    alert("Seleccione una fecha de retorno.");
    e.preventDefault();
    return;
  }
});

const fechaSalida = document.getElementById("salida");
const fechaRetorno = document.getElementById("retorno");

// Cuando cambie la fecha de salida
fechaSalida.addEventListener("change", () => {
  fechaRetorno.min = fechaSalida.value;
});

// Cuando cambie la fecha de retorno
fechaRetorno.addEventListener("change", () => {
  if (fechaRetorno.value < fechaSalida.value) {
    alert("La fecha de retorno no puede ser menor que la fecha de salida.");
    fechaRetorno.value = ""; // Borra retorno
  }
});