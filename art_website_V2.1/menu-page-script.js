///////////////////////////////
//// variables for main-page //
///////////////////////////////
//Be careful, this variable is in this script and in film-page script.
var page_number = 0;
const song_list = document.getElementById("song-list");
const song_info_container = document.getElementById("song-info-container");
const music_page_back_button = document.getElementById("music-page-back-btn");
const music_page_controls = document.getElementById("music-page-controls");

const header = document.getElementById("header");
const password_popup = document.getElementById("password-popup");
const password_popup_close_btn = document.getElementById(
  "password-popup-close-btn"
);
const menu_page_video = document.getElementById("menu-page-video");
const menu_page_overlay = document.getElementById("menu-page-overlay");
const menu_page_links = document.querySelectorAll(".page--main-page a");
const art_form_selectors = [].slice.call(
  document.getElementById("art-form-selector").children
);
const music_link_add_btn = document.getElementById("music-link-add-btn");
const film_link_add_btn = document.getElementById("film-link-add-btn");
const book_link_add_btn = document.getElementById("book-link-add-btn");
const art_form_btn = document.getElementById("art-form-btn");
const art_form_wrapper = document.getElementById("art-form-wrapper");
const menu_page_art_forms = document.querySelectorAll(".page--main-page .form"); //instead of .form, the query could also be done over action tag)

////////////////////////////////////
// Event listeners for main-page ///
////////////////////////////////////
//NOTA!! THERE ARE MAAAANY WAYS TO DEFINE THE FUNCTIONS OF THE EVENTLISTENER, IN THIS CASE I USED AN ARROW FUNCTION
// WHICH ALLOWED ME TO PASS SOME PARAMETERS. ANONYMOUS FUNCTIONS ARE THE ONES TO USE WHEN
// YOU NEED SOME PARAMETERS BECAUSE THE USE OF PARENTHESIS ON THE NAME OF THE EXISTING FUNCTION WOULD
// WORK AS A CALL, SO YOU WOULD CALL THE FUNCTION DIRECTLY.  WHEN THERE IS NO PARAMETER YOU CAN JUST DIRECTLY PASS THE FUNCTION
// AND ALSO THERE IS HARDER THIGNS TO DO WHEN YOU WANT THE EVENT TO HAVE THE POSSIBILITY TO BE REMOVED
//SINCE FOR THAT YOU NEED TO DEFINE A FUNCTION WITH A NAME.... LEER SOBRE ESTAS COSAS
// Al final lo cambie a como creo que tenia que hacer. EN LUGAR DE USAR EL INDEX DE ESE FOR EACH,
// USE EL ARGUMENTO DE "event" QUE ENVIA EL EVENTLISTENER Y RECALCULÉ EL INDEX Y LO QUE NECESITABA
// CON LA PROPIEDAD DE event.target.
// DEJO OTROS CON EL INDEX, UN CON EVENT Y OTRO SIN EVENT, SÓLO PARA TENER VARIEDAD DE FORMAS DE HACER LO MISMO. PERO
// CREO QUE EL MÁS CORRECTO ES EL DE LOS QUE NO USAN EL INDEX NI PARAMETROS EXTRA PARA LA FUNCION CALLBACK.
menu_page_links.forEach((item) =>
  item.addEventListener("mouseout", ChangeMenuVideo_listener)
);
menu_page_links.forEach((item) =>
  item.addEventListener("mouseover", ChangeMenuVideo_listener)
);
menu_page_links.forEach((item, index) =>
  item.addEventListener("click", () => changeMenuPage(index))
);
menu_page_art_forms.forEach((item, index) =>
  item.addEventListener("submit", (e) => uploadArtwork(index, e))
);
art_form_btn.addEventListener("click", toggleArtForm);
password_popup_close_btn.addEventListener("click", () =>
  password_popup.classList.toggle("visible")
);

