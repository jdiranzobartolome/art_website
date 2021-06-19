export var page_number = 0;

//@TO-DO: throw 'TransitionEnd event is not supported in this browser'; 
//https://stackoverflow.com/questions/5023514/how-do-i-normalize-css3-transition-functions-across-browsers/9090128#9090128
//https://medium.com/better-programming/detecting-the-end-of-css-transition-events-in-javascript-8653ae230dc7
export function transitionEndEventName () {
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
}


export async function playVideo(link, element) {

    // Using youtube API for finding out info about the video for fetching the embed video url.
    // Should add some feedback to the user if the request fails.
    console.log(link);
    const res = await fetch(`https://www.youtube.com/oembed?url=${link}&format=json`);
    let body = await res.json();

    // Using regex for fetching the url from the embeded object response.
    const urlRegex = /(https?:\/\/[^ ]*)/;
    var embed_link = body.html.match(urlRegex)[1];

    // Starting video
    const output =`
    <iframe width="100%" height="100%" src="${embed_link}" frameborder="0"></iframe>
  `;
    
    element.innerHTML = output;
}