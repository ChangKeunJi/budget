//! Money Class

class List {
  constructor(type, amount, id) {
    this.type = type;
    this.amount = amount;
    this.id = id;
  }
}

//! UI Class

class UI {
  constructor() {
    this.displayBudget = document.querySelector(".display-budget-value");
    this.displayExpense = document.querySelector(".display-expense-value");
    this.displayBalance = document.querySelector(".display-balance-value");
    this.buttons = document.querySelectorAll(".btn-outline-warning");
    this.formInput = document.getElementById("form-input");
    this.formSubmit = document.getElementById("form-submit");
    this.expenseList = document.getElementById("expense-list");
    this.incomeBtn = document.getElementById("income");
    this.deleteBtn = document.querySelector(".fa-trash-alt");
    this.income = JSON.parse(localStorage.getItem("income"))
      ? JSON.parse(localStorage.getItem("income"))
      : 0;
    this.expense = 0;
    this.balance = 0;
    this.itemList = [];
  }

  submitForm() {
    let value = this.formInput.value;
    this.activeBtn = document.querySelector(".active");

    if (value === "" || value < 0) {
      alert("Are You Kidding me?");
      this.formInput.value = "";
    } else {
      this.showDisplay();
      this.formInput.value = "";
    }
  }

  showDisplay() {
    this.totalBudgetAndExpense();
    this.totalBalance();

    let lists = JSON.parse(localStorage.getItem("lists"));

    console.log(lists);

    this.displayBudget.textContent = this.income;
    this.displayExpense.textContent = this.expense;
    this.displayBalance.textContent = this.balance;
  }

  totalBudgetAndExpense() {
    let value = this.formInput.value;
    this.activeBtn = document.querySelector(".active");

    if (this.activeBtn.id === this.incomeBtn.id) {
      this.income = value;
      Store.setIncome(this.income);
    } else {
      this.totalExpense();
    }
  }

  totalExpense() {
    let value = this.formInput.value;
    this.activeBtn = document.querySelector(".active");
    value = parseInt(value, 10);
    let income = this.income;

    if (value !== "" && value > 0) {
      let list = new List(this.activeBtn.id, value, new Date().getTime());
      this.itemList.push(list);
      Store.addList(list);
      this.addToList(this.itemList, this.expenseList);
    }

    let total = 0;

    total = this.itemList.reduce((a, b) => {
      a += b.amount;
      return a;
    }, 0);

    this.expense = total;
  }

  totalBalance() {
    this.balance = this.income - this.expense;
    if (this.balance < 0) {
      this.displayBalance.classList.add("warn");
    } else {
      this.displayBalance.classList.remove("warn");
    }
    this.balance = this.income - this.expense;
  }

  addToList(list = [], expenseList) {
    expenseList.innerHTML = list
      .map((item, i) => {
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

  deleteList(el) {
    let target = el.parentElement;
    if (el.classList.contains("fa-trash-alt")) {
      el.parentElement.parentElement.remove();
      let id = parseInt(el.id);
      let targetList = this.itemList.filter(item => item.id === id);
      let tempExpense = targetList[0].amount;
      this.expense -= tempExpense;
      let tempList = this.itemList.filter(item => item.id !== id);
      this.itemList = tempList;
      this.showDisplay();
      Store.removeList(id);
    }
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

  static removeList(id) {
    const lists = this.getList();

    lists.forEach((item, index) => {
      if (item.id == id) {
        lists.splice(index, 1);
      }
    });

    localStorage.setItem("lists", JSON.stringify(lists));
  }

  static setIncome(num) {
    // let income;

    // if (localStorage.getItem("income") === null) {
    //   income = 0;
    // } else {
    //   income = JSON.parse(localStorage.getItem("income"));
    // }

    localStorage.setItem("income", num);
  }
}

//! Event Listener

const eventListener = () => {
  const form = document.querySelector(".form");

  const ui = new UI();

  let tempList = JSON.parse(localStorage.getItem("lists"));
  ui.addToList((tempList = []), ui.expenseList);

  // Choosing Form Btn

  ui.buttons.forEach(btn => {
    btn.addEventListener("click", e => {
      ui.buttons.forEach(btn => {
        btn.classList.remove("active");
      });
      e.target.classList.add("active");
    });
  });

  // Submit Expense or Income
  form.addEventListener("submit", e => {
    ui.submitForm();
    e.preventDefault();
    console.log(ui.itemList);
  });

  // Delete List
  ui.expenseList.addEventListener("click", e => {
    ui.deleteList(e.target);
    console.log(ui.itemList);
  });
};

document.addEventListener("DOMContentLoaded", eventListener);
