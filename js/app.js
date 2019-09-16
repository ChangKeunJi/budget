class List {
  constructor(type, amount, id) {
    this.type = type;
    this.amount = amount;
    this.id = id;
  }
}

class UI {
  constructor() {
    this.list = document.getElementById("expense-list");
    this.deleteBtn = document.querySelector(".fa-trash-alt");
    this.expenseForm = document.querySelector("#expense-form");
    this.buttons = document.querySelectorAll(".btn-outline-warning");
    this.expenseInput = document.getElementById("expense-input");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetDisplay = document.querySelector(".display-budget-value");
    this.expenseDisplay = document.querySelector(".display-expense-value");
    this.balanceDisplay = document.querySelector(".display-balance-value");
    this.activeBtn = document.querySelector(".active");
    this.resetBtn = document.querySelector("#reset");
    this.budget = 0;
    this.expense = 0;
    this.balance = 0;
    this.expenseArr = [];
  }

  submitBudget() {
    let value = this.budgetInput.value;
    if (value < 0 || value === "") {
      alert("Wrong Input");
    } else {
      this.budgetDisplay.textContent = value;
      this.budgetInput.value = "";
    }
    this.budget = value;
    this.displayBalance();
  }

  addArr() {
    let value = parseInt(this.expenseInput.value);
    let type = this.activeBtn.id.toUpperCase();
    // Add to Expense Arr

    const list = new List(type, value, new Date().getTime());
    this.expenseArr.push(list);
    console.log(list);
  }

  submitExpense() {
    let value = parseInt(this.expenseInput.value);
    let type = this.activeBtn.id.toUpperCase();
    let total = 0;

    if (value <= 0 || value === "") {
      alert("Wrong Input");
    } else {
      this.addArr();
      this.subSubmitExpense();
    }

    this.displayBalance();
  }

  subSubmitExpense() {
    let value = parseInt(this.expenseInput.value);
    let type = this.activeBtn.id.toUpperCase();
    let total = 0;

    total = this.expenseArr.reduce((a, b) => {
      a += b.amount;
      return a;
    }, 0);

    this.expenseDisplay.textContent = total;

    this.expenseInput.value = "";

    this.addHistory(this.expenseArr, this.list);

    this.displayBalance();
  }

  addHistory(arr, list) {
    list.innerHTML = arr
      .map(item => {
        return `
        <tr>
        <td>
          <button type="button" class="btn btn-outline-warning list-btn">
            ${item.type}
          </button>
        </td>
        <td id='amount'>-$${item.amount}</td>
        <td><i class="fas fa-trash-alt" id=${item.id} type=${item.amout}></i></td>
        </tr>
        `;
      })
      .join("");
  }

  deleteList(target) {
    let id = parseInt(target.id);
    let tempList = this.expenseArr.filter(list => list.id !== id);
    this.expenseArr = tempList;
  }

  displayBalance() {
    let sum = this.budgetDisplay.innerHTML - this.expenseDisplay.innerHTML;

    if (sum < 0) {
      this.balanceDisplay.classList.add("warning");
    } else {
      this.balanceDisplay.classList.remove("warning");
    }

    this.balanceDisplay.textContent = sum;
  }
}

// Event Listner

const eventListener = () => {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.querySelector("#expense-form");
  const ui = new UI();

  // Submit Budget

  budgetForm.addEventListener("submit", e => {
    e.preventDefault();
    ui.submitBudget();
  });

  // Select Expense Button

  ui.buttons.forEach(btn => {
    btn.addEventListener("click", e => {
      ui.buttons.forEach(btn => {
        btn.classList.remove("active");
      });
      e.target.classList.add("active");
    });
  });

  // Submit Expense

  expenseForm.addEventListener("submit", e => {
    e.preventDefault();
    // ui.addArr();
    ui.submitExpense();
  });

  // Delete List

  ui.list.addEventListener("click", e => {
    if (e.target.classList.contains("fa-trash-alt")) {
      ui.deleteList(e.target);
      ui.subSubmitExpense();
    }
  });

  // Reset

  ui.resetBtn.addEventListener("click", () => {
    window.location.reload(true);
  });
};

document.addEventListener("DOMContentLoaded", eventListener);
