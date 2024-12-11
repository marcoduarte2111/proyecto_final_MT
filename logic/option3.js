// Variables para almacenar el autómata
let states = [];
let transitions = [];
let initialState = "";
let acceptingStates = [];

// Agregar estado
document.getElementById("add-state").addEventListener("click", function () {
    const newState = document.getElementById("new-state").value.trim();
    if (newState && !states.includes(newState)) {
        states.push(newState);
        updateStateList();
        updateSelects();
    }
    document.getElementById("new-state").value = "";
});

// Agregar transición
document.getElementById("add-transition").addEventListener("click", function () {
    const fromState = document.getElementById("from-state").value;
    const symbol = document.getElementById("transition-symbol").value.trim();
    const toState = document.getElementById("to-state").value;

    if (fromState && symbol && toState) {
        transitions.push({ from: fromState, symbol: symbol, to: toState });
        updateTransitionList();
    }
    document.getElementById("transition-symbol").value = "";
});

// Actualizar lista de estados
function updateStateList() {
    const stateList = document.getElementById("state-list");
    stateList.innerHTML = "<strong>Estados:</strong><br>" + states.join(", ");
}

// Actualizar lista de transiciones
function updateTransitionList() {
    const transitionList = document.getElementById("transition-list");
    transitionList.innerHTML = "<strong>Transiciones:</strong><br>";
    transitions.forEach(t => {
        transitionList.innerHTML += `${t.from} --${t.symbol}--> ${t.to}<br>`;
    });
}

// Actualizar los select de origen y destino para transiciones
function updateSelects() {
    const fromSelect = document.getElementById("from-state");
    const toSelect = document.getElementById("to-state");

    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";
    states.forEach(state => {
        fromSelect.innerHTML += `<option value="${state}">${state}</option>`;
        toSelect.innerHTML += `<option value="${state}">${state}</option>`;
    });
}

// Obtener el autómata en forma de objeto
function getAutomaton() {
    return {
        states: states,
        alphabet: [...new Set(transitions.map(t => t.symbol))],
        initialState: initialState,
        acceptingStates: acceptingStates,
        transitions: transitions
    };
}

// Mostrar el autómata actual en gráfico
document.getElementById("show-automaton").addEventListener("click", function () {
    const automaton = getAutomaton();
    displayGraph(automaton, "graph"); // Mostrar el gráfico del autómata original

    // Limpiar la sección del autómata reducido y función de transición
    document.getElementById("reduced-graph").innerHTML = "";
    document.getElementById("reduced-transition-function").innerHTML = "";
    document.getElementById("reduction-msg").textContent = "";
});

// Función para visualizar el autómata como un gráfico usando DOT y Viz.js
function displayGraph(automaton, elementId) {
    let dot = 'digraph G {\nrankdir=LR;\nnode [shape=circle, fontname="Arial"];\n';

    // Nodo "invisible" para apuntar al inicial
    dot += `"" [shape=none];\n`;
    if (automaton.initialState) {
        dot += `"" -> "${automaton.initialState}" [label="inicio"];\n`;
    }

    // Marcar estados de aceptación con doble círculo
    automaton.acceptingStates.forEach(s => {
        dot += `"${s}" [peripheries=2];\n`;
    });

    // Añadir transiciones
    automaton.transitions.forEach(t => {
        dot += `"${t.from}" -> "${t.to}" [label="${t.symbol}"];\n`;
    });

    dot += '}';

    const viz = new Viz();
    viz.renderSVGElement(dot)
        .then(function (svgElement) {
            const graphDiv = document.getElementById(elementId);
            graphDiv.innerHTML = "";
            graphDiv.appendChild(svgElement);
        })
        .catch(console.error);
}

// Función para obtener estados alcanzables
function getReachableStates(automaton) {
    const reachable = new Set([automaton.initialState]);
    let changed = true;

    while (changed) {
        changed = false;
        automaton.transitions.forEach(({ from, to }) => {
            if (reachable.has(from) && !reachable.has(to)) {
                reachable.add(to);
                changed = true;
            }
        });
    }
    return Array.from(reachable);
}

