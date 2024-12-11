// Referencias a los elementos del DOM(Document Object Model) || elemntos para interactuar con los de la pagina web 
const btnValidate = document.getElementById('checkStringButton');
const resultDiv = document.getElementById('stringResult');
const buildAutomatonButton = document.getElementById('buildAutomataButton');


// Validar el lenguaje
document.getElementById("validateButton").addEventListener("click", () => {// es el evento de cuando se da click  (validar lenguaje)
    const lenguaje = document.getElementById("languageInput").value.trim();// obtiene el campo del lenguaje de entrada
    if (lenguaje === "") {
        alert("Por favor, ingresa un lenguaje.");
        return;
    }

    const resultado = esRegular(lenguaje);// llama la funcion esRegular para verificar si es irregular o no 

    //busca el dom y muestra en la pagina el resultado
    const validationResult = document.getElementById("validationResult");
    validationResult.innerHTML = `<p>El lenguaje es: ${resultado}</p>`;


    // dependeinedo del resultado da la posibidad de crear el automara o da una alerta de que es regular 
    if (resultado === "No Regular") {
        document.getElementById("automataInputs").classList.remove("hidden");
        document.getElementById("automataSection").classList.add("hidden");
    } else {
        document.getElementById("automataInputs").classList.add("hidden");
        document.getElementById("automataSection").classList.add("hidden");
        alert("El lenguaje es regular. No se puede construir un autómata de pila.");
    }

    document.getElementById("resetButton").classList.remove("hidden"); // boton para ingresar otro lenuaje e caso de el usuario lo necesite
    document.getElementById("validateButton").disabled = true;
    document.getElementById("languageInput").disabled = true;
});

// Funcionalidad delk boton reiniciar
document.getElementById("resetButton").addEventListener("click", () => {
    document.getElementById("languageInput").value = "";
    document.getElementById("validationResult").innerHTML = "";
    document.getElementById("automataInputs").classList.add("hidden");
    document.getElementById("automataSection").classList.add("hidden");
    document.getElementById("transitionTable").classList.add("hidden");

    document.getElementById("validateButton").disabled = false;
    document.getElementById("languageInput").disabled = false;
    document.getElementById("resetButton").classList.add("hidden");
});


// Verificación de lenguajes no regulares. codigo dani
function vj(lenguaje) {
    console.log("\n** Comprobando dependencias jerárquicas...");

    // Patrones comunes
    if (
    	lenguaje.includes("0^n 1^n") ||
        lenguaje.includes("a^n b^n") || 
        lenguaje.includes("a^n b^m c^n") ||
        lenguaje.includes("cadenas duplicadas") || 
        lenguaje.includes("palíndromo") || 
        lenguaje.includes("balanceo") ||
        lenguaje.includes("dependencia entre símbolos")
    ) {
        console.log("El lenguaje presenta dependencia jerárquica. No es regular.");
        return "No Regular";
    }

    // Otros patrones explícitos 
    const jerarquicos = [
    	/ab,aabb,aaabbb,aaaabbbb/, //ejemplo explícito 
        /^a\^n b\^n$/,    // Igualdad entre símbolos
        /^a\^n b\^m c\^n$/, // Dependencia parcial entre símbolos
        /^w donde w = reverso\(w\)$/, // Palíndromo
        /^a\^p$/,          // Números primos
        /^ww$/,            // Cadenas duplicadas
    ];

    for (const regex of jerarquicos) {
        if (regex.test(lenguaje)) {
            console.log("El lenguaje cumple con un patrón jerárquico (dependencia estructural). No es regular.");
            return "No Regular";
        }
    }

    console.log("No se identificaron dependencias jerárquicas.");
    return false;
}


// Función para determinar si el lenguaje es regular. fucion de dos codigos de dani (esRegular y bombeo)
function esRegular(lenguaje) {
    console.log("\n** Comprobando regularidad...");
    
    if (lenguaje == "{#}") {
    	console.log("");
    	return true;   
    }

    // 1: Lenguaje infinito
    if (lenguaje.includes("infinito")) {
        console.log("El lenguaje es infinito, por lo tanto es regular.");
        return "Es regular";
    }

    // 2: Unión o concatenación lenguajes regulares
    if (lenguaje.includes("unión") || lenguaje.includes("concatenación")) {
        console.log("El lenguaje es una unión o concatenación de lenguajes regulares, por lo tanto es regular.");
        return "Es regular";
    }

    // 3: Cerradura de Kleene
    if (lenguaje.includes("*")) {
        console.log("El lenguaje es la cerradura de Kleene de otro lenguaje, por lo tanto es regular.");
        return "Es regular";
    }
    // teorema de bombeo para ver si es irregular
    if (lenguaje.includes("0^n 1^n")) {
        console.log("El lenguaje 0^n 1^n no cumple con el lema de bombeo y no es regular.");
        return "No Regular";
    }

    // Caso de ejemplo: Lenguaje con igualdad de a^n b^n
    if (lenguaje.includes("a^n b^n")) {
        console.log("El lenguaje a^n b^n no cumple con el lema de bombeo y no es regular.");
        return "No Regular";
    }

    // Verificar si tiene dependencia jerárquica
    return !vj(lenguaje);
}

