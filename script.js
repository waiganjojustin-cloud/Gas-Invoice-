const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");

const itemCategory = document.getElementById("itemCategory");
const itemName = document.getElementById("itemName");
const cylinderSize = document.getElementById("cylinderSize");
const transactionType = document.getElementById("transactionType");
const itemQty = document.getElementById("itemQty");
const itemPrice = document.getElementById("itemPrice");

const addItemButton = document.getElementById("addItem");
const invoiceItems = document.getElementById("invoiceItems");

const subtotalDisplay = document.getElementById("subtotal");
const grandTotal = document.getElementById("grandTotal");

const discountInput = document.getElementById("discount");
const paymentMethod = document.getElementById("paymentMethod");

const saveInvoiceButton = document.getElementById("saveInvoice");
const printInvoiceButton = document.getElementById("printInvoice");

const savedInvoices = document.getElementById("savedInvoices");

let items = [];

addItemButton.addEventListener("click", function () {
    const category = itemCategory.value;
    const name = itemName.value.trim();
    const size = cylinderSize.value;
    const type = transactionType.value;
    const qty = Number(itemQty.value);
    const price = Number(itemPrice.value);

    if (category === "") {
        alert("Please select a category.");
        return;
    }

    if (name === "") {
        alert("Please enter the product or service name.");
        return;
    }

    if (size === "") {
        alert("Please select a cylinder size.");
        return;
    }

    if (type === "") {
        alert("Please select the transaction type.");
        return;
    }

    if (qty <= 0 || isNaN(qty)) {
        alert("Please enter a valid quantity.");
        return;
    }

    if (price <= 0 || isNaN(price)) {
        alert("Please enter a valid price.");
        return;
    }

    const total = qty * price;

    items.push({
        category: category,
        name: name,
        size: size,
        type: type,
        qty: qty,
        price: price,
        total: total
    });

    displayItems();

    itemCategory.value = "";
    itemName.value = "";
    cylinderSize.value = "";
    transactionType.value = "";
    itemQty.value = "";
    itemPrice.value = "";

    itemName.focus();
});

function displayItems() {
    invoiceItems.innerHTML = "";

    let subtotal = 0;

    items.forEach(function (item, index) {
        subtotal += item.total;

        const row = document.createElement("tr");

        row.innerHTML =
            "<td>" + item.category + "</td>" +
            "<td>" + item.name + "</td>" +
            "<td>" + item.size + "</td>" +
            "<td>" + item.type + "</td>" +
            "<td>" + item.qty + "</td>" +
            "<td>Ksh " + item.price.toFixed(2) + "</td>" +
            "<td>Ksh " + item.total.toFixed(2) + "</td>" +
            "<td><button type='button' onclick='removeItem(" +
            index +
            ")'>Remove</button></td>";

        invoiceItems.appendChild(row);
    });

    const discount = Number(discountInput.value) || 0;
    const total = Math.max(0, subtotal - discount);

    subtotalDisplay.textContent = subtotal.toFixed(2);
    grandTotal.textContent = total.toFixed(2);
}

function removeItem(index) {
    items.splice(index, 1);
    displayItems();
}

discountInput.addEventListener("input", function () {
    displayItems();
});

saveInvoiceButton.addEventListener("click", function () {
    const name = customerName.value.trim();
    const phone = customerPhone.value.trim();
    const payment = paymentMethod.value;

    if (name === "") {
        alert("Please enter the customer name.");
        return;
    }

    if (phone === "") {
        alert("Please enter the phone number.");
        return;
    }

    if (items.length === 0) {
        alert("Please add at least one item.");
        return;
    }

    if (payment === "") {
        alert("Please select a payment method.");
        return;
    }

    let subtotal = 0;

    items.forEach(function (item) {
        subtotal += item.total;
    });

    const discount = Number(discountInput.value) || 0;
    const total = Math.max(0, subtotal - discount);

    const invoice = {
        id: Date.now(),
        customerName: name,
        customerPhone: phone,
        items: items,
        subtotal: subtotal,
        discount: discount,
        total: total,
        paymentMethod: payment,
        date: new Date().toLocaleString()
    };

    const invoices =
        JSON.parse(localStorage.getItem("invoices")) || [];

    invoices.push(invoice);

    localStorage.setItem(
        "invoices",
        JSON.stringify(invoices)
    );

    alert("Invoice saved successfully!");

    displaySavedInvoices();

    clearInvoice();
});

