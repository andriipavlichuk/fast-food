const ORDER_STAGES = [
    "Замовлення сформовано",
    "Замовлення готується",
    "Замовлення очікує на кур’єра",
    "Замовлення прямує до вас",
    "Замовлення отримано",
]

// Convert text to a DOM node
function textToNode(text) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = text.trim();
    return wrapper.firstChild;
}

/* == =============== == */
/* == CARD COMPONENTS == */
/* == =============== == */

// Product card
function createProductCard(productId, name, description, image, price, isTop, category, inCart = false) {
    const card = textToNode(`
        <div class="product-card bg-white" data-category="${category}" data-product-id="${productId}">
            ${isTop ? '<span class="badge bg-highlight text-white">ТОП</span>' : ''}
            <img src="${image}" alt="${name}">
            <div class="card-body">
                <p class="text-primary h5 card-title">${name}</p>
                <p class="body-text-small text-secondary card-description">${description}</p>
                <div class="card-bottom">
                    <h3 class="card-price text-primary">${price}₴</h3>
                    <button class="btn card-btn ${inCart ? 'btn-outline' : 'btn-highlight'}">
                        ${inCart ? 'В кошику' : 'До кошику'}
                    </button>
                </div>
            </div>
        </div>
    `);

    const button = card.querySelector(".card-btn");
    button.onclick = inCart ? () => removeFromCart(productId) : () => addToCart(productId);
    return card;
}

// In cart card
function createInCartCard(productId, name, description, image, price, isTop, category, quantity, editable = true) {
    const card = textToNode(`
        <div class="in-cart-card bg-white" data-product-id="${productId}">
            ${isTop ? '<span class="badge bg-highlight text-white">ТОП</span>' : ''}
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
    `);

    if (editable) {
        const quantity_input = card.querySelector("input[type='number']");
        card.querySelector(".increment").onclick = () => setQuantity(productId, cart.getQuantity(productId) + 1);
        card.querySelector(".decrement").onclick = () => setQuantity(productId, cart.getQuantity(productId) - 1);
        quantity_input.addEventListener("focusout", () => setQuantity(productId, quantity_input.value))
    }
    return card;
}

// Review card
function createReviewCard(id, name, avatar, rating, comment) {
    return textToNode(`
        <div class="review bg-white" data-review-id="${id}">
            <div class="review-author">
                <img src="${avatar}" alt="${name}">
                <div class="right">
                    <p class="text-primary h6 review-author-name">${name}</p>
                    <div class="review-rating">
                        ${new Array(5).fill(0).map((_, i) => `
                            <img src="/assets/icons/Star${i < rating ? "" : "Outline"}.svg" alt="Зірка" width="20" height="20">
                        `).join("")}               
                    </div>
                </div>
            </div>
            <p class="body-text text-primary review-text">"${comment}"</p>
        </div>
    `)
}

// Order card
function createOrderCard(id, address, placed_at = 0, stage = -1) {
    const date = new Date(placed_at);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return textToNode(`
        <div class="order-card bg-white">
            <h4 class="text-primary order-number">Замовлення №${id}</h4>
            <div class="order-details">
                <p class="body-text-small text-secondary">${day}.${month}.${year} ${hours}:${minutes}</p>
                <p class="body-text-small text-secondary">•</p>
                <p class="body-text-small text-secondary">Доставити до ${address}</p>
            </div>
            ${createOrderProgressCard(id, placed_at, stage).innerHTML}
        </div>
    `);
}

// Order progress (progress bar)
function createOrderProgressCard(id, placed_at = 0, stage = -1) {
    if (stage < 0) {
        stage = calculateOrderStage(placed_at);
    }


    const progress = 100 * Math.min(stage, ORDER_STAGES.length) / (ORDER_STAGES.length - 1);
    const progress_circles = ORDER_STAGES.map((_, index) =>
        `<div class="stage-circle${index <= stage ? ' active' : ''}"></div>`
    ).join('')

    return textToNode(`
        <div class="order-card bg-white">
            <div class="order-stage" data-order-id="${id}">
                <div class="order-progress">
                    ${progress_circles}
                    <div class="order-progress-bar" style="width: ${progress}%"></div>
                </div>
                <p class="body-text text-primary">${ORDER_STAGES[Math.min(stage, ORDER_STAGES.length)]}</p>
            </div>
        </div>
    `)
}

// Checkbox for filters
function createFilterCheckbox(category) {
    const filter = textToNode(
        `<div class="checkbox checked" data-filter-category="${category}">${category}</div>`
    )

    filter.onclick = function () {
        document
            .querySelectorAll(`[data-category="${filter.dataset.filterCategory}"]`)
            .forEach(card => card.classList.toggle("hidden"));
        this.classList.toggle('checked');
    }

    return filter;
}

/* == ======== == */
/* == HANDLERS == */
/* == ======== == */

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

function calculateOrderStage(placed_at) {
    const elapsedSeconds = Math.floor((Date.now() - placed_at) / 1000);
    return Math.min(Math.floor(elapsedSeconds / 10), ORDER_STAGES.length - 1);
}

/* == ========== == */
/* == CARD LISTS == */
/* == ========== == */

// Get a list of product cards for catalog
function getCatalogItems(parent, amount = -1) {
    requestProducts(amount).then(items => {
        [...items].forEach((product) => {
            parent.appendChild(createProductCard(...Object.values(product), cart.hasItemWithId(product.id)));
        });
    });
}

// Get a list of product cards for catalog along with categories
function getCatalog(list_parent, filter_parent, amount = -1) {
    requestProducts(amount).then(items => {
        const categories = new Set();

        [...items].forEach((product) => {
            list_parent.appendChild(createProductCard(...Object.values(product), cart.hasItemWithId(product.id)));
            categories.add(product.category);
        });

        [...categories].forEach((category) => {
            filter_parent.appendChild(createFilterCheckbox(category));
        })
    });
}

// Get a list of review cards for reviews
function getReviewCards(parent, amount = -1) {
    requestReviews(amount).then(items => {
        [...items].forEach((product) => {
            parent.appendChild(createReviewCard(...Object.values(product)))
        });
    });
}

// Get a list of items in the card
function getCartItems(parent, editable = true) {
    requestItems(cart.getList()).then(items => {
        [...items].forEach(item => {
            parent.appendChild(createInCartCard(...Object.values(item), cart.getQuantity(item.id), editable));
        })
    })

    return {
        isEmpty: cart.isEmpty(),
    };
}

// Get a list of active orders
function getActiveOrders(parent, if_empty = () => {}) {
    requestOrders().then(items => {
        if (!items.length) {
            if_empty();
            return;
        }

        [...items].forEach(order => {
            const element = textToNode(`<a href="/order/${order.id}"></a>`)
            element.appendChild(createOrderCard(
                +order.id,
                order.receiver_address,
                +order.placed_at
            ))
            parent.appendChild(element);
        })
    })
}

// Get a list of items in the order
function getOrderItems(items, parent) {
    requestItems(Object.keys(items)).then(products => {
        [...products].forEach(item => {
            parent.appendChild(createInCartCard(
                +item.id, item.name, item.description, item.image,
                items[item.id].p, item.top, item.category, items[item.id].q,
                false
            ));
        })
    })
}
