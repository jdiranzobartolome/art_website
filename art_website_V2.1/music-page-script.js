const music_page_piano_img = document.getElementById("music-page-piano-img");
const music_page_tv_img = document.getElementById("music-page-tv-img");
const music_page_video_container = document.getElementById("music-page-video-container");
const music_page_nav_left = document.getElementById("music-page-nav-left");
const music_page_nav_right = document.getElementById("music-page-nav-right");
const music_page_content = document.getElementById("music-page-content");
const ghost_img = document.getElementById("ghost-img");
const ghost_elements = Array.from(ghost_img.children);
var music_page_player = document.getElementById("music-page-player");
var transitionEnd = transitionEndEventName();


// ONLY FOR TESTING THAT WHEN I CLICK THE VIDEO APPEARS NICELY
// const dummy_link = document.getElementById("dummy-link-for-test");
// dummy_link.addEventListener("click", () => startMusicVideo()); 


// function for creating or disintegrating the ghost image. It is a recursive funcition which
// calls itself continuously.
function ghostImage(index, dissapear) {
    // Remove hide from the ghost_img in case it was hidden from previous iterations.
    ghost_img.classList.remove("hide");
    /* la position del background se podria poner en CSS pero habria que hacerlo 
            individualmente para cada uno de los ghost elements, que son muchos. Así que 
            lo hago con javascript */
    ghost_elements[index].style.backgroundPosition = `${index*(-10)}px 0px`
    ghost_elements[index].classList.add("show");
    ghost_elements[index].addEventListener('transitionend', () => {
       // We will enter here for the first transition end, we could check for which 
       // transitions are thby checking out event.type, but we dont need it. 
       if (ghost_elements.length !== (index + 1)) {
        ghostImage(index + 1, dissapear);
       } else if (dissapear) {
               // Once the image is totally created we can safely make it 
               // dissapear and remove all "show"
               ghost_img.classList.add('hide');
               ghost_img.addEventListener('transitionend', function _listener_2(e) {
                // IMPORTANT!!
                // Checking the target so the event is not fired by transitionend of 
                // its children (events bubble up through their parents chaing)
                if (e.target !== ghost_img) {return}
                ghost_img.removeEventListener('transitionend', _listener_2);
                ghost_elements.forEach((item) => item.classList.remove("show"));
                console.log('transitionend fired');
              });  
        }
    }, { once: true }); 

    // Now that the ghost image got created, we make it dissapear inmmediately.
    // But not the whole image (we could use ghostImage() with the second argument
    // to true to make it dissapear one element at a time, but I like it better 
    // with the whole image dissapearing as a whole. )
}

function startMusicVideo() {
    startTV();
}

function hideMusicMenu(){
    music_page_nav_left.classList.remove("show");
    music_page_nav_right.classList.remove("show");
}

function showMusicMenu(){
    music_page_nav_left.classList.add("show");
    music_page_nav_right.classList.add("show");
}

function startTV() {
    hideMusicMenu();
    //ghostImage(0, true)

    fitMusicVideoContainer();
    //since both sides of the nav do the same transition, just cheking one side is enough
    music_page_nav_left.addEventListener(transitionEnd, function _listener() {
        music_page_nav_left.removeEventListener(transitionEnd, _listener);
        music_page_tv_img.classList.toggle("hidden");
        music_page_piano_img.classList.toggle("hidden");
        music_page_video_container.style.opacity = "1";
        music_page_video_container.style.pointerEvents = "all";
        music_page_video_container.addEventListener(transitionEnd, function _listener() {
            removeEventListener(transitionEnd, _listener);
            playMusicVideo();
      });
      });
      
}

function playMusicVideo() {
    const output =`
    <img src="./img/music-page/film-grainy-texture.png" alt="" class="TV-filter-img"></img>
    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/Hb8-3Rg7e9s?autoplay=1" allow="autoplay" frameborder="0"></iframe>
  `;
  music_page_video_container.innerHTML = output;
}



//https://stackoverflow.com/questions/5023514/how-do-i-normalize-css3-transition-functions-across-browsers/9090128#9090128
//https://medium.com/better-programming/detecting-the-end-of-css-transition-events-in-javascript-8653ae230dc7
// WAY OF PERFORMING TRANSITION END EVENTS CORRECTLY!!!!
function transitionEndEventName () {
    var i,
        undefined,
        el = document.createElement('div'),
        transitions = {
            'transition':'transitionend',
            'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };

    for (i in transitions) {
        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
        }
    }

    //TODO: throw 'TransitionEnd event is not supported in this browser'; 
}

//YOUTUBE VIDEOS NEED TO BE IN /EMBED/ OPTION IN THE URL FOR THEM TO WORK IN WEBSITES OTHER THAN YOUTUBE.

/* media queries equivalent on javascript for attaching the video-container to the TV screen of the tv-img */


