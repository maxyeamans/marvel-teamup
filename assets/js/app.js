//----Firebase----
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
//----------------------------------

//----Variables----
var strCharacterName;
var numCharacterId;
var imgCharacterThumb;

var strCollabTitle1;
var numCollabId1;
var imgCollabThumb1;

var strCollabTitle2;
var numCollabId2;
var imgCollabThumb2;


var strCollabTitle3;
var numCollabId3;
var imgCollabThumb3;

var activeElements = 0;

// Moment JS
var formatDate = "YYYY-MM-DD";
var strTheDate = moment().format(formatDate);

var arrayCombinedIDs = [];
var strCombinedIDs;
var thumbLink
var charName
var urlThumbnail;
var strName;

//----------------

//----Input for Character----
$("#characterInput").on("click", function (event) {
    event.preventDefault();

    strCharacterName = $("#userInput").val();
    var queryURL = "http://gateway.marvel.com/v1/public/characters?name=" + strCharacterName + "&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d"

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (firstCharacter) {

        //If search fails
        if (firstCharacter.data.total == 0) {
            $('.modal-body').text("CANNOT FIND CHARACTER PLEASE TRY AGAIN!")
            $('#noCharacterModal').modal('show');

        }
        else {
            console.log("Search results for first character: " + firstCharacter.data.total);
            imgCharacterThumb = firstCharacter.data.results[0].thumbnail.path + "." + firstCharacter.data.results[0].thumbnail.extension;
            numCharacterId = firstCharacter.data.results[0].id;
            strCharacterName = firstCharacter.data.results[0].name;

            database.ref(strCharacterName + "/").set({
                idNumber: numCharacterId,
                name: strCharacterName,
                thumbnail: imgCharacterThumb,

            });

            $("#display-button-area").velocity("fadeIn");


        }
    });
});



//----Adds Character onto page from database----
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
        "id-number": snap.idNumber

    })

    // set div class
    divChar.addClass("col-xl-2 col-lg-3 col-md-4 col-6 my-2")

    // add image to div
    divChar.prepend(imgChar);

    // add image div to page
    $("#display-button-area").append(divChar);
});

//--------Character Buttons-------------
$(document).on("click", ".img-thumbnail", function () {
    if ($(this).hasClass("inactive") && activeElements < 2) {
        $(this).addClass("active");
        $(this).removeClass("inactive");
        activeElements++;
    }
    else {
        if ($(this).hasClass("active")) {
            activeElements--;
        }
        $(this).removeClass("active");
        $(this).addClass("inactive");
    }

    // Enable submit button if two characters are selected
    if (activeElements == 2) {
        $(".inactive").css({ opacity: 0.5 });
        $("#get-info").prop("disabled", false);
    }
    else {
        $(".inactive").css({ opacity: 1 });
        $("#get-info").prop("disabled", true);
    }
});
//------Functions That Take from Database------
function getThumbnailByID(id) {


    ref = database.ref().child(id);
    ref.once("value", function (snapshot) {
        thumbLink = snapshot.val().thumbnail;
    })
    return thumbLink;
}

function getNameByID(id) {

    ref = database.ref().child(id);
    ref.once("value", function (snapshot) {
        charName = snapshot.val().name;
    })
    return charName;
};
//-------------------------------



