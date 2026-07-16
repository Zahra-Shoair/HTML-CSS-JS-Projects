// ============================================================
// SECTION 1: GRABBING ELEMENTS FROM THE HTML PAGE
// ============================================================
// `document` = the built-in object representing the whole webpage (the DOM).
// `getElementById("id")` = a method that searches the page for one element
// that has that exact id="..." attribute in the HTML, and returns it.
// We store each result in a `const` (a variable that can't be reassigned)
// so we can reference these elements later without searching the DOM again
// (searching the DOM repeatedly is slower, so we cache it once here).

const balanceEl = document.getElementById("balance");
// The element (probably a <span> or <div>) that will display the total balance.

const incomeAmountEl = document.getElementById("income-amount");
// The element that will display total income.

const expenseAmountEl = document.getElementById("expense-amount");
// The element that will display total expenses.

const transactionListEl = document.getElementById("transaction-list");
// Probably a <ul> — the container we'll fill with <li> transaction items.

const transactionFormEl = document.getElementById("transaction-form");
// The <form> element the user submits to add a new transaction.

const descriptionEl = document.getElementById("description");
// The <input> where the user types a description ("Coffee", "Paycheck", etc).

const amountEl = document.getElementById("amount");
// The <input> where the user types the dollar amount.


// ============================================================
// SECTION 2: LOADING SAVED DATA FROM THE BROWSER
// ============================================================

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
// This line does several things, right to left:
//
// 1. `localStorage.getItem("transactions")`
//    `localStorage` is a browser feature that lets a website save small
//    pieces of text data on the user's computer, so it's still there
//    after the page is closed and reopened. `getItem("transactions")`
//    looks for a saved value under the key "transactions". If nothing
//    has been saved yet, this returns `null`.
//
// 2. `JSON.parse(...)`
//    localStorage can only store STRINGS. So when we saved our
//    transactions earlier, we had to convert the array of objects into
//    a string (see JSON.stringify below). `JSON.parse` converts that
//    string back into a real JavaScript array/object we can use.
//    NOTE: if the stored value is `null` (nothing saved yet),
//    `JSON.parse(null)` actually returns `null` too, not an error.
//
// 3. `|| []`
//    The `||` is the "OR" operator. Here it's used as a fallback:
//    if the left side (`JSON.parse(...)`) is `null` (falsy), JavaScript
//    uses the right side instead — an empty array `[]`. This means: if
//    there's no saved data yet, just start with an empty transactions list.
//
// `let` (not `const`) is used because this array gets reassigned later
// in removeTransaction() with `transactions = transactions.filter(...)`.


// ============================================================
// SECTION 3: LISTENING FOR FORM SUBMISSION
// ============================================================

transactionFormEl.addEventListener("submit", addTransaction);
// `addEventListener(eventType, callbackFunction)` tells the browser:
// "watch this element, and when this specific event happens, run this function."
//
// - "submit" is the event that fires when a <form> is submitted
//   (e.g. clicking a submit button, or pressing Enter in a form field).
// - `addTransaction` is passed WITHOUT parentheses — we're passing a
//   reference to the function itself, not calling it right now.
//   The browser will call it automatically later, when the event fires,
//   and will automatically pass it an "event object" as an argument.


// ============================================================
// SECTION 4: ADDING A NEW TRANSACTION
// ============================================================

