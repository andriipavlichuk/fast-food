const PATTERNS = {
    "name": /^.{5,}$/,
    "email": /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "address": /^.{20,}$/,
    "comment": /^.{10,}$/,
    "message": /^.{5,}$/,
    "card-number": /^(?:\d{4}[- ]){3}\d{4}$/,
    "card-cvv": /^\d{3}$/,
    "card-exp": /^(0[1-9]|1[0-2])\/\d{2}$/,
};

function validateInput(input) {
    if (!PATTERNS[input.name] || !input.required) {
        return true;
    }

    let is_valid = PATTERNS[input.name].test(input.value.trim());
    const msg = document.querySelector(`[data-msg-for="${input.name}"]`);

    if (input.name === "card-exp") {
        const raw_value = input.value.replace(/\D/g, "").substring(0, 4);
        msg.innerHTML = "*Має містити дату у форматі ММ/РР";
        if (raw_value.length === 4) {
            const current_date = new Date();
            const current_month = current_date.getMonth() + 1;
            const current_year = current_date.getFullYear() % 100;
            const month = parseInt(raw_value.substring(0, 2));
            const year = parseInt(raw_value.substring(2, 4));
            if (year < current_year || (year === current_year && month <= current_month)) {
                msg.innerHTML = "*Термін придатності картки минув";
                is_valid = false;
            }
        }
    }

    input.classList.toggle("outline-danger", !is_valid);
    document.querySelector(`[data-msg-for="${input.name}"]`)?.classList.toggle("hidden", is_valid);

    return is_valid;
}

function validateInputs() {
    return Array.from(document.querySelectorAll('input, textarea'))
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

function showPopup(message, type, time = 5000) {
    const popup = document.createElement("div");
    switch (type) {
        case "success":
            popup.classList.add("popup", "bg-success", "text-white");
            break;
        case "error":
            popup.classList.add("popup", "bg-danger", "text-white");
            break;
        default:
            popup.classList.add("popup", "bg-white", "text-primary");
    }
    popup.innerText = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = "1";
        popup.style.transform = "translateX(0)";
    }, 10);

    setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 510);
    }, time)
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('focusout', () => validateInput(input));
    });

    document.querySelector("form")?.addEventListener('input', function (event) {
        const input = event.target;
        input.value = formatInput(input);
        validateInput(input);
    });

    document.getElementById("contact-form")?.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateInputs()) {
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = formatInput({ name: key, value });
            });

            e.submitter.classList.add("disabled");
            fetch('/handlers/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    e.submitter.classList.remove("disabled");
                    if (response.ok) {
                        e.target.reset();
                        console.log('Success:', response);
                        showPopup("Повідомлення надіслано!", "success", 5000);
                        return;
                    }
                    throw new Error('Failed to send message');
                })
                .catch(error => {
                    console.error('Error:', error);
                    showPopup("Сталася помилка. Спробуйте знову через деякий час", "error", 10000);
                });
        }
    })
})