//selection between the film/book/music forms
art_form_selectors.forEach((item, index) =>
  item.addEventListener("click", () => {
    art_form_selectors.forEach((item, i) => {
      if (index === i) {
        if (!item.classList.contains("pressed")) {
          item.classList.add("pressed");
          // Beside creating the effect of the button being pressed, we also change the attribute of the password_pupup tet and submit button
          // external to the HTML forms. Depending on which form button is clicked, that submit button will be linked to one form or other.
          let form_ids = ["film-form", "book-form", "music-form"];
          Array.prototype.slice
            .call(password_popup.querySelectorAll("*"))
            .forEach((child) => {
              let form_element =
                child.tagName === "LABEL" ||
                child.tagName === "INPUT" ||
                child.tagName === "BUTTON"
                  ? true
                  : false;
              if (form_element) {
                child.setAttribute("form", form_ids[i]);
              }
            });
        }
      } else {
        item.classList.remove("pressed");
      }
    });

    menu_page_art_forms.forEach((item, i) => {
      if (index === i) {
        if (!item.classList.contains("show")) {
          item.classList.add("show");
        }
      } else {
        item.classList.remove("show");
      }
    });
  })
);

//Event listeners para los botones de añadir links en los forms
// En estos event listeners de añadir input text al form añado la tarea a realizar directamente toda en la función anónima, por variar.
music_link_add_btn.addEventListener("click", () => {
  var link_number =
    music_link_add_btn.parentElement.getElementsByTagName("input").length + 1;

  music_link_add_btn.parentElement.lastElementChild.insertAdjacentHTML(
    "afterend",
    `<label for="music-link-${link_number}"></label>
    <input type="text" id="music-link-${link_number}" placeholder="Enter youtube link.">
    <small>Error message</small>`
  );

  /* VITAL!!! La primera vez hiciste esto pero no funcionaba. Eso es porque usando innerHTML += text, lo que haces en realidad es 
    borrar el HTML y volver a escribir con cosas añadidas. Si entre lo que borras habia un elemento con un event listener, esos eventlisteners se mueren!!! */
  /*  music_link_add_btn.parentElement.innerHTML = `${music_link_add_btn.parentElement.innerHTML}` +
    `<label for="music-link-${link_number}"></label>
    <input type="text" id="music-link-${link_number}" placeholder="Enter youtube link.">
    <small>Error message</small>`  */
});

film_link_add_btn.addEventListener("click", () => {
  var link_number =
    film_link_add_btn.parentElement.getElementsByTagName("input").length + 1;

  film_link_add_btn.parentElement.lastElementChild.insertAdjacentHTML(
    "afterend",
    `<label for="film-link-${link_number}"></label>
    <input type="text" id="film-link-${link_number}" placeholder="Enter youtube link.">
    <small>Error message</small>`
  );
});

book_link_add_btn.addEventListener("click", () => {
  var link_number =
    book_link_add_btn.parentElement.getElementsByTagName("input").length + 1;

  book_link_add_btn.parentElement.lastElementChild.insertAdjacentHTML(
    "afterend",
    `<label for="book-quote-${link_number}">Quote</label>
    <textarea id="book-quote-${link_number}" class="text-area" name="book-quote" rows="4" cols="31">Input quote here.</textarea>
    <small>Error message</small>`
  );
});

//Event listeners para los botones de submit (before password, so they trigger a popup asking for the password)
menu_page_art_forms.forEach((item, index) => {
  item.lastElementChild.addEventListener("click", () => {
    password_popup.classList.toggle("visible");
  });
});

///////////////////////////////
//// functions for main-page //
///////////////////////////////

// adding a new text input in html

// toggle art form
function toggleArtForm() {
  //Array.prototype can also we written only as [], so it could be [].slice.call...etc
  Array.prototype.slice
    .call(art_form_btn.children)
    .forEach((item) => item.classList.toggle("close"));
  art_form_wrapper.classList.toggle("show");
}

// _Listener for the ChangeMenuVideo function, since we want to be able to remove the eventListener associated
// to it sometimes.
// for info, read here: https://medium.com/@DavideRama/removeeventlistener-and-anonymous-functions-ab9dbabd3e7b
function ChangeMenuVideo_listener(e) {
  // The DOM query selector do not create arrays, but nodeLists. They can be iterated with forEach but there
  // are many array functions they do not have. Some of them can be solved by transforming to an Array like in the following method.
  var index = Array.prototype.indexOf.call(menu_page_links, e.target);
  mouseover_bool = e.type === "mouseover" ? true : false;
  ChangeMenuVideo(index, mouseover_bool);
}

