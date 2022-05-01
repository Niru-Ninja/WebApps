document.addEventListener('DOMContentLoaded', function(){
    const path = "http://" + String(window.location.host) + "/todos_los_comentarios";
    fetch(path)
        .then(response => response.json())
        .then(data => {
            //Fit results in the HTML:
            for(let i in data){
                document.getElementById("reseñas_resultados").innerHTML += '<div class="comentario"><h2>'+
                data[i].nombre +' '+ data[i].apellido +
                '</h2><p>'+ data[i].comentario +'</p></div>';
            }
        });
});