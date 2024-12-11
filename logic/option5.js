$(document).ready(() => {
    // Función para verificar si una cadena es aceptada por una expresión regular
    function isStringAccepted(regexString, testString) {
        try {
            // Crear una expresión regular a partir del string ingresado
            const regex = new RegExp(`^${regexString}$`); // Asegurarse de que coincida toda la cadena
            return regex.test(testString); // Verificar si la cadena cumple con el lenguaje
        } catch (error) {
            console.error("Error en la expresión regular:", error);
            return false;
        }
    }

    function generateTape(testChar) {
        const tape = $("#tape");
        tape.empty(); // Limpiar el contenido existente en el tape
        const arrayChar = testChar.split("");
        arrayChar.forEach((char, index) => {
            const div = document.createElement('div');
            div.textContent = char; // Asignar el contenido del carácter
            div.classList.add("celda"); // Añadir la clase "celda" al div
            div.id = `char-${index}`; // Asignar un id único basado en el índice
            tape.append(div);
        });
    }

    $("#simulateButton").click(() => {
        const regexInput = $("#regexExpression").val(); // Obtener valor del input regex
        const testString = $("#stringInput").val(); // Obtener valor del input string

        generateTape(testString);

        const isAccepted = isStringAccepted(regexInput, testString);

        if (isAccepted) {
            acceptedString(testString) 
        } else {
            deniedString(testString)
        }
    });
});



function acceptedString(testString) {
    const array = testString.split("")
    for (let i = 0; i < array.length; i++) {
        setTimeout(()=>{$(`#char-${i}`).addClass("heading")},i*1000)
        setTimeout(()=>{$(`#char-${i}`).removeClass("heading")},(i*1000)+1000)
    }
    setTimeout(()=>{
        let k = 1
        for (let j = array.length; j > -1; j--) {
            setTimeout(()=>{$(`#char-${j}`).addClass("heading")},k*1000)
            setTimeout(()=>{$(`#char-${j}`).removeClass("heading")},(k*1000)+1000)
            k++
        }
    }, array.length*1000)
    $("#stateDisplay").text("La Cadena es aceptada")
}



function deniedString(testString) {
    const array = testString.split("")
    for (let i = 0; i < array.length; i++) {
        setTimeout(()=>{$(`#char-${i}`).addClass("heading")},i*1000)
        setTimeout(()=>{$(`#char-${i}`).removeClass("heading")},(i*1000)+1000)
    }
    setTimeout(()=>{
        let k = 1
        for (let j = array.length; j > 0; j--) {
            setTimeout(()=>{$(`#char-${j}`).addClass("heading")},k*1000)
            setTimeout(()=>{$(`#char-${j}`).removeClass("heading")},(k*1000)+1000)
            k++
            setTimeout(()=>{$(`#char-${0}`).addClass("denied")},(array.length*2*1000))
        }
    }, array.length*1000)
    $("#stateDisplay").text("La Cadena NO es aceptada")
}