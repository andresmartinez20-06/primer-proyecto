// Ejemplo de script para el scroll suave (aunque CSS ya maneja esto con scroll-behavior: smooth)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

/**store**/
document.addEventListener('DOMContentLoaded', () => {
    const products = document.querySelectorAll('.product');
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const searchBar = document.getElementById('search-bar');
    const categories = document.querySelectorAll('.category');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();

    products.forEach(product => {
        const addToCartButton = product.querySelector('.add-to-cart');
        const quantityElement = product.querySelector('.quantity');
        const increaseButton = product.querySelector('.increase');
        const decreaseButton = product.querySelector('.decrease');

        addToCartButton.addEventListener('click', () => {
            const quantity = parseInt(quantityElement.textContent);
            addToCart(product, quantity);
        });

        increaseButton.addEventListener('click', () => {
            quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
        });

        decreaseButton.addEventListener('click', () => {
            const currentQuantity = parseInt(quantityElement.textContent);
            if (currentQuantity > 1) {
                quantityElement.textContent = currentQuantity - 1;
            }
        });
    });

    function addToCart(product, quantity) {
        const name = product.getAttribute('data-name');
        const price = parseFloat(product.getAttribute('data-price'));
        const cartItem = cart.find(item => item.name === name);
        
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }

        updateCartDisplay();
        saveCart();
    }

    function updateCartDisplay() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
            total += item.price * item.quantity;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Eliminar';
            removeButton.classList.add('remove');
            removeButton.addEventListener('click', () => {
                removeFromCart(item.name);
            });

            listItem.appendChild(removeButton);
            cartItems.appendChild(listItem);
        });

        totalPriceElement.textContent = total.toFixed(2);
    }

    function removeFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        updateCartDisplay();
        saveCart();
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        products.forEach(product => {
            const name = product.getAttribute('data-name').toLowerCase();
            if (name.includes(query)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });

    categories.forEach(category => {
        category.addEventListener('click', () => {
            const categoryValue = category.getAttribute('data-category');
            filterProductsByCategory(categoryValue);
        });
    });

    function filterProductsByCategory(category) {
        products.forEach(product => {
            const productCategory = product.getAttribute('data-category');
            if (category === 'all' || category === productCategory) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
});
