let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let cart = [];

function addProduct() {
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const image = document.getElementById('productImage').files[0];
    const stock = document.getElementById('productStock').value;

    if (!name || !price || !image || !stock) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const product = { name, price, image: e.target.result, stock: parseInt(stock) };
        inventory.push(product);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        displayInventory();
        clearFields();
        alert('Producto agregado exitosamente');
    };
    reader.readAsDataURL(image);
}

function displayInventory(showDeleteButton = true, showAddToCartButton = false) {
    const inventoryDiv = document.getElementById('inventory');
    inventoryDiv.innerHTML = '';
    inventory.forEach((product, index) => {
        inventoryDiv.innerHTML += `
            <div class="product">
                <span>${product.name} - Q${product.price} - Stock: ${product.stock}</span>
                <img src="${product.image}" alt="${product.name}">
                ${showDeleteButton ? `<button onclick="removeProduct(${index})">Eliminar</button>` : ''}
                ${showAddToCartButton ? `
                    <input type="number" id="quantity${index}" class="quantity" placeholder="Cant.">
                    <button onclick="addToCart(${index})">Agregar al Carrito</button>
                ` : `
                    <input type="number" id="newStock${index}" placeholder="Nuevo Stock">
                    <button onclick="updateStock(${index})">Modificar Stock</button>
                `}
            </div>
        `;
    });
}

function removeProduct(index) {
    inventory.splice(index, 1);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    displayInventory();
}

function updateStock(index) {
    const newStock = parseInt(document.getElementById(`newStock${index}`).value);
    if (newStock >= 0) {
        inventory[index].stock = newStock;
        localStorage.setItem('inventory', JSON.stringify(inventory));
        displayInventory();
    } else {
        alert('El stock debe ser un número positivo');
    }
}

function addToCart(index) {
    const quantity = parseInt(document.getElementById(`quantity${index}`).value);
    const product = inventory[index];
    if (quantity <= product.stock && quantity > 0) {
        cart.push({ ...product, quantity });
        product.stock -= quantity;
        localStorage.setItem('inventory', JSON.stringify(inventory));
        displayInventory(false, true);
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

    cartDiv.innerHTML += `
        <div class="cart-header">
            <h2>Agregados para vender</h2>
        </div>
    `;

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

function removeFromCart(index) {
    const product = cart[index];
    inventory.forEach(item => {
        if (item.name === product.name) {
            item.stock += product.quantity;
        }
    });
    cart.splice(index, 1);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    displayInventory(false, true);
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
