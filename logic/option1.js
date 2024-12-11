// const readline = require("readline");

// Entrada y salida
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// Verificación de lenguajes no regulares


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
        return true;
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
            return true;
        }
    }

    console.log("No se identificaron dependencias jerárquicas.");
    return false;
}

// Verificar si el lenguaje es regular
function esRegular(lenguaje) {
    console.log("\n** Comprobando regularidad...");
    
    if (lenguaje == "{#}") {
    	console.log("");
    	return true;   
    }

    // 1: Lenguaje infinito
    if (lenguaje.includes("infinito")) {
        console.log("El lenguaje es infinito, por lo tanto es regular.");
        return true;
    }

    // 2: Unión o concatenación lenguajes regulares
    if (lenguaje.includes("unión") || lenguaje.includes("concatenación")) {
        console.log("El lenguaje es una unión o concatenación de lenguajes regulares, por lo tanto es regular.");
        return true;
    }

    // 3: Cerradura de Kleene
    if (lenguaje.includes("*")) {
        console.log("El lenguaje es la cerradura de Kleene de otro lenguaje, por lo tanto es regular.");
        return true;
    }

    // Verificar si tiene dependencia jerárquica
    return !vj(lenguaje);
}

// Verificar si el lenguaje tiene caracteres válidos
function CaraV(lenguaje) {
    
    const regex = /^[0-1abcnmpzwA-Z^,()+?{}|#\\/.* ]+$/;
    return regex.test(lenguaje);
}

// Función para aplicar el lema de bombeo
function Bombeo(lenguaje) {
    console.log("\n** Comprobando lema de bombeo...");

    // Lenguajes no regulares como 0^n 1^n no cumplen con el lema de bombeo
    if (lenguaje.includes("0^n 1^n")) {
        console.log("El lenguaje 0^n 1^n no cumple con el lema de bombeo y no es regular.");
        return false;
    }

    // Caso de ejemplo: Lenguaje con igualdad de a^n b^n
    if (lenguaje.includes("a^n b^n")) {
        console.log("El lenguaje a^n b^n no cumple con el lema de bombeo y no es regular.");
        return false;
    }

    // Si no se detectan casos específicos, asumimos que pasa el lema de bombeo
    console.log("El lenguaje parece pasar el lema de bombeo.");
    return true;
}

// Función principal
function main() {
    // console.log("=== Verificador de Lenguajes Regulares ===\n");
    // rl.question("Ingrese una descripción del lenguaje (o expresión regular): ", (lenguaje) => {
        const lenguaje = $("#language-input").val()
        console.log(lenguaje)



        // Verificación de espacios vacíos
        if (lenguaje === "") {
            window.alert("Error: El lenguaje no puede estar vacío.");
            return;
        }

        // Verificación de caracteres no válidos
        if (!CaraV(lenguaje)) {
            window.alert("Error: El lenguaje contiene caracteres no válidos.");
            return;
        }

        
        setTimeout(() => $("#answer").val("Comprobando lema de bombeo..."), 500)

        setTimeout(() => $("#answer").val(`Lenguaje: "${lenguaje}"`), 2000)
        

        const regular = esRegular(lenguaje);
        setTimeout(()=>{
            if (regular) {
                $("#answer").val("Resultado: El lenguaje es REGULAR.");
            } else {
                $("#answer").val("Resultado: El lenguaje NO es REGULAR.");
            }
        },4000)
    }

