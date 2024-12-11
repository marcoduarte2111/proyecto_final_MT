$('.buttons').on('click', function(e){
    const new_page = e.target.className
    window.location.href= `./options/${new_page}.html`
})