//FAILURE!! BUT I KNOW HOW TO DO IT...... CALCULATE IN JAVASCRIPT HEIGHT AND WIDTH OF THE IMAGE AND ITS POSITION AND
// FIND OUT THE FORMULAS TO KNOW HOW INNER POINTS OF AN IMAGE MOVE WHEN AN IMAGE MOVES AND CHANGES DIMENSIONS (WITH SAME RATIO)


 var body = document.body,
    html = document.documentElement;

// function to make the music video container fit the screen of the TV from the image
/*  function fitMusicVideoContainer () {
    
    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    if (w >= 1084) {
        music_page_video_container.style.width = "49%"; 
        music_page_video_container.style.left = "19.5%";
        music_page_video_container.style.height = `${(w - 0.928)/18.81}%`;   
        music_page_video_container.style.top = `${(w - 1864.5)/(-36)}%`; 
    }

    if (w < 1084) {
        music_page_video_container.style.height = "58%";
        music_page_video_container.style.width = `${(w - 1780)/(-14.5)}%`;
        music_page_video_container.style.left = `${(w - 656)/(20.5)}%`;
        music_page_video_container.style.top = "20.5%";
    }

    if ((h < 721) & (w <= 1084)) {
        music_page_video_container.style.height = `${(h - 1391)/(-10.7)}%`;
    }

} 
 */

//FAILURE!! BUT I KNOW HOW TO DO IT...... CALCULATE IN JAVASCRIPT HEIGHT AND WIDTH OF THE IMAGE AND ITS POSITION AND
// FIND OUT THE FORMULAS TO KNOW HOW INNER POINTS OF AN IMAGE MOVE WHEN AN IMAGE MOVES AND CHANGES DIMENSIONS (WITH SAME RATIO)
// absolute coordinate rlettive to viewport of the Image!!!
// with that, and the imagesize (need to find out how to find out that) I could know all their coordinates and imensions
// and try to find out how the innerpoints (the corners of the tv) would move.... 
//https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element-relative-to-the-browser-window


// Definitivo!!! attach a div to some area of an image with constant ratio (like in the case of object-fit: cover)
//
var img_rect = music_page_tv_img.getBoundingClientRect();    
var attachment_rect = music_page_video_container.getBoundingClientRect();
var reference_rect = music_page_content.getBoundingClientRect();

// Calcular las distancias iniciales entre el origen de la imagen y la distancia x e y al origen del attachement cuando está 
// bien colocado. Lo importante es coger esa distancia y tambien mirar el width o height de la imagen en ese momento.
//Tambien es importante que sepas el width y el height del attachment (el attachment a de estar perfecamente colocado sobre el
// area de la imagen que se desea ocupar)
/* var xinit = attachment_rect.left - img_rect.left;
var yinit = attachment_rect.top - img_rect.top;
var img_winit = img_rect.width;
var img_hinit = img_rect.height;
var attachment_winit = attachment_rect.width;
var attachment_hinit = attachment_rect.height;

console.log(xinit);
console.log(yinit);
console.log(img_winit);
console.log(img_hinit);
console.log(attachment_winit);
console.log(attachment_hinit); */

/* Apuntalas: 
xinit = 31.36669921875
yinit = 148.0833282470703
img_winit = 1244
img_hinit = 722
attachment_winit = 610
attachment_hinit = 480

 */

 // Y guardalas como variables constantes:
/* const xinit = 26.566650390625
const yinit = 148.0833282470703
const img_winit = 1316
const img_hinit = 722.4000244140625
const attachment_winit = 987
const attachment_hinit = 426.20001220703125 */

/* var xinit = attachment_rect.left - img_rect.left;
var yinit = attachment_rect.top - img_rect.top;
var img_winit = music_page_tv_img.offsetWidth;
var img_hinit = music_page_tv_img.offsetHeight;
var attachment_winit = music_page_video_container.offsetWidth;
var attachment_hinit = music_page_video_container.offsetHeight; */


//AL FINAL SOLO SE HACERLO PARA CON OBJECT-FIT: CONTAIN. HACERLO Y MAÑANA DEJARLO TODO LIMPIO Y CON LA EXPLICACION!!!!!!


 // Ahora a vas a poder, con estos datos, calcular exactamente la posicion y el tamaño que debe tener el attachment en cada momento,
 //esta función deberá ser llamada al menos una nada más despliegues el attachment (no al inicio de la carga de la página, 
 // ya que algunos elementos podrían o estar preparados aún) y luego cada vez que el usuario modifique el tamaño. 