//-------The Comics Search-------
$("#get-info").on("click", function (event) {


    // Empty current array
    arrayCombinedIDs = [];
    incrementer = 1;

    $(".active").each(function () {
        var numID = $(this).attr("id-number");

        arrayCombinedIDs.push(numID);
        urlThumbnail = getThumbnailByID(numID);
        strName = getNameByID(numID);

        console.log(thumbLink);
        console.log(charName);

        console.log(strName)
        console.log(urlThumbnail)

        $("#display-image-" + incrementer).attr("src", urlThumbnail);
        $('#display-image-' + incrementer).velocity("bounceIn");
        $("#display-name-" + incrementer).text(strName);
        $('#display-name' + incrementer).velocity("bounceIn");

        incrementer++;

    });

    strCombinedIDs = arrayCombinedIDs.toString();
    console.log(strCombinedIDs);

    var teamupQueryURL = "https://gateway.marvel.com/v1/public/comics?format=comic&formatType=comic&noVariants=true&dateRange=1960-01-01%2C" + strTheDate + "&sharedAppearances=" + strCombinedIDs + "&orderBy=focDate%2ConsaleDate&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d";
    $.ajax({
        url: teamupQueryURL,
        method: "GET",
        success: function(){
            $('.comic-search-result').text("Now Searching...");
          },
    }).then(function (teamup) {

        if (teamup.data.total == 0) {
            $('.comics').velocity("fadeOut");
            var notFound = function () {
                $(".comics").empty();
                $('#comic-search-result').text("No Comics Found!");
                $('.modal-body').text("CANNOT FIND ANY COMICS! SORRY!")
                $('#noCharacterModal').modal('show');
                if ($('.img-thumbnail').hasClass("active")) {
                    $('.img-thumbnail').removeClass("active");
                    $('.img-thumbnail').addClass("inactive");
                    activeElements = 0;
                    $(".inactive").css({ opacity: 1 });


                }
            }
            setTimeout(notFound, 1200);

        }
        else {

            $('.comics').empty();
            //just to shorten the code
            var result = teamup.data.results;
            $('#comic-search-result').text("Comics found: " + result.length);



            //This makes the search limited to 3 comics!
            $.each(result, function (key, value) {
                return key < 2
            });


            //console logs our results and if they exist
            console.log("Comic 1 info: ", result[0]);
            console.log("Comic 2 info: ", result[1]);
            console.log("Comic 3 info: ", result[2]);

            strCollabTitle1 = result[0].title;
            numCollabId1 = result[0].id;
            imgCollabThumb1 = result[0].thumbnail.path + "." + result[0].thumbnail.extension;

            console.log(strCollabTitle1);
            console.log(imgCollabThumb1);

            $('#comic1').html("<img style='width:250px; height:300px' src=" + imgCollabThumb1 + "></img>");
            $('#comic1').velocity("bounceIn");



            if (typeof result[1] != "undefined") {
                strCollabTitle2 = teamup.data.results[1].title;
                numCollabId2 = teamup.data.results[1].id;
                imgCollabThumb2 = teamup.data.results[1].thumbnail.path + "." + teamup.data.results[1].thumbnail.extension;
                console.log(strCollabTitle2);
                console.log(imgCollabThumb2);


                $('#comic2').html("<img style='width:250px; height:300px' src=" + imgCollabThumb2 + "></img>")
                $('#comic2').velocity("bounceIn");
            }
            else {
                $('#comic2').empty();
            }

            if (typeof result[2] != "undefined") {
                strCollabTitle3 = teamup.data.results[2].title;
                numCollabId3 = teamup.data.results[2].id;
                imgCollabThumb3 = teamup.data.results[2].thumbnail.path + "." + teamup.data.results[2].thumbnail.extension;
                console.log(strCollabTitle3);
                console.log(imgCollabThumb3);

                $('#comic3').html("<img style='float:left; width:250px; height:300px' class='img-fluid' src=" + imgCollabThumb3 + "></img>")
                $('#comic3').velocity("bounceIn");

            }
            else {
                $('#comic3').empty();
            }

        }

    });
});




//Jason's Original Code. Just ctrl + / to test.

// //------Firebase---------
// var config = {
//     apiKey: "AIzaSyAyM37LB5h7tDTR7vlf2DHYTkCDP5b0VLc",
//     authDomain: "soaring-indigo-mimes.firebaseapp.com",
//     databaseURL: "https://soaring-indigo-mimes.firebaseio.com",
//     projectId: "soaring-indigo-mimes",
//     storageBucket: "soaring-indigo-mimes.appspot.com",
//     messagingSenderId: "417609766921"
// };
// firebase.initializeApp(config);
// //-----------------------


// //-------Variables-------
// var database = firebase.database();


// //----Character Info----
// var strCharacterName;
// var strCharacterName2;

// var numCharacterId;
// var numCharacterId2;

// var imgCharacterThumb;
// var imgCharacterThumb2;


// //----Comics Info-----
// var strCollabTitle1;
// var numCollabId1;
// var imgCollabThumb1;

// var strCollabTitle2;
// var numCollabId2;
// var imgCollabThumb2;


// var strCollabTitle3;
// var numCollabId3;
// var imgCollabThumb3;


