const cart = new Cart();

cart.addUpdateListener(function (e) {
    const cartNode = document.querySelector(".cart");
    if (!cartNode) {
        return;
    }

    if (e.isEmpty) {
        cartNode.classList.remove("full");
    } else {
        cartNode.classList.add("full");
    }
})
cart._callUpdateFunction();

function createProductCard(id, product) {
    let {top, image, name, description, price, category} = product;

    let isInCart = cart.getList().includes(id);

    let cardHTML = `
        <div class="product-card bg-white" data-category="${category}" data-product-id="${id}">
            ${top ? '<span class="badge bg-highlight text-white">ТОП</span>' : ''}
            <img src="${image}" alt="${name}">
            <div class="card-body">
                <h5 class="text-primary card-title">${name}</h5>
                <p class="body-text-small text-secondary card-description">${description}</p>
                <div class="card-bottom">
                    <h3 class="card-price text-primary">${price}₴</h3>
                    <button class="btn card-btn ${isInCart ? 'btn-outline' : 'btn-highlight'}">
                        ${isInCart ? 'В кошику' : 'До кошику'}
                    </button>
                </div>
            </div>
        </div>
    `;

    let wrapper = document.createElement("div");
    wrapper.innerHTML = cardHTML.trim();
    const card = wrapper.firstChild;
    const button = card.querySelector(".card-btn");
    button.onclick = isInCart ? () => removeFromCart(id) : () => addToCart(id);
    return card;
}

function createInCartCard(id, product, quantity, editable = true) {
    const {top, image, name, description, price} = product;

    const cardHTML = `
        <div class="in-cart-card bg-white" data-product-id="${id}">
            ${top ? '<span class="badge bg-highlight text-white">ТОП</span>' : ''}
            <img src="${image}" alt="${name}">
            <div class="card-body">
                <div class="card-info">
                    <h5 class="text-primary card-title">${name}</h5>
                    <p class="body-text-small text-secondary card-description">${description}</p>
                    <h3 class="card-price text-primary">${price}₴</h3>
                </div>
                <div class="quantity">
                    ${editable ? `
                    <button class="btn btn-primary decrement">-</button>
                    <input type="number" value="${quantity}">
                    <button class="btn btn-primary increment">+</button>
                    ` : `<p class="text-primary body-text-large">${quantity}x</p>`
    }
                </div>
            </div>
        </div>
    `;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = cardHTML.trim();
    const card = wrapper.firstChild;
    if (editable) {
        const quantity_input = card.querySelector("input[type='number']");
        card.querySelector(".increment").onclick = () => setQuantity(id, cart.getQuantity(id) + 1);
        card.querySelector(".decrement").onclick = () => setQuantity(id, cart.getQuantity(id) - 1);
        quantity_input.addEventListener("focusout", () => setQuantity(id, quantity_input.value))
    }
    return card;
}

function fillCatalogItems(parent, amount = -1) {
    amount = amount < 0 ? Object.keys(PRODUCT_TABLE).length : amount;

    let items = Object.entries(PRODUCT_TABLE).slice(0, amount);
    items.forEach(([id, product]) => {
        parent.appendChild(createProductCard(id, product));
    });
}

function toggleCategory(category) {
    document
        .querySelectorAll(`[data-category="${category}"]`)
        .forEach(card => {
            card.classList.toggle("hidden");
        });
}

function getCartItems(parent) {
    cart.getList().forEach(id => {
        const product = PRODUCT_TABLE[id];
        const quantity = cart.getQuantity(id);
        parent.appendChild(createInCartCard(id, product, quantity));
    });

    return {
        isEmpty: cart.isEmpty(),
        total: cart.getTotal()
    };
}

function getOrderItems(parent) {
    cart.getList().forEach(id => {
        const product = PRODUCT_TABLE[id];
        const quantity = cart.getQuantity(id);
        parent.appendChild(createInCartCard(id, product, quantity, false));
    });

    return {
        isEmpty: cart.isEmpty(),
        total: cart.getTotal()
    };
}

function addToCart(id) {
    cart.add(id);

    const button = document.querySelector(`[data-product-id="${id}"] .card-btn`);
    button.classList.add("btn-outline");
    button.classList.remove("btn-highlight");
    button.innerHTML = "В кошику";
    button.onclick = () => removeFromCart(id);
}

function removeFromCart(id) {
    cart.remove(id);

    const button = document.querySelector(`[data-product-id="${id}"] .card-btn`);
    button.classList.add("btn-highlight");
    button.classList.remove("btn-outline");
    button.innerHTML = "До кошику";
    button.onclick = addToCart;
}

function setQuantity(id, quantity) {
    if (quantity <= 0) {
        const confirmRemoval = confirm("Ви впевнені, що хочете прибрати товар з кошика?");

        if (confirmRemoval) {
            document.querySelector(`[data-product-id="${id}"]`).remove();
        } else {
            quantity = 1;
        }
    }

    const input = document.querySelector(`[data-product-id="${id}"] input[type="number"]`);
    cart.setQuantity(id, quantity);
    if (quantity > 0) {
        input.value = quantity;
    }
}