function displaySavedInvoices() {
    const invoices =
        JSON.parse(localStorage.getItem("invoices")) || [];

    savedInvoices.innerHTML = "";

    if (invoices.length === 0) {
        savedInvoices.innerHTML =
            "<p>No saved invoices yet.</p>";
        return;
    }

    invoices.forEach(function (invoice) {

        const card = document.createElement("div");

        card.className = "saved-card";

        let itemsList = "";

        invoice.items.forEach(function (item) {
            itemsList +=
                "<div>" +
                "<strong>" + item.name + "</strong>" +
                " — " +
                item.size +
                " — " +
                item.type +
                " — Qty: " +
                item.qty +
                " — Ksh " +
                item.total.toFixed(2) +
                "</div>";
        });

        card.innerHTML =
            "<h3>Invoice #" + invoice.id + "</h3>" +

            "<p><strong>Customer:</strong> " +
            invoice.customerName +
            "</p>" +

            "<p><strong>Phone:</strong> " +
            invoice.customerPhone +
            "</p>" +

            "<p><strong>Date:</strong> " +
            invoice.date +
            "</p>" +

            "<p><strong>Payment:</strong> " +
            invoice.paymentMethod +
            "</p>" +

            "<div class='saved-items'>" +
            "<strong>Items:</strong>" +
            itemsList +
            "</div>" +

            "<p><strong>Subtotal:</strong> Ksh " +
            invoice.subtotal.toFixed(2) +
            "</p>" +

            "<p><strong>Discount:</strong> Ksh " +
            invoice.discount.toFixed(2) +
            "</p>" +

            "<p><strong>Total:</strong> Ksh " +
            invoice.total.toFixed(2) +
            "</p>" +

            "<button type='button' onclick='printSavedInvoice(" +
            invoice.id +
            ")'>Print</button> " +

            "<button type='button' onclick='deleteInvoice(" +
            invoice.id +
            ")'>Delete</button>";

        savedInvoices.appendChild(card);
    });
}

function deleteInvoice(id) {
    const answer = confirm(
        "Are you sure you want to delete this invoice?"
    );

    if (!answer) {
        return;
    }

    let invoices =
        JSON.parse(localStorage.getItem("invoices")) || [];

    invoices = invoices.filter(function (invoice) {
        return invoice.id !== id;
    });

    localStorage.setItem(
        "invoices",
        JSON.stringify(invoices)
    );

    displaySavedInvoices();
}

printInvoiceButton.addEventListener("click", function () {
    const name = customerName.value.trim();
    const phone = customerPhone.value.trim();
    const payment = paymentMethod.value;

    if (name === "") {
        alert("Please enter the customer name.");
        return;
    }

    if (phone === "") {
        alert("Please enter the phone number.");
        return;
    }

    if (items.length === 0) {
        alert("Please add at least one item.");
        return;
    }

    if (payment === "") {
        alert("Please select a payment method.");
        return;
    }

    printInvoice(
        name,
        phone,
        items,
        "New",
        new Date().toLocaleString(),
        Number(discountInput.value) || 0,
        payment
    );
});

function printSavedInvoice(id) {
    const invoices =
        JSON.parse(localStorage.getItem("invoices")) || [];

    const invoice = invoices.find(function (invoice) {
        return invoice.id === id;
    });

    if (!invoice) {
        alert("Invoice not found.");
        return;
    }

    printInvoice(
        invoice.customerName,
        invoice.customerPhone,
        invoice.items,
        invoice.id,
        invoice.date,
        invoice.discount,
        invoice.paymentMethod
    );
}

