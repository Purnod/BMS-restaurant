// Logout functionality
document.querySelectorAll('.logout_button').forEach(button => {
  button.addEventListener('click', () => {
      sessionStorage.clear();
      alert("You have been logged out.");
      window.location.hash = "login";
      document.querySelectorAll(".nav-links a").forEach(link => {
        link.style.pointerEvents = "none";
        link.style.opacity = "0.5";
      });
  });
});
// navigation bar 

let page_titles = {
  "login": "Abey's Kitchen | Login",
  "dashboard": "Abey's Kitchen  | Dashboard",
  "finance": "Abey's Kitchen  | Finance",
  "inventory": "Abey's Kitchen  | Inventory",
   "orders": "Abey's Kitchen  | Orders"
};

function update_title() {
  let hash = window.location.hash.substring(1);
  if (page_titles[hash]) {
    document.title = page_titles[hash];
  }
}

window.addEventListener("hashchange", () => {
  let page = location.hash.substring(1) || "login"; 
  showpage(page);      
  update_title(); 
  updateRoleSections();     
});

let initialPage = location.hash.substring(1) || "login";
showpage(initialPage);
update_title();
updateRoleSections();     


update_title();
// Security 
//login page 

//navigation link disable if not logged in
document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("isLoggedIn") === null) {
    sessionStorage.setItem("isLoggedIn", "false");
  }});


let isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
if (!isLoggedIn) {
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.style.pointerEvents = "none";
    link.style.opacity = "0.5";
  });
}

// login logic 
let users = {
    manager:{username:"manager", password:"kC9t#zx%TkmN#4GK", role:"manager"},
    admin:{username:"admin", password:"$tNbZUT*tneU*5Kt", role:"admin"}
};

function Login_check() {
  let entered_username = document.getElementById("username").value;
  let entered_password = document.getElementById("password").value;

  let found_user = Object.values(users).find(user => 
      user.username === entered_username && user.password === entered_password
  );
  if (found_user) {
      sessionStorage.setItem("role", found_user.role);
      sessionStorage.setItem("isLoggedIn", "true");
      alert("Login successful! Welcome, " + found_user.role);
      window.location.hash = "dashboard";
      updateRoleSections();

      document.querySelectorAll(".nav-links a").forEach(link => {
        link.style.pointerEvents = "auto";
        link.style.opacity = "1";
      });
}
 else {
      alert("Invalid username or password. Please try again.");
  }
  entered_username.value = "";
  entered_password.value = "";
}

// navigate block if not logged in
function showpage(pageId) {
  let isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (isLoggedIn !== "true" && pageId !== "login") {
      window.location.hash = "login";
      return;
  }
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(pageId).style.display = "block";
}

// role based page show

function updateRoleSections() {
  let role = sessionStorage.getItem("role");

  document.querySelectorAll(".Admin-section").forEach(el => el.style.display = "none");
  document.querySelectorAll(".Manager-section").forEach(el => el.style.display = "none");

  if (role === "admin") {
    document.querySelectorAll(".Admin-section").forEach(el => el.style.display = "block");
  } else if (role === "manager") {
    document.querySelectorAll(".Manager-section").forEach(el => el.style.display = "block");
  }
}
updateRoleSections();

// Finance page logic

