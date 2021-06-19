// TO-DO! SOLVING THE DRAG PROBLE AND SOME OTHER ISSUES. 

// WARNING: THIS PROGRAM WILL MAKE EVERYTHING ON THE PAGE NOT DRAGGABLE.
// CREATE A PARAMETER FOR MAKING THE WHOLE PAGE NOT DRAGGABLE OR NOT. 
// IF THE USER DECIDES TO NOT MAKE IT, HE/SHE IS RESPONSIBLE FOR MAKING THE USRROUNDINGS OF 
// THE BOOK AND THE BOOK ITSELF (IT IS ENOUFH WITH MAKING NOT DRAGGABLE ANY PARENT OF THE BOOK)
// NOT TRAGGABLE. OTHERWISE MISTAKES ARISE SOMETIMES WHEN PERFORMING THE MOUSEDOWN AND MOVE ACTIONS. 

const flipbook = (() => {
    ///////////////////////
    // scoped CSS styling 
    //////////////////////7
    const HTMLpage_scoped_css = `
                                   <style scoped>
                                    * {
                                        -webkit-user-drag: none;
                                        user-select: none;
                                        -moz-user-select: none;
                                        -webkit-user-drag: none;
                                        -webkit-user-select: none;
                                        -ms-user-select: none;
                                    }
                                    
                                    h1 {
                                        font-size: 30px;
                                        color: #000;
                                    }
                                    
                                    h2 {
                                        font-size: 23px;
                                        color: #000;
                                    }
                                    
                                    h3 {
                                        font-size: 18px;
                                        color: #000;
                                    }
                                    
                                    h4 {
                                        font-size: 15px;
                                        color: #000;
                                    }
                                    
                                    p {
                                        font-size: 13px;
                                        color: #000;
                                    }
                                </style>`

    const scoped_css = `<style scoped>
                            .flipbook {
                                background: #aa1111;
                                position: absolute;
                                top: 0;
                                left: 0;
                                border-radius: 5px;
                                box-shadow: 15px 0 5px rgba(0, 0, 0, 0.1) inset,
                                1px 0 5px rgba(0, 0, 0, 0.4) inset, 25px 0 30px rgba(0, 0, 0, 0.2) inset,
                                -25px 0 30px rgba(0, 0, 0, 0.1) inset;
                            }
                            
                            .flipbook__flipper {
                                position: absolute;
                                top: 10px;
                                left: 10px;
                                border: dotted rgba(0, 0, 0, 0) 6px;
                                z-index: 999;
                            }
                            
                            .flipbook__page {
                                pointer-events: "none";
                                z-index: 1;
                                background: #fff;
                                position: absolute;
                                top: 0;
                                border: 0px solid #000;
                                border-top-left-radius: 20px 10px;
                                border-bottom-left-radius: 20px 10px;
                                border-top-right-radius: 50px 5px;
                                border-bottom-right-radius: 20px 2px;
                                box-shadow: 5px 0 5px rgba(0, 0, 0, 0.3) inset,
                                1px 0 5px rgba(0, 0, 0, 0.4) inset,
                                10px 0 4px rgba(255, 255, 255, 0.2) inset,
                                25px 0 30px rgba(0, 0, 0, 0.4) inset, -25px 0 30px rgba(0, 0, 0, 0.1) inset,
                                -1px 0 4px rgba(0, 0, 0, 0.3), 3px 0 5px rgba(0, 0, 0, 0.5),
                                45px 0 45px rgba(255, 255, 255, 0.3) inset;
                            }
                            
                            .flipbook__page .content {
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                text-align: center;
                                justify-content: center;
                            }
                            
                            .flipbook__page h1 {
                                font-size: 30px;
                                color: #000;
                            }
                            
                            .flipbook__page h2 {
                                font-size: 23px;
                                color: #000;
                            }
                            
                            .flipbook__page h3 {
                                font-size: 18px;
                                color: #000;
                            }
                            
                            .flipbook__page h4 {
                                font-size: 15px;
                                color: #000;
                            }
                            
                            .flipbook__page p {
                                font-size: 13px;
                                color: #000;
                            }
                            
                        </style>`;


    // Configuration parameter variables
    let book_padd= 10;


    // Create pages HTML
    function createFlipBookHTML(flipbook_container, pages_dataURL) {
        let w = flipbook_container.clientWidth;
        let h = flipbook_container.clientHeight;


        let html = `<div class="flipbook" 
                    onmousedown="event.preventDefault ? event.preventDefault() : event.returnValue = false" 
                    draggable="false"
                    style="width:${w}px; 
                    height:${h}px">`;
        html += scoped_css;
        html += `<div class="flipbook__flipper"
                style="width:${(w - 2*book_padd)}px;
                height:${h - 2*book_padd}px">`;

        pages_dataURL.forEach((item,index) => {
            //Debug
            console.log(`inserting page ${index + 1}`)
            html = (index === 0) 
                ? html + `<div class="flipbook__page flipbook__page--left"
                        style="background-image:url(${item}); background-size:cover; left:0px;
                        width:${(w - 2*book_padd)/2}px; height:${h - 2*book_padd}px">
                        </div>`
                : html + `<div class="flipbook__page flipbook__page--right"
                        style="background-image:url(${item}); background-size:cover; left:${(w - 2*book_padd)/2}px;
                         width:${(w - 2*book_padd)/2}px; height:${h - 2*book_padd}px">
                        </div>`
        })
        html += `</div>
                </div>`;

        return html
    };

    async function htmlToImg(flipbook_container, HTMLpages) {
        //Debug
        console.log("htmlToImg function initiated");
        let pages_dataURL = [];
        let x = 3;

        // You cannot use forEach when there is an asynchronous function inside the callback. 
        // Read this: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
        for (const item of HTMLpages) {
            // Aqui igual necesito de alguna forma copiar
            // el div al origen del body con un canvas para snapshot. No estoy 
            // seguro si eso no daria probleams haciendo que en las paginas web
            // se viera ese canvas de repente durante un momento.
            
            // For making it work both with strings in HTML form or with the real elements.
            try {
                // TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                //FINISH THIS PART OF THE CODE AND TEST IT, THE ONE WITH ELEMENTS, INSTEAD HTML STRINGS
                item.style.cssText = `width:${(flipbook_container.clientWidth - 2*book_padd)/2}px;
                                      height:${flipbook_container.clientHeight - 2*book_padd}px;`
                item.innerHTML += HTMLpage_scoped_css;
                let canvas = await html2canvas(item);
                let dataURL = canvas.toDataURL("image/png");
                pages_dataURL.push(dataURL);
            } catch (err) {
                // the variables are strings, not DOM elements.
                let canvas_frame = document.createElement("div");
                canvas_frame.classList.add('_canvas');
                canvas_frame.style.cssText = `width:${(flipbook_container.clientWidth - 2*book_padd)/2}px;
                                        height:${flipbook_container.clientHeight - 2*book_padd}px;
                                        position: absolute; top:-1000px; left:-1000px; z-index:99999999;`;
                document.body.insertAdjacentElement('afterbegin', canvas_frame);
                canvas_frame.innerHTML = item;
                let canvas = await html2canvas(canvas_frame);
                // Remove canvas
                canvas_frame.remove();
                let dataURL = canvas.toDataURL("image/png");
                pages_dataURL.push(dataURL);
            }
        };

        //Debug
        console.log("htmlToImg function completed");
        //window.open(pages_dataURL[0], '_blank');
        
        return pages_dataURL
    };


    // @ TO-DO: add errord handling, catching and dispatch erros so the function 
    // can be properly used in a try/catch with custom errors.
    async function renderFlipBook(flipbook_container, HTMLpages) {
        //Create a debug variable in each function and give console.log feedback if set to true.
        let DEBUG = false;
        // Flipbook HTML
        console.log('renderFlipBook function initiated');
        //const pages_dataURL = createFlipBookHTML(htmlToImg(flipbook_container, HTMLpages));
        const pages_dataURL = await htmlToImg(flipbook_container, HTMLpages);
        const html = createFlipBookHTML(flipbook_container, pages_dataURL);
        flipbook_container.innerHTML = html;

        //return flipbook element (not the container, we consider that propierty of the 
        // user since its defined by him/her)
        return flipbook_container.firstElementChild;
    }

    // Scope where all the variables and logic for the interation with the book is held.
    var startInteraction = function(flipper) {
        let flipping_rest = false;
        let flipbook_container = flipper.parentElement.parentElement;
        let right_flip_init = false;
        let left_flip_init = false;
        let mouse_held = false;
        let thisX = 0;

        document.body.addEventListener('mousedown', () => mouse_held = true );
        document.body.addEventListener('mouseup', () => mouse_held = false );
        flipper.addEventListener('mousemove', flipperListener);

        //initializing book state
        initializeNoFlippingState();

        function flipperListener(e) {
            e.preventDefault();
            console.log(mouse_held);
            //e.currentTarget indicates the current target for the event as the event travels the DOM. 
            // It indicates the original element the event was set on.
            //e.target indicates the element in which the event occured and that could actually 
            // be one of the descendants (in this case, using e.target just gives the pages of the 
            // book).
            // DOUBT: IS IT BETTER TO USE "GLOBAL VARIABLES" OR TO NOT USE THEM AND HAVE, 
            // CONSTANTLY, THE FLIPPER BEING CREATED AND DESTROYED WITH e.currentTarget?
            // THIS EVENT IS CONSTANTLY BEING TRIGGERED, SO I GUESS USIGN SCOPED GLOBAL VARIABLE
            // WILL BE BETTER. SAME FOR THE REST OF VARIABLES. WHEN IS IT BETTER TO USE GLOBAL OR
            // NOT?
            //flipper = E.currentTarget;
            thisX = e.pageX - flipbook_container.getBoundingClientRect().x - flipper.offsetLeft;
            flippingLogic();
        }

        function flippingLogic() {
            if ((right_flip_init) && (!flipping_rest)) {
                if (thisX < (0.08*flipper.clientWidth)) {
                    // Finish flipping page automatically
                    finishPageFlip(true);
                    // Calling flippingRest so the flipping is disabled for one second. 
                    // Otherwise, since the user is still in the left side of the book with the mouse pressed, 
                    // the left page flipping event gets initiated as soon as the right one finishes. 
                    flippingRest();
                } else if (!mouse_held) {
                    //cancelling flipping and making page go back automatically to the beginning (the right side)
                    cancelPageFlip(true);
                    right_flip_init = false;
                } else { 
                    updatePageFlip(true, thisX);
                }
            } 
        
        
            // Same logic for the case of flipping left page
            if ((left_flip_init) && (!flipping_rest)) {
                if (thisX > (0.93*flipper.clientWidth)) {
                    // Finish flipping page automatically
                    finishPageFlip(false);
                    left_flip_init = false;
                    flippingRest();
                } else if (!mouse_held) {
                    //cancelling flipping and making page go back automatically to the beginning (the right side)
                    cancelPageFlip(false);
                    left_flip_init = false;
                } else {
                    updatePageFlip(false, thisX);
                }
            } 
        
            if (!flipping_rest) {
                // Logic for establishing the cursors and the beginning of the flipping actions.
                if ((thisX > (0.95*flipper.clientWidth)) && (!left_flip_init) && (flipper.querySelectorAll('.flipbook__page--right').length > 2)) {
                    flipper.style.cursor='pointer';
                    if ((mouse_held) && (document.querySelectorAll('.flipbook__page--right').length > 1)) {
                        //Getting it all ready for flipping the right page
                        initializePageFlippingState(true)
                        right_flip_init = true;
                        left_flip_init = false;
                    }
                } else if ((thisX < (0.05*flipper.clientWidth)) && (!right_flip_init) && (flipper.querySelectorAll('.flipbook__page--left').length > 2))  {
                    flipper.style.cursor='pointer';
                    if (mouse_held) {
                        // For now I comment this so leftPageFlipping can never happenS
                        initializePageFlippingState(false)
                        left_flip_init = true;
                        right_flip_init = false;
                    }
                } else if (!right_flip_init) {
                    flipper.style.cursor ='default';
                } else if (!left_flip_init) {
                    flipper.style.cursor ='default';
                }
            }
        }

        function finishPageFlip(right_flip) {
            if (right_flip) {
                updatePageFlip(true, 0);
                right_flip_init = false;
                back_page.classList.remove("flipbook__page--right");
                back_page.classList.add("flipbook__page--left");
                front_page.classList.remove("flipbook__page--right");
                front_page.classList.add("flipbook__page--left");
            } else {
                updatePageFlip(false, flipper.clientWidth);
                left_flip_init = false;
                back_page.classList.remove("flipbook__page--left");
                back_page.classList.add("flipbook__page--right");
                front_page.classList.remove("flipbook__page--left");
                front_page.classList.add("flipbook__page--right");
            }
            
            flipper.style.cursor='default';

            initializeNoFlippingState();
        
        }

        //@function
        // @name    flippingRest
        // @goal    Stops the interaction and cursor feedback from the book for a moment after flipping a page.
        //          This avoids problems such as the user accidentally starting to turn the other side page.
        function flippingRest() {
            flipping_rest = true;
            flipper.removeEventListener('mousemove', flipperListener);
            setTimeout(() => flipper.style.cursor ='default', 100);
            setTimeout(() => {
                flipping_rest = false;
                flipper.addEventListener('mousemove', flipperListener);
            }, 1000);
        }

        // You could use this initialization for cancelling (instead of feeding the updatePafeFlipping with 
        // the harcored extreme values, that is useless). Just leave it like this so maybe in the future, 
        // you can hardcore the values and make the page go slowly to that harcored value. 

        function initializeNoFlippingState() {
            //All pages Zindex is 1 except for the only two pages that are visible.
            //Also, reseting all widths, lefts, tops...etc

            console.log("entered in initializeNoFlippingState");

            w = flipper.clientWidth/2;

            Array.prototype.slice.call(flipper.children).forEach((item) => {
                item.style.zIndex = '1';
                if (item.classList.contains('flipbook__page--right')) {
                    item.style.cssText += `width:${w}px; left:${w}px;`;
                } else {
                    item.style.cssText += `width:${w}px; left: 0px;`;
                }
            });

            let left_pages = flipper.querySelectorAll('.flipbook__page--left');
            let right_pages = flipper.querySelectorAll('.flipbook__page--right');
            left_pages[left_pages.length - 1].style.zIndex = '2';
            right_pages[0].style.zIndex = '2';
        }
    
        //@TO-DO
        // ADD ALSO GENERAL EXPLANATION TO EACH FUNCTION, OUTSIDE OF IT, WITH 
        // ALSO TO-DOs, NAME...ETC, TPO LO QUE HACE TRAVERSY MEDIA.  
        function initializePageFlippingState(right_flip) {
            
            // Reset all zIndex.
            Array.prototype.slice.call(flipper.children).forEach((item, index) => {
                item.style.zIndex = '1';
            });

            // Set Zindexes of the important four pages during flipping 
            //(three from the side of the flipped paged and one of the other side).
            let left_pages = flipper.querySelectorAll('.flipbook__page--left');
            let right_pages = flipper.querySelectorAll('.flipbook__page--right');

            if (right_flip) {
                left_pages[left_pages.length - 1].style.zIndex = '2';
                right_pages[0].style.zIndex = '4';
                right_pages[1].style.zIndex = '3';
                right_pages[2].style.zIndex = '2';
                front_page = right_pages[0];
                back_page = right_pages[1];
            } else {
                right_pages[0].style.zIndex = '2';
                left_pages[left_pages.length - 1].style.zIndex = '3';
                left_pages[left_pages.length - 2].style.zIndex = '4';
                left_pages[left_pages.length - 3].style.zIndex = '2';
                front_page = left_pages[left_pages.length - 2];
                back_page = left_pages[left_pages.length - 1];
            }

        }
        
        // @ TO-DO: intentar hacer que al cancelar, la pagina vuelva lentamente a su lugar inicial.
        function cancelPageFlip(right_flip) {
            console.log("Entered in function cancelPageFlip");

            //activating flippingRest (the most important effect is that the flipper event listener will be removed
            // for 2 seconds, and, for that time, thisX will not be updated by the listener)
            flippingRest();

            // Set an interval so the page goes back to its place slowly.
            if (right_flip) {
                let timer = setInterval(() => { 
                    thisX += 6;
                    if (thisX > 0.96*flipper.clientWidth) {
                        initializeNoFlippingState();
                        clearInterval(timer);
                    } else {
                        updatePageFlip(true, thisX);
                    }
                }, 0.08);  
            } else {
                let timer = setInterval(() => {
                    thisX -= 6;
                    if (thisX < 0.04*flipper.clientWidth) {
                        initializeNoFlippingState();
                        clearInterval(timer);
                    } else {
                        updatePageFlip(false, thisX);
                    }
                }, 0.08);
            }
            
        }
        
        // @TO-DO: FIND OUT HOW TO PROPERLY GET THE REAL HEIGHT, WITHOUT PADDING AND MARGIN
        // Even though it is global we need the thisX parameter because the cancelling and finalizing functions
        // send the thisX value hardcoded. 
        function updatePageFlip(right_flip, x) {
            // back_page and front_page are defined in reference to the right side. In other words, 
            // the back_page is the back page from the right side sheet that is going to be flipped from or that 
            // is going to flipped into (depending on performing the flip from the right side or the left).

            let left_pages = flipper.querySelectorAll('.flipbook__page--left');
            let right_pages = flipper.querySelectorAll('.flipbook__page--right');
            let back_page = (right_flip) 
                            ? right_pages[1]
                            : left_pages[left_pages.length - 1];
            let front_page = (right_flip) 
                            ? right_pages[0]
                            : left_pages[left_pages.length - 2];

            const h = flipper.clientHeight;
            const w = flipper.clientWidth;

            const cc = ((x / -5) + 50).toFixed(2);
            const dd = ((30 + (x / -10)) * -1 + 1).toFixed(2);
            const ff = (15 - (10 + (x / -10)) * -1 + 6).toFixed(2);
            const gg = ((10 - (x / -13)) / 80).toFixed(2);

            if (x > (0.5*flipper.clientWidth)) {
                back_page.style.cssText += `width:${(w/2) + (-1/2)*x}px;
                                    height:${(h*1.2) + (-0.2*h/w)*x}px;
                                    top:${-50 + (x/(w/50))}px;
                                    left:${x - 2}px`;
                front_page.style.cssText += `width:${x - w/2}px;
                                            left:${w/2}px`;
            } else {
                back_page.style.cssText +=`width:${(w/2) + (-1/2)*x}px;
                                    height:${(h) + (0.2*h/w)*x}px;
                                    top:${-x/(w/50)}px;
                                    left:${x - 2}px;`;
                front_page.style.cssText += `width:0px;`;
            }

            // Really important to concatenate here, because the cssText, if not concatenated, just deletes the rest of the CSS, 
            // so if here you do not concatenate, the cssText you just updated gets deleted.
            back_page.style.cssText +='box-shadow', cc + 'px 0 ' + cc + 'px rgba(0,0,0,0.7), 2px 0 4px rgba(0,0,0,0.5), -2px 0 4px rgba(0,0,0,0.5), -20px 0 40px rgba(0,0,0,0.2), 4px 0 10px rgba(0,0,0,0.1) inset, -2px 0 2px rgba(0,0,0,0.2) inset, ' + dd + 'px 0 ' + ff + 'px rgba(0,0,0,' + gg + ') inset';
                }

    }

    



    return async function main(flipbook_container, HTMLpages) {
        const flipbook = await renderFlipBook(flipbook_container, HTMLpages);
        // The use of :scope selector makes the browser look for only its own direct scope, 
        //direct descentants of flipper (only its own children, not the children of its children)
        const flipper = flipbook.querySelector(':scope > .flipbook__flipper');
        startInteraction(flipper);
    };

    
})();