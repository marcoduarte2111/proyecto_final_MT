const standardCharacters = ['a', 'b', 'c', '1', '0', 'n', 'm', 'p', 'z', 'w', '(', ')', '{', '}', '#'];

        function addCharacter(char) {
            const input = document.getElementById('language-input');
            input.value += char;
        }

        function addExponent(exp) {
            const input = document.getElementById('language-input');
            const currentValue = input.value.trim();
            
            // Check if the last character is a standard character
            if (currentValue.length > 0 && standardCharacters.includes(currentValue.slice(-1))) {
                input.value += `^${exp} `;
            } else {
                alert('Debes ingresar un carácter estándar antes de agregar un exponente.');
            }
        }

        function clearInput() {
            const input = document.getElementById('language-input');
            input.value = '';
            $("#answer").val("")
        }

        document.getElementById('language-input').addEventListener('keydown', (event) => {
            if (event.key !== 'Backspace' && event.key !== 'Delete') {
                event.preventDefault();
            }
        });