// manager section 
// finance table population
fetch('finance_manager.json')
  .then(response => response.json())
  .then(data => { console.log(data);
      let finance_summary = document.querySelector('#finance_summary tbody');
      finance_summary.innerHTML = '';
      
      data.financial_summary.forEach(finance =>  { console.log(finance);
        let product = data.sales_table.find(sale_r => sale_r.Product === finance.Product_Name);
        if (product) {
          let totalProfit = Number (product.Unit_Profit) * Number (finance.Qty_Sold);
          finance.Total_Profit = totalProfit;
        }

          let row = document.createElement('tr');
          row.innerHTML = `
              <td>${finance.Product_Name}</td>
              <td>${finance.Qty_Sold}</td>
              <td>${finance.Total_Profit}</td>
              <td>${finance.Platform_Fees}</td>
          `;
          finance_summary.appendChild(row);
      });

      // sales table population

      data.sales_table.forEach(sale_t => {
        let sales_table = document.querySelector('#sales_table tbody');

        let total_price = Number(sale_t.Qty) * Number(sale_t.Unit_Price);
        sale_t.Total_Price = total_price;

        let total_profit = Number(sale_t.Qty) * Number(sale_t.Unit_Profit);
        sale_t.Total_Profit = total_profit;

        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale_t.Product}</td>
            <td>${sale_t.Qty}</td>
            <td>${sale_t.Unit_Price}</td>
            <td>${sale_t.Total_Price}</td>
            <td>${sale_t.Unit_Profit}</td>
            <td>${sale_t.Total_Profit}</td>
            <td>${sale_t.Order_Platform}</td>
            <td>${sale_t.Customer}</td>
        `;
        sales_table.appendChild(row);
      });
  })
   
  .catch(error => console.error('Error loading finance data:', error));

  // admin section
  // sales table population
fetch('finance_admin.json')
  .then(response => response.json())
  .then(data => { console.log(data);

      let sales_table_admin = document.querySelector('#sales_table_admin tbody');
      sales_table_admin.innerHTML = '';

      data.sales_table.forEach(sale_t => {

        let total_price = Number(sale_t.Qty) * Number(sale_t.Unit_Price);
        sale_t.Total_Price = total_price;

        let total_profit = Number(sale_t.Qty) * Number(sale_t.Unit_Profit);
        sale_t.Total_Profit = total_profit;

        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale_t.Product}</td>
            <td>${sale_t.Qty}</td>
            <td>${sale_t.Unit_Price}</td>
            <td>${sale_t.Total_Price}</td>
            <td>${sale_t.Unit_Profit}</td>
            <td>${sale_t.Total_Profit}</td>
            <td>${sale_t.Order_Platform}</td>
            <td>${sale_t.Customer}</td>
        `;
        sales_table_admin.appendChild(row);
      });

      //platform fees  population
      let platform_fees_summary = document.querySelector('#platform_fees tbody');
      platform_fees_summary.innerHTML = '';

      data.platform_fees.forEach(fee => {
          let row = document.createElement('tr');
          row.innerHTML = `
              <td>${fee.Platform}</td>
              <td>${fee.Total_Sales}</td>
              <td>${fee.Total_Fees}</td>
              <td>${fee.Number_Of_Orders}</td>
          `;
          platform_fees_summary.appendChild(row);
      });

      //expenses table population
      let expenses_table = document.querySelector('#expenses_table tbody');
      expenses_table.innerHTML = '';
      data.expenses.forEach(expense => {
          let row = document.createElement('tr');
          row.innerHTML = `
              <td>${expense.Expense}</td>
              <td>${expense.Date}</td>
              <td>${expense.Spend_Amount}</td>
          `;
          expenses_table.appendChild(row);
      });

      //finance summary population
      let finance_summary_admin = document.querySelector('#finance_summary_admin tbody');
      finance_summary_admin.innerHTML = '';

      data.financial_summary.forEach(finance => {
          let row = document.createElement('tr');
          row.innerHTML = `
              <td>${finance.Product_Name}</td>
              <td>${finance.Qty_Sold}</td>
              <td>${finance.Total_Profit}</td>
              <td>${finance.Platform_Fees}</td>
          `;
          finance_summary_admin.appendChild(row);
      });


  })
  .catch(error => console.error('Error loading finance data:', error));

// Inventory page logic

//  manager section
let inventoryData = null;

//global fetch inventory data
fetch('inventory_manager.json')
  .then(response => response.json())  
  .then(data => { inventoryData = data; 
                  console.log("Inventory loaded:", inventoryData);

                  populateCurrentStockTable(data);
                  handleLowStock(data);
    })
.catch(err => console.error("Error loading inventory:", err));  

// current stock table population
function populateCurrentStockTable(data) {             
      let current_stock_table = document.querySelector('.current_stock_table tbody');
      current_stock_table.innerHTML = '';
      data.Current_Stock_Table.forEach(stock =>  { console.log("Current stock",stock);
          let row = document.createElement('tr');
          row.innerHTML = `
              <td>${stock.Product_Name}</td>
              <td>${stock.Current_Stock}</td>
              <td>${stock.Reorder_Level}</td>
              <td>${stock.Supplier}</td>
              <td>${stock.Date_of_Expiry}</td>
          `;
          current_stock_table.appendChild(row);
          console.log("Row added to current stock table",row);
      });
}


// low_stock_section
function handleLowStock(data) {

    let low_Stock_Container = document.querySelector('.low_stock_products');

    // clear previous contents
    low_Stock_Container.innerHTML = '';

    // Use the same array used earlier in the file
    let stockList = data.Current_Stock_Table || [];

    let out_Of_Stock_Products = [];

    stockList.forEach(item => {
      console.log("Checking stock for item:", item);
      // ensure numeric values
      let current = Number(item.Current_Stock) || 0;
      let reorder = Number(item.Reorder_Level) || 0;

       if (current > reorder) {
          return; // skip items that are above reorder level
        }

        //  Low stock adding to the cards 
        let div = document.createElement('div');
        div.className = "low-stock-item";
        div.style.backgroundColor = (current === 0 || current <= reorder*0.5) ? '#ffcccc' : '#fff5b1';
        div.innerHTML = `
            <strong>${item.Product_Name}</strong>
            <div>Current: ${current}</div>
            <div>Reorder Level: ${reorder}</div>`;
        low_Stock_Container.appendChild(div);
        console.log("Created cards count:", low_Stock_Container.children.length);
      });

            // ----- SHOW ALERT -----
    //     if (out_Of_Stock_Products.length > 0 && (location.hash.substring(1) === "inventory")) {
    //     alert(`The following products are out of stock:\n- ${out_Of_Stock_Products.join("\n- ")}`);
    // }
      
}

window.addEventListener("hashchange", () => {
    if (location.hash.substring(1) === "inventory" && inventoryData) {
        handleLowStock(inventoryData);
    }
});
        