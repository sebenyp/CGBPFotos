// Biztosan nem fog kelleni, csak addig is legalább fade-eljen
//var actualGallery = 1;

// Ezt nem tudom, hogy kell-e, úgy tűnik, hogy nem
$(function () {
    $('#myCarousel').carousel({
        pause: "false"
    });
});

$(document).ready(function () {
    doOnScreenChange();
});

$('#myCarousel').bind('slide.bs.carousel', function (e) {
    doOnScreenChange();
});

// Latency on resize, wait 20ms after resizing to run the method.
$(window).resize(function () {
    clearTimeout(window.resizedFinished);
    window.resizedFinished = setTimeout(function () {
        doOnScreenChange();
    }, 20);
});

function doOnNext(type) {
    var element;
    if (type == "next") {
        element = $(".carousel-inner .next img");
    } else {
        element = $(".carousel-inner .prev img");
    }
    setAll(element);//kell ez ide???
}

function doOnScreenChange() {
    $("#imgViewContainer").height(window.innerHeight);

    if (window.innerWidth < 992) {
        $("#galleriesButton").attr("data-toggle", "dropdown");
        $("#menuButton").show();
        $(".menuItem").each(function () {
            var aaa = $(this).children("a");
            aaa.removeClass("pull-left");
            aaa.addClass("pull-right");
        });
    } else {
        $("#galleriesButton").attr("data-toggle", "");
        $("#menuButton").hide();
        $(".menuItem").each(function () {
            var aaa = $(this).children("a");
            aaa.removeClass("pull-right");
            aaa.addClass("pull-left");
        });
    }
    $(".navbar-collapse").css({ maxHeight: $(window).height() - $(".navbar-header").height() + "px" });
}

// Gallery functions starts here

$("#imgViewContainer").click(function () {
    $(this).fadeOut();
});

//this needs to buttons can disable when u click on them
//vagy már nem kell?
//jQuery.fn.extend({
//    disable: function (state) {
//        return this.each(function () {
//            this.disabled = state;
//        });
//    }
//});

var leftButtonFn = function (e) {
    // prevent from parent clicking
    e.preventDefault();
    e.stopPropagation();

    //button function
    var imgDb = $("img").length;
    //switch (actualGallery) {
    //    case 1:
    //        imgDb = $("#menu1 img").length;
    //        break;
    //    case 2:
    //        imgDb = $("#menu2 img").length;
    //        break;
    //    case 3:
    //        imgDb = $("#menu3 img").length;
    //        break;
    //    default:
    //        imgDb = $("#menu1 img").length;
    //}

    var actualImg = $(".viewed");
    var actualImgId = actualImg.attr("id") * 1;

    var prevImgId = actualImgId - 1;
    if (prevImgId < 0) prevImgId = imgDb - 1;

    var prevImg = $("#" + prevImgId);
    //switch (actualGallery) {
    //    case 1:
    //        prevImg = $("#menu1 #" + prevImgId);
    //        break;
    //    case 2:
    //        prevImg = $("#menu2 #" + prevImgId);
    //        break;
    //    case 3:
    //        prevImg = $("#menu3 #" + prevImgId);
    //        break;
    //    default:
    //        prevImg = $("#menu1 #" + prevImgId);
    //}

    var prevImgSource = prevImg.attr("src");
    // leállítani a kattinthatóságot
    $("#imageViewerLeftButton").off('click');

    // ha letiltjuk a leftButtonFn függvényt akkor újból engedi az ős funkcióját
    // jelen esetben a fadeOut-ot, amit újra le kell tiltani
    $('#imageViewerLeftButton').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

    // function animation
    $("#imageViewer").fadeOut(200, function () {
        actualImg.removeClass("viewed");
        $("#imageViewer").attr("src", prevImgSource);
        prevImg.addClass("viewed");
    }).fadeIn(200, function () {
        // visszatenni a kattinthatóságot
        $("#imageViewerLeftButton").on('click', leftButtonFn);
    });
};

var rightButtonFn = function (e) {
    // prevent from parent clicking
    e.stopPropagation();
    e.preventDefault();

    //button function
    var imgDb = $("img").length;
    //switch (actualGallery) {
    //    case 1:
    //        imgDb = $("#menu1 img").length;
    //        break;
    //    case 2:
    //        imgDb = $("#menu2 img").length;
    //        break;
    //    case 3:
    //        imgDb = $("#menu3 img").length;
    //        break;
    //    default:
    //        imgDb = $("#menu1 img").length;
    //}

    var actualImg = $(".viewed");
    var actualImgId = actualImg.attr("id") * 1;

    var prevImgId = actualImgId + 1;
    if (prevImgId > (imgDb - 1)) prevImgId = 0;

    var prevImg = $("#" + prevImgId);
    //switch (actualGallery) {
    //    case 1:
    //        prevImg = $("#menu1 #" + prevImgId);
    //        break;
    //    case 2:
    //        prevImg = $("#menu2 #" + prevImgId);
    //        break;
    //    case 3:
    //        prevImg = $("#menu3 #" + prevImgId);
    //        break;
    //    default:
    //        prevImg = $("#menu1 #" + prevImgId);
    //}

    var prevImgSource = prevImg.attr("src");
    // leállítani a kattinthatóságot
    $("#imageViewerRightButton").off('click');

    // ha letiltjuk a rightButtonFn függvényt akkor újból engedi az ős funkcióját
    // jelen esetben a fadeOut-ot, amit újra le kell tiltani
    $('#imageViewerRightButton').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

    //animation
    $("#imageViewer").fadeOut(200, function () {
        actualImg.removeClass("viewed")
        $("#imageViewer").attr("src", prevImgSource);
        prevImg.addClass("viewed");
    }).fadeIn(200, function () {
        // visszatenni a kattinthatóságot
        $("#imageViewerRightButton").on('click', rightButtonFn);
    });
};

// initial function registrations on left and right buttons
$("#imageViewerRightButton").on('click', rightButtonFn);
$("#imageViewerLeftButton").on('click', leftButtonFn);

// set initial height
$('#imgViewContainer').css('height', window.innerWidth + 'px');

// Click on an image in gallery
$('.viewable').click(function () {
    $(".viewed").removeClass("viewed");
    $(this).addClass("viewed");
    $("#imgViewContainer").height(window.innerHeight);
    var src = $(this).attr('src'); //get the source attribute of the clicked image
    $('#imageViewer').attr('src', src); //assign it to the tag for your fullscreen div
    $('#imgViewContainer').fadeIn();
});

// To don't close imageviewer by clicking on the picture
$('#imageViewer').click(function (e) {
    e.stopPropagation();
    e.preventDefault();
});

$("#imageViewerCloseButton").click(function () {
    $('#imgViewContainer').fadeOut();
});

//End of Gallery