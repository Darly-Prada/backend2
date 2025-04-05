document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.addToCartBtn');
    const emptyCartButton = document.querySelector('.emptyCartBtn');
    const productForm = document.getElementById("productForm");

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productElement = e.target.closest('.product');
            const productId = e.target.getAttribute('data-product-id');
            const title = productElement.querySelector('h3').textContent;
            const price = productElement.querySelector('p:nth-child(3)').textContent.replace('Precio: $', '');

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.productId === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ productId, title, price: parseFloat(price), quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        });
    });
    if (emptyCartButton) {
        emptyCartButton.addEventListener('click', () => {
            localStorage.removeItem('cart');
            updateCart();
        });
    }
    if (productForm) {
        productForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const title = document.getElementById("productTitle").value;
            const price = document.getElementById("productPrice").value;
            const description = document.getElementById("productDescription").value;
            const category = document.getElementById("productCategory").value;
            const code = document.getElementById("productCode").value;
            const stock = document.getElementById("productStock").value;

            try {
                const response = await fetch('/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, price, description, category, code, stock }),
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Producto agregado');
                    window.location.reload();
                } else {
                    alert('Error al agregar el producto');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
    const deleteProductButtons = document.querySelectorAll('.deleteProductBtn');
    deleteProductButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const productIdToDelete = e.target.getAttribute('data-product-id');

            try {
                const response = await fetch(`/api/products/${productIdToDelete}`, {
                    method: 'DELETE',
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Producto eliminado');
                    window.location.reload();
                } else {
                    alert('Error al eliminar el producto');
                    console.error('Error al eliminar el producto:', result);
                }
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
            }
        });
    });

    function updateCart() {
        const cartList = document.getElementById('cartList');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartList.innerHTML = '';

        if (cart.length > 0) {
            cart.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${item.title} - Precio: $${item.price} - Cantidad: ${item.quantity} -
                    <button class="removeFromCartBtn" data-product-id="${item.productId}">Eliminar</button>
                `;
                cartList.appendChild(li);
            });
            attachRemoveFromCartListeners();
        } else {
            cartList.innerHTML = '<li>No hay productos en tu carrito.</li>';
        }
    }

    function attachRemoveFromCartListeners() {
        const removeFromCartButtons = document.querySelectorAll('.removeFromCartBtn');
        removeFromCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productIdToRemove = e.target.getAttribute('data-product-id');
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart = cart.filter(item => item.productId !== productIdToRemove);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            });
        });
    }

    updateCart();
});