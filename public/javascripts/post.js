var post1 =document.querySelector('#post1')
var post =document.querySelector('#post')
var show =document.querySelector('#show')


var cross = document.querySelector('#cross')
var create = document.querySelector('#create')

show.addEventListener("click", function(){
    post1.style.display = "flex"
})

cross.addEventListener("click", function(){
    post1.style.display = "none"
})

