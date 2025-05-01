function loadOrderByID(id) {
    const orders = JSON.parse(localStorage.getItem("active_orders"));
    const order = orders ? orders.find(order => order[0] === +id) : undefined;
    return order ? new Order().fromArray(order) : undefined;
}

function updateOrderStages (id) {
    setInterval(() => {
        const order = loadOrderByID(id);
        if (order) {
            const progressCard = createOrderProgressCard(id, order.placed_at).querySelector(".order-stage");
            document.querySelector(`.order-card:has([data-order-id="${id}"]) .order-stage`).replaceWith(progressCard);
            console.log("Updated order stage for ID:", id);
        }
    }, 10000)
}