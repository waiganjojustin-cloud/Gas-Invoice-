// Get elements from the HTML
const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");

const itemName = document.getElementById("itemName");
const itemQty = document.getElementById("itemQty");
const itemPrice = document.getElementById("itemPrice");

const addItemButton = document.getElementById("addItem");
const invoiceItems = document.getElementById("invoiceItems");
const grandTotal = document.getElementById("grandTotal");

const saveInvoiceButton = document.getElementById("saveInvoice");
const printInvoiceButton = document.getElementById("printInvoice");

const savedInvoices = document.getElementById("savedInvoices");

// Store the items for the current invoice
let items = [];


// ADD ITEM
addItemButton.addEventListener("click", function () {

    const name = itemName.value.trim();
    const qty = Number(itemQty.value);
    const price = Number(itemPrice.value);

    if (name === "") {
        alert("Please enter an item name.");
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
        name: name,
        qty: qty,
        price: price,
        total: total
    });

    displayItems();

    // Clear item fields
    itemName.value = "";
    itemQty.value = "";
    itemPrice.value = "";

    itemName.focus();
});


// DISPLAY ITEMS
function displayItems() {

    invoiceItems.innerHTML = "";

    let total = 0;

    items.forEach(function (item, index) {

        total += item.total;

        const row = document.createElement("tr");

        row.innerHTML =
            "<td>" + item.name + "</td>" +
            "<td>" + item.qty + "</td>" +
            "<td>Ksh " + item.price.toFixed(2) + "</td>" +
            "<td>Ksh " + item.total.toFixed(2) + "</td>" +
            "<td><button type='button' onclick='removeItem(" +
            index +
            ")'>Remove</button></td>";

        invoiceItems.appendChild(row);
    });

    grandTotal.textContent = total.toFixed(2);
}


// REMOVE ITEM
function removeItem(index) {

    items.splice(index, 1);

    displayItems();
}


// SAVE INVOICE
saveInvoiceButton.addEventListener("click", function () {

    const name = customerName.value.trim();
    const phone = customerPhone.value.trim();

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

    let total = 0;

    items.forEach(function (item) {
        total += item.total;
    });

    const invoice = {
        id: Date.now(),
        customerName: name,
        customerPhone: phone,
        items: items,
        total: total,
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


// DISPLAY SAVED INVOICES
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


// DELETE SAVED INVOICE
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


// PRINT CURRENT INVOICE
printInvoiceButton.addEventListener("click", function () {

    const name = customerName.value.trim();
    const phone = customerPhone.value.trim();

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

    printInvoice(
        name,
        phone,
        items
    );
});


// PRINT SAVED INVOICE
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
        invoice.date
    );
}


// PRINT FUNCTION
function printInvoice(
    name,
    phone,
    invoiceItemsList,
    invoiceNumber = "New",
    date = new Date().toLocaleString()
) {

    let rows = "";
    let total = 0;

    invoiceItemsList.forEach(function (item) {

        total += item.total;

        rows +=
            "<tr>" +
            "<td>" + item.name + "</td>" +
            "<td>" + item.qty + "</td>" +
            "<td>Ksh " + item.price.toFixed(2) + "</td>" +
            "<td>Ksh " + item.total.toFixed(2) + "</td>" +
            "</tr>";
    });

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
        "<title>Invoice</title>" +

        "<style>" +

        "body {" +
        "font-family: Arial, sans-serif;" +
        "padding: 40px;" +
        "}" +

        "h1 {" +
        "text-align: center;" +
        "}" +

        "table {" +
        "width: 100%;" +
        "border-collapse: collapse;" +
        "margin-top: 30px;" +
        "}" +

        "th, td {" +
        "border: 1px solid #ddd;" +
        "padding: 10px;" +
        "text-align: left;" +
        "}" +

        "th {" +
        "background: #2c7be5;" +
        "color: white;" +
        "}" +

        ".total {" +
        "text-align: right;" +
        "font-size: 22px;" +
        "font-weight: bold;" +
        "margin-top: 20px;" +
        "}" +

        "</style>" +

        "</head>" +

        "<body>" +

        "<h1>INVOICE</h1>" +

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

        "<table>" +

        "<thead>" +

        "<tr>" +
        "<th>Item</th>" +
        "<th>Qty</th>" +
        "<th>Price</th>" +
        "<th>Total</th>" +
        "</tr>" +

        "</thead>" +

        "<tbody>" +
        rows +
        "</tbody>" +

        "</table>" +

        "<div class='total'>" +
        "Total: Ksh " +
        total.toFixed(2) +
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


// CLEAR CURRENT INVOICE
function clearInvoice() {

    customerName.value = "";
    customerPhone.value = "";

    itemName.value = "";
    itemQty.value = "";
    itemPrice.value = "";

    items = [];

    displayItems();
}


// LOAD SAVED INVOICES
displaySavedInvoices();