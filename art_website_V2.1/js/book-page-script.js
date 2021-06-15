
const flipbook_container = document.getElementById('flipbook-container');
const flip_book = document.getElementById('flipbook');
const flipper = document.getElementById('flipper');
const book_shelf = document.getElementById('book-shelf');
const book_page_controls = document.getElementById("book-page-controls");
const upper_shelf = document.getElementById('upper-shelf');
const bottom_shelf = document.getElementById('bottom-shelf');
var back_page = {};
var front_page = {};
var current_book_page = 1;
var book_max_pages = 0;
var flipping_rest = false;

var mouse_held = false;
var thisX = 0;
var right_flip_init = false;
var left_flip_init = false;

// event listeners to know whether the mouse is being held or not. 
document.body.addEventListener('mousedown', () => mouse_held = true );
document.body.addEventListener('mouseup', () => mouse_held = false );
flipper.addEventListener('mousemove', flipper_listener);

function flipper_listener(e) {

    //Poner todo esto dentro de un if (mousebuttonpressed
    //Getting the X coordinate inside the flipper element

    // finding out the X coordinate of the cursor whithin the flipper (with a max value of the width of the flipper
    // when the cursor is at the utmost right, and 0 when the cursor in at the left of the flipper). 
    // For that I use the value of "left" (offsetLeft), but taking into account the translation of -50%
    // given to the container to center it.
    thisX = e.pageX - (flipbook_container.offsetLeft - flipbook_container.clientWidth/2) - flipper.offsetLeft
    

    // If flipping completed: Finishing the action and making the page automatically
    // finish the flipping by itself.
    //But, if the flipping has been initiated but the mouse is not held (and we did not reach the left side
    // of the book, which is the previous if logic).
    // Otherwise, if the flipping going on, the page needs to keep moving accordingly.  
    if ((right_flip_init) && (!flipping_rest)) {
        if (thisX < (0.03*flipper.clientWidth)) {
            // Finish flipping page automatically
            finishRightPageFlip(thisX);
            // Calling flippingRest so the flipping is disabled for one second. 
            // Otherwise, since the user is still in the left side of the book with the mouse pressed, 
            // the left page flipping event gets initiated as soon as the right one finishes. 
            flippingRest();
        } else if (!mouse_held) {
            //cancelling flipping and making page go back automatically to the beginning (the right side)
            cancelRightPageFlip();
            right_flip_init = false;
        } else { 
            updatePageFlip(thisX);
        }
    } 


    // Same logic for the case of flipping left page
    if ((left_flip_init) && (!flipping_rest)) {
        if (thisX > (0.93*flipper.clientWidth)) {
            // Finish flipping page automatically
            finishLeftPageFlip(thisX);
            left_flip_init = false;
            flippingRest();
        } else if (!mouse_held) {
            //cancelling flipping and making page go back automatically to the beginning (the right side)
            cancelLeftPageFlip();
            left_flip_init = false;
        } else {
            updatePageFlip(thisX);
        }
    } 

    if (!flipping_rest) {
        // Logic for establishing the cursors and the beginning of the flipping actions.
        if ((thisX > (0.95*flipper.clientWidth)) && (!left_flip_init) && (current_book_page < (book_max_pages - 1))) {
            flipper.style.cursor='pointer';
            if ((mouse_held) && (document.querySelectorAll('.flipbook__page--right').length > 1)) {
                //Getting it all ready for flipping the right page
                initializeRightPageFlippingState()
                right_flip_init = true;
                left_flip_init = false;
            }
        } else if ((thisX < (0.05*flipper.clientWidth)) && (!right_flip_init) && (current_book_page >= 3))  {
            flipper.style.cursor='pointer';
            if (mouse_held) {
                // For now I comment this so leftPageFlipping can never happenS
                initializeLeftPageFlippingState()
                left_flip_init = true;
                right_flip_init = false;
            }
        } else if (!right_flip_init) {
            flipper.style.cursor ='default';
        } else if (!left_flip_init) {
            flipper.style.cursor ='default';
        }

        // Same logic for the left page flipping.
    }
};

