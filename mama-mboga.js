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
    let totalProfit = 0;

    for (let i = 0; i < vegetables.length; i++) {
        let vegetable = vegetables[i];
        stockTotal = stockTotal + (vegetable.stock * vegetable.buyPrice);
        totalProfit = totalProfit + ((vegetable.sellPrice - vegetable.buyPrice) * vegetable.stock);
    }

    let totalItemsEl = document.getElementById("total-items");
    let stockValueEl = document.getElementById("stock-value");
    let todaySalesEl = document.getElementById("today-sales");
    let totalProfitEl = document.getElementById("total-profit");

    if (totalItemsEl) totalItemsEl.textContent = itemCount;
    if (stockValueEl) stockValueEl.textContent = "KSh " + Math.round(stockTotal);
    if (todaySalesEl) todaySalesEl.textContent = "KSh 0";
    if (totalProfitEl) totalProfitEl.textContent = "KSh " + Math.round(totalProfit);
}

function showMessage(textValue) {
    let addMsg = document.getElementById("add-msg");
    let saleMsg = document.getElementById("sale-msg");
    if (addMsg) addMsg.textContent = textValue;
    if (saleMsg) saleMsg.textContent = textValue;
}

function clearMessage() {
    let addMsg = document.getElementById("add-msg");
    let saleMsg = document.getElementById("sale-msg");
    if (addMsg) addMsg.textContent = "";
    if (saleMsg) saleMsg.textContent = "";
}

function populateSalesDropdown() {
    let dropdown = document.getElementById("item");
    if (!dropdown) return;

    while (dropdown.firstChild) {
        dropdown.removeChild(dropdown.firstChild);
    }

    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select item";
    dropdown.appendChild(defaultOption);

    for (let i = 0; i < vegetables.length; i++) {
        let vegetable = vegetables[i];
        if (vegetable.stock > 0) {
            let option = document.createElement("option");
            option.value = i;
            option.textContent = vegetable.name + " (" + vegetable.stock.toFixed(1) + "kg)";
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
        showMessage("Please enter vegetable name");
        return;
    }

    addVegetable(nameField, stockField, buyField, sellField);
    showMessage("Stock added successfully");
    document.getElementById("add-form").reset();
    updateDashboardDisplay();
    setTimeout(clearMessage, 3000);
}

function handleSale(event) {
    event.preventDefault();
    let selectedIndex = document.getElementById("item").value;
    let quantityField = document.getElementById("qty").value;

    if (selectedIndex.length < 1) {
        showMessage("Please select an item");
        return;
    }

    let vegetable = vegetables[selectedIndex];
    let quantitySold = parseFloat(quantityField);

    if (quantitySold > vegetable.stock || quantitySold <= 0) {
        showMessage("Not enough stock available");
        return;
    }

    vegetable.stock = vegetable.stock - quantitySold;
    vegetable.sold = vegetable.sold + quantitySold;
    saveData();
    showMessage("Sale recorded successfully");
    document.getElementById("sale-form").reset();
    populateSalesDropdown();
    updateDashboardDisplay();
    setTimeout(clearMessage, 3000);
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
