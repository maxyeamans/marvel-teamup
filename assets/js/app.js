var config = {
    apiKey: "AIzaSyAyM37LB5h7tDTR7vlf2DHYTkCDP5b0VLc",
    authDomain: "soaring-indigo-mimes.firebaseapp.com",
    databaseURL: "https://soaring-indigo-mimes.firebaseio.com",
    projectId: "soaring-indigo-mimes",
    storageBucket: "soaring-indigo-mimes.appspot.com",
    messagingSenderId: "417609766921"
};
firebase.initializeApp(config);

var database = firebase.database();

//Firebase
//save characters in individual files
//example: characters folder
//inside characters have: ID, thumbnail, image
//have if statement to see if character is already in database, if not, create one.

//Javascript:
//have text input form check marvel database and return false if nothing is found.
//have text input form spit out marvel data into cards


var strCharacterName;
var numCharacterId;
var imgCharacterThumb;
var imgCharacterMain;

var strCharacterFolder;
var strNameFolder;

var charNumber;
$("#characterInput").on("click", function (event) {
    event.preventDefault();

    strCharacterName = $("#userInput").val();

    var queryURL = "http://gateway.marvel.com/v1/public/characters?name=" + strCharacterName + "&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d"

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        imgCharacterThumb = response.data.results[0].thumbnail.path + "." + response.data.results[0].thumbnail.extension;
        numCharacterId = response.data.results[0].id;
        strCharacterName = response.data.results[0].name;


        charNumber = response.data.results[0].id;
        console.log(response.data.results[0].id);
        database.ref(charNumber + "/").set({
            idNumber: numCharacterId,
            name: strCharacterName,
            thumbnail: imgCharacterThumb,

        });
    });
});

database.ref().on("child_added", function (snapshot) {

    var snap = snapshot.val();
    var charImgPath = snap.thumbnail;

    // create image element
    var imgChar = $("<img>");
    // create div element to hold image
    var divChar = $("<div>")

    // set image attributes
    imgChar.attr({
        // attribute-value pairs to set
        src: charImgPath,
        class: "img-thumbnail inactive",
        title: snap.name,
        value: snap.idNumber
    })

    // set div class
    divChar.addClass("col-xl-2 col-lg-3 col-md-4 col-6 my-2")

    // add image to div
    divChar.append(imgChar);

    // add image div to page
    $("#display-button-area").append(divChar);
});

var activeElements = 0;
$("#get-info").disabled = true;

$(document).on("click", ".img-thumbnail", function () {
    if ($(this).hasClass("inactive") && activeElements < 2) {
        $(this).addClass("active");
        $(this).removeClass("inactive");
        activeElements++;
        console.log(activeElements);
    }
    else {
        if ($(this).hasClass("active")) {
            activeElements--;
        }
        $(this).removeClass("active");
        $(this).addClass("inactive");
        console.log(activeElements);
    }

    if (activeElements == 2) {
        $(".inactive").css({ opacity: 0.5 });
    }
    else {
        $(".inactive").css({ opacity: 1 });
    }
});