function fitMusicVideoContainer() {
    
     img_size_info = getImgSizeInfo(music_page_tv_img);
    //console.log(img_size_info); 
   //console.log(attachment_rect.left - img_rect.left);
    //console.log(attachment_rect.top - img_rect.top);  */
    /* console.log(music_page_video_container.offsetWidth);
    console.log(music_page_video_container.offsetHeight); */
 /*    console.log(music_page_content.offsetWidth);
    console.log(music_page_content.offsetHeight); */
  /*   console.log(attachment_rect.left);
    console.log(img_rect.left);
    console.log(reference_rect.left); */



    //calculo de la x de la img con referencia al reference. Como ahora es object-fill: contain, la imagen total siemrpe 
    // tiene su origen en el 0,0 (del div de referencia, el relativo). Pero, cuando aparecen franjas negras, esas franjas 
    // hay que descontarlas de la posicion de origen de la imagen (aunque para la pagina web, el origen sigue siendo el 
    // 0,0)
    // Para cuando esta en "contain"
    /* var x_img = (img_size_info.width < music_page_tv_img.offsetWidth) ? ((music_page_tv_img.offsetWidth - img_size_info.width)/2) : 0;   
    var y_img = (img_size_info.height < music_page_tv_img.offsetHeight) ? ((music_page_tv_img.offsetHeight - img_size_info.height)/2) : 0; */
    
    //para cover. Aquí es importante pensar que, por defecto, el object-position siempre es 50% 50%, es decir, el punto central de la imagen
    // siempre cae en el centro del container. 
    var x_img =  (music_page_content.offsetWidth - img_size_info.width)/2;  
    var y_img = (music_page_content.offsetHeight - img_size_info.height)/2; 

    // calculo de la nueva distancia teorica x e y entre el origen del attachment y el origen de la imagen
    // gracias a los valores de antes y al ratio de la imagen.
    // el offset al final lo añado yo a ojo por corregir pequeños errores. 
    var x = xinit*((img_size_info.width)/img_winit) - 2;
    var y = yinit*((img_size_info.height)/img_hinit) - 1;

    //calculamos el origen del attachment con respecto a la referencia
    var x_attach = x_img + x;
    var y_attach = y_img + y;

    // ahora calculamos el nuevo width y height del attachment, con los ratios
    var w_attach = attachment_winit*((img_size_info.width)/img_winit);
    var h_attach = attachment_hinit*((img_size_info.height)/img_hinit);

    // Finalmente hacemos update en el CSS a los valores del attachment
    music_page_video_container.style.width = `${w_attach}px`; 
    music_page_video_container.style.height = `${h_attach}px`;
    music_page_video_container.style.left = `${x_attach}px`;  
    music_page_video_container.style.top = `${y_attach}px`;

    
  

}
// Por último, añadimos un event listener para que llame a la función y llamamos también a la función justo antes de 
// de desplegar el attachment por primera vez. 
window.addEventListener('resize', fitMusicVideoContainer);

/* window.addEventListener('resize', function() {
    console.log(getImgSizeInfo(music_page_tv_img));
  }); */


//window.addEventListener('resize', calculateInitParams);

function calculateInitParams() {
    var xinit = attachment_rect.left - img_rect.left;
    var yinit = attachment_rect.top - img_rect.top;
    var img_winit = music_page_tv_img.offsetWidth;
    var img_hinit = music_page_tv_img.offsetHeight;
    var attachment_winit = music_page_video_container.offsetWidth; 
    var attachment_hinit = music_page_video_container.offsetHeight;
console.log("----------------");
    console.log(xinit);
console.log(yinit);
console.log(img_winit);
console.log(img_hinit);
console.log(attachment_winit);
console.log(attachment_hinit);
img_size_info = getImgSizeInfo(music_page_tv_img);
console.log(img_size_info);


 }


 // Datos con 1075 x 722 in viewport con object-fit: container, estos estan bien seguro.
const xinit = 209.6500244140625;
const yinit = 151.6999969482422; 
const img_winit = 1075;
const img_hinit = 716.6;
const attachment_winit = 527;
const attachment_hinit = 419;

 // Datos con 1075 x 722 in viewport con object-fit: container, estos estan bien seguro.
/*  const xinit = 141.79998779296875;
 const yinit = 73.23333740234375; 
 const img_winit = 1083;
 const img_hinit = 722;
 const attachment_winit = 527;
 const attachment_hinit = 419; */




// function to knowing the rendered size of a object-fit: contain image (so not the whole "image element" but the imageitself. )
//VITAL ENTENDERLO Y LEER AQUI: https://stackoverflow.com/questions/37256745/object-fit-get-resulting-dimensions
function getRenderedSize(contains, cWidth, cHeight, width, height, pos){
    var oRatio = width / height,
        cRatio = cWidth / cHeight;
    return function() {
      if (contains ? (oRatio > cRatio) : (oRatio < cRatio)) {
        this.width = cWidth;
        this.height = cWidth / oRatio;
      } else {
        this.width = cHeight * oRatio;
        this.height = cHeight;
      }      
      this.left = (cWidth - this.width)*(pos/100);
      this.right = this.width + this.left;
      return this;
    }.call({});
  }
  
  function getImgSizeInfo(img) {
    var pos = window.getComputedStyle(img).getPropertyValue('object-position').split(' ');
     return getRenderedSize(false,
                           img.width,
                           img.height,
                           img.naturalWidth,
                           img.naturalHeight,
                           parseInt(pos[0])); 
  }
  
  