function printInvoice(
    name,
    phone,
    invoiceItemsList,
    invoiceNumber,
    date,
    discount,
    payment
) {
    let rows = "";
    let subtotal = 0;

    invoiceItemsList.forEach(function (item) {
        subtotal += item.total;

        rows +=
            "<tr>" +
            "<td>" + item.category + "</td>" +
            "<td>" + item.name + "</td>" +
            "<td>" + item.size + "</td>" +
            "<td>" + item.type + "</td>" +
            "<td>" + item.qty + "</td>" +
            "<td>Ksh " + item.price.toFixed(2) + "</td>" +
            "<td>Ksh " + item.total.toFixed(2) + "</td>" +
            "</tr>";
    });

    const total = Math.max(0, subtotal - discount);

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
        alert(
            "Please allow pop-ups to print the invoice."
        );
        return;
    }

    printWindow.document.write(
        "<html>" +
        "<head>" +
        "<title>GasFlow Invoice</title>" +

        "<style>" +

        "body {" +
        "font-family: Arial, sans-serif;" +
        "padding: 40px;" +
        "color: #1e293b;" +
        "}" +

        ".header {" +
        "text-align: center;" +
        "margin-bottom: 30px;" +
        "}" +

        ".header h1 {" +
        "color: #172554;" +
        "}" +

        ".details {" +
        "margin-bottom: 25px;" +
        "line-height: 1.8;" +
        "}" +

        "table {" +
        "width: 100%;" +
        "border-collapse: collapse;" +
        "margin-top: 20px;" +
        "}" +

        "th, td {" +
        "border: 1px solid #ddd;" +
        "padding: 9px;" +
        "text-align: center;" +
        "}" +

        "th {" +
        "background: #172554;" +
        "color: white;" +
        "}" +

        ".calculation {" +
        "margin-top: 25px;" +
        "margin-left: auto;" +
        "width: 300px;" +
        "line-height: 2;" +
        "}" +

        ".total {" +
        "font-size: 22px;" +
        "font-weight: bold;" +
        "border-top: 2px solid #172554;" +
        "padding-top: 10px;" +
        "}" +

        ".footer {" +
        "text-align: center;" +
        "margin-top: 50px;" +
        "color: #64748b;" +
        "}" +

        "</style>" +

        "</head>" +

        "<body>" +

        "<div class='header'>" +
        "<h1>🔥 GASFLOW MANAGER</h1>" +
        "<p>Gas Cylinders • Refilling • Accessories</p>" +
        "</div>" +

        "<div class='details'>" +

        "<p><strong>Invoice:</strong> " +
        invoiceNumber +
        "</p>" +

        "<p><strong>Date:</strong> " +
        date +
        "</p>" +

        "<p><strong>Customer:</strong> " +
        name +
        "</p>" +

        "<p><strong>Phone:</strong> " +
        phone +
        "</p>" +

        "<p><strong>Payment:</strong> " +
        payment +
        "</p>" +

        "</div>" +

        "<table>" +

        "<thead>" +

        "<tr>" +
        "<th>Category</th>" +
        "<th>Item</th>" +
        "<th>Size</th>" +
        "<th>Type</th>" +
        "<th>Qty</th>" +
        "<th>Price</th>" +
        "<th>Total</th>" +
        "</tr>" +

        "</thead>" +

        "<tbody>" +
        rows +
        "</tbody>" +

        "</table>" +

        "<div class='calculation'>" +

        "<p><strong>Subtotal:</strong> Ksh " +
        subtotal.toFixed(2) +
        "</p>" +

        "<p><strong>Discount:</strong> Ksh " +
        discount.toFixed(2) +
        "</p>" +

        "<p class='total'>Total: Ksh " +
        total.toFixed(2) +
        "</p>" +

        "</div>" +

        "<div class='footer'>" +
        "<p>Thank you for your business!</p>" +
        "<p>GasFlow Manager</p>" +
        "</div>" +

        "</body>" +

        "</html>"
    );

    printWindow.document.close();

    printWindow.focus();

    setTimeout(function () {
        printWindow.print();
    }, 500);
}

function clearInvoice() {
    customerName.value = "";
    customerPhone.value = "";

    itemCategory.value = "";
    itemName.value = "";
    cylinderSize.value = "";
    transactionType.value = "";
    itemQty.value = "";
    itemPrice.value = "";

    discountInput.value = "0";
    paymentMethod.value = "";

    items = [];

    displayItems();
}

displaySavedInvoices();