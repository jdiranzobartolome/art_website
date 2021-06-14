$(document).ready(function() {

    function endMove() {
        $(this).removeClass('movable');
    }

    function startMove() {
        $('#flipwrap.movable').on('mousemove', function(event) {
            // thisX = event.pageX - $(this).width()/2 + 10;
            // thisY = event.pageY - $(this).height();
            // cc = ((thisX / -5) + 50).toFixed(2);
            // dd = ((30 + (thisX / -10)) * -1 + 1).toFixed(2);
            // ff = (15 - (10 + (thisX / -10)) * -1 + 6).toFixed(2);
            // gg = ((10 - (thisX / -13)) / 80).toFixed(2);
            // if ($('#flipwrap').hasClass('movable')) {
            //     $('#page7').css({
            //         width: 105 - thisX / 2.5,
            //         height: 375 - thisX / 4,
            //         top: -30 + thisX / 8,
            //         left: thisX + 125
            //     }).css('box-shadow', cc + 'px 0 ' + cc + 'px rgba(0,0,0,0.7), 2px 0 4px rgba(0,0,0,0.5), -2px 0 4px rgba(0,0,0,0.5), -20px 0 40px rgba(0,0,0,0.2), 4px 0 10px rgba(0,0,0,0.1) inset, -2px 0 2px rgba(0,0,0,0.2) inset, ' + dd + 'px 0 ' + ff + 'px rgba(0,0,0,' + gg + ') inset');
            //     //console.log(cc + '   ' + dd + '  ' + ff + '  ' + gg );
            //     $('#page6').css({
            //         width: 15 + thisX / 1.5
            //     });
            // }
        
            //My version
            thisX = event.pageX - 50 - 5;
            thisY = event.pageY - $(this).height();
            cc = ((thisX / -5) + 50).toFixed(2);
            dd = ((30 + (thisX / -10)) * -1 + 1).toFixed(2);
            ff = (15 - (10 + (thisX / -10)) * -1 + 6).toFixed(2);
            gg = ((10 - (thisX / -13)) / 80).toFixed(2);

            if (thisX > 200) {
                if ($('#flipwrap').hasClass('movable')) {
                    $('#page7').css({
                        width: 200 - (1/2)*thisX,
                    height: (357 + 47) + (-47/200)*thisX,
                    // El top ha de ser cero al inicio e ir aumentando.
                    top: -50 + thisX / 8,
                    left: thisX - 2
                    }).css('box-shadow', cc + 'px 0 ' + cc + 'px rgba(0,0,0,0.7), 2px 0 4px rgba(0,0,0,0.5), -2px 0 4px rgba(0,0,0,0.5), -20px 0 40px rgba(0,0,0,0.2), 4px 0 10px rgba(0,0,0,0.1) inset, -2px 0 2px rgba(0,0,0,0.2) inset, ' + dd + 'px 0 ' + ff + 'px rgba(0,0,0,' + gg + ') inset');
                    //console.log(cc + '   ' + dd + '  ' + ff + '  ' + gg );
                    $('#page6').css({
                        width: - 190 + thisX
                    });
                }
            } else {
                if ($('#flipwrap').hasClass('movable')) {
                    $('#page7').css({
                        width: 200 - (1/2)*thisX,
                        height: 310 + (47/200)*thisX,
                        top: - thisX / 8,
                        left: thisX - 2
                    }).css('box-shadow', cc + 'px 0 ' + cc + 'px rgba(0,0,0,0.7), 2px 0 4px rgba(0,0,0,0.5), -2px 0 4px rgba(0,0,0,0.5), -20px 0 40px rgba(0,0,0,0.2), 4px 0 10px rgba(0,0,0,0.1) inset, -2px 0 2px rgba(0,0,0,0.2) inset, ' + dd + 'px 0 ' + ff + 'px rgba(0,0,0,' + gg + ') inset');
                    //console.log(cc + '   ' + dd + '  ' + ff + '  ' + gg );
                    $('#page6').css({
                        width: - 190 + thisX
                    });
                }
            }
            
        });
    }

    // Esto ha de ser sustuido por un addEventListener.
    // El flipwrap se puede considerar como el area "tactil" que lee el movimiento del mouse y lo traduce en 
    // como ha de cambiar la pagina. 
    $("#flipwrap").on('mousedown', function() {
        //e.preventDefault();
        $('#page7').addClass('movable');
        $('#flipwrap').addClass('movable');

        // var thisX = event.pageX - ($(this).width()/2) + 10,
        //     thisY = event.pageY - $(this).height(),
        //     thisXrev = thisX * -4 + 1100;
        // console.log(thisX);
        
        //First I will just get the absolute X and Y on the tactile flipwrapper
        var thisX = event.pageX - 50 - 5,
            thisY = event.pageY - $(this).height(),
            thisXrev = thisX * -4 + 1100;
        console.log(thisX);

        // En realidad los calculas tienen que ser a la a partir mas tarde, como cuando ya 
        // el cursor esta en el ultimo 70% de la pagina izquiera, pero de momento hazlo desde la mitad por 
        // probar rapido, ya que asi es invertir las funciones y ya.
        // if (thisX > 200) {
        //     $('#page7').animate({
        //         width: 200 - (1/2)*thisX,
        //         height: (357 + 47) + (-47/200)*thisX,
        //         // El top ha de ser cero al inicio e ir aumentando.
        //         top: -50 + thisX / 8,
        //         left: thisX + 5
        //     });
        // } else {
        //     $('#page7').animate({
        //         width: 200 - (1/2)*thisX,
        //         height: 310 + (47/200)*thisX,
        //         top: - thisX / 8,
        //         left: thisX + 5
        //     }); 
        // }
        
        // $('#page6').animate({
        //     width: - 190 + thisX
        // });

        //this goes to a function which only creates another eventListener for when the mouse moves
        startMove();
        
        // This creates the flipping effect only by clicking, even if the mouse doesnt move.
        // Therefore, this is pretty much the only part of the code you need to understand. 
        // This only starts when
        // $('#page7').animate({
        //     width: 105 - thisX / 2.5,
        //     height: 375 - thisX / 4,
        //     top: -30 + thisX / 8,
        //     left: thisX + 125
        // });
        // $('#page6').animate({
        //     width: 15 + thisX / 1.5
        // });
    }).on('mouseup', function() {
        $('#page7').removeClass('movable');
        $('#flipwrap').removeClass('movable');
        endMove();
    });

});