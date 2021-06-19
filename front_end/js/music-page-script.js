///////////
// Imports
///////////
import { transitionEndEventName, playVideo } from "./main-script.js";
import { ChangeMenuVideo } from "./menu-page-script.js";


///////////////////////////
// Module global variables
///////////////////////////
const song_list = document.getElementById("song-list");
const music_page_piano_img = document.getElementById("music-page-piano-img");
const music_page_tv_img = document.getElementById("music-page-tv-img");
const music_page_video_container = document.getElementById("music-page-video-container");
export const music_page_nav_left = document.getElementById("music-page-nav-left");
export const music_page_nav_right = document.getElementById("music-page-nav-right");
const music_page_content = document.getElementById("music-page-content");
const ghost_img_container = document.getElementById("ghost-img-container");
const music_page_back_button = document.getElementById("music-page-back-btn");
const ghost_elements = Array.from(ghost_img_container.firstElementChild.children);
const song_info_container = document.getElementById("song-info-container");
const music_page_controls = document.getElementById("music-page-controls");
export var music_page_player = document.getElementById("music-page-player");
var transitionEnd = transitionEndEventName();
var music_page_number = 0;

// Music video screen resizing initial data: calculated for 1075 x 722 in viewport 
// and object-fit: container for the image.
const xinit = 209.6500244140625;
const yinit = 151.6999969482422; 
const img_winit = 1075;
const img_hinit = 716.6;
const attachment_winit = 527;
const attachment_hinit = 419;



///////////////////
// Event Listeners
///////////////////
music_page_back_button.addEventListener("click", () => musicToMenu());

Array.prototype.slice.call(music_page_controls.children).forEach((item, index) => item.addEventListener("click", () => {
    if (index === 0) {
        music_page_number -= 1;
        populateMusicMenu(music_page_number);
    } else {
        music_page_number += 1;
        populateMusicMenu(music_page_number);
    }
})); 

//Event listener for fitting the music video container to the TV image everytime the screen is resized. 
window.addEventListener('resize', fitMusicVideoContainer);


/////////////
// Functions
////////////
function musicToMenu() {
    // Forcing the same effect as if we stopped hovering over the menu "film"
    // link so the video and the visuals of the menu are resetted.
    ChangeMenuVideo(2, false);

    // Removing the song-list menu and moving to menu page. 
    music_page_nav_left.classList.remove("show");
    music_page_nav_right.classList.remove("show");
    document.body.style.transition = "transform 3s ease";
    document.body.style.transform = "translate(0,0)";
    header.style.transition = "transform 3s ease"
    header.style.transform = "translate(0,0)";
}


// Recursing function for creating the ghost image (or making it dissapear)
export function ghostImage(index, dissapear) {
    // Remove hide from the ghost_img in case it was hidden from previous iterations.
    ghost_img_container.classList.remove("hide");
    ghost_img_container.style.visibility='visible';

    // setting the position of each ghost element 
    ghost_elements[index].style.backgroundPosition = `${index*(-10)}px 0px`
    ghost_elements[index].classList.add("show");

    // TransitionEnd event listener for knowing when the ghost image is complete.
    ghost_elements[index].addEventListener(transitionEnd, () => { 

       if (ghost_elements.length !== (index + 1)) {

        ghostImage(index + 1, dissapear);

       } else if (dissapear) {
               // Once the image is totally created we can safely make it 
               // dissapear and remove all "show"
               ghost_img_container.classList.add('hide');
               ghost_img_container.addEventListener(transitionEnd, function _listener_2(e) {
                
                // Events bubble up from the children to their parents too, so we need to check the 
                // target to make sure the transition end event was triggered by the ghost image and not
                // by its ghost element children (since those are also transitioning at a faster rate)
                if (e.target !== ghost_img_container) {return}

                ghost_img_container.removeEventListener(transitionEnd, _listener_2);
                ghost_elements.forEach((item) => item.classList.remove("show"));
                ghost_img_container.style.visibility = 'hidden';
              });  
        }
    }, { once: true }); 

}

function hideMusicMenu(){
    music_page_nav_left.classList.remove("show");
    music_page_nav_right.classList.remove("show");
    music_page_back_button.style.visibility = 'hidden';
}

function showMusicMenu(){
    music_page_nav_left.classList.add("show");
    music_page_nav_right.classList.add("show");
    music_page_back_button.style.visibility = 'visible';
}

function hideTV() {
    showMusicMenu();
    music_page_tv_img.classList.toggle("hidden");
    music_page_piano_img.classList.toggle("hidden");
    // Not necessary, but it is not a bad idea
    // to add an eventListener after toggling hidden transitions so when the transition 
    // finishes, the object does really go visibility=hidden. In this case I do not want the 
    // transition when dissapearing so I turn it hidden before. 
    music_page_video_container.style.visibility = "hidden";
    music_page_video_container.style.opacity = "0";
    music_page_video_container.style.pointerEvents = "none";
    
}

