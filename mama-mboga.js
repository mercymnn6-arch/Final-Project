let vegetables = [];

function loadData() {
    let savedData = localStorage.getItem("mboga");
    if (savedData) {
        vegetables = JSON.parse(savedData);
    }
}

function saveData() {
    localStorage.setItem("mboga", JSON.stringify(vegetables));
}

function addVegetable(nameValue, stockValue, buyValue, sellValue) {
    let newVegetable = {
        name: nameValue,
        stock: parseFloat(stockValue),
        sold: 0,
        buyPrice: parseFloat(buyValue),
        sellPrice: parseFloat(sellValue)
    };
    vegetables.push(newVegetable);
    saveData();
}

function updateDashboardDisplay() {
    let itemCount = vegetables.length;
    let stockTotal = 0;

    for (let i = 0; i < vegetables.length; i++) {
        let vegetable = vegetables[i];
        stockTotal = stockTotal + (vegetable.stock * vegetable.buyPrice);
    }

    document.getElementById("total-items").textContent = itemCount;
    document.getElementById("stock-value").textContent = "KSh " + Math.round(stockTotal);
    document.getElementById("today-sales").textContent = "KSh 0";
    document.getElementById("total-profit").textContent = "KSh 0";
}

function showAddMessage(textValue) {
    let messageBox = document.getElementById("add-msg");
    messageBox.textContent = textValue;
}

function clearAddMessage() {
    let messageBox = document.getElementById("add-msg");
    messageBox.textContent = "";
}

function populateSalesDropdown() {
    let dropdown = document.getElementById("item");
    dropdown.innerHTML = '<option value="">Select item</option>';

    for (let i = 0; i < vegetables.length; i++) {
        let vegetable = vegetables[i];
        if (vegetable.stock > 0) {
            let option = document.createElement("option");
            option.value = i;
            option.textContent = vegetable.name + " (" + vegetable.stock + "kg)";
            dropdown.appendChild(option);
        }
    }
}

function handleAddStock(event) {
    event.preventDefault();

    let nameField = document.getElementById("name").value;
    let stockField = document.getElementById("stock").value;
    let buyField = document.getElementById("buy").value;
    let sellField = document.getElementById("sell").value;

    if (nameField.length < 1) {
        showAddMessage("Please enter vegetable name");
        return;
    }

    addVegetable(nameField, stockField, buyField, sellField);
    showAddMessage("Stock added successfully");
    document.getElementById("add-form").reset();
    updateDashboardDisplay();

    setTimeout(clearAddMessage, 3000);
}

function handleSale(event) {
    event.preventDefault();

    let selectedIndex = document.getElementById("item").value;
    let quantityField = document.getElementById("qty").value;

    if (selectedIndex.length < 1) {
        showAddMessage("Please select an item");
        return;
    }

    let vegetable = vegetables[selectedIndex];
    let quantitySold = parseFloat(quantityField);

    if (quantitySold > vegetable.stock) {
        showAddMessage("Not enough stock available");
        return;
    }

    vegetable.stock = vegetable.stock - quantitySold;
    vegetable.sold = vegetable.sold + quantitySold;
    saveData();

    showAddMessage("Sale recorded successfully");
    document.getElementById("sale-form").reset();
    populateSalesDropdown();
    updateDashboardDisplay();

    setTimeout(clearAddMessage, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
    loadData();

    let addForm = document.getElementById("add-form");
    if (addForm) {
        addForm.addEventListener("submit", handleAddStock);
    }

    let saleForm = document.getElementById("sale-form");
    if (saleForm) {
        populateSalesDropdown();
        saleForm.addEventListener("submit", handleSale);
    }

    updateDashboardDisplay();
});