// Moving from main-page to any one of the other pages.
function changeMenuPage(index) {
  // Moving to film page.
  if (index == 0) {
    menu_page_links[index].removeEventListener(
      "mouseout",
      ChangeMenuVideo_listener
    );
    document.body.style.transition = "transform 3s ease";
    document.body.style.transform = "translate(100vw,0)";
    header.style.transition = "transform 3s ease";
    header.style.transform = "translate(-100vw,0)";
    /* variables defined in film-page-script.js */

    // Populate the film menu with the initial 6 films from menu-page 1. This function is defined in film-page-script.js
    populateFilmMenu(0);

    // PASARLO A USAR TRANISITION EVENT LISTENER PARA QUE SE AÑADA LA CALSE SHOW CUANDO
    //HAYA ACABADO LA TRANSICION DEL BODY.
    // Y CAMBIAR AQUI DESDE JAVASCRIPT EL VALOR DE TRANSICION DEL BODY PORQUE EN CADA TRANSICION CAMBIA!!!
    // PARA HACIA FILM-PAGE SON 3S CREO, PARA HACIA MUSIC-PAGE SON UNOS 7S
    setTimeout(() => {
      film_page_nav_left.classList.add("show");
      film_page_nav_right.classList.add("show");
      menu_page_links[index].addEventListener(
        "mouseout",
        ChangeMenuVideo_listener
      );
      // For now I will do like this to take the transitions out... because the transition: none !important, seems
      // no not always work.
      document.body.style.transition = "transform 0.01s ease";
      header.style.transition = "transform 0.1s ease";
    }, 2000);

    // Moving to book page.
  } else if (index == 1) {
    menu_page_links[index].removeEventListener(
      "mouseout",
      ChangeMenuVideo_listener
    );
    document.body.style.transition = "transform 3s ease";
    document.body.style.transform = "translate(0,100vh)";
    header.style.transition = "transform 3s ease";
    header.style.transform = "translate(0,-100vh)";

    setTimeout(() => {
      menu_page_links[index].addEventListener(
        "mouseout",
        ChangeMenuVideo_listener
      );
      document.body.style.transition = "transform 0.01s ease";
      header.style.transition = "transform 0.1s ease";
    }, 2000);

    // Moving to music page.
  } else if (index === 2) {
    // Remove event listener mouseout so while the transition is being performed the video of the menu-page
    // does not change because of the mouseout event.
    menu_page_links[index].removeEventListener(
      "mouseout",
      ChangeMenuVideo_listener
    );

    /* Next variables and function defined in music-page-script.js */
    music_page_player.volume = 0.5;
    music_page_player.play();

    document.body.style.transition = "transform 7s ease";
    document.body.style.transform = "translate(-100vw,0)";
    header.style.transition = "transform 3s ease";
    header.style.transform = "translate(100vw,0)";

    // interval between pressing the music button and for the ghost image to start appearing.
    // with the second argument as true, the ghist image will dissapear after appearing.
    setTimeout(() => {
      ghostImage(0, true);
    }, 2500);

    // PENSAR SI AQUI BIENE MEJOR UN TIMEOUT OR UN EVENT DE TRANSICION
    // Tiempo hasta que caiga el nav de music-page desde puslar el boton.
    //Esto hacerlo con transition event listener para cuando acabe la transcion del movimineto del body.
    setTimeout(() => {
      music_page_nav_left.classList.add("show");
      music_page_nav_right.classList.add("show");

      // Once the transition is finished I set the EventListener again.
      menu_page_links[index].addEventListener(
        "mouseout",
        ChangeMenuVideo_listener
      );

      document.body.style.transition = "transform 0.01s ease";
      header.style.transition = "transform 0.1s ease";
    }, 7000);
  }
}

