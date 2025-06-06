class Order {
    constructor() {
        this.id = 0;
        this.delivery_cost = 0;
        this.items = {};
        this.total = 0;

        this.receiver = {
            name: "",
            email: "",
            address: "",
            card_l4d: "",
        }

        this.comment = "";
        this.placed_at = 0;
    }

    create(cart, prices, delivery_cost) {
        this.id = 0;
        this.delivery_cost = delivery_cost;
        this.updateCart(cart, prices);
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

    updateCart(cart, prices) {
        this.items = {};
        this.total = 0;

        Object.keys(cart).forEach((item) => {
            const quantity = cart[item];
            const price = prices[item];
            this.items[item] = {
                q: quantity,
                p: price,
            };
            this.total += quantity * price;
        })
    }

    setReceiversInfo(name, email, address, card_l4d, comment = "") {
        this.receiver.name = name;
        this.receiver.email = email;
        this.receiver.address = address;
        this.receiver.card_l4d = card_l4d;
        this.comment = comment;
    }

    toString() {
        return JSON.stringify([
            this.id,
            this.delivery_cost,
            this.items,
            this.total,
            this.receiver.name,
            this.receiver.email,
            this.receiver.address,
            this.receiver.card_l4d,
            this.comment,
            this.placed_at
        ]);
    }

    fromArray (arr) {
        const [
            id,
            delivery_cost,
            items,
            total,
            name,
            email,
            address,
            card_l4d,
            comment,
            placed_at
        ] = arr;

        this.id = id;
        this.delivery_cost = delivery_cost;
        this.items = items;
        this.total = total;
        this.receiver.name = name;
        this.receiver.email = email;
        this.receiver.address = address;
        this.receiver.card_l4d = card_l4d;
        this.comment = comment;
        this.placed_at = placed_at;

        return this;
    }

    fromString(str) {
        this.fromArray(JSON.parse(str));
    }

    place() {
        this.placed_at = new Date().getTime();
        return this.toString();
    }
}