function flippingRest() {
    flipping_rest = true;
    flipper.removeEventListener('mousemove', flipper_listener);
    setTimeout(() => flipper.style.cursor ='default', 100)
    setTimeout(() => {
        flipping_rest = false;
        flipper.addEventListener('mousemove', flipper_listener);
    }, 1000);
}

function cancelRightPageFlip() {
    initializeNoFlippingState()
    // applying the formulas with the X value in the utmost right side of the book, 
    // point where the page is grabbed for flipping. 
    updatePageFlip(flipper.clientWidth);
    // Muevo ambas paginas a la izquierda. Y, en el caso de la front page, le vuelvo a poner el width al natural.
}

// MIX THESE TWO FUNCTIONS TOO
function finishRightPageFlip() {
    // applying the formulas with the X value in the utmost left side of the book, 
    // point where the page is grabbed for flipping.
    updatePageFlip(0);
    right_flip_init = false;
    flipper.style.cursor='default';

    back_page.classList.remove("flipbook__page--right");
    back_page.classList.add("flipbook__page--left");
    front_page.classList.remove("flipbook__page--right");
    front_page.classList.add("flipbook__page--left");

    initializeNoFlippingState()

    current_book_page = current_book_page + 2;
}

function finishLeftPageFlip() {
    // applying the formulas with the X value in the utmost left side of the book, 
    // point where the page is grabbed for flipping.
    updatePageFlip(flipper.clientWidth);
    left_flip_init = false;
    flipper.style.cursor='default';

    back_page.classList.remove('flipbook__page--left');
    back_page.classList.add('flipbook__page--right');
    front_page.classList.remove('flipbook__page--left');
    front_page.classList.add('flipbook__page--right');

    initializeNoFlippingState()

    current_book_page = current_book_page - 2;
}

function cancelLeftPageFlip() {
    // applying the formulas with the X value in the utmost right side of the book, 
    // point where the page is grabbed for flipping. 
    updatePageFlip(0);
    initializeNoFlippingState();
}

function updatePageFlip(thisX) {
    // @TO-DO: FIND OUT HOW TO PROPERLY GET THE REAL HEIGHT, WITHOUT PADDING AND MARGIN
    const h = flipper.clientHeight;
    const w = flipper.clientWidth;

    const cc = ((thisX / -5) + 50).toFixed(2);
    const dd = ((30 + (thisX / -10)) * -1 + 1).toFixed(2);
    const ff = (15 - (10 + (thisX / -10)) * -1 + 6).toFixed(2);
    const gg = ((10 - (thisX / -13)) / 80).toFixed(2);

    if (thisX > (0.5*flipper.clientWidth)) {
        back_page.style.cssText += `width:${(w/2) + (-1/2)*thisX}px;
                            height:${(h*1.2) + (-0.2*h/w)*thisX}px;
                            top:${-50 + (thisX/(w/50))}px;
                            left:${thisX - 2}px`;
        front_page.style.cssText += `width:${thisX - w/2}px;
                                     left:${w/2}px`;
    } else {
        back_page.style.cssText +=`width:${(w/2) + (-1/2)*thisX}px;
                            height:${(h) + (0.2*h/w)*thisX}px;
                            top:${-thisX/(w/50)}px;
                            left:${thisX - 2}px;`;
        front_page.style.cssText += `width:0px;`;
    }

    // Really important to concatenate here, because the cssText, if not concatenated, just deletes the rest of the CSS, 
    // so if here you do not concatenate, the cssText you just updated gets deleted.
    back_page.style.cssText +='box-shadow', cc + 'px 0 ' + cc + 'px rgba(0,0,0,0.7), 2px 0 4px rgba(0,0,0,0.5), -2px 0 4px rgba(0,0,0,0.5), -20px 0 40px rgba(0,0,0,0.2), 4px 0 10px rgba(0,0,0,0.1) inset, -2px 0 2px rgba(0,0,0,0.2) inset, ' + dd + 'px 0 ' + ff + 'px rgba(0,0,0,' + gg + ') inset';
}