// Uploading an artwork to the database
async function uploadArtwork(index, e) {
  e.preventDefault();
  console.log("uploading");

  switch (index) {
    case 0:
      var title = document.getElementById("film-title").value;
      var director = document.getElementById("film-director").value;
      var country = document.getElementById("film-country").value;
      var year = document.getElementById("film-year").value;
      var info = document.getElementById("film-info").value;
      var trailer = document.getElementById("film-trailer").value;
      var imglink = document.getElementById("film-img-link").value;
      var password = document.getElementById("password").value;

      const res = await fetch("http://localhost:3000/api/films", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-type": "application/json",
          password,
        },
        body: JSON.stringify({
          title,
          director,
          country,
          year,
          info,
          trailer,
          imglink,
        }),
      });

      const data = await res.json();
      console.log(data);
      const small = password_popup.querySelector("small");
      password_popup.classList.remove("error");
      password_popup.classList.remove("success");

      // if there is an error
      if (res.status != 200) {
        small.innerText = data.errors[0].msg;
        password_popup.classList.add("error");
        small.classList.toggle("visible");
        var transitionEnd = transitionEndEventName();
        small.addEventListener(transitionEnd, function _listener() {
          small.removeEventListener(transitionEnd, _listener);
          small.classList.toggle("visible");
        });

        // if the upload is succesful
      } else {
        small.innerText = "artwork uploaded to the database";
        password_popup.classList.add("success");
        small.classList.toggle("visible");
        var transitionEnd = transitionEndEventName();
        small.addEventListener(transitionEnd, function _listener() {
          small.removeEventListener(transitionEnd, _listener);
          small.classList.toggle("visible");
        });
      }

      break;

    case 1:
      // COPY HERE LATER THE ONE FROM FILMS BUT THE OLD ONE, SINCE THERE WAS A USEFUL REGEX FOR PARSING THE QUOTES OF BOOKS
      
      break;

    case 2:
      var title = document.getElementById("song-title").value;
      var artist = document.getElementById("song-artist").value;
      var country = document.getElementById("song-country").value;
      var year = document.getElementById("song-year").value;
      var info = document.getElementById("song-info").value;
      var music_video = document.getElementById("song-video").value;
      var imglink = document.getElementById("song-img-link").value;
      var password = document.getElementById("password").value;

      const res = await fetch("http://localhost:3000/api/songs", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-type": "application/json",
          password,
        },
        body: JSON.stringify({
          title,
          artist,
          country,
          year,
          info,
          music_video,
          imglink,
        }),
      });

      const data = await res.json();
      console.log(data);
      const small = password_popup.querySelector("small");
      password_popup.classList.remove("error");
      password_popup.classList.remove("success");

      // if there is an error
      if (res.status != 200) {
        small.innerText = data.errors[0].msg;
        password_popup.classList.add("error");
        small.classList.toggle("visible");
        var transitionEnd = transitionEndEventName();
        small.addEventListener(transitionEnd, function _listener() {
          small.removeEventListener(transitionEnd, _listener);
          small.classList.toggle("visible");
        });

        // if the upload is succesful
      } else {
        small.innerText = "artwork uploaded to the database";
        password_popup.classList.add("success");
        small.classList.toggle("visible");
        var transitionEnd = transitionEndEventName();
        small.addEventListener(transitionEnd, function _listener() {
          small.removeEventListener(transitionEnd, _listener);
          small.classList.toggle("visible");
        });
      }

      break;
  }
}

// Playing one of the three thematic videos of main-page
function ChangeMenuVideo(index, mouseover_bool) {
  if (mouseover_bool) {
    menu_page_links[index].parentElement.style.zIndex = "101";
    nonFocusedToggleHide(index);
  }

  menu_page_overlay.classList.toggle("show");
  var transitionEnd = transitionEndEventName();
  menu_page_overlay.addEventListener(transitionEnd, function _listener() {
    menu_page_overlay.removeEventListener(transitionEnd, _listener);
    menu_page_video.setAttribute(
      "src",
      `./video/menu-page/${
        mouseover_bool ? menu_page_links[index].id : "menu-video"
      }.webm`
    );
    setTimeout(function () {
      menu_page_overlay.classList.toggle("show");
      if (!mouseover_bool) {
        nonFocusedToggleHide(index);
        menu_page_overlay.addEventListener(transitionEnd, function _listener() {
          menu_page_overlay.removeEventListener(transitionEnd, _listener);
          menu_page_links[index].parentElement.style.zIndex = "10";
        });
      }
    }, 500);
  });
}

