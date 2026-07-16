const transactionFormEl = document.getElementById("transaction-form");
const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");

let balance = 0;
let income = 0;
let expenses = 0;

transactionFormEl.addEventListener("submit", updateInfo);

function updateInfo(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const amount = Number(formData.get("amount"));
  const description = formData.get("description");

  console.log(amount, description);
  console.log("Form submission intercepted successfully.");

  if (!validateData(description, amount)) {
    console.log(`Invalid amount: ${amount}`);
    return;
  }
  updateBalance(amount);
  addList(description, amount);
  updateSummary(amount);
}

function validateData(description, amount) {
  return amount !== 0 && description.trim() !== "";
}

function updateBalance(amount) {
  balance += amount;
  balanceEl.textContent = `$${balance}`;
}

function addList(description, amount) {
  // old code
  // let incomeOrExpense;
  // if (amount < 0) {
  //   incomeOrExpense = "expense";
  // } else {
  //   incomeOrExpense = "income";
  // }

  // transactionArray = `<li class="transaction ${incomeOrExpense}" > Description: ${description}
  //   Amount: ${amount}</li>`

  // Add list to UI
  const listItem = document.createElement("li");
  const descriptionSpanEl = document.createElement("span");
  const amountSpanEl = document.createElement("span");
  descriptionSpanEl.textContent = `${description}`;
  amountSpanEl.textContent = `${amount}`;
  listItem.classList.add("transaction");
  listItem.appendChild(descriptionSpanEl);
  listItem.appendChild(amountSpanEl);
  if (amount < 0) {
    listItem.classList.add("expense");
  } else {
    listItem.classList.add("income");
  }

  transactionListEl.appendChild(listItem);
}

function updateSummary(amount) {
  if (amount < 0) {
    expenses += amount;
    expenseAmountEl.textContent = `$${Math.abs(expenses)}`;
  } else {
    income += amount;
    incomeAmountEl.textContent = `$${income}`;
  }
}
