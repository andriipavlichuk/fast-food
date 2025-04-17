const PATTERNS = {
    "name": /^.{5,}$/,
    "email": /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "address": /^.{20,}$/,
    "comment": /^.{10,}$/,
    "card-number": /^(?:\d{4}[- ]){3}\d{4}$/,
    "card-cvv": /^\d{3}$/,
    "card-exp": /^(0[1-9]|1[0-2])\/\d{2}$/,
};

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateInputs()) alert("Далі нізя");
    });

    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focusout', () => validateInput(input));
    });

    function validateInput(input) {
        if (!PATTERNS[input.name] || !input.required) {
            return true;
        }

        const is_valid = PATTERNS[input.name].test(input.value.trim());
        input.classList.toggle("outline-danger", !is_valid);
        document.querySelector(`[data-msg-for="${input.name}"]`)?.classList.toggle("hidden", is_valid);

        return is_valid;
    }

    function validateInputs() {
        return Array.from(document.querySelectorAll('[data-pattern]'))
            .map(input => validateInput(input))
            .every(isValid => isValid);
    }

    document.querySelector("form")?.addEventListener('input', function (event) {
        validateInput(event.target)
    });
})