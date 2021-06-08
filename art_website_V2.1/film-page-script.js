const film_page_cinema_img = document.getElementById("film-page-cinema-img");
const film_page_projector_img = document.getElementById("film-page-projector-img");
const film_page_video_container = document.getElementById("film-page-video-container");
const film_page_nav_left = document.getElementById("film-page-nav-left");
const film_page_nav_right = document.getElementById("film-page-nav-right");
var transitionEnd = transitionEndEventName();

// I took it out cause now Im testing it on the music page
 // ONLY FOR TESTING THAT WHEN I CLICK THE VIDEO APPEARS NICELY
/* const dummy_link = document.getElementById("dummy-link-for-test");
dummy_link.addEventListener("click",startCinemaVideo);  */



function startCinemaVideo() {
    expandScreen();
}

function hideFilmMenu(){
    film_page_nav_left.classList.remove("show");
    film_page_nav_right.classList.remove("show");
}

function showFilmMenu(){
    film_page_nav_left.classList.add("show");
    film_page_nav_right.classList.add("show");
}

function expandScreen() {
    hideFilmMenu();
    //since both sides of the nav do the same transition, just cheking one side is enough
    film_page_nav_left.addEventListener(transitionEnd, function _listener() {
        film_page_nav_left.removeEventListener(transitionEnd, _listener);

        film_page_projector_img.classList.toggle("hidden");
        film_page_cinema_img.classList.toggle("hidden");
        film_page_video_container.style.height = "49%";
        film_page_video_container.addEventListener(transitionEnd, function _listener() {
            removeEventListener(transitionEnd, _listener);
            playVideo();
      });
      });

      
}

function playVideo() {
    const output =`
    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/kDlEvaKBkhU?autoplay=1" allow="autoplay" frameborder="0"></iframe>
  `;
  film_page_video_container.innerHTML = output;
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