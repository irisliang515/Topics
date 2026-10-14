console.log(products);


let productList = document.getElementById("productList");

let currentProduct = null;
let currentQty = 1;

// 分類菜單
function showProducts(category, btn) {
    let buttons = document.querySelectorAll(".category-btn");
    buttons.forEach(function(item){
        item.classList.remove("btn-warning");
        item.classList.add("btn-light");
    });
    if (btn) {
        btn.classList.remove("btn-light");
        btn.classList.add("btn-warning");
    }

    let result;
    if (category=="全部") {
        result = products;
    }else {
        result = products.filter(function(item){
            return item.category == category;
        });
    }

    let html ="";
    
    result.forEach(function(product){
        
        let card = `
        <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
        
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
        <h5 class="card-title">${product.name}</h5>
        <p class="price">NT$${product.price}</p>
        <div class ="input-group">
        
        <button onclick="decreaseQty(${product.id})" class="qty-btn">
        <i class="bi bi-dash-square-dotted"></i>
        </button>
        <input id="qty${product.id}" type="number" value="1" min="1" readonly class="form-control text-center">
        <button onclick="increaseQty(${product.id})" class="qty-btn">
        <i class="bi bi-plus-square-dotted"></i>
        </button>
        
        </div>
        <button onclick="openCustomizeModal(${product.id})" class="btn btn-success w-100">加入購物車</button>
        </div>
        </div>
        </div>
        `;
        
        html += card;
    });
    productList.innerHTML = html;

}

function openCustomizeModal(id){
    currentProduct = products.find(function(item){
        return item.id == id;
    });

    currentQty = Number(document.getElementById("qty"+id).value);

    if(!currentProduct.options){
        addCart(id);
        return;
    }

    document.getElementById("modalProductName").innerText = currentProduct.name;

    let html = "";

    if(currentProduct.options){

        if(currentProduct.options.checkbox){

            currentProduct.options.checkbox.forEach(function(item){

                html += `
                <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        value="${item.text}">

                    <label class="form-check-label">
                        ${item.text}
                        ${item.price>0 ? "(+NT$"+item.price+")" : ""}
                    </label>
                </div>
                `;

            });

        }

        if(currentProduct.options.radio){

            html += `<h6 class="mt-3">${currentProduct.options.radio.title}</h6>`;

            currentProduct.options.radio.list.forEach(function(item,index){

                html += `
                <div class="form-check">

                    <input
                        class="form-check-input"
                        type="radio"
                        name="radioOption"
                        value="${item.text}"
                        ${index==0 ? "checked" : ""}>

                    <label class="form-check-label">
                        ${item.text}
                    </label>

                </div>
                `;
            });
        }
    }

    document.getElementById("modalOptions").innerHTML = html;

    let modal = new bootstrap.Modal(document.getElementById("customizeModal"));

    modal.show();
}

let cart = [];
function addCart(id) {
    let product = products.find(function (item) {
        return item.id == id;
    });
    let qty = Number(document.getElementById("qty" + id).value);
    
    let cartItem = cart.find(function(item){
        return item.id == id;
    });
    if (cartItem) {
        cartItem.qty += qty;
    }else{
        cart.push({
            // id: product.id,
            // name: product.name,
            // price: product.price,
            ...product,
            qty: qty
        });
    }
    
    document.getElementById("qty" + id).value = 1;
    saveCart();
    showCart();
    showToast(product.name + " 已加入購物車！");
}


function showCart() {
    let cartList = document.getElementById("cartList");
    let total = 0;
    cartList.innerHTML = "";
    cart.forEach(function (item, index) {
        cartList.innerHTML +=`
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h6>${item.name}</h6>
                    <p class="cart-options">${item.options ? item.options.join("、") : ""}</p>
                    <p class="cart-price">NT$${item.price * item.qty}</p>
                </div>
                
                <div class="d-flex align-items-center">
                    <button onclick="decreaseCartQty(${index})">
                    <i class="bi bi-dash-square-dotted"></i>
                    </button>
                    <span class="mx-3">${item.qty}</span>
                    <button onclick="increaseCartQty(${index})">
                    <i class="bi bi-plus-square-dotted"></i>
                    </button>
                </div>
            </div>
            <hr>
        `;
        total += item.price * item.qty;
    });
    document.getElementById("total").innerText = total;
}

function decreaseCartQty(index) {
    if (cart[index].qty > 1) {
        cart[index].qty --;
    }else {
        cart.splice(index,1); 
    }
    saveCart();
    showCart();
}

function increaseCartQty(index) {
    cart[index].qty ++;
    saveCart();
    showCart();
}

function increaseQty(id) {
    let qtyInput = document.getElementById("qty" + id);
    let qty = Number(qtyInput.value);
    qty++;
    qtyInput.value = qty;
}

function decreaseQty(id) {
    let qtyInput = document.getElementById("qty" + id);
    let qty = Number(qtyInput.value);
    if (qty > 1) {
        qty--;
    }
    qtyInput.value = qty;
}

function saveCart() {
    localStorage.setItem("cart",JSON.stringify(cart));
}

function loadCart() {
    let data = localStorage.getItem("cart");
    if (data) {
        cart = JSON.parse(data);
    }
}

function showToast(message) {
    document.getElementById("toastMessage").innerText = message;
    let toast = document.getElementById("cartToast");
    let toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
    toastBootstrap.show();
}

function toggleCart() {
    // console.log("有");
    
    let cartArea = document.getElementById("cartArea");
    let cartInner = document.querySelector(".cart-inner");
    let arrow = document.getElementById("arrow");
    if (cartArea.style.display == "none") {
        cartArea.style.display = "flex";
        cartInner.style.height = "85vh";
        arrow.className="bi bi-chevron-up";
    }else {
        cartArea.style.display = "none";
        cartInner.style.height = "auto";
        arrow.className="bi bi-chevron-down";
    }
}

function confirmAddCart(){
    let options = [];
    let extraPrice = 0;
    let checks = document.querySelectorAll("#modalOptions input[type='checkbox']");
    
    checks.forEach(function(check){
        if(check.checked){
            options.push(check.value);
            let option = currentProduct.options.checkbox.find(function(item){
                return item.text == check.value;
            });
            extraPrice += option.price;
        }
    });

    let radio = document.querySelector("#modalOptions input[type='radio']:checked");

    if (radio) {
        options.push(radio.value);
    }
    
    cart.push({
        ...currentProduct,
        qty:currentQty,
        price:currentProduct.price + extraPrice,
        options:options
    });

    saveCart();
    showCart();
    showToast(currentProduct.name + " 已加入購物車！");

    bootstrap.Modal.getInstance(document.getElementById("customizeModal")).hide();

    document.getElementById("qty"+currentProduct.id).value = 1;
}

function checkout(){
    if(cart.length==0){
        showToast("購物車沒有商品！");
        return;
    }
    showToast("🎉 訂單已送出，感謝您的訂購！");

    cart=[];

    saveCart();
    showCart();
}

// buttons.forEach(function(item){
//     item.classList.remove("active");
// });
// btn.classList.add("active");


loadCart();
showCart();

let firstBtn = document.querySelector(".category-btn");
showProducts("全部", firstBtn);