// //moment js for the ajax team up link
// var formatDate = "YYYY-MM-DD";
// var strTheDate = moment().format(formatDate);
// //-----------------------


// $(document).ready(function () {

//     //----First Character----

//     //stuff to fix
//     // The problem is that if the character is not found, the jquery becomes undefined.
//     // also some characters are just not showing up: 
//     //EX: Venom (Eddie Brock shows up but not Flash Thompson?), Shocker, Green Goblin, Hobgoblin, She-Hulk unless specified by their real (or human) names. WHY API WHY?

//     $("#characterInput").on("click", function (event) {
//         event.preventDefault();

//         strCharacterName = $("#userInput").val();
//         var queryURL = "http://gateway.marvel.com/v1/public/characters?name=" + strCharacterName + "&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d"
//         $.ajax({
//             url: queryURL,
//             method: "GET",
//         }).then(function (firstCharacter) {

//             //If search fails
//             if (firstCharacter.data.total == 0) {
//                 $('#firstCharacterName').text("TRY AGAIN");
//                 $('#testImage').html("CANNOT FIND CHARACTER! PLACEHOLDER");

//             }
//             else {
//                 console.log("Search results for first character: " + firstCharacter.data.total);
//                 imgCharacterThumb = firstCharacter.data.results[0].thumbnail.path + "." + firstCharacter.data.results[0].thumbnail.extension;
//                 numCharacterId = firstCharacter.data.results[0].id;
//                 strCharacterName = firstCharacter.data.results[0].name;

//                 database.ref(strCharacterName + "/").set({
//                     idNumber: numCharacterId,
//                     name: strCharacterName,
//                     thumbnail: imgCharacterThumb,

//                 });
//                 //Loads the image and then puts the velocity animations in.
//                 $('#testImage').html("<img style='width:300px; height:300px' src=" + imgCharacterThumb + "></img>");
//                 $('#testImage').velocity("bounceIn");

//                 $('#firstCharacterName').text(strCharacterName);
//                 $('#firstCharacterName').velocity("bounceIn");
//             }
//         });
//     });

//     //----Second Character----
//     $("#characterInput2").on("click", function (event) {
//         event.preventDefault();

//         strCharacterName2 = $("#userInput2").val();
//         var queryURL2 = "http://gateway.marvel.com/v1/public/characters?name=" + strCharacterName2 + "&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d"

//         $.ajax({
//             url: queryURL2,
//             method: "GET",
//         }).then(function (secondCharacter) {

//             //If search fails
//             if (secondCharacter.data.count == 0) {
//                 $('#secondCharacterName').text("TRY AGAIN");
//                 $('#secondTestImage').html("CANNOT FIND CHARACTER PLACEHOLDER!");
//             }
//             else {
//                 console.log("Search results for second character: " + secondCharacter.data.count);
//                 imgCharacterThumb2 = secondCharacter.data.results[0].thumbnail.path + "." + secondCharacter.data.results[0].thumbnail.extension;
//                 numCharacterId2 = secondCharacter.data.results[0].id;
//                 strCharacterName2 = secondCharacter.data.results[0].name;

//                 database.ref(strCharacterName2 + "/").set({
//                     idNumber: numCharacterId2,
//                     name: strCharacterName2,
//                     thumbnail: imgCharacterThumb2,

//                 });

//                 //Loads the image and then puts the velocity animations in.
//                 $('#secondTestImage').html("<img style='width:300px; height:300px' src=" + imgCharacterThumb2 + "></img>")
//                 $('#secondTestImage').velocity("bounceIn");

//                 $('#secondCharacterName').text(strCharacterName2);
//                 $('#secondCharacterName').velocity("bounceIn");
//             }
//         });
//     });


//     //----Collab----
//     $('#fusion').on("click", function () {
//         var queryURL3 = "https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&noVariants=true&dateRange=1960-01-01%2C2018-06-23&sharedAppearances=" + numCharacterId + " %2C" + numCharacterId2 + "&orderBy=focDate%2ConsaleDate&limit=3&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d"

//         //Ajax for the team up link
//         console.log(queryURL3);
//         $.ajax({
//             url: queryURL3,
//             method: "GET",
//         }).then(function (theCollab) {