// Fusión de estados equivalentes
function mergeEquivalentStates(automaton) {
    let partition = [
        automaton.acceptingStates,
        automaton.states.filter(s => !automaton.acceptingStates.includes(s))
    ];

    let newPartition;
    do {
        newPartition = [];
        for (const group of partition) {
            const subgroups = {};
            for (const state of group) {
                const key = automaton.alphabet
                    .map(symbol => {
                        const transition = automaton.transitions.find(t => t.from === state && t.symbol === symbol);
                        return transition ? partition.findIndex(g => g.includes(transition.to)) : -1;
                    })
                    .join(",");
                if (!subgroups[key]) subgroups[key] = [];
                subgroups[key].push(state);
            }
            newPartition.push(...Object.values(subgroups));
        }
    } while (newPartition.length !== partition.length && (partition = newPartition));

    const stateMap = {};
    partition.forEach((group, i) => group.forEach(state => (stateMap[state] = `q${i}`)));

    return {
        states: [...new Set(Object.values(stateMap))],
        alphabet: automaton.alphabet,
        initialState: stateMap[automaton.initialState],
        acceptingStates: partition
            .filter(group => group.some(s => automaton.acceptingStates.includes(s)))
            .flat()
            .map(s => stateMap[s]),
        transitions: automaton.transitions
            .map(({ from, symbol, to }) => ({
                from: stateMap[from],
                symbol,
                to: stateMap[to]
            }))
            .filter(
                (transition, index, self) =>
                    self.findIndex(
                        t =>
                            t.from === transition.from &&
                            t.symbol === transition.symbol &&
                            t.to === transition.to
                    ) === index
            )
    };
}

// Reducción completa del autómata
function reduceAutomaton(automaton) {
    const reachableStates = getReachableStates(automaton);
    const reachableTransitions = automaton.transitions.filter(({ from, to }) =>
        reachableStates.includes(from) && reachableStates.includes(to)
    );

    const reducedAutomaton = {
        states: reachableStates,
        alphabet: automaton.alphabet,
        initialState: automaton.initialState,
        acceptingStates: automaton.acceptingStates.filter(s => reachableStates.includes(s)),
        transitions: reachableTransitions
    };

    return mergeEquivalentStates(reducedAutomaton);
}

// Mostrar función de transición del autómata reducido
function displayReducedTransitionFunction(reducedAutomaton) {
    const container = document.getElementById("reduced-transition-function");
    container.innerHTML = ""; // Limpiar antes de actualizar

    if (reducedAutomaton.states.length === 0 || reducedAutomaton.alphabet.length === 0) {
        container.innerHTML = "<p>No hay información suficiente para mostrar la función de transición.</p>";
        return;
    }

    // Crear tabla
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Encabezado: Estado/Símbolos
    const headerRow = document.createElement("tr");
    const thEmpty = document.createElement("th");
    thEmpty.textContent = "Estado";
    headerRow.appendChild(thEmpty);

    reducedAutomaton.alphabet.forEach(sym => {
        const th = document.createElement("th");
        th.textContent = sym;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Cuerpo: Para cada estado, ver a dónde va con cada símbolo
    reducedAutomaton.states.forEach(state => {
        const row = document.createElement("tr");

        const stateCell = document.createElement("td");
        stateCell.textContent = state;
        row.appendChild(stateCell);

        reducedAutomaton.alphabet.forEach(sym => {
            const cell = document.createElement("td");
            const transition = reducedAutomaton.transitions.find(t => t.from === state && t.symbol === sym);
            cell.textContent = transition ? transition.to : "-"; // Mostrar "-" si no hay transición
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
}

// Mostrar autómata reducido
document.getElementById("reduce-automaton").addEventListener("click", function () {
    const original = getAutomaton();
    const reducedAutomaton = reduceAutomaton(original);
    displayGraph(reducedAutomaton, "reduced-graph");
    displayReducedTransitionFunction(reducedAutomaton);

    const msgElem = document.getElementById("reduction-msg");
    if (reducedAutomaton.states.length < original.states.length) {
        msgElem.textContent = "El autómata fue reducido correctamente.";
        msgElem.classList.add("reduced");
        msgElem.classList.remove("not-reduced");
    } else {
        msgElem.textContent = "El autómata ya estaba en su forma mínima.";
        msgElem.classList.add("not-reduced");
        msgElem.classList.remove("reduced");
    }
});

// Actualizar inicial y aceptaciones
document.getElementById("initial-state").addEventListener("change", function () {
    initialState = this.value.trim();
});

document.getElementById("accepting-states").addEventListener("change", function () {
    acceptingStates = this.value.trim().split(",").map(s => s.trim()).filter(s => s !== "");
});

// Inicialización
updateStateList();
updateSelects();