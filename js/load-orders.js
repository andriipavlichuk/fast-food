const STAGES = [
    "Замовлення сформовано",
    "Замовлення готується",
    "Замовлення очікує на кур’єра",
    "Замовлення прямує до вас",
    "Замовлення отримано",
]

function calculateStage(placed_at) {
    const elapsedSeconds = Math.floor((Date.now() - placed_at) / 1000);
    return Math.min(Math.floor(elapsedSeconds / 10), STAGES.length - 1);
}

function createOrderCard(id, address, placed_at = 0, stage = -1) {
    const date = new Date(placed_at);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const element = `
        <div class="order-card bg-white">
            <h4 class="text-primary order-number">Замовлення №${id}</h4>
            <div class="order-details">
                <p class="body-text-small text-secondary">${day}.${month}.${year} ${hours}:${minutes}</p>
                <p class="body-text-small text-secondary">•</p>
                <p class="body-text-small text-secondary">Доставити до ${address}</p>
            </div>
            ${createOrderProgressCard(id, placed_at, stage).innerHTML}
        </div>
    `;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = element.trim();
    return wrapper.firstChild;
}

function createOrderProgressCard(id, placed_at = 0, stage = -1) {
    if (stage < 0) {
        stage = calculateStage(placed_at);
    }
    const progress = 100 * Math.min(stage, STAGES.length) / (STAGES.length - 1);
    const progress_circles = STAGES.map((_, index) =>
        `<div class="stage-circle${index <= stage ? ' active' : ''}"></div>`
    ).join('')

    const element = `
        <div class="order-card bg-white">
            <div class="order-stage" data-order-id="${id}">
                <div class="order-progress">
                    ${progress_circles}
                    <div class="order-progress-bar" style="width: ${progress}%"></div>
                </div>
                <p class="body-text text-primary">${STAGES[Math.min(stage, STAGES.length)]}</p>
            </div>
        </div>`

    const wrapper = document.createElement("div");
    wrapper.innerHTML = element.trim();
    return wrapper.firstChild;
}

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