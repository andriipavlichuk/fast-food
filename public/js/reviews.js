function createReviewCard(name, avatar, rating, comment) {
    const cardHTML = `
    <div class="review bg-white">
        <div class="review-author">
            <img src="${avatar}" alt="${name}">
            <div class="right">
                <h6 class="text-primary review-author-name">${name}</h6>
                <div class="review-rating">
                    ${new Array(5).fill(0).map((_, i) => `
                        <img src="/assets/icons/Star${i < rating ? "" : "Outline"}.svg" alt="Зірка">
                    `).join("")}               
                </div>
            </div>
        </div>
        <p class="body-text text-primary review-text">"${comment}"</p>
    </div>
    `

    const wrapper = document.createElement("div");
    wrapper.innerHTML = cardHTML;
    return wrapper.firstElementChild;
}

function fillReviewItems(parent, amount = -1) {
    amount = amount < 0 ? Object.keys(REVIEWS).length : amount;

    let items = Object.entries(REVIEWS).slice(0, amount);
    items.forEach(([id, entries]) => {
        parent.appendChild(createReviewCard(...Object.values(entries)));
    });
}