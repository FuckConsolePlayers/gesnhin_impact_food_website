var body = document.getElementsByTagName("body")[0];
var food = [];
var ingridients = [];
$.ajax({

    url: 'https://api.genshin.dev/materials/cooking-ingredients/',

    method: 'GET',

    dataType: 'json',

    data: $(this).serialize(),

    success: function(data){
        for(const [key, value] of Object.entries(data)){
            value["id"] = key;
            ingridients.push(value);
        }
    }
});
    $.ajax({

        url: 'https://api.genshin.dev/consumables/food',
    
        method: 'GET',
    
        dataType: 'json',
    
        data: $(this).serialize(),
    
        success: function(data){
            var body = document.getElementsByTagName("body")[0];
            var count = 0;
            for(const [key, value] of Object.entries(data)){
                food.push(value);
                count = count+1;

                elik = document.createElement("div");
                elik.setAttribute("class",'container');

                el = document.createElement("div");
                el.setAttribute("class",'panel-default');

                var stars = value.rarity;
                while(stars != 0){
                    elem = document.createElement("img");
                    elem.setAttribute("class",'panel-body');
                    elem.setAttribute("src",'https://pixlok.com/wp-content/uploads/2021/07/Rating-SVG-Icon-s9fd-300x300.png');
                    elem.setAttribute("width","32");
                    elem.setAttribute("height","32");
                    elem.setAttribute("align","left");
                    el.appendChild(elem);
                    stars = stars - 1;
                }

                elem = document.createElement("h1");
                elem.setAttribute("class",'panel-body');
                elem.setAttribute("onclick",'show('+count+')');
                elem.innerText = value.name;
                el.appendChild(elem);

                elem = document.createElement("h2");
                elem.setAttribute("class",'panel-body');
                elem.innerText = 'Effect '+value.effect;
                el.appendChild(elem);

                if(value.proficiency != undefined){
                    elem = document.createElement("h2");
                    elem.setAttribute("class",'panel-body');
                    elem.innerText = 'Proficiency '+value.proficiency;
                    el.appendChild(elem);
                }

                elem = document.createElement("p");
                elem.setAttribute("class",'panel-body');
                elem.innerText = value.description;
                el.appendChild(elem);

                elem = document.createElement("p");
                elem.setAttribute("class",'panel-body');
                elem.innerText = '                                                                      \n                                                                                  ';
                el.appendChild(elem);

                elik.appendChild(el);
                body.appendChild(elik);
            }
        }
    });
function show_ingridient(s){
    var found = ingridients[s];
    var a = '<h1>'+found.name+'</h1>';
    a = a + "<p>                                                </p>"
    if(found.sources != undefined){
        a = a+'<h2>Sources</h2>';
        found.sources.forEach(el => {
            a = a + el+'\n';
        });
    }
    a = a + "<p>                                                </p>"
    a = a+'<h2>Description</h2>';
    a = a + '<p>'+found.description+'</p>';
    let timerInterval;
    Swal.fire({
        html: a,
        timer: 25000,
        timerProgressBar: false,
        willClose: () => {
          clearInterval(timerInterval)
        }
      })
}
function show(s){
    var m = food[s-1];
    if(m.hasRecipe){
        var a = "";
        m.recipe.forEach(element => {
            var id = element.item.toLowerCase().replace(' ','-');
            var r = ingridients.findIndex(x=>x.id==id);
            if(r > 0){
                a = a + '<h2 onclick=show_ingridient('+r+')><img width="64" height="64" src="'+'https://api.genshin.dev/materials/cooking-ingredients/'+id+'"></img>'+element.item+': '+element.quantity+'</h2>';
            }
        });
        let timerInterval;
        Swal.fire({
            html: a,
            timer: 25000,
            timerProgressBar: false,
            willClose: () => {
              clearInterval(timerInterval)
            }
          })
    }
    else{
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'error',
            title: m.name+' does not have recipe'
          })
    }
}