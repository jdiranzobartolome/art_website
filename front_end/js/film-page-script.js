///////////
// Imports
///////////
import { transitionEndEventName, playVideo } from "./main-script.js";
import { ChangeMenuVideo } from "./menu-page-script.js";


///////////////////////////
// Module global variables
///////////////////////////
const film_page_cinema_img = document.getElementById("film-page-cinema-img");
const film_page_projector_img = document.getElementById("film-page-projector-img");
const film_page_video_container = document.getElementById("film-page-video-container");
export const film_page_nav_left = document.getElementById("film-page-nav-left");
export const film_page_nav_right = document.getElementById("film-page-nav-right");
const DVD_list = document.getElementById("DVD-list");
const DVD_info_container = document.getElementById("DVD-info-container");
const film_page_back_button = document.getElementById("film-page-back-btn");
const film_page_controls = document.getElementById("film-page-controls");
var transitionEnd = transitionEndEventName();
var current_films = [];
var film_page_number = 0;


///////////////////
// Event Listeners
///////////////////
film_page_back_button.addEventListener("click", () => filmToMenu());

Array.prototype.slice.call(film_page_controls.children).forEach((item, index) => item.addEventListener("click", () => {
    if (index === 0) {
        film_page_number -= 1;
        populateFilmMenu(film_page_number);
    } else {
        film_page_number += 1;
        populateFilmMenu(film_page_number);
    }
})); 


/////////////
// Functions
////////////
function filmToMenu() {
    // Forcing the same effect as if we stopped hovering over the menu "film"
    // link so the video and the visuals of the menu are resetted. However, 
    // I need to find out why this is needed.This function is deined in menu-page-script.js
    ChangeMenuVideo(0, false);
    // Removing the DVD-list menu and moving to menu page. 
    film_page_nav_left.classList.remove("show");
    film_page_nav_right.classList.remove("show");
    document.body.style.transition = "transform 3s ease";
    document.body.style.transform = "translate(0,0)";
    header.style.transition = "transform 3s ease"
    header.style.transform = "translate(0,0)";

}

function hideFilmMenu(){
    film_page_nav_left.classList.remove("show");
    film_page_nav_right.classList.remove("show");
    film_page_back_button.style.visibility = 'hidden';
}

function showFilmMenu(){
    film_page_nav_left.classList.add("show");
    film_page_nav_right.classList.add("show");
    film_page_back_button.style.visibility = 'visible';
}

function expandScreen() {
    hideFilmMenu();
    //since both sides of the nav do the same transition, just cheking one side is enough
    film_page_nav_left.addEventListener(transitionEnd, function _listener_1() {

        film_page_projector_img.classList.toggle("hidden");
        film_page_cinema_img.classList.toggle("hidden");
        film_page_video_container.style.height = "49%";
        film_page_video_container.addEventListener(transitionEnd, function _listener_2() {

            // The screen will retract when clicking outside of it. I put it here
            // so the click is only accepted after the screen has been
            // totally expanded. 
            document.body.addEventListener("click", function _listener_3(e) {
                console.log("Hide Screen Listener");
                if ((e.target !== film_page_video_container) && (film_page_video_container.innerHTML !== '')) {
                    hideScreen();
                    document.body.removeEventListener("click", _listener_3);
                    film_page_video_container.innerHTML = '';

                }
            }, ); 
      }, { once: true });
      }, { once: true }); 
}

function hideScreen() {
    console.log('entre a HideScren');
    film_page_projector_img.classList.toggle("hidden");
    film_page_cinema_img.classList.toggle("hidden");
    film_page_video_container.style.height = "0%"; 
    showFilmMenu();
}

export async function populateFilmMenu(page) {
    // We set the state of global film_page_number to the page we are populating. 
    film_page_number = page;

    const res = await fetch('http://localhost:3000/api/films', {
        method: 'GET',
        headers: {
            'page-number': film_page_number
        }
    });
    
    // The server will answer with a max of six films from the database
    let body = await res.json();

 
    let current_films = body.films;
    const total_films = body['total-films'];

    // Reset of the DVD list, so the list gets populated from scratch.
    DVD_list.innerHTML = '';
    current_films.forEach((item, index) => {
        DVD_list.innerHTML += `<li class="item">
                                  <div class="item__main-img item__main-img--film-page">
                                    <img src="${item.imglink}" alt="">
                                  </div>
                                  <div class="item__secondary-img item__secondary-img--film-page">
                                    <img src="./img/film-page/action.png" id="trailer-link-${index}" alt="">
                                  </div>
                               </li>`
    });

    // show the arrow controls that are necessary, depending on the number of page and wether there are 
    // more films to fetch. 
    if (film_page_number !== 0 && film_page_controls.firstElementChild.classList.contains('hidden')) 
        film_page_controls.firstElementChild.classList.remove('hidden') 
    if (film_page_number == 0 && !film_page_controls.firstElementChild.classList.contains('hidden')) 
        film_page_controls.firstElementChild.classList.add('hidden') 
     
    if ((total_films > ((film_page_number + 1)*6)) && film_page_controls.lastElementChild.classList.contains('hidden')) 
        film_page_controls.lastElementChild.classList.remove('hidden'); 
    if (!(total_films > ((film_page_number + 1)*6)) && !film_page_controls.lastElementChild.classList.contains('hidden')) 
        film_page_controls.lastElementChild.classList.add('hidden');

    // Adding the click addEventListeners so the info of the DVD appears when clicking on the image 
    Array.prototype.slice.call(DVD_list.children).forEach((item, index) => item.firstElementChild.firstElementChild.addEventListener("click", () => {
        document.getElementById('film-title').innerHTML = `${current_films[index].title}`;
        document.getElementById('film-director').innerHTML = `by ${current_films[index].director}`;
        document.getElementById('film-country-year').innerHTML = `${current_films[index].country}, ${current_films[index].year}`;
        document.getElementById('film-info').innerHTML = `${current_films[index].info}`;
        // Modificar esto para que solo desaparezca clicando la misma. Si clicas otra imagen, no. 
        // Ya que lo único que tiene que pasar es que se cambie la información. 
        DVD_info_container.classList.toggle('hidden');
    })); 

    // Get all elements whose id start with "trailer-link" and add event listeners.
    document.querySelectorAll('[id^="trailer-link"]').forEach((item, index) => item.addEventListener("click", () => {
        expandScreen();
        playVideo(current_films[index].trailer, film_page_video_container);
    })); 

}