let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let cart = [];

function addProduct() {
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const image = document.getElementById('productImage').files[0];
    const stock = document.getElementById('productStock').value;

    const reader = new FileReader();
    reader.onload = function(e) {
        const product = { name, price, image: e.target.result, stock: parseInt(stock) };
        inventory.push(product);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        displayInventory();
        clearFields();
        alert('Producto agregado exitosamente'); // Notificación
    };
    reader.readAsDataURL(image);
}

function displayInventory() {
    const inventoryDiv = document.getElementById('inventory');
    inventoryDiv.innerHTML = '';
    inventory.forEach((product, index) => {
        inventoryDiv.innerHTML += `
            <div class="product">
                <span>${product.name} - Q${product.price} - Stock: ${product.stock}</span>
                <img src="${product.image}" alt="${product.name}">
                <input type="number" id="quantity${index}" class="quantity" placeholder="Cant.">
                <button onclick="addToCart(${index})">Agregar al Carrito</button>
                <button onclick="removeProduct(${index})">Eliminar</button>
            </div>
        `;
    });
}

function addToCart(index) {
    const quantity = parseInt(document.getElementById(`quantity${index}`).value);
    const product = inventory[index];
    if (quantity <= product.stock && quantity > 0) {
        cart.push({ ...product, quantity });
        product.stock -= quantity;
        localStorage.setItem('inventory', JSON.stringify(inventory));
        displayInventory();
        displayCart();
        clearFields();
    } else {
        alert('Cantidad no disponible');
    }
}

function displayCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = '';
    let total = 0;
    cart.forEach((product, index) => {
        total += product.price * product.quantity;
        cartDiv.innerHTML += `
            <div class="cart-item">
                <span>${product.name} - Q${product.price} x ${product.quantity}</span>
                <img src="${product.image}" alt="${product.name}">
                <button onclick="removeFromCart(${index})">Eliminar</button>
            </div>
        `;
    });
    document.getElementById('total').innerText = total;
}

function removeProduct(index) {
    inventory.splice(index, 1);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    displayInventory();
}

function removeFromCart(index) {
    const product = cart[index];
    inventory.forEach(item => {
        if (item.name === product.name) {
            item.stock += product.quantity;
        }
    });
    cart.splice(index, 1);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    displayInventory();
    displayCart();
}

function calculateChange() {
    const cashReceived = document.getElementById('cashReceived').value;
    const total = document.getElementById('total').innerText;
    const change = cashReceived - total;
    document.getElementById('change').innerText = change;
}

function finalizeSale() {
    document.getElementById('cashReceived').value = '';
    document.getElementById('change').innerText = '0';
    cart = [];
    displayCart();
}

function clearFields() {
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productStock').value = '';
    document.querySelectorAll('.quantity').forEach(input => input.value = '');
}

displayInventory();
