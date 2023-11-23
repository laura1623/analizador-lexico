/**
 * Función para analizar un código y generar tokens.
 */
function analizarCodigo() {
  var codigo = document.getElementById('codigo').value;
  var tokens = [];
  var lexema = "";
  var categoria = "";
  var estado = 0;
  var posicion = 0;

/**
   * Agrega un token al array de tokens.
   * @param {string} categoria - Categoría del token.
   */

  function agregarToken(categoria) {
    tokens.push({ lexema, categoria, posicion });
    lexema = "";
  }

 /**
   * Reporta un error en la consola.
   * @param {string} errorTipo - Tipo de error.
   * @param {number} posicion - Posición del error.
   */

  function reportarError(errorTipo, posicion) {
    console.error(`Error (${errorTipo}) en la posición ${posicion}`);
  }

                                                                                // Bucle principal para analizar el código

  for (var i = 0; i < codigo.length; i++) {
    var char = codigo[i];
    posicion++;

    switch (estado) {
      case 0:
        if (/\s/.test(char)) {

                                                                              // Ignorar espacios en blanco

        } else if (/[a-zA-Z_]/.test(char)) {
          lexema += char;
          estado = 1;
        } else if (char === '/' && i + 1 < codigo.length && codigo[i + 1] === '/') {
          if (i + 2 < codigo.length && (/\s/.test(codigo[i + 2]) && /\d/.test(codigo[i + 3]))) {
            lexema += "//";
            agregarToken("operador de aritmetico");                            // verificar si en el espacio hay un operador aritmetico
            i += 2;
          } else if (i + 2 < codigo.length && (/\s/.test(codigo[i + 2]) || /[a-zA-Z]/.test(codigo[i + 2]))) {
            lexema += "//";
            agregarToken("simbolo de comentario de linea");                   // verificar si en el espacio hay un comentario
            i++;
            while (i + 1 < codigo.length && codigo[i + 1] !== '\n') {
              lexema += codigo[++i];
            }
            agregarToken("contenido del comentario");                        // verificar el contenido
          }
        } else if (char === ';' || char === '|' || char === '&') {          //verificar caracteres especiales
          lexema += char;
          if (char === '|' || char === '&') {
            if (i + 1 < codigo.length && codigo[i + 1] === char) {
              lexema += codigo[i + 1];
              i++;
            }
          }
          agregarToken(obtenerCategoria(lexema));
        } else if (/[\+\-\*\/\:\=\(\)\<\>\,\0-9\{\}]/.test(char)) {       //separar caracteres 
          lexema += char;
          agregarToken(obtenerCategoria(lexema));
        } else {
          lexema += char;
          reportarError("No reconocido", posicion);
        }
        break;

      case 1:
        if (/[a-zA-Z_\d]/.test(char)) {
          lexema += char;
        } else {
          agregarToken(obtenerCategoria(lexema));
         
          i--;                                                              // Retroceder un caracter para reevaluar en el próximo ciclo
          estado = 0;
        }
        break;

      default:
        break;
    }
  }

                                                                            // Manejo de estado final

  if (estado === 1) {
    agregarToken(obtenerCategoria(lexema));
  }

  mostrarResultados(tokens);  
}
  
/**
 * Obtiene la categoría de un lexema.
 * @param {string} lexema - Lexema a categorizar.
 * @returns {string} - Categoría del lexema.
 */

function obtenerCategoria(lexema) {
  if (lexema== "for" ||lexema== "while" ||lexema=="do-while") {
    return "Palabra reservada para ciclos";
  } else if (lexema== "if" ||lexema== "else if" ||lexema=="switch"||lexema=="else") {
    return "Palabra reservada para desicion";
  }else if (lexema === "String" || lexema === "int" || lexema === "fun" || lexema === "class" || lexema === "count" || lexema === "double"|| lexema === "float"|| lexema === "char"|| lexema === "Boolean"|| lexema === "array"|| lexema === "list"|| lexema === "set"|| lexema === "map"|| lexema === "println"|| lexema === "println"|| lexema === "enum") {
    return "Palabra reservada";    
  } else if (/^[\+\-\*\/\%\,\.]$/.test(lexema)) {
    return "operador aritmetico";
  } else if (/^\d+$/.test(lexema)) {
    return "entero";
  } else if (/^[\=\+=\-=\*=\/=\%=]$/.test(lexema)) {
    return "operador de asignacion";
  } else if (/^[\(\{\[\"]+$/.test(lexema)) {
    return "simbolos de abrir";
  } else if (/^[\)\}\]\"]+$/.test(lexema)) {
      return "simbolos de cerrar";
  } else if (/^[\==\!=\>\<\>=\<=]$/.test(lexema)) {
    return "operador relacional";
  } else if (/^[;]$/.test(lexema)) {
      return "terminal";
  } else if (/^(\&\&|\|\||\!)$/.test(lexema)) {
      return "Operador logico";
  } else if (/^[a-zA-Z_][a-zA-Z_\d]*$/.test(lexema)) {
      return "identificador";
  } else if (lexema== "//") {
      return "Comentario de linea";
  } else if (lexema== "/*" ||lexema== "*/") {
      return "Comentario de bloque";
  } else {
    return "no reconocido";
  }
}

/**
 * Muestra los resultados en una tabla HTML.
 * @param {Array} tokens - Array de tokens a mostrar.
 */

function mostrarResultados(tokens) {
  var tablaTokens = document.getElementById('tablaTokens').getElementsByTagName('tbody')[0];
  tablaTokens.innerHTML = "";

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    var fila = tablaTokens.insertRow(i);
    var celdaLexema = fila.insertCell(0);
    var celdaCategoria = fila.insertCell(1);
    var celdaPosicion = fila.insertCell(2);

    celdaLexema.innerHTML = token.lexema;
    celdaCategoria.innerHTML = token.categoria;
    celdaPosicion.innerHTML = token.posicion;
  }
}