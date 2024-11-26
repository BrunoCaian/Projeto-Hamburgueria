const menu = document.querySelector('#menu')
const cartBtn = document.querySelector('#cart-btn')
const cartModal = document.querySelector('#cart-modal')
const cartItemsContainer = document.querySelector('#cart_items')
const cartTotal = document.querySelector('#cart_total')
const checkoutBtn = document.querySelector('#checkout-btn')
const closeModalBtn = document.querySelector('#close_modal-btn')
const cartCounter = document.querySelector('#cart-count')
const addressInput = document.querySelector('#address')
const addressWarn = document.querySelector('#address-warn')

let cart = []

cartBtn.addEventListener('click', (e) =>{
    uptadeCartModal()
    cartModal.style.display = "flex"
})

cartModal.addEventListener('click', (e) =>{
    if(e.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener('click', () =>{
    cartModal.style.display = 'none'
})

menu.addEventListener('click', (e)=>{
    let parentButton = e.target.closest('.add-to-cart-btn')
    if(parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parentButton.getAttribute('data-price')

        addToCart(name, price)
    }
})

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem) {
       existingItem.quantity += 1
    }else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    
    uptadeCartModal()
}

function uptadeCartModal() {
    cartItemsContainer.innerHTML = ''
    let total = 0
    cart.forEach(item=>{
        const btnRemove = document.querySelector('#btn-remove')
        const cartItemsElement = document.createElement('div')
        cartItemsElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')
        cartItemsElement.innerHTML = `
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="font-medium">Nome: ${item.name}</p>
            <p class="font-medium ">Preço: R$ ${item.price}</p>
            <p class="mb-2">Quantidade: ${item.quantity}</p>
          </div>  

            <button class="remove-from-cart-btn" data-name="${item.name}">
               Remover 
            </buttom>
            
        </div>`

        total += item.price * item.quantity
        cartItemsContainer.appendChild(cartItemsElement)
    })
    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

    cartCounter.innerHTML = cart.length
}

cartItemsContainer.addEventListener('click',(e)=>{
    if(e.target.classList.contains('remove-from-cart-btn')) {
        const name = e.target.getAttribute('data-name')
        removeItemCart(name)
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item=> item.name === name)
    if(index !== -1){
       const item = cart[index]  
       if(item.quantity > 1) {
        item.quantity -= 1
        uptadeCartModal()
        return
       }

       cart.splice(index, 1)
       uptadeCartModal()
    }
}

addressInput.addEventListener('input', (e)=>{
    let inputValue = e.target.value
    if(inputValue !== '') {
        addressInput.classList.remove('border-red-500')
        addressWarn.classList.add('hidden')
    }
})

checkoutBtn.addEventListener('click', ()=>{

    const isOpen = checkRestaurantOpen()
    if(!isOpen){
        Toastify({
            text: "Ops, a hamburgeria está fechada!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            }, 
        }).showToast()
        return
    }

    if(cart.length === 0) return
    if(addressInput.value === '') {
        addressWarn.classList.remove('hidden')
        addressInput.classList.add('border-red-500')
        return
    }

    const cartItems = cart.map((item)=> {
        return (
             `Nome: (${item.name}) Preço: (R$ ${item.price}) Quantidade: (${item.quantity})... `
        )
    }).join('')
    const message = encodeURIComponent(cartItems)
    const phone = '5588981624144'
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = []
    uptadeCartModal()
})

function checkRestaurantOpen(){
    const data = new Date()
    const hours = data.getHours()
    return hours >= 18 && hours < 22
}

const dateItem = document.querySelector('#date')
const isOpen = checkRestaurantOpen()

if(isOpen) {
    dateItem.classList.remove('bg-red-500')
    dateItem.classList.add('bg-green-600')
}else {
    dateItem.classList.remove('bg-green-600')
    dateItem.classList.add('bg-red-500')
}