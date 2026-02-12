let vegetables = [];

function loadData() {
    let savedData = localStorage.getItem("mboga");
    if (savedData) {
        vegetables = JSON.parse(savedData);
    }
}

function saveData() {
    let vegetableText = JSON.stringify(vegetables);
    localStorage.setItem("mboga", vegetableText);
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

    for (let count = 0; count < vegetables.length; count = count + 1) {
        let vegetable = vegetables[count];

        let oneStockValue = vegetable.stock * vegetable.buyPrice;
        stockTotal = stockTotal + oneStockValue;

        let priceDifference = vegetable.sellPrice - vegetable.buyPrice;
        let oneProfitValue = priceDifference * vegetable.stock;
        totalProfit = totalProfit + oneProfitValue;
    }


    let totalItemsElement = document.getElementById("total-items");
    let stockValueElement = document.getElementById("stock-value");
    let todaySalesElement = document.getElementById("today-sales");
    let totalProfitElement = document.getElementById("total-profit");

    if (totalItemsElement) totalItemsElement.textContent = itemCount;
    if (stockValueElement) stockValueElement.textContent = "KSh " + Math.round(stockTotal);
    if (todaySalesElement) todaySalesElement.textContent = "KSh 0";
    if (totalProfitElement) totalProfitElement.textContent = "KSh " + Math.round(totalProfit);
}

function showMessage(textValue) {
    let addMessage = document.getElementById("add-msg");
    let saleMessage = document.getElementById("sale-msg");
    if (addMessage) addMessage.textContent = textValue;
    if (saleMessage) saleMessage.textContent = textValue;
}

function clearMessage() {
    let addMessage = document.getElementById("add-msg");
    let saleMessage = document.getElementById("sale-msg");
    if (addMessage) addMessage.textContent = "";
    if (saleMessage) saleMessage.textContent = "";
}

function populateSalesDropdown() {
    let dropdown = document.getElementById("item");
    if (dropdown == null) {
        return;
    }

    let numberOfChildren = dropdown.children.length;
    for (let clearCount = 0; clearCount < numberOfChildren; clearCount = clearCount + 1) {
        dropdown.removeChild(dropdown.children[0]);
    }

    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select item";
    dropdown.appendChild(defaultOption);

    for (let count = 0; count < vegetables.length; count = count + 1) {
        let vegetable = vegetables[count];
        if (vegetable.stock > 0) {
            let option = document.createElement("option");
            option.value = count;
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
