const film_page_cinema_img = document.getElementById("film-page-cinema-img");
const film_page_projector_img = document.getElementById("film-page-projector-img");
const film_page_video_container = document.getElementById("film-page-video-container");
const film_page_nav_left = document.getElementById("film-page-nav-left");
const film_page_nav_right = document.getElementById("film-page-nav-right");
const DVD_list = document.getElementById("DVD-list");
const DVD_info_container = document.getElementById("DVD-info-container");
const film_page_back_button = document.getElementById("film-page-back-btn");
const film_page_controls = document.getElementById("film-page-controls");
var transitionEnd = transitionEndEventName();
var current_films = [];
var page_number = 0;

//Event Listeners
film_page_back_button.addEventListener("click", () => filmToMenu());
Array.prototype.slice.call(film_page_controls.children).forEach((item, index) => item.addEventListener("click", () => {
    if (index === 0) {
        page_number -= 1;
        populateFilmMenu(page_number);
    } else {
        page_number += 1;
        populateFilmMenu(page_number);
    }
})); 



// I took it out cause now Im testing it on the music page
 // ONLY FOR TESTING THAT WHEN I CLICK THE VIDEO APPEARS NICELY
/* const dummy_link = document.getElementById("dummy-link-for-test");
dummy_link.addEventListener("click",startCinemaVideo);  */

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
    console.log('entre a expandScren');
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
                    //Okay... remember to always add the Element when doing removeEventListener. 
                    // Also, there is an option in addEventListeners to run it only once.
                    // In addition, besides the removeEventListener method, ther is also a controller.abort() method,
                    // remember all this!
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

async function playVideo(link, type) {
    
    if (type === 'film') {
        //Expanding film screen
        expandScreen();
    } else if (type === 'music') {
        //Opening TV screen
        startTV();
    }


    // Using youtube API for finding out info about the video for fetching the embed video url.
    // Should add some feedback to the user if the request fails.
    console.log(link);
    const res = await fetch(`https://www.youtube.com/oembed?url=${link}&format=json`);
    body = await res.json();

    // Using regex for fetching the url from the embeded object response.
    const urlRegex = /(https?:\/\/[^ ]*)/;
    var embed_link = body.html.match(urlRegex)[1];

    // Starting video
    const output =`
    <iframe width="100%" height="100%" src="${embed_link}" frameborder="0"></iframe>
  `;
    
    if (type === 'film') {
        //playing video on film scree
        film_page_video_container.innerHTML = output;
    } else if (type === 'music') {
        //Opening TV screen
        music_page_video_container.innerHTML = output;
    }
    
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
async function populateFilmMenu(page) {
    // We set the state of global page_number to the page we are populating. 
    page_number = page;

    const res = await fetch('http://localhost:3000/api/films', {
        method: 'GET',
        headers: {
            'page-number': page_number
        }
    });
    body = await res.json();
    // This will the json boydo of the answer, with an array of 6 films and the total number of films.  

    // Now this needs to populate the menu.
    // ALSO: CAREFUL TO NOT USE SAME ID FOR MORE THAN ONE ELEMENT. You made the mistake of 
    // calling all the trailer link elements with same id, that can be dangerous and give problems to the browser too.
    //DVD_list.innerHTML = ''; 
    //saving this in global variable current_films so the info about the current films displayed in meny
    // is available after this function has finished (particularly because the eventlistener
    // will need it)

    current_films = body.films;
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
    console.log(!film_page_controls.firstElementChild.classList.contains('hidden'));
    if (page_number !== 0 && film_page_controls.firstElementChild.classList.contains('hidden')) 
        film_page_controls.firstElementChild.classList.remove('hidden') 
    if (page_number == 0 && !film_page_controls.firstElementChild.classList.contains('hidden')) 
        film_page_controls.firstElementChild.classList.add('hidden') 
    
    console.log(film_page_controls.lastElementChild.classList.contains('hidden'));   
    if ((total_films > ((page_number + 1)*6)) && film_page_controls.lastElementChild.classList.contains('hidden')) 
        film_page_controls.lastElementChild.classList.remove('hidden'); 
    if (!(total_films > ((page_number + 1)*6)) && !film_page_controls.lastElementChild.classList.contains('hidden')) 
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
        playVideo(current_films[index].trailer, 'film');
    })); 

    //Lastly, outside of this function, event listeners will be added to each populated image so when you click on it, the 
    // info is displayed on the left. 
    // ¿WHERE SHOULD I PUT THE EVENT LISTENERS? BECAUSE I AM POPULATING HERE... INVESTIGATE. WHEN YOU FINISH THAT, 
    // MOST THINGS WILL BE DONE!! I GUESS THE EVENT SHOULD BE AS A ARRAY EVENT LISTENER ON TOP OF THIS PAGE, 
    // THEN, THIS FUNCTION SHOULD PUPULATE THEM AND SET THEM TO DISPLAY TRUE, I GUESS WHILE THEY ARE IN DISPLAY OFF THE 
    // CLICK WILL NOT WORK. OR REMEMBER HOW TO DEACTIVATE CLICKS SSO THIS FUNCTION WILL ACTIVATE THE CLICK ONLY 
    // AFTER POPULATING IT. ALSO, MAKE THE IMAGES SMALLER AND ADD LEFT AND RIGHT ARROW LIKE IN THE BOOK EXAMPLE. 
    // AND THE LEFT AND RIGHT ARROW SHOULD APPEAR ONLY WHEN NECESSARY. NO LEFT ARROW FOR PAGE 0. AH... SO MANY THINGS TO DO. 
}