function addTransaction(e) {
  // `e` is short for "event" — the event object the browser automatically
  // passes in when the "submit" event fires. It contains info about the
  // event and methods to control its behavior.

  e.preventDefault();
  // By default, submitting a <form> makes the browser reload the page
  // (or navigate somewhere). `preventDefault()` stops that default
  // behavior so we can handle the submission ourselves with JavaScript
  // instead, without a page reload.

  // get form values
  const description = descriptionEl.value.trim();
  // `.value` reads whatever text is currently typed into the input field.
  // `.trim()` is a string method that removes extra whitespace from the
  // start and end (so "  Coffee  " becomes "Coffee").

  const amount = parseFloat(amountEl.value);
  // `amountEl.value` is always a STRING, even if the user typed numbers
  // (e.g. "25.50"). `parseFloat()` converts that string into an actual
  // decimal number (25.5) so we can do math with it later.

  transactions.push({
    id: Date.now(),
    description,
    amount,
  });
  // `.push(item)` adds a new item to the END of the `transactions` array.
  // The item here is an OBJECT with three properties:
  //   - id: Date.now() returns the current time in milliseconds since
  //     Jan 1, 1970, as a number (e.g. 1721160000000). It's used as a
  //     quick, unique-enough ID for each transaction.
  //   - description, and amount — written using "shorthand property
  //     names". Since we already have variables named `description` and
  //     `amount`, writing `description,` is shorthand for
  //     `description: description,` (same for amount). JS automatically
  //     uses the variable's name as the key and its value as the value.

  localStorage.setItem("transactions", JSON.stringify(transactions));
  // Saves our updated array back into localStorage so it persists.
  // `JSON.stringify(transactions)` converts the array of objects into a
  // plain string (the opposite of JSON.parse), because localStorage can
  // only store strings, not real arrays/objects.
  // `setItem(key, value)` writes that string under the key "transactions".

  updateTransactionList();
  // Calls the function below to re-draw the on-screen list of transactions,
  // now including the one we just added.

  updateSummary();
  // Calls the function below to recalculate and re-display the balance,
  // income, and expense totals.

  transactionFormEl.reset();
  // A built-in method on <form> elements that clears all its input fields
  // back to empty/default, so the user can type a new entry.
}


// ============================================================
// SECTION 5: RE-DRAWING THE TRANSACTION LIST ON THE PAGE
// ============================================================

function updateTransactionList() {
  transactionListEl.innerHTML = "";
  // `.innerHTML` is a property representing all the HTML content INSIDE
  // an element. Setting it to an empty string "" wipes out everything
  // currently inside the list, so we can rebuild it fresh below without
  // ending up with duplicates.

  const sortedTransactions = [...transactions].reverse();
  // `[...transactions]` uses the "spread" syntax to copy every item out
  // of the `transactions` array into a brand-new array. We do this
  // instead of using `transactions.reverse()` directly because
  // `.reverse()` mutates (changes) the array in place — copying first
  // means we don't accidentally reorder our actual saved data.
  // `.reverse()` then flips the copy's order, so the most recently
  // added transaction (last in the array) shows up FIRST on screen.

  sortedTransactions.forEach((transaction) => {
    // `.forEach(callback)` runs the given function once for every item
    // in the array. Here, `transaction` represents one item (one
    // transaction object) on each pass through the loop.

    const transactionEl = createTransactionElement(transaction);
    // Calls the function below to build an actual HTML <li> element
    // representing this transaction.

    transactionListEl.appendChild(transactionEl);
    // `.appendChild(element)` inserts that new element into the DOM,
    // as the last child inside `transactionListEl` (the <ul>).
  });
}


// ============================================================
// SECTION 6: BUILDING ONE <li> ELEMENT FOR A TRANSACTION
// ============================================================

function createTransactionElement(transaction) {
  const li = document.createElement("li");
  // Creates a brand new, empty <li> element in memory. It's not on the
  // page yet — it only gets shown once we appendChild() it somewhere
  // (which happens back in updateTransactionList).

  li.classList.add("transaction");
  // `.classList` represents an element's list of CSS classes.
  // `.add("transaction")` adds the class "transaction" to it, so CSS
  // styling rules for `.transaction` apply to it.

  li.classList.add(transaction.amount > 0 ? "income" : "expense");
  // This adds ANOTHER class, chosen using a "ternary operator":
  //   condition ? valueIfTrue : valueIfFalse
  // If transaction.amount is greater than 0, add class "income";
  // otherwise (it's zero or negative), add class "expense".
  // This lets CSS color income green and expenses red, for example.

  li.innerHTML = `
    <span>${transaction.description}</span>
    <span>
  
    ${formatCurrency(transaction.amount)}
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    </span>
  `;
  // This uses a "template literal" — a string wrapped in backticks (`)
  // instead of quotes. Template literals let you:
  //   1. Write multi-line strings easily (regular quotes can't span lines).
  //   2. Embed JavaScript values directly using ${...}, called
  //      "interpolation" — whatever's inside ${} is evaluated and its
  //      result is inserted into the string.
  // Here we're building raw HTML as a string:
  //   - ${transaction.description} inserts the description text.
  //   - ${formatCurrency(transaction.amount)} calls the function further
  //     below to turn the raw number into a formatted string like "$25.50".
  //   - The button's onclick="removeTransaction(...)" is HTML-attribute
  //     JavaScript: it wires up an onclick handler directly in the HTML
  //     string, inserting the transaction's id so clicking "x" knows
  //     which transaction to delete.
  // Setting `.innerHTML` on the <li> replaces its contents with this
  // parsed HTML.

  return li;
  // Sends the fully built <li> element back to whoever called this
  // function (updateTransactionList), so it can be appended to the page.
}