function startTV() {
    hideMusicMenu();
    //ghostImage(0, true)

    fitMusicVideoContainer();

    //since both sides of the nav do the same transition, just cheking one side is enough
    music_page_nav_left.addEventListener(transitionEnd, () => {
        music_page_tv_img.classList.toggle("hidden");
        music_page_piano_img.classList.toggle("hidden");
        music_page_video_container.style.visibility = "visible";
        music_page_video_container.style.opacity = "1";
        music_page_video_container.style.pointerEvents = "all";
        music_page_video_container.addEventListener(transitionEnd, function _listener() {
            // The TV image will close when clicking outside of the TV screen. I put it here
            // so the click is only accepted after the TV image and screen appeared.
            document.body.addEventListener("click", function _listener_3(e) {
                console.log("Hide TV Listener");
                if ((e.target !== music_page_video_container) && (music_page_video_container.innerHTML !== '')) {
                    //Okay... remember to always add the Element when doing removeEventListener. 
                    // Also, there is an option in addEventListeners to run it only once.
                    // In addition, besides the removeEventListener method, ther is also a controller.abort() method,
                    // remember all this!
                    hideTV();
                    document.body.removeEventListener("click", _listener_3);
                    music_page_video_container.innerHTML = '';

                }
            }, );
      }, { once: true });
      }, {once: true });
      
}

export async function populateMusicMenu(page) {
    // We set the state of global page_number to the page we are populating. 
    music_page_number = page;
  
    const res = await fetch('http://localhost:3000/api/songs', {
        method: 'GET',
        headers: {
            'page-number': music_page_number
        }
    });
    let body = await res.json();
  
    let current_songs = body.songs;
    const total_songs = body['total-songs'];
  
    // Reset of the DVD list, so the list gets populated from scratch.
    song_list.innerHTML = '';
    current_songs.forEach((item, index) => {
        song_list.innerHTML += `<li class="item">
                                  <div class="item__main-img item__main-img--music-page">
                                    <img src="${item.imglink}" alt="">
                                  </div>
                                  <div class="item__secondary-img item__secondary-img--music-page">
                                    <img src="./img/film-page/action.png" id="music-video-link-${index}" alt="">
                                  </div>
                               </li>`
    });
  
    // show the arrow controls that are necessary, depending on the number of page and whether there are 
    // more songs to fetch. 
    console.log(!music_page_controls.firstElementChild.classList.contains('hidden'));
    if (music_page_number !== 0 && music_page_controls.firstElementChild.classList.contains('hidden')) 
        music_page_controls.firstElementChild.classList.remove('hidden') 
    if (music_page_number == 0 && !music_page_controls.firstElementChild.classList.contains('hidden')) 
        music_page_controls.firstElementChild.classList.add('hidden') 
    
    console.log(music_page_controls.lastElementChild.classList.contains('hidden'));   
    if ((total_songs > ((music_page_number + 1)*6)) && music_page_controls.lastElementChild.classList.contains('hidden')) 
        music_page_controls.lastElementChild.classList.remove('hidden'); 
    if (!(total_songs > ((music_page_number + 1)*6)) && !music_page_controls.lastElementChild.classList.contains('hidden')) 
        music_page_controls.lastElementChild.classList.add('hidden');
    
    // Adding the click addEventListeners so the info of the songs appears when clicking on the image 
    Array.prototype.slice.call(song_list.children).forEach((item, index) => item.firstElementChild.firstElementChild.addEventListener("click", () => {
        console.log(current_songs[index]);
        document.getElementById('song-title').innerHTML = `${current_songs[index].title}`;
        document.getElementById('song-artist').innerHTML = `by ${current_songs[index].artist}`;
        document.getElementById('song-country-year').innerHTML = `${current_songs[index].country}, ${current_songs[index].year}`;
        document.getElementById('song-info').innerHTML = `${current_songs[index].info}`;
        // Modificar esto para que solo desaparezca clicando la misma. Si clicas otra imagen, no. 
        // Ya que lo único que tiene que pasar es que se cambie la información. 
        song_info_container.classList.toggle('hidden');
    })); 
    
    // Get all elements whose id start with "music-video-link" (created just now with ninnerHTML) and add event listeners.
    document.querySelectorAll('[id^="music-video-link"]').forEach((item, index) => item.addEventListener("click", () => {
        startTV();
        playVideo(current_songs[index].music_video, music_page_video_container);
    })); 
   
}

//////////////////////////////////////////////////////////////////////////////
// Functions related to resizing the music video screen to fit with the TV img
//////////////////////////////////////////////////////////////////////////////

 
//esta función deberá ser llamada al menos una nada más despliegues el attachment (no al inicio de la carga de la página, 
// ya que algunos elementos podrían o estar preparados aún) y luego cada vez que el usuario modifique el tamaño. 
function fitMusicVideoContainer() {
    
     let img_size_info = getImgSizeInfo(music_page_tv_img);

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


// function to knowing the rendered size of a object-fit: contain image (so not the whole "image element" but the imageitself. )
// More info here: https://stackoverflow.com/questions/37256745/object-fit-get-resulting-dimensions
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


  ///////////////////////////////////////////////////////////////////////////////////////////////////
// Initial Parameter calculation for the resizing functioning of the screen on top of the TV image. 
// ////////////////////////////////////////////////////////////////////////////////////////////////

// //window.addEventListener('resize', calculateInitParams);

// function calculateInitParams() {
//     var xinit = attachment_rect.left - img_rect.left;
//     var yinit = attachment_rect.top - img_rect.top;
//     var img_winit = music_page_tv_img.offsetWidth;
//     var img_hinit = music_page_tv_img.offsetHeight;
//     var attachment_winit = music_page_video_container.offsetWidth; 
//     var attachment_hinit = music_page_video_container.offsetHeight;

//    img_size_info = getImgSizeInfo(music_page_tv_img);

//  }
