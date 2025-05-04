let seleccion = [];
let indicePregunta = 0;
let marcador = 0;

async function cargarXML() {
  const response = await fetch('./assets/quiz.xml');
  const text = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");

  // Acceder a las preguntas dentro de <Cuestionario>
   const preguntas = Array.from(xmlDoc.getElementsByTagName("Pregunta")).map(p => ({
      enunciado: p.getElementsByTagName("Enunciado")[0].textContent,
      opcion1: p.getElementsByTagName("Opcion1")[0].textContent,
      opcion2: p.getElementsByTagName("Opcion2")[0].textContent,
      opcion3: p.getElementsByTagName("Opcion3")[0].textContent,
      respuestaCorrecta: p.getElementsByTagName("RespuestaCorrecta")[0].textContent
  }));

  seleccion =obtenerPreguntasAleatorias(preguntas);
  mostrarPregunta();
}

//mostramos la pregunta
function mostrarPregunta() {
  if (indicePregunta >= seleccion.length) {
    document.getElementById("pregunta-container").innerHTML = `<h2>Juego terminado! Puntos obtenidos: ${marcador}</h2>`;
    let respuestaDiv= document.getElementById("respuesta");
    respuestaDiv.style.display = "block";
    if(marcador===150){
      respuestaDiv.innerHTML=`Eres un autentico profesional`;
      respuestaDiv.style.color= "whitesmoke";
    }else if(marcador<150 && marcador>100 ){
      respuestaDiv.innerHTML=`Eres un friki de videojuegos`;
      respuestaDiv.style.color= "whitesmoke";
    } else if (marcador<100 && marcador>50) {
      respuestaDiv.innerHTML=`Bueno anda, lo importante es participar`;
      respuestaDiv.style.color= "whitesmoke";
    }else{
      respuestaDiv.innerHTML=`No se que haces en informática, si lo haces a posta no te sale tan mal.`;
      respuestaDiv.style.color= "whitesmoke";
    }
   
      return;
  }

  const preguntaActual = seleccion[indicePregunta];
  let opcionesHTML = "";

  // Crear botones con las opciones correctamente referenciadas
  [preguntaActual.opcion1, preguntaActual.opcion2, preguntaActual.opcion3].forEach(opcion => {
      opcionesHTML += `<button onclick="verificarRespuesta('${opcion}')">${opcion}</button><br>`;
  });

  document.getElementById("pregunta-container").innerHTML = `
      <h3>${preguntaActual.enunciado}</h3>
      ${opcionesHTML}
  `;
}

function verificarRespuesta(respuestaSeleccionada) {
  const preguntaActual = seleccion[indicePregunta];
  let respuestaDiv= document.getElementById("respuesta");
  if (respuestaSeleccionada === preguntaActual.respuestaCorrecta) {
      marcador += 10;
      respuestaDiv.innerHTML=`¡Correcto! Has ganado 10 puntos.`;
      respuestaDiv.style.color= "whitesmoke";
  } else {
    respuestaDiv.innerHTML=`Incorrecto. La respuesta correcta es:  ${preguntaActual.respuestaCorrecta}`;
    respuestaDiv.style.color= "crimson";
  }

    respuestaDiv.style.display = "block";
    setTimeout(() => {
        respuestaDiv.style.display = "none";
        cargarSiguientePregunta();
    }, 2000); // 2 segundos

}

//cargar siguiente pregunta
function cargarSiguientePregunta() {
  indicePregunta++;
  mostrarPregunta();
}
// Función para seleccionar 15 preguntas aleatorias
function obtenerPreguntasAleatorias(preguntas) {
  return preguntas.sort(() => Math.random() - 0.5).slice(0, 15);
}

//cargar xml al cargar la ventana
window.onload = cargarXML;