// ============================================================
// SECTION 7: CALCULATING AND DISPLAYING TOTALS
// ============================================================

function updateSummary() {
  // 100, -50, 200, -200 => 50
  const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  // `.reduce(callback, initialValue)` walks through every item in the
  // array and "reduces" it down to a single value.
  //   - `acc` ("accumulator") is the running total so far.
  //   - `transaction` is the current item being processed.
  //   - `acc + transaction.amount` is what gets returned each time,
  //     becoming the new `acc` for the next item.
  //   - `0` (the second argument to reduce) is the STARTING value of acc,
  //     before any items have been processed.
  // End result: balance = the sum of every transaction's amount.

  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  // `.filter(callback)` creates a NEW array containing only the items
  // where the callback returns true — here, only transactions with a
  // positive amount (income). `.reduce(...)` is then chained directly
  // onto that filtered array to sum those amounts up, same logic as above.

  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  // Same idea, but keeps only negative amounts (expenses) and sums them.
  // Because the amounts are already negative, `expenses` ends up as a
  // negative number (e.g. -250).

  // update ui => todo: fix the formatting
  balanceEl.textContent = formatCurrency(balance);
  // `.textContent` sets the visible text inside an element (safer/simpler
  // than innerHTML when you're just inserting plain text, not HTML tags).
  // formatCurrency() (below) turns the raw number into something like "$50.00".

  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency(expenses);
  // Same pattern for the income and expense display elements.
}


// ============================================================
// SECTION 8: FORMATTING NUMBERS AS CURRENCY
// ============================================================

function formatCurrency(number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
  // `Intl.NumberFormat` is a built-in JavaScript object for formatting
  // numbers according to language/region rules.
  //   - `new Intl.NumberFormat(locale, options)` creates a "formatter"
  //     configured for US English formatting, styled as currency, in USD.
  //   - `.format(number)` then runs the actual number through that
  //     formatter and returns a nicely formatted string, e.g.
  //     formatCurrency(1234.5) => "$1,234.50"
  //     formatCurrency(-50)    => "-$50.00"
}


// ============================================================
// SECTION 9: DELETING A TRANSACTION
// ============================================================

function removeTransaction(id) {
  // filter out the one we wanted to delete
  transactions = transactions.filter((transaction) => transaction.id !== id);
  // `.filter()` again — this builds a NEW array containing every
  // transaction EXCEPT the one whose id matches the id we want to remove
  // (`!==` means "not equal to"). We reassign `transactions` to this new
  // filtered array, effectively deleting that one item.
  // (This is why `transactions` had to be declared with `let`, not `const`.)

  localStorage.setItem("transcations", JSON.stringify(transactions));
  // ⚠️ BUG: notice the key here is spelled "transcations" (typo), but
  // everywhere else in the file it's saved/read as "transactions".
  // This means deletions get saved under the WRONG key, so when the
  // page reloads, it loads the old "transactions" key (without the
  // deletion) instead of this corrected list. Fix: change "transcations"
  // to "transactions" to match the rest of the file.

  updateTransactionList();
  updateSummary();
  // Same as in addTransaction — redraw the list and totals to reflect
  // the deletion.
}


// ============================================================
// SECTION 10: INITIAL PAGE LOAD
// ============================================================

// initial render
updateTransactionList();
updateSummary();
// These two calls run immediately when the script first loads (not
// inside any function or event listener), so that any transactions
// already saved in localStorage from a previous visit are displayed
// right away, instead of showing a blank page until the user adds
// something new.
