class Order {
    constructor() {
        this.id = 0;
        this.delivery_cost = 0;
        this.items = {};
        this.total = 0;
    }

    create(cart, database, delivery_cost) {
        this.id = Math.floor(Math.random() * 100000);
        this.delivery_cost = delivery_cost;
        this.updateCart(cart, database);
    }

    save() {
        const order = {
            id: this.id,
            delivery_cost: this.delivery_cost,
            items: this.items,
            total: this.total,
        };

        localStorage.setItem("pending_order", JSON.stringify(order));
    }

    load(name) {
        const order = JSON.parse(localStorage.getItem(name));

        if (order) {
            this.id = order.id;
            this.delivery_cost = order.delivery_cost;
            this.items = order.items;
            this.total = order.total;
            return true;
        }

        return false;
    }

    updateCart(cart, database) {
        this.items = [];
        this.total = 0;

        Object.keys(cart).forEach((item) => {
            const quantity = cart[item];
            const price = database[item].price;
            this.items[item] = {
                q: quantity,
                p: price,
            };
            this.total += quantity * price;
        })
    }

    // Remove matching order from local storage
    // remove() {
    //
    // }
}