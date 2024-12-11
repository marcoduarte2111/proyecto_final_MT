let automata = {};

// Validar el lenguaje
document.getElementById("validateButton").addEventListener("click", () => {
    resetFields();

    const lenguaje = document.getElementById("languageInput").value.trim();
    if (lenguaje === "") {
        alert("Por favor, ingresa un lenguaje.");
        return;
    }

    const resultado = validarLenguaje(lenguaje);

    const validationResult = document.getElementById("validationResult");
    validationResult.innerHTML = `<p>Resultado: ${resultado}</p>`;

    if (resultado.includes("REGULAR")) {
        document.getElementById("automataInputs").classList.remove("hidden");
        document.getElementById("automataSection").classList.add("hidden");
    } else {
        alert("El lenguaje no es regular. No se puede construir un autómata.");
        return;
    }

    document.getElementById("resetButton").classList.remove("hidden");
    document.getElementById("validateButton").disabled = true;
    document.getElementById("languageInput").disabled = true;
});

// Reiniciar la página y campos
document.getElementById("resetButton").addEventListener("click", () => {
    resetFields();
    document.getElementById("languageInput").value = "";
    document.getElementById("validationResult").innerHTML = "";

    document.getElementById("validateButton").disabled = false;
    document.getElementById("languageInput").disabled = false;
    document.getElementById("resetButton").classList.add("hidden");
});

// Función para reiniciar todos los campos
function resetFields() {
    document.getElementById("statesInput").value = "";
    document.getElementById("initialStateInput").value = "";
    document.getElementById("alphabetInput").value = "";
    document.getElementById("finalStatesInput").value = "";

    document.getElementById("automataInputs").classList.add("hidden");
    document.getElementById("transitionInputs").classList.add("hidden");
    document.getElementById("automataSection").classList.add("hidden");
    document.getElementById("transitionTable").classList.add("hidden");
    document.getElementById("verifySection").classList.add("hidden");

    const cyContainer = document.getElementById("cy");
    cyContainer.innerHTML = ""; // Limpia el grafo
}

// Validar si un lenguaje es regular
function validarLenguaje(lenguaje) {
    console.log("\n** Análisis del lenguaje ingresado:");
    console.log(`Lenguaje: "${lenguaje}"`);

    // Verificar si el lenguaje tiene caracteres válidos
    if (!CaraV(lenguaje)) {
        return "No Regular: contiene caracteres no válidos.";
    }

    // Verificar si el lenguaje es regular
    const regular = esRegular(lenguaje);

    if (regular) {
        return "REGULAR: El lenguaje es regular.";
    } else {
        return "No Regular: El lenguaje no es regular.";
    }
}

