var box1 =document.querySelector('#box1')
var box2 =document.querySelector('#box2')
var box3 =document.querySelector('#box3')
var cross = document.querySelector('#cross')
var create = document.querySelector('#create')

create.addEventListener("click", function(){
    box2.style.display = "flex"
})

cross.addEventListener("click", function(){
    box2.style.display = "none"
})

