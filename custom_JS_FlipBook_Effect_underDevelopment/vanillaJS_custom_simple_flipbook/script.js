const flip_book = document.getElementById('flipbook');
const flipper = document.getElementById('flipper');


interactWithBook();


function interactWithBook() {
    // function created to enclose the eventListener so the thisX variable does not need to be created
    // and destroyed everytime the eventListeners get triggered, and, at the same time
    // so these variables do not need to go to global.

    var mouse_held = false;
    var thisX = 0;
    var flip_init = false;
    const front_page = document.getElementById('page7'); 
    const back_page = document.getElementById('page6');
    

    // event listeners to know whether the mouse is being held or not. 
    document.body.addEventListener('mousedown', () => mouse_held = true );
    document.body.addEventListener('mouseup', () => mouse_held = false );

//VITAL!!! Element.style gives an array with all css styles but it only gives the values that are directly
// written in CSS or given a value directly through this function. It does not compute CSS stylesheet values (it return 
//empy strings). For values computed after stylsheet check .computedstyles(). 
// However, .style is still the best way to give new values from javascript!!! REMEMBER THIS!!

    flipper.addEventListener('mousemove', function(e) {
        //Poner todo esto dentro de un if (mousebuttonpressed
        //Getting the X coordinate inside the flipper element
    
        // Change this to the commented one when you implement it as a block in your program, then the only 
        // thing you need to do it put the flipbook inside a container and make that container
        // visible any time you want to use this! :D 
        //thisX = e.pageX - flip_book.parentElement.style.left - flipper.style.left
        thisX = e.pageX - 50 - 5;

        // If flipping completed: Finishing the action and making the page automatically
        // finish the flipping by itself.
        //But, if the flipping has been initiated but the mouse is not held (and we did not reach the left side
        // of the book, which is the previous if logic).
        // Otherwise, if the flipping going on, the page needs to keep moving accordingly.  
        if (flip_init) {
            if (thisX < (0.1*flipper.clientWidth)) {
                // Finish flipping page automatically
                finishPageFlip(thisX);
                flip_init = false;
            } else if (!mouse_held) {
                //cancelling flipping and making page go back automatically to the beginning (the right side)
                cancelPageFlip();
                flip_init = false;
            } else {
                updatePageFlip(thisX);
            }
        } 

        // Logic for establishing the cursos and the beginning of the flipping action.
        if (thisX > (0.9*flipper.clientWidth)) {
            flipper.style.cursor='pointer';
            if (mouse_held) {
                flip_init = true;
            }
        } else if (!flip_init) {
            flipper.style.cursor ='default';
        }
    });

    function cancelPageFlip() {
        // applying the formulas with the X value in the utmost right side of the book, 
        // point where the page is grabbed for flipping. 
        updatePageFlip(flipper.clientWidth);
    }

    function finishPageFlip() {
        // applying the formulas with the X value in the utmost left side of the book, 
        // point where the page is grabbed for flipping.
        updatePageFlip(0);
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
            //    front_page.style.cssText = `width:${200 - (1/2)*thisX}px;
            //                     height:${(357+47)-47/200*thisX}px;
            //                     top:${-50 + thisX/8}px;
            //                     left:${thisX - 2}px`;
            //     back_page.style.cssText = `width:${-190 + thisX}px;`;

            front_page.style.cssText = `width:${(w/2) + (-1/2)*thisX}px;
                                height:${(h*1.2) + (-0.2*h/w)*thisX}px;
                                top:${-50 + (thisX/(w/50))}px;
                                left:${thisX - 2}px`;
                back_page.style.cssText = `width:${-190 + thisX}px;`;
        } else {
            front_page.style.cssText =`width:${(w/2) + (-1/2)*thisX}px;
                                height:${(h) + (0.2*h/w)*thisX}px;
                                top:${-thisX/(w/50)}px;
                                left:${thisX - 2}px;`;
            back_page.style.cssText = `width:0px;`;
        }

        // Really important to concatenate here, because the cssText, if not concatenated, just deletes the rest of the CSS, 
        // so if here you do not concatenate, the cssText you just updated gets deleted.
        front_page.style.cssText +='box-shadow', cc + 'px 0 ' + cc + 'px rgba(0,0,0,0.7), 2px 0 4px rgba(0,0,0,0.5), -2px 0 4px rgba(0,0,0,0.5), -20px 0 40px rgba(0,0,0,0.2), 4px 0 10px rgba(0,0,0,0.1) inset, -2px 0 2px rgba(0,0,0,0.2) inset, ' + dd + 'px 0 ' + ff + 'px rgba(0,0,0,' + gg + ') inset';
    }
}
