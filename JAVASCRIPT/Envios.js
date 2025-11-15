  // JS básico: variables, constantes, arreglos, operadores, prompt/confirm/alert y manipulación del DOM
    const form = document.getElementById('formCotizar');
    const resultado = document.getElementById('resultado');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const origen = document.getElementById('origen').value.trim();
      const destino = document.getElementById('destino').value.trim();
      const peso = parseFloat(document.getElementById('peso').value) || 0;
      const largo = parseFloat(document.getElementById('largo').value) || 0;
      const ancho = parseFloat(document.getElementById('ancho').value) || 0;
      const alto = parseFloat(document.getElementById('alto').value) || 0;
      const tipo = document.getElementById('tipo').value;

      if (!origen || !destino) {
        alert('Por favor, completa Origen y Destino.');
        return;
      }

      // Solicitar distancia vía prompt para practicar entrada de datos
      let distancia = prompt('¿Cuántos km hay entre ' + origen + ' y ' + destino + '?', '100');
      distancia = parseFloat(distancia);
      if (isNaN(distancia) || distancia < 0) {
        alert('Distancia no válida. Intenta nuevamente.');
        return;
      }

      // Calculo sencillo de ejemplo (no real):
      // precio = base + (peso * 2) + (volumen_cm3 * 0.002) + (distancia * 0.1)
      // urgente suma 25% adicional
      const volumen = largo * ancho * alto; // cm3
      let precio = 8 + (peso * 2) + (volumen * 0.002) + (distancia * 0.1);
      if (tipo === 'urgente') precio *= 1.25;

      const confirmar = confirm('Estimado: S/ ' + precio.toFixed(2) + '\n¿Deseas ver el detalle en pantalla?');
      if (confirmar) {
        resultado.innerHTML = `
          <div class="detalle-precio">
            <h3>Resumen del envío</h3>
            <ul>
              <li><strong>Origen:</strong> ${origen}</li>
              <li><strong>Destino:</strong> ${destino}</li>
              <li><strong>Peso:</strong> ${peso} kg</li>
              <li><strong>Dimensiones:</strong> ${largo} x ${ancho} x ${alto} cm</li>
              <li><strong>Tipo:</strong> ${tipo}</li>
            </ul>
            <p class="precio">Total estimado: <span>S/ ${precio.toFixed(2)}</span></p>
          </div>
        `;
        resultado.classList.add('mostrar');
        resultado.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('Puedes ajustar los datos y recalcular cuando gustes.');
      }
    });

    // Seguimiento con pequeño arreglo de estados
    const estados = ['En agencia', 'En tránsito', 'En reparto', 'Entregado'];
    document.getElementById('btnRastrear').addEventListener('click', function () {
      let codigo = document.getElementById('codigoSeguimiento').value.trim();
      if (!codigo) {
        codigo = prompt('Ingresa tu código de seguimiento:');
      }
      if (!codigo) {
        alert('Debes ingresar un código.');
        return;
      }
      const idx = Math.floor(Math.random() * estados.length); // estructura de control y operadores
      alert('Código ' + codigo + ': ' + estados[idx]);
    });  
