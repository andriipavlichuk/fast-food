class Cart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem("cart")) || {};
        this.onChange = [];
    }

    add(id) {
        this.cart[id] = 1;
        localStorage.setItem("cart", JSON.stringify(this.cart));
        this._callUpdateFunction()
    }

    remove(id) {
        if (this.cart[id]) {
            delete this.cart[id];
            localStorage.setItem("cart", JSON.stringify(this.cart));
        }
        this._callUpdateFunction()
    }

    setQuantity(id, quantity) {
        this.cart[id] = quantity;

        if (this.cart[id] <= 0) {
            delete this.cart[id];
        }

        localStorage.setItem("cart", JSON.stringify(this.cart));
        this._callUpdateFunction()
    }

    update() {
        this.cart = JSON.parse(localStorage.getItem("cart")) || {};
        this._callUpdateFunction()
    }

    getList() {
        return Object.keys(this.cart);
    }

    getQuantity(id) {
        return this.cart[id] || 0;
    }

    isEmpty() {
        return Object.keys(this.cart).length === 0;
    }

    getTotal() {
        return Object
            .entries(this.cart)
            .reduce((total, [id, quantity]) => total + quantity * PRODUCT_TABLE[id].price, 0);
    }

    addUpdateListener(callback) {
        if (typeof callback === "function") {
            this.onChange.push(callback);
        }
    }

    removeUpdateListener(callback) {
        if (typeof callback === "function") {
            this.onChange = this.onChange.filter(cb => cb !== callback);
        }
    }

    _getObjectArguments() {
        return {
            items: Object.entries(this.cart),
            quantities: this.cart,
            length: Object.keys(this.cart).length,
            total: this.getTotal(),
            isEmpty: this.isEmpty(),
        }
    }

    _callUpdateFunction() {
        this.onChange.forEach(callback => callback(this._getObjectArguments()));
    }
}

