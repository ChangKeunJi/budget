// List Class

class List {
  constructor(type, amount, id) {
    this.type;
    this.amount;
    this.id;
  }
}

// Income Class

class Income {
  constructor(income) {
    this.income;
  }
}

// UI Class

class UI {
  constructor() {
    this.displayIncome = document.querySelector(".display-budget-value");
    this.displayExpense = document.querySelector(".display-expense-value");
    this.displayBalance = document.querySelector(".display-balance-value");
    this.buttons = document.querySelectorAll(".btn-outline-warning");
    this.formInput = document.getElementById("form-input");
    this.formSubmit = document.getElementById("form-submit");
    this.expenseList = document.getElementById("expense-list");
    this.incomeBtn = document.getElementById("income");
    this.deleteBtn = document.querySelector(".fa-trash-alt");
    this.income = [{ income: 10 }];
    this.expense = 0;
    this.balance = 0;
    this.itemList = [];
  }

  // Display all the data based on Object Data.
  showDisplay() {
    let income;  
    if(!JSON.stringify(localStorage.getItem("income")) {
        income = 0;
    } else {
        income =  JSON.stringify(localStorage.getItem("income")[0])
    }

    this.displayIncome.textContent = income;

    let total = 0;
    total = this.itemList.reduce((a, b) => {
      a += b.amount;
      return a;
    }, 0);

    this.displayExpense.textContent = total;
    this.displayBalance.textContent = this.income[0].income - total;
  }

  submitForm() {
    let value = this.formInput.value;
    let type = document.querySelector(".active").id;

    if (value === "" || value < 0) {
      alert("Invalid Number");
    } else if (type === this.incomeBtn) {
      this.addIncome(value);
    } else {
      this.addExpense(value, type);
    }
  }

  addIncome(value) {
    const income = new Income(value);
    this.income[0] = income;
    this.showDisplay();
  }

  addExpense(value, type) {
    const list = new List(type, value, new Date().getTime());
    this.itemList.push(list);
    this.showDisplay();
  }
}

//! Store Class

class Store {
  static getList() {
    let lists;

    if (localStorage.getItem("lists") === null) {
      lists = [];
    } else {
      lists = JSON.parse(localStorage.getItem("lists"));
    }
    return lists;
  }

  static addList(list) {
    const lists = this.getList();
    lists.push(list);
    localStorage.setItem("lists", JSON.stringify(lists));
  }

  static getIncome() {
    let income;

    if (localStorage.getItem("income") === null) {
      income = [{ income: 0 }];
    } else {
      income = JSON.parse(localStorage.getItem("income"));
    }
  }

  static addIncome(inc) {
    const income = this.getIncome();
    income[0] = inc;
    localStorage.setItem("income", JSON.stringify(income));
  }
}

//! Event Listener

const eventListener = () => {
  const form = document.querySelector(".form");

  const ui = new UI();

  // Show All the data first

  ui.showDisplay();

  // Select Button

  ui.buttons.forEach(button => {
    button.addEventListener("click", e => {
      ui.buttons.forEach(e => {
        e.classList.remove("active");
      });
      e.target.classList.add("active");
    });
  });

  // Submit Expense or Income

  ui.formInput.addEventListener("submit", e => {
    ui.submitForm();
    e.preventDefault();
  });
};

document.addEventListener("DOMContentLoaded", eventListener);