// MIX THIS TWO INITIALIZATION FUNCTIONS IN ONE IN WHICH YOU INPUT A BOOLEAN (TRUE = RIGHT, FALSE = LEFT), 
// OR A STRING. 

function initializeNoFlippingState() {
    //All pages zIndex is 1 except for the only two pages that are visible.
    Array.prototype.slice.call(flipper.children).forEach((item, index) => {
        item.style.zIndex = '1';
        item.style.cssText += `width:${flipper.clientWidth/2}`;
    });



    let left_pages = document.querySelectorAll('.flipbook__page--left');
    let right_pages = document.querySelectorAll('.flipbook__page--right');
    left_pages[left_pages.length - 1].style.zIndex = '2';
    right_pages[0].style.zIndex = '2';
}

function initializeRightPageFlippingState() {
    Array.prototype.slice.call(flipper.children).forEach((item, index) => {
        item.style.zIndex = '1';
    });

    let left_pages = document.querySelectorAll('.flipbook__page--left');
    let right_pages = document.querySelectorAll('.flipbook__page--right');
    left_pages[left_pages.length - 1].style.zIndex = '2';
    right_pages[0].style.zIndex = '4';
    right_pages[1].style.zIndex = '3';
    right_pages[2].style.zIndex = '2';
    front_page = right_pages[0];
    back_page = right_pages[1];
}

function initializeLeftPageFlippingState() {
    Array.prototype.slice.call(flipper.children).forEach((item, index) => {
        item.style.zIndex = '1';
    });

    let left_pages = document.querySelectorAll('.flipbook__page--left');
    let right_pages = document.querySelectorAll('.flipbook__page--right');
    right_pages[0].style.zIndex = '2';
    left_pages[left_pages.length - 1].style.zIndex = '3';
    left_pages[left_pages.length - 2].style.zIndex = '4';
    left_pages[left_pages.length - 3].style.zIndex = '2';
    front_page = left_pages[left_pages.length - 2];
    back_page = left_pages[left_pages.length - 1];
}