const PRODUCT_TABLE = {
    "1": {
        top: true,
        image: "/assets/products/Product1.jpg",
        name: "Королівський бургер",
        description: "Соковита котлета, сир чеддер, свіже листя салату та соус барбекю.",
        price: 169,
        category: "burgers",
    },
    "2": {
        top: true,
        image: "/assets/products/Product2.jpg",
        name: "Філадельфія лайт",
        description: "Ніжний лосось, вершковий сир, авокадо та рис – ідеальне поєднання.",
        price: 219,
        category: "rolls",
    },
    "3": {
        top: true,
        image: "/assets/products/Product3.jpg",
        name: "Чікен Бургер",
        description: "Соковита куряча котлета, свіжі овочі та соус ранч.",
        price: 159,
        category: "burgers",
    },
    "4": {
        top: true,
        image: "/assets/products/Product4.jpg",
        name: "Дабл Чізбургер",
        description: "Подвійна котлета, сир та фірмовий соус для максимального смаку.",
        price: 189,
        category: "burgers",
    },
    "5": {
        top: true,
        image: "/assets/products/Product5.jpg",
        name: "Піца Пепероні",
        description: "Тонке тісто, томатний соус, моцарела та пікантна пепероні.",
        price: 219,
        category: "pizza",
    },
    "6": {
        top: true,
        image: "/assets/products/Product6.jpg",
        name: "Швидка Маргарита",
        description: "Тонке тісто, ароматний томатний соус, моцарела та базилік.",
        price: 189,
        category: "pizza",
    },
    "7": {
        top: true,
        image: "/assets/products/Product7.jpg",
        name: "Каліфорнія рол",
        description: "Крабове м'ясо, авокадо, огірок та ікра тобіко.",
        price: 199,
        category: "rolls",
    },
    "8": {
        top: true,
        image: "/assets/products/Product8.jpg",
        name: "Веган Бургер",
        description: "Рослинна котлета, свіжі овочі та веганський соус.",
        price: 149,
        category: "burgers",
    },
    "9": {
        top: false,
        image: "/assets/products/Product9.jpg",
        name: "Чотири сири",
        description: "Моцарела, горгонзола, пармезан і чеддер на хрусткому тісті.",
        price: 239,
        category: "pizza",
    },
    "10": {
        top: false,
        image: "/assets/products/Product10.jpg",
        name: "Дракон рол",
        description: "Рис, вугор, авокадо, огірок, унагі соус і кунжут.",
        price: 229,
        category: "rolls",
    },
    "11": {
        top: false,
        image: "/assets/products/Product11.jpg",
        name: "Гриль Бургер",
        description: "Яловичина на грилі, карамелізована цибуля та соус чилі.",
        price: 179,
        category: "burgers",
    },
    "12": {
        top: false,
        image: "/assets/products/Product12.jpg",
        name: "М'ясна феєрія",
        description: "Ковбаски, шинка, бекон, моцарела та гострий соус.",
        price: 249,
        category: "pizza",
    },
    "13": {
        top: false,
        image: "/assets/products/Product13.jpg",
        name: "BBQ Бургер",
        description: "Котлета, бекон, смажена цибуля, барбекю соус і розплавлений чеддер.",
        price: 189,
        category: "burgers",
    },
    "14": {
        top: false,
        image: "/assets/products/Product14.jpg",
        name: "Футомакі з тунцем",
        description: "Ніжний тунець, авокадо, крем-сир, рис і норі",
        price: 239,
        category: "rolls",
    },
    "15": {
        top: false,
        image: "/assets/products/Product15.jpg",
        name: "Гавайська піца",
        description: "Класичне поєднання шинки, ананасів і ніжного сиру.",
        price: 199,
        category: "pizza",
    },
    "16": {
        top: false,
        image: "/assets/products/Product16.jpg",
        name: "Сяке Макі",
        description: "Класичний рол із лососем, рисом та водоростями.",
        price: 179,
        category: "rolls",
    },
    "17": {
        top: false,
        image: "/assets/products/Product17.jpg",
        name: "Діабло",
        description: "Гостра салямі, перець халапеньйо, томатний соус, моцарела та соус чилі.",
        price: 229,
        category: "pizza",
    },
    "18": {
        top: false,
        image: "/assets/products/Product18.jpg",
        name: "Мексиканський Бургер",
        description: "Котлета з перцем халапеньйо, гуакамоле та пікантний соус.",
        price: 179,
        category: "burgers",
    },
    "19": {
        top: false,
        image: "/assets/products/Product19.jpg",
        name: "Овочева піца",
        description: "Перець, помідори, гриби, оливки та моцарела..",
        price: 189,
        category: "pizza",
    },
    "20": {
        top: false,
        image: "/assets/products/Product20.jpg",
        name: "Темпура рол",
        description: "Смажений у клярі рол із креветкою та сиром.",
        price: 199,
        category: "rolls",
    },
    "21": {
        top: false,
        image: "/assets/products/Product21.jpg",
        name: "Веган рол",
        description: "Авокадо, огірок, болгарський перець і крем-сир.",
        price: 189,
        category: "rolls",
    },
    "22": {
        top: false,
        image: "/assets/products/Product22.jpg",
        name: "Цезар Піца",
        description: "Куряче філе, пармезан, листя салату, соус Цезар і моцарела.",
        price: 219,
        category: "pizza",
    },
    "23": {
        top: false,
        image: "/assets/products/Product23.jpg",
        name: "Супер Чізбургер",
        description: "Потрійний чеддер, потрійна котлета та кремовий соус.",
        price: 229,
        category: "burgers",
    },
    "24": {
        top: false,
        image: "/assets/products/Product24.jpg",
        name: "Темпура рол",
        description: "Тигрова креветка, огірок, соус спайсі та ікра тобіко.",
        price: 219,
        category: "rolls",
    },
};

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

function createInCartCard(id, product, editable = true) {
    const {top, image, name, description, price} = product;

    const quantity = cart.getQuantity(id);

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
        card.querySelector(".increment").onclick = () => increaseQuantity(id);
        card.querySelector(".decrement").onclick = () => decreaseQuantity(id);
    }
    return card;
}

function catalogCart(parent, amount = -1) {
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
        parent.appendChild(createInCartCard(id, product));
    });

    return {
        isEmpty: cart.isEmpty(),
        total: cart.getTotal()
    };
}

function getOrderItems(parent) {
    cart.getList().forEach(id => {
        const product = PRODUCT_TABLE[id];
        parent.appendChild(createInCartCard(id, product, false));
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

function updateQuantity(id, quantity) {
    const input = document.querySelector(`[data-product-id="${id}"] input[type="number"]`);
    cart.setQuantity(id, quantity);
    if (quantity > 0) {
        input.value = quantity;
    }
}

function increaseQuantity(id) {
    updateQuantity(id, cart.getQuantity(id) + 1);
}

function decreaseQuantity(id) {
    let newQuantity = cart.getQuantity(id) - 1;

    if (newQuantity <= 0) {
        const confirmRemoval = confirm("Ви впевнені, що хочете прибрати товар з кошика?");

        if (confirmRemoval) {
            document.querySelector(`[data-product-id="${id}"]`).remove();
        } else {
            newQuantity = 1;
        }
    }

    updateQuantity(id, newQuantity);
}