// function for hiding the items not focused on
function nonFocusedToggleHide(index) {
  menu_page_links.forEach((item, i) => {
    if (index !== i) {
      menu_page_links[i].classList.toggle("hidden");
    }
  });
}
//VITAL!!!!! INTENTAR NO USAR LO DEL ZINDEX Y MIRAR
//SI ES POSIBLE HACER QUE DESAPAREZCAN LOS ELEMENTOS CON UNA TRANSICION
//DE OPACIDAD CUANDO PASA A HIDDEN...CREO QUE SERA MUUUUCHO MEJOR.

// TO SOLVE!!!!!!
// MAKE WORDS DISSAPEAR WITH OPACITY
// ALSO, CHANGE TIMEOUTS TO TRANSITION EVENTS AND TRY TO SOLVE THE WEIRD THINGS THAT HAPPEN WHEN YOU MOVE THE MOSUE FAST

//https://stackoverflow.com/questions/5023514/how-do-i-normalize-css3-transition-functions-across-browsers/9090128#9090128
//https://medium.com/better-programming/detecting-the-end-of-css-transition-events-in-javascript-8653ae230dc7
// WAY OF PERFORMING TRANSITION END EVENTS CORRECTLY!!!!
function transitionEndEventName() {
  var i,
    undefined,
    el = document.createElement("div"),
    transitions = {
      transition: "transitionend",
      OTransition: "otransitionend", // oTransitionEnd in very old Opera
      MozTransition: "transitionend",
      WebkitTransition: "webkitTransitionEnd",
    };

  for (i in transitions) {
    if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
      return transitions[i];
    }
  }

}



// @TO-DO  Mix the populateFilmMenu and populateMusicMenu into one function 
// Do this after thinking how to layout the JS files and functions.

async function populateMusicMenu(page) {
  // We set the state of global page_number to the page we are populating. 
  page_number = page;

  const res = await fetch('http://localhost:3000/api/songs', {
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

  current_songs = body.songs;
  const total_songs = body['total-songs'];

  // Reset of the DVD list, so the list gets populated from scratch.
  Song_list.innerHTML = '';
  current_songs.forEach((item, index) => {
      DVD_list.innerHTML += `<li class="item">
                                <div class="item__main-img item__main-img--music-page">
                                  <img src="${item.imglink}" alt="">
                                </div>
                                <div class="item__secondary-img item__secondary-img--music-page">
                                  <img src="./img/film-page/action.png" id="music-video-link-${index}" alt="">
                                </div>
                             </li>`
  });

  // show the arrow controls that are necessary, depending on the number of page and wether there are 
  // more films to fetch. 
  console.log(!song_page_controls.firstElementChild.classList.contains('hidden'));
  if (page_number !== 0 && song_page_controls.firstElementChild.classList.contains('hidden')) 
      song_page_controls.firstElementChild.classList.remove('hidden') 
  if (page_number == 0 && !song_page_controls.firstElementChild.classList.contains('hidden')) 
      song_page_controls.firstElementChild.classList.add('hidden') 
  
  console.log(song_page_controls.lastElementChild.classList.contains('hidden'));   
  if ((total_films > ((page_number + 1)*6)) && song_page_controls.lastElementChild.classList.contains('hidden')) 
      song_page_controls.lastElementChild.classList.remove('hidden'); 
  if (!(total_films > ((page_number + 1)*6)) && !song_page_controls.lastElementChild.classList.contains('hidden')) 
      song_page_controls.lastElementChild.classList.add('hidden');

  // Adding the click addEventListeners so the info of the DVD appears when clicking on the image 
  Array.prototype.slice.call(song_list.children).forEach((item, index) => item.firstElementChild.firstElementChild.addEventListener("click", () => {
      document.getElementById('title').innerHTML = `${current_songs[index].title}`;
      document.getElementById('musician').innerHTML = `by ${current_songs[index].director}`;
      document.getElementById('country-year').innerHTML = `${current_songs[index].country}, ${current_songs[index].year}`;
      document.getElementById('info').innerHTML = `${current_songs[index].info}`;
      // Modificar esto para que solo desaparezca clicando la misma. Si clicas otra imagen, no. 
      // Ya que lo único que tiene que pasar es que se cambie la información. 
      songs_info_container.classList.toggle('hidden');
  })); 

  // Get all elements whose id start with "trailer-link" and add event listeners.
  document.querySelectorAll('[id^="music-video-link"]').forEach((item, index) => item.addEventListener("click", () => {
      playVideo(current_songs[index].musicVideo);
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