// Evento para construir el autómata
document.getElementById("buildAutomataButton").addEventListener("click", () => {// es el evento de cuando se da click (construir automata)
    //campos del automata por su definicion:conjunto de estados, alfabeto de entrada, alfabeto de la pila, estados de transicion, estado inicial y simbolo inicial de la pila no se pide porque simpre es z
    states = document.getElementById('statesInput').value.split(',');
    alphabet = document.getElementById('alphabetInput').value.split(',');
    stackAlphabet = document.getElementById('stackAlphabetInput').value.split(',');
    transitions = parseTransitions(document.getElementById('transitionFunctionInput').value);
    initialState = document.getElementById('initialStateInput').value.trim();
    acceptStates = document.getElementById('finalStatesInput').value.split(',');

    if (!states.includes(initialState)) {
        alert("El estado inicial debe estar en el conjunto de estados.");
        return;
    }

    if (!acceptStates.every(state => states.includes(state))) {
        alert("Todos los estados finales deben estar en el conjunto de estados.");
        return;
    }

    automaton = { states, alphabet, stackAlphabet, transitions, initialState, acceptStates };
    buildGraph();// construccion del automata graficamente
    document.getElementById('automataSection').classList.remove('hidden');
    document.getElementById('automataHidden').classList.remove('hidden');
});




// Función para procesar las transiciones
function parseTransitions(transitionString) {// es el evento de cuando se da click  (comprobar cadena)
    if (!transitionString || typeof transitionString !== 'string') {// valida que la cadena si exista y sea string
        console.error('Error: Las transiciones no están definidas o no tienen el formato correcto.');
        return {};
    }
 
    const transitions = {};// aca se guardan las tranciciones que se procesan 
    const transitionsArray = transitionString.split('\n'); // convierte la entrada donde cada linea es una transicion 
    transitionsArray.forEach((transition, index) => {// recorre cada linea del arratcon un foreach
        if (!transition.includes('->')) {
            console.error(`Transición inválida en la línea ${index + 1}: ${transition}`);
            return;
        }

        const [left, right] = transition.split('->');
        const [state, input, stackTop] = left.split(',').map(s => s.trim());//Contiene el estado actual, el símbolo de entrada y el tope de la pila. || .map es para elimanar espacios en blanco innecesarios
        const [nextState, stackAction] = right.split(',').map(s => s.trim());//Contiene el siguiente estado y la acción sobre la pila.

        if (!transitions[state]) {
            transitions[state] = [];
        }

        transitions[state].push({
            input: input,
            stackTop: stackTop === 'ε' ? '' : stackTop, // Manejo de ε como cadena vacía
            stackAction: stackAction === 'ε' ? '' : stackAction, // Manejo de ε como cadena vacía
            nextState: nextState
        });
    });

    console.log('Transiciones procesadas:', transitions);
    return transitions;
}





// Función para construir y mostrar el grafo del autómata
function buildGraph() {
    const elements = [];

    // Nodos
    states.forEach(state => {
        let classes = '';
        if (acceptStates.includes(state)) {
            classes += 'final ';
        }
        if (state === initialState) {
            classes += 'initial ';
        }
        elements.push({
            data: { id: state, label: state },
            classes: classes.trim()
        });
    });

    // Transiciones
    for (const [currentState, transArray] of Object.entries(transitions)) {
        if (Array.isArray(transArray)) {
            transArray.forEach(({ input, stackTop, stackAction, nextState }) => {
                const displayInput = input === '' ? 'ε' : input;
                const displayStackTop = stackTop === '' ? 'ε' : stackTop;
                const displayStackAction = stackAction === '' ? 'ε' : stackAction;
                const label = `${displayInput}, ${displayStackTop}, ${displayStackAction}`;
                // Verificar que los nodos fuente y destino existan
                if (!states.includes(currentState) || !states.includes(nextState)) {
                    console.error(`Error: El nodo fuente (${currentState}) o destino (${nextState}) no existe.`);
                    return;
                }
                elements.push({
                    data: {
                        id: `${currentState}-${label}-${nextState}`,
                        source: currentState,
                        target: nextState,
                        label
                    }
                });
            });
        } else {
            console.error(`Transiciones de ${currentState} no son un arreglo:`, transArray);
        }
    }

    // Mostrar el grafo con Cytoscape
    cytoscape({
        container: document.getElementById('cy'),
        elements,
        style: [
            { 
                selector: 'node', 
                style: { 
                    label: 'data(label)', 
                    'text-valign': 'center', 
                    'text-halign': 'center',
                    'background-color': '#666', 
                    'color': '#fff',
                    'font-size': '12px',
                    'text-outline-width': 2,
                    'text-outline-color': '#666'
                } 
            },
            { 
                selector: 'edge', 
                style: { 
                    'curve-style': 'bezier', 
                    'target-arrow-shape': 'triangle', 
                    'label': 'data(label)',
                    'font-size': '10px',
                    'text-rotation': 'autorotate',
                    'text-margin-y': -10
                } 
            },
            { 
                selector: '.final', 
                style: { 
                    'background-color': '#f00', 
                    'shape': 'ellipse', 
                    'border-width': 2, 
                    'border-color': '#f00' 
                } 
            },
            { 
                selector: '.initial', 
                style: { 
                    'background-color': '#0f0', 
                    'border-width': 2, 
                    'border-color': '#0f0' 
                } 
            }
        ],
        layout: { name: 'circle' }
    });
}