// Verificar si el lenguaje tiene caracteres válidos
function CaraV(lenguaje) {
    const regex = /^[0-1abcnmpzwA-Z^,()+?{}|#\\/.* ]+$/;
    return regex.test(lenguaje);
}

// Verificación de lenguajes no regulares (dependencias jerárquicas)
function vj(lenguaje) {
    console.log("\n** Comprobando dependencias jerárquicas...");

    const patronesNoRegulares = [
        "0^n 1^n",
        "a^n b^n",
        "a^n b^m c^n",
        "cadenas duplicadas",
        "palíndromo",
        "balanceo",
        "dependencia entre símbolos",
        "w donde w = reverso(w)",
        "w w", // cadenas duplicadas
    ];

    for (const patron of patronesNoRegulares) {
        if (lenguaje.includes(patron)) {
            console.log("El lenguaje presenta dependencia jerárquica. No es regular.");
            return true;
        }
    }

    console.log("No se identificaron dependencias jerárquicas.");
    return false;
}

// Función para aplicar el lema de bombeo
function Bombeo(lenguaje) {
    console.log("\n** Comprobando lema de bombeo...");

    const lenguajesNoRegulares = [
        "0^n 1^n",
        "a^n b^n",
        "a^n b^m c^n",
        "w w",
        "números primos",
    ];

    for (const caso of lenguajesNoRegulares) {
        if (lenguaje.includes(caso)) {
            console.log(`El lenguaje ${caso} no cumple con el lema de bombeo y no es regular.`);
            return false;
        }
    }

    console.log("El lenguaje parece pasar el lema de bombeo.");
    return true;
}

// Verificar si el lenguaje es regular
function esRegular(lenguaje) {
    console.log("\n** Comprobando regularidad...");

    if (lenguaje === "{#}") {
        console.log("El lenguaje es el lenguaje vacío. Es regular.");
        return true;
    }

    // 1: Lenguaje infinito
    if (lenguaje.includes("infinito")) {
        console.log("El lenguaje es infinito, por lo tanto es regular.");
        return true;
    }

    // 2: Unión o concatenación de lenguajes regulares
    if (lenguaje.includes("unión") || lenguaje.includes("concatenación") || lenguaje.includes("|")) {
        console.log("El lenguaje es una unión o concatenación de lenguajes regulares, por lo tanto es regular.");
        return true;
    }

    // 3: Cerradura de Kleene
    if (lenguaje.includes("*")) {
        console.log("El lenguaje es la cerradura de Kleene de otro lenguaje, por lo tanto es regular.");
        return true;
    }

    // 4: Aplicar verificación de dependencias jerárquicas
    if (vj(lenguaje)) {
        return false;
    }

    // 5: Aplicar lema de bombeo
    if (!Bombeo(lenguaje)) {
        return false;
    }

    // Si no se identificaron patrones no regulares, se asume regular
    console.log("El lenguaje es regular.");
    return true;
}

// Definir transiciones
document.getElementById("nextStepButton").addEventListener("click", () => {
    const estados = document.getElementById("statesInput").value.split(",");
    const alfabeto = document.getElementById("alphabetInput").value.split(",");
    alfabeto.push("#"); // Agregar vacío como símbolo posible

    const transitionForm = document.getElementById("transitionForm");
    transitionForm.innerHTML = ""; // Limpia cualquier formulario previo

    estados.forEach(estado => {
        alfabeto.forEach(simbolo => {
            const label = document.createElement("label");
            label.textContent = `Transición desde ${estado} con símbolo '${simbolo}':`;
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = `Estado destino para '${simbolo}'`;
            input.id = `transicion-${estado}-${simbolo}`;
            transitionForm.appendChild(label);
            transitionForm.appendChild(input);
            transitionForm.appendChild(document.createElement("br"));
        });
    });

    document.getElementById("transitionInputs").classList.remove("hidden");
});

// Construir el autómata
document.getElementById("buildAutomataButton").addEventListener("click", () => {
    const estados = document.getElementById("statesInput").value.split(",");
    const estadoInicial = document.getElementById("initialStateInput").value;
    const alfabeto = document.getElementById("alphabetInput").value.split(",");
    const estadosFinales = document.getElementById("finalStatesInput").value.split(",");

    alfabeto.push("#"); // Asegurar que el vacío esté incluido en el alfabeto

    const elements = [];
    const transiciones = {};

    // Crear los nodos del autómata
    estados.forEach(estado => {
        elements.push({
            data: { id: estado, label: estado },
            classes: estado === estadoInicial ? "inicio" : estadosFinales.includes(estado) ? "final" : "",
        });
        transiciones[estado] = {};
    });

    // Crear las transiciones del autómata
    estados.forEach(estado => {
        alfabeto.forEach(simbolo => {
            const inputId = `transicion-${estado}-${simbolo}`;
            const destino = document.getElementById(inputId).value.trim();

            if (destino && estados.includes(destino)) {
                if (!transiciones[estado][simbolo]) {
                    transiciones[estado][simbolo] = [];
                }
                transiciones[estado][simbolo].push(destino);

                elements.push({
                    data: {
                        id: `${estado}-${simbolo}-${destino}`,
                        source: estado,
                        target: destino,
                        label: simbolo === "#" ? "ε" : simbolo,
                    },
                });
            }
        });
    });

    // Renderizar el autómata con Cytoscape
    const cy = cytoscape({
        container: document.getElementById("cy"),
        elements: elements,
        style: [
            {
                selector: "node",
                style: {
                    label: "data(label)",
                    "background-color": "#666",
                    "text-outline-width": 2,
                    "text-outline-color": "#666",
                    color: "#fff",
                },
            },
            {
                selector: ".inicio",
                style: {
                    "background-color": "#0f0",
                },
            },
            {
                selector: ".final",
                style: {
                    "background-color": "#f00",
                },
            },
            {
                selector: "edge",
                style: {
                    "curve-style": "bezier",
                    "control-point-step-size": 40,
                    "target-arrow-shape": "triangle",
                    label: "data(label)",
                },
            },
        ],
        layout: { name: "circle" },
    });

    mostrarFuncionDeTransicion(transiciones);

    document.getElementById("automataSection").classList.remove("hidden");
    document.getElementById("verifySection").classList.remove("hidden");

    // Asociar la verificación de cadenas al botón de verificación
    document.getElementById("verifyButton").onclick = () =>
        verificarCadena(transiciones, estadosFinales, estadoInicial);
});

// Mostrar la tabla de transición
function mostrarFuncionDeTransicion(transiciones) {
    const tableBody = document.getElementById("transitionTableBody");
    tableBody.innerHTML = "";

    Object.entries(transiciones).forEach(([estado, trans]) => {
        Object.entries(trans).forEach(([simbolo, destinos]) => {
            destinos.forEach(destino => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${estado}</td><td>${simbolo === "#" ? "ε" : simbolo}</td><td>${destino}</td>`;
                tableBody.appendChild(row);
            });
        });
    });

    document.getElementById("transitionTable").classList.remove("hidden");
}

// Verificar una cadena
function verificarCadena(transiciones, estadosFinales, estadoInicial) {
    const cadena = document.getElementById("cadenaInput").value.split("");
    let estadoActual = estadoInicial;
    const pasos = [`Estado inicial: ${estadoActual}`];

    for (const simbolo of cadena) {
        if (transiciones[estadoActual] && transiciones[estadoActual][simbolo]) {
            estadoActual = transiciones[estadoActual][simbolo][0]; // Tomamos el primer destino
            pasos.push(`Con símbolo '${simbolo}' -> ${estadoActual}`);
        } else {
            pasos.push(`Error: No hay transición para '${simbolo}' desde ${estadoActual}`);
            actualizarTraza(pasos, false);
            return;
        }
    }

    const aceptada = estadosFinales.includes(estadoActual);
    pasos.push(
        aceptada
            ? `La cadena es aceptada. Estado final: ${estadoActual}`
            : `La cadena no es aceptada. Estado actual: ${estadoActual}`
    );

    actualizarTraza(pasos, aceptada);
}

// Actualizar la traza en la interfaz
function actualizarTraza(pasos, aceptada) {
    const trazaDiv = document.getElementById("traceOutput");
    trazaDiv.innerHTML = pasos.map(paso => `<p>${paso}</p>`).join("");
    trazaDiv.className = aceptada ? "accepted" : "rejected";
}