async function populateBookMenu(page) {
    // We set the state of global page_number to the page we are populating. 
    page_number = page;

    const res = await fetch('http://localhost:3000/api/books', {
        method: 'GET',
        headers: {
            'page-number': page_number
        }
    });
    body = await res.json();
    // This will the json boydo of the answer, with an array of 6 books and the total number of books.  

    // Now this needs to populate the menu.
    // ALSO: CAREFUL TO NOT USE SAME ID FOR MORE THAN ONE ELEMENT. You made the mistake of 
    // calling all the trailer link elements with same id, that can be dangerous and give problems to the browser too.
    //book_list.innerHTML = ''; 
    //saving this in global variable current_books so the info about the current books displayed in meny
    // is available after this function has finished (particularly because the eventlistener
    // will need it)

    current_books = body.books;
    const total_books = body['total-books'];

    // Resetting the book shelf
    upper_shelf.innerHTML = '';
    bottom_shelf.innerHTML = '';
    current_books.forEach((item, index) => {
        if (index <= 2) {
            upper_shelf.innerHTML += `<div class="book" id="shelf-book-${index + 1}"><img src="${item.imglink}" alt=""></div>`;
        } else {
            bottom_shelf.innerHTML += `<div class="book" id="shelf-book-${index + 1}"><img src="${item.imglink}" alt=""></div>`;
        }
    });

    // show the arrow controls that are necessary, depending on the number of page and wether there are 
    // more books to fetch. 
    if (page_number !== 0 && book_page_controls.firstElementChild.classList.contains('hidden')) 
        book_page_controls.firstElementChild.classList.remove('hidden') 
    if (page_number == 0 && !book_page_controls.firstElementChild.classList.contains('hidden')) 
        book_page_controls.firstElementChild.classList.add('hidden') 
     
    if ((total_books > ((page_number + 1)*6)) && book_page_controls.lastElementChild.classList.contains('hidden')) 
        book_page_controls.lastElementChild.classList.remove('hidden'); 
    if (!(total_books > ((page_number + 1)*6)) && !book_page_controls.lastElementChild.classList.contains('hidden')) 
        book_page_controls.lastElementChild.classList.add('hidden');
   
    // Get all elements whose id start with "book-" and add event listeners.
    document.querySelectorAll('[id^="shelf-book-"]').forEach((item, index) => item.addEventListener("click", async () => {
        await renderBook(current_books[index]);
        setTimeout(() => startFlipbook(current_books[index]), 3000);
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

function startFlipbook(i) {
    flipbook_container.style.visibility = 'visible';



    // // Adding the click addEventListeners so the info of the book appears when clicking on the image 
    // Array.prototype.slice.call(book_list.children).forEach((item, index) => item.firstElementChild.firstElementChild.addEventListener("click", () => {
    //     document.getElementById('book-title').innerHTML = `${current_books[index].title}`;
    //     document.getElementById('book-author').innerHTML = `by ${current_books[index].author}`;
    //     document.getElementById('book-country-year').innerHTML = `${current_books[index].country}, ${current_books[index].year}`;
    //     document.getElementById('book-info').innerHTML = `${current_books[index].info}`;
    //     // Modificar esto para que solo desaparezca clicando la misma. Si clicas otra imagen, no. 
    //     // Ya que lo único que tiene que pasar es que se cambie la información. 
    //     book_info_container.classList.toggle('hidden');
    // })); 

}



function renderBook(book) {
    const canvas_element = document.getElementById('canvas');

    flipper.innerHTML = '';
    let canvas = {};
    // We add one last page (for having a white page) if the total 
    // number of pages is an odd number. 
    let pages = (book.quotes.length + 2);

    // Creating title page template
    flipper.innerHTML = `<div class="flipbook__page flipbook__page--left" id="page-1">
                            <div class="content">
                                <h1>${book.title}</h1>
                                <h4>by</h4>
                                <h2>${book.author}</h2>
                                <h3>${book.country}, ${book.year}</h3>
                            </div>
                        </div>`

    // creating info page template
    flipper.innerHTML += `<div class="flipbook__page flipbook__page--right" id="page-2">
                            <div class="content">
                                <h1>Info</h1>
                                <p>${book.info}</p>
                            </div>
                        </div>`


    // creating quote pages
    book.quotes.forEach((item, index) => {
        flipper.innerHTML += `<div class="flipbook__page flipbook__page--right" id="page-${index + 3}">
                            <div class="content">
                                <p>${item}</p>
                            </div>
                        </div>`
    });

    // add extra write page if needed
    if ((book.quotes.length)%2 !== 0) {
        pages += 1;
        flipper.innerHTML += `<div class="flipbook__page flipbook__page--right" id="page-${pages}">
                                <div class="content">
                                </div>
                            </div>`
        
    }

        //REMEMBER!! IF YOU HAVE A REFERENCE TO AN OBJECT AND THAT DIES (LIKE OVERWRITTING IT ON htmlInner
        // YOU NEED TO REFERENCE IT AGAIN, SINCE THE VARIABLE IS A POINTER TO NOWHERE!!)
        front_page = document.getElementById('page-2'); 
        back_page = document.getElementById('page-3'); 
        back_page.style.cssText +='width:0px';
        current_book_page = 1;
        book_max_pages = pages;

    Array.prototype.slice.call(flipper.children).forEach(async (item, index) => {
        canvas_element.innerHTML = item.innerHTML;
        item.innerHTML='';
        
        let canvas = await html2canvas(canvas_element);
        let dataURL = canvas.toDataURL("image/png");
        // I delete the <content> tag where the original html text was and 
        // use the new image version as background image on the pages divs.
        item.style.cssText += `background-image:url(${dataURL}); background-size: cover`;
        
    });

    //Initialization of the Z-indexes
    initializeRightPageFlippingState();

}