// Función para actualizar la visualización de la pila
function updateStackDisplay(stack) {
    const stackContainer = document.getElementById('stack');
    stackContainer.innerHTML = '';// limpia el html

    stack.slice().forEach(symbol => {
        //modifica el html
        const stackElement = document.createElement('div');
        stackElement.className = 'stack-element';
        stackElement.textContent = symbol;
        stackContainer.appendChild(stackElement);
    });
}

// Función para mostrar los pasos de verificación y actualizar la pila
function verifyString(inputString) {
    let stack = ['z'];  // Asegurarnos de que la pila siempre empiece con z
    let currentState = initialState;// es el estado acutal del automata que al crearce va a ser el estado inicial 
    const stepsContainer = document.getElementById('verificationSteps');
    stepsContainer.innerHTML = '';

    console.log('Verificando cadena:', inputString);
    console.log('Estado inicial:', currentState, 'Pila inicial:', stack);

    for (let symbol of inputString) {// recoore la cadena de entrada a analizar
        if (!alphabet.includes(symbol)) {//verifica que este en el alfabeto permitido
            return `Símbolo no válido: ${symbol}`;
        }

        //se obtinenn transiciones que cuplen con dos condiciones:1.El símbolo de entrada debe coincidir con el símbolo procesado y 2.El símbolo en la parte superior de la pila (si es diferente de 'ε') debe coincidir con el stackTop de la transición.

        let validTransitions = transitions[currentState]?.filter(t => t.input === symbol && (t.stackTop === '' || t.stackTop === stack[stack.length - 1]));

        console.log(`Transiciones válidas para estado ${currentState}, símbolo ${symbol}, top pila ${stack[stack.length - 1]}:`, validTransitions);

        if (!validTransitions || validTransitions.length === 0) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error';
            errorElement.textContent = `No hay transiciones válidas desde el estado ${currentState} con el símbolo ${symbol}.`;
            stepsContainer.appendChild(errorElement);
            return `No hay transiciones válidas desde el estado ${currentState} con el símbolo ${symbol}.`;
        }

        let transition = validTransitions[0];

        // Mostrar el paso actual en el html
        const stepElement = document.createElement('div');
        stepElement.className = 'step';
        stepElement.innerHTML = `
            <strong>Estado:</strong> ${currentState} <br>
            <strong>Símbolo:</strong> ${symbol} <br>
            <strong>Pila antes:</strong> ${stack.join('')} <br>
            <strong>Acción:</strong> ${transition.stackAction} <br>
            <strong>Pila después:</strong> ${
                (transition.stackTop !== '' ? stack.slice(0, -1) : stack).concat(transition.stackAction.split('')).join('') // convierte la pila en un string para mostrarlo 
            }
        `;
        stepsContainer.appendChild(stepElement);

        // Realizar la transición
        if (transition.stackTop !== '') {
            stack.pop();
        }
        if (transition.stackAction !== '') {
            stack.push(...transition.stackAction.split(''));
        }

        console.log('Aplicando transición:', transition);
        console.log('Nuevo estado:', transition.nextState, 'Pila:', stack);

        // Actualizar la pila en el DOM
        updateStackDisplay(stack);

        // Asegurarse de cambiar al nuevo estado incluso si es el mismo
        currentState = transition.nextState;
    }

    // Comprobar si se acepta la cadena y si la pila termina con z
    if (acceptStates.includes(currentState) && stack.length === 1 && stack[0] === 'z') {
        const successElement = document.createElement('div');
        successElement.className = 'accepted';
        successElement.textContent = 'Cadena aceptada.';
        stepsContainer.appendChild(successElement);
        console.log('Cadena aceptada.');
        return 'Cadena aceptada.';
    } else {
        const failureElement = document.createElement('div');
        failureElement.className = 'rejected';
        failureElement.textContent = 'Cadena rechazada.';
        stepsContainer.appendChild(failureElement);
        console.log('Cadena rechazada.');
        return 'Cadena rechazada.';
    }
    
}

// Evento para validar la cadena ingresada
btnValidate.addEventListener('click', () => {
    const inputString = document.getElementById('stringInput').value;
    const result = verifyString(inputString);
    resultDiv.textContent = result;
    document.getElementById('stackContainer').classList.remove('hidden');
    document.getElementById('verificationStepsContainer').classList.remove('hidden');
});