//             console.log(theCollab)
//             console.log(theCollab.data.total)

//             //Failed Search
//             if (theCollab.data.total == 0) {
//                 $('#testImage').velocity("fadeOut");
//                 $('#firstCharacterName').velocity("fadeOut");
//                 $('#secondTestImage').velocity("fadeOut");
//                 $('#secondCharacterName').velocity("fadeOut");


//                 $('#comic1').velocity("fadeOut");
//                 $('#comic2').velocity("fadeOut");
//                 $('#comic3').velocity("fadeOut");

//                 var notFound = function () {
//                     $(".comics").empty();
//                     $('#notFound').html("Nothing Found! PLACEHOLDER");
//                 }

//                 setTimeout(notFound, 1200);



//             }
//             else {

//                 $('#notFound').empty();
//                 //just to shorten the code
//                 var result = theCollab.data.results;
//                 console.log("Comics found: " + result.length)



//                 //This makes the search limited to 3 comics!
//                 $.each(result, function (key, value) {
//                     return key < 2
//                 });


//                 //console logs our results and if they exist
//                 console.log(result[0], "Does it exist?", typeof result[0] != "undefined");
//                 console.log(result[1], "Does it exist?", typeof result[1] != "undefined");
//                 console.log(result[2], "Does it exist?", typeof result[2] != "undefined");

//                 //code spits out one comic. 
//                 strCollabTitle1 = result[0].title;
//                 numCollabId1 = result[0].id;
//                 imgCollabThumb1 = result[0].thumbnail.path + "." + result[0].thumbnail.extension;

//                 console.log(strCollabTitle1);
//                 console.log(imgCollabThumb1);

//                 $('#comic1').html("<img style='width:300px; height:300px' src=" + imgCollabThumb1 + "></img>");
//                 $('#comic1').velocity("bounceIn");



//                 if (typeof result[1] != "undefined") {
//                     strCollabTitle2 = theCollab.data.results[1].title;
//                     numCollabId2 = theCollab.data.results[1].id;
//                     imgCollabThumb2 = theCollab.data.results[1].thumbnail.path + "." + theCollab.data.results[1].thumbnail.extension;
//                     console.log(strCollabTitle2);
//                     console.log(imgCollabThumb2);


//                     $('#comic2').html("<img style='width:300px; height:300px' src=" + imgCollabThumb2 + "></img>")
//                     $('#comic2').velocity("bounceIn");


//                 }

//                 if (typeof result[2] != "undefined") {
//                     strCollabTitle3 = theCollab.data.results[2].title;
//                     numCollabId3 = theCollab.data.results[2].id;
//                     imgCollabThumb3 = theCollab.data.results[2].thumbnail.path + "." + theCollab.data.results[2].thumbnail.extension;
//                     console.log(strCollabTitle3);
//                     console.log(imgCollabThumb3);

//                     $('#comic3').html("<img style='width:300px; height:300px' src=" + imgCollabThumb3 + "></img>")
//                     $('#comic3').velocity("bounceIn");

//                 }
//                 //Fancy Velocity JS stuff
//                 $('#firstNameCollab').text(strCharacterName);
//                 $('#firstNameCollab').velocity("fadeIn");

//                 $("#firstCharacterCollab").html("<img style='width:300px; height:300px' src=" + imgCharacterThumb + "></img>");
//                 $('#firstCharacterCollab').velocity("fadeIn");

//                 $('#secondNameCollab').text(strCharacterName2);
//                 $('#secondNameCollab').velocity("fadeIn");

//                 $("#secondCharacterCollab").html("<img style='width:300px; height:300px' src=" + imgCharacterThumb2 + "></img>");
//                 $('#secondCharacterCollab').velocity("fadeIn");



//                 //Makes the searched characters appear below.
//                 $('#testImage').velocity("fadeOut");
//                 $('#firstCharacterName').velocity("fadeOut");

//                 $('#secondTestImage').velocity("fadeOut");
//                 $('#secondCharacterName').velocity("fadeOut");


//                 //Makes the above searched characters disappear... Optional stuff
//                 var disappear = function () {
//                     $(".characterInfo").empty();
//                 }

//                 setTimeout(disappear, 1200);
//             }

//         });
//     });

// });