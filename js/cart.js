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

    clear () {
        this.cart = {};
        localStorage.removeItem("cart");
        this._callUpdateFunction()
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