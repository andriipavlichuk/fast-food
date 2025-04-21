const STAGES = [
    "Замовлення сформовано",
    "Замовлення готується",
    "Замовлення очікує на кур’єра",
    "Замовлення прямує до вас",
    "Замовлення отримано",
]

function createOrderCard(id, address, placed_at = 0, stage = 3) {
    const date = new Date(placed_at);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const progress = 100 * Math.min(stage, STAGES.length) / (STAGES.length - 1);
    const progress_circles = STAGES.map((_, index) =>
        `<div class="stage-circle${index <= stage ? ' active' : ''}"></div>`
    ).join('')

    const element = `
        <div class="order-card bg-white">
            <h4 class="text-primary order-number">Замовлення №${id}</h4>
            <div class="order-details">
                <p class="body-text-small text-secondary">${day}.${month}.${year} ${hours}:${minutes}</p>
                <p class="body-text-small text-secondary">•</p>
                <p class="body-text-small text-secondary">Доставити до ${address}</p>
            </div>
            <div class="order-stage">
                <div class="order-progress">
                    ${progress_circles}
                    <div class="order-progress-bar" style="width: ${progress}%"></div>
                </div>
                <p class="body-text text-primary">${STAGES[Math.min(stage, STAGES.length)]}</p>
            </div>
        </div>
    `

    const wrapper = document.createElement("div");
    wrapper.innerHTML = element.trim();
    return wrapper.firstChild;
}