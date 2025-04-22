const PATTERNS = {
    "name": /^.{5,}$/,
    "email": /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "address": /^.{20,}$/,
    "comment": /^.{10,}$/,
    "card-number": /^(?:\d{4}[- ]){3}\d{4}$/,
    "card-cvv": /^\d{3}$/,
    "card-exp": /^(0[1-9]|1[0-2])\/\d{2}$/,
};

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
    return Array.from(document.querySelectorAll('input'))
        .map(input => validateInput(input))
        .every(isValid => isValid);
}

function formatInput(input) {
    switch (input.name) {
        case "card-number":
            return input.value.replace(/\D/g, "").substring(0, 16).replace(/(.{4})/g, "$1 ").trim();

        case "card-cvv":
            return input.value.replace(/\D/g, "").substring(0, 3);

        case "card-exp":
            const raw_value = input.value.replace(/\D/g, "").substring(0, 4);
            return raw_value.length > 2 ? raw_value.substring(0, 2) + "/" + raw_value.substring(2) : raw_value;

        default:
            return input.value;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focusout', () => validateInput(input));
    });

    document.querySelector("form")?.addEventListener('input', function (event) {
        const input = event.target;
        input.value = formatInput(input);
        validateInput(input);
    });
})