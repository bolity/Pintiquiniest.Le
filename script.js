const themeToggle = document.getElementById('theme-toggle');
const cuadrado = document.getElementById('cuadrado');
const titlee = document.getElementById('titlees');
const comprobate = document.getElementById('comprobarBtn');
const puntosElement = document.getElementById('puntos');
let isDarkTheme = false;
let lineaActual = 0;
let palabraSeleccionada = "";
let intentos = 0;

// Inicializa un Map para realizar un seguimiento de los intentos por palabra
const intentosPorPalabra = new Map();

let puntos = parseInt(localStorage.getItem('puntos')) || 0;
puntosElement.textContent = `Puntos: ${puntos}`;

function calcularPuntos(intentos) {
  if (intentos === 1) {
    return 100; // Otorgar 100 puntos si se adivina en el primer intento.
  } else if (intentos === 2) {
    return 50; // Otorgar 50 puntos si se adivina en el segundo intento.
  } else {
    return 25; // Otorgar 25 puntos para intentos posteriores.
  }
}

function actualizarPuntos(puntosGanados) {
  puntos += puntosGanados;
  localStorage.setItem('puntos', puntos);
  puntosElement.textContent = `Puntos: ${puntos}`;
}

function palabraAdivinada() {
  const intentosParaPalabra = intentosPorPalabra.get(palabraSeleccionada);
  const puntosGanados = calcularPuntos(intentosParaPalabra);
  actualizarPuntos(puntosGanados);
}

themeToggle.addEventListener('click', () => {
  isDarkTheme = !isDarkTheme;

  if (isDarkTheme) {
    document.body.classList.add('dark-theme');
    cuadrado.classList.add('dark-cuadrado');
    titlee.classList.add('dark-title');
    comprobate.classList.add('dark-comprobar');
    comprobate.classList.remove('comprobar', 'button');
  } else {
    document.body.classList.remove('dark-theme');
    cuadrado.classList.remove('dark-cuadrado');
    titlee.classList.remove('dark-title');
    comprobate.classList.remove('dark-comprobar');
    comprobate.classList.add('comprobar', 'button');
  }
});

const palabrasAdivinar = ["lameu", "labro", "chefa", "marta", "pinti", "mrpql", "luis", "chamo", "elmeu", "elbro", "enano", "bluef", "leo", "negro", "negra", "pablo", " guito", "luchi", "pablo", "mila", "puga", "brea", "marti", "masc", "ferni", "colmo", "chus", "luvi", "curi", "leo", "enero"];

// Obtén todos los cuadrados internos por línea
const lineas = document.querySelectorAll('.linea');
const cuadradosInternosPorLinea = Array.from(lineas).map(linea =>
  Array.from(linea.querySelectorAll('.cuadrado-interno'))
);

function habilitarLineaActual() {
  cuadradosInternosPorLinea[lineaActual].forEach(input => {
    input.removeAttribute('disabled');
  });

  // Deshabilita las líneas anteriores
  for (let i = 0; i < lineaActual; i++) {
    cuadradosInternosPorLinea[i].forEach(input => {
      input.setAttribute('disabled', 'true');
    });
  }

  // Deshabilita las líneas posteriores
  for (let i = lineaActual + 1; i < cuadradosInternosPorLinea.length; i++) {
    cuadradosInternosPorLinea[i].forEach(input => {
      input.setAttribute('disabled', 'true');
    });
  }
}

function comprobarPalabra() {
  const cuadradosArray = cuadradosInternosPorLinea[lineaActual];
  const palabraIngresada = cuadradosArray.map(input => input.value).join('');

  intentos++;

  for (let i = 0; i < cuadradosArray.length; i++) {
    const letraIngresada = palabraIngresada[i];
    const letraSeleccionada = palabraSeleccionada[i];
    const input = cuadradosArray[i];

    if (palabraIngresada === palabraSeleccionada) {
      palabraAdivinada();
    }

    if (letraIngresada === letraSeleccionada) {
      input.classList.remove('incorrecto');
      input.classList.remove('vacio');
      input.classList.add('correcto');
    } else if (letraSeleccionada && palabraSeleccionada.includes(letraIngresada)) {
      input.classList.remove('correcto');
      input.classList.remove('vacio');
      input.classList.add('incorrecto');
    } else {
      input.classList.remove('correcto');
      input.classList.remove('incorrecto');
      input.classList.add('vacio');
    }
  }
}

comprobate.addEventListener('click', () => {
  if (lineaActual === 0 && !palabraSeleccionada) {
    palabraSeleccionada = palabrasAdivinar[Math.floor(Math.random() * palabrasAdivinar.length)];
    intentos = 0; // Reinicia los intentos cuando se elige una nueva palabra
  }

  // Guarda el número de intentos para la palabra actual
  intentosPorPalabra.set(palabraSeleccionada, intentos);

  comprobarPalabra();

  if (lineaActual < cuadradosInternosPorLinea.length - 1) {
    lineaActual++;
    habilitarLineaActual();
  } else {
    // Deshabilita los cuadrados internos después de que todas las líneas hayan sido comprobadas
    cuadradosInternosPorLinea.forEach(cuadradosArray => {
      cuadradosArray.forEach(input => {
        input.setAttribute('disabled', 'true');
      });
    });
  }
});

cuadradosInternosPorLinea.forEach((cuadradosArray, lineaIndex) => {
  cuadradosArray.forEach((input, index) => {
    input.addEventListener('input', (event) => {
      const valorActual = event.target.value.trim();

      if (valorActual.length === 1) {
        if (index < cuadradosArray.length - 1) {
          cuadradosArray[index + 1].focus();
        } else if (lineaIndex < cuadradosInternosPorLinea.length - 1) {
          cuadradosInternosPorLinea[lineaIndex + 1][0].focus();
        }
      }
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace') {
        if (index > 0 && event.target.value.trim() === '') {
          cuadradosArray[index - 1].focus();
        }
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (lineaActual === 0 && !palabraSeleccionada) {
          palabraSeleccionada = palabrasAdivinar[Math.floor(Math.random() * palabrasAdivinar.length)];
          intentos = 0; // Reinicia los intentos cuando se elige una nueva palabra
        }
        comprobarPalabra();
        if (lineaActual < cuadradosInternosPorLinea.length - 1) {
          lineaActual++;
          habilitarLineaActual();
        }
      }
    });
  });
});

// Habilitar los text inputs de la primera línea al cargar la página
habilitarLineaActual();

// Recupera los puntos almacenados localmente al cargar la página
