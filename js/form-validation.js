document.addEventListener('DOMContentLoaded', () => {
    const cardNumberInput = document.getElementById('card-number');
    const cardExpInput = document.getElementById('card-exp');

    // Format card number as "1111 2222 3333 4444"
    cardNumberInput.addEventListener('input', () => {
        let value = cardNumberInput.value.replace(/\D/g, ''); // Remove non-digits
        value = value.match(/.{1,4}/g)?.join(' ') || value; // Add spaces every 4 digits
        cardNumberInput.value = value;
    });

    // Format expiration date as "MM/YY"
    cardExpInput.addEventListener('input', () => {
        let value = cardExpInput.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4); // Add "/" after MM
        }
        cardExpInput.value = value.slice(0, 5); // Limit to "MM/YY"
    });

    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateInputs()) alert("Далі нізя");
    });

    document.querySelectorAll('[data-pattern]').forEach(input => {
        input.addEventListener('focusout', () => validateInput(input));
    });

    function validateInputs() {
        return Array.from(document.querySelectorAll('[data-pattern]'))
            .map(input => validateInput(input))
            .every(isValid => isValid);
    }

    function validateInput(input) {
        const pattern = new RegExp(input.dataset.pattern);
        const errorMessage = document.querySelector(`[data-msg-for="${input.id}"]`);
        const isValid = pattern.test(input.value.trim());
        errorMessage.classList.toggle('hidden', isValid);
        return isValid;
    }
})