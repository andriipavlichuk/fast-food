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
