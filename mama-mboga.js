let vegetables = [];

function loadData() {
    let saved = localStorage.getItem("mboga");
    if (saved) {
        vegetables = JSON.parse(saved);
    }
}

function saveData() {
    localStorage.setItem("mboga", JSON.stringify(vegetables));
}

function addVegetable(name, bought, sold, buyPrice, sellPrice) {
    let veg = {
        name: name,
        bought: Number(bought),
        sold: Number(sold),
        buyPrice: Number(buyPrice),
        sellPrice: Number(sellPrice),
        profit: (Number(sold) * Number(sellPrice)) - (Number(bought) * Number(buyPrice))
    };
    vegetables.push(veg);
    saveData();
}

function getTotals() {
    let totalProfit = 0;
    let totalSold = 0;

    vegetables.forEach(function (veg) {
        totalProfit = totalProfit + veg.profit;
        totalSold = totalSold + veg.sold;
    });

    return {
        profit: totalProfit,
        sold: totalSold,
        count: vegetables.length
    };
}

function getBestSeller() {
    let best = { name: " ", profit: 0 };

    vegetables.forEach(function (veg) {
        if (veg.profit > best.profit) {
            best.name = veg.name;
            best.profit = veg.profit;
        }
    });

    return best;
}

function saveStock() {
    let name = document.getElementById("name").value;
    let stock = document.getElementById("stock").value;
    let buyPrice = document.getElementById("buy").value;
    let sellPrice = document.getElementById("sell").value;

    if (name == "") {
        alert("Enter vegetable name");
        return;
    }

    addVegetable(name, stock, 0, buyPrice, sellPrice);
    alert("Stock saved! Profit: KSh" + vegetables[vegetables.length - 1].profit);
    document.getElementById("add-form").reset();
}

function showResults() {
    let totals = getTotals();
    let best = getBestSeller();


    document.getElementById("today-profit").innerHTML = "KSh" + totals.profit;
    document.getElementById("today-sales").innerHTML = totals.sold + "kg";
    document.getElementById("total-items").innerHTML = totals.count;
    document.getElementById("stock-value").innerHTML = best.name + " (KSh " + best.profit + ")";
}


document.addEventListener("DOMContentLoaded", function () {
    const addForm = document.getElementById("add-form");
    if (addForm) {
        addForm.addEventListener("submit", function (e) {
            e.preventDefault();
            saveStock();
        });
    }
}

);


