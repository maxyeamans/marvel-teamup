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
var strCharacterName2;

var numCharacterId;
var numCharacterId2;

var imgCharacterThumb;
var imgCharacterThumb2;

var strNameFolder;

var strCollabTitle1;
var numCollabId1;
var imgCollabThumb1;

var strCollabTitle2;
var numCollabId2;
var imgCollabThumb2;


var strCollabTitle3;
var numCollabId3;
var imgCollabThumb3;



//----First Character----
$("#characterInput").on("click", function (event) {
    event.preventDefault();

    strCharacterName = $("#userInput").val();
    var queryURL = "http://gateway.marvel.com/v1/public/characters?name=" + strCharacterName + "&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d"

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (firstCharacter) {

        imgCharacterThumb = firstCharacter.data.results[0].thumbnail.path + "." + firstCharacter.data.results[0].thumbnail.extension;
        numCharacterId = firstCharacter.data.results[0].id;
        strCharacterName = firstCharacter.data.results[0].name;

        if (typeof firstCharacter == "undefined") {
            $('#testImage').html("CANNOT FIND CHARACTER!")

        }
        else {

            database.ref(numCharacterId + "/").set({
                idNumber: numCharacterId,
                name: strCharacterName,
                thumbnail: imgCharacterThumb,

            });
            $('#testImage').html("<img style='width:300px; height:300px' src=" + imgCharacterThumb + "></img>")
            $('#firstCharacterName').text(strCharacterName)

        }
    });
});

//----Second Character----
$("#characterInput2").on("click", function (event) {
    event.preventDefault();

    strCharacterName2 = $("#userInput2").val();
    var queryURL2 = "http://gateway.marvel.com/v1/public/characters?name=" + strCharacterName2 + "&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d"

    $.ajax({
        url: queryURL2,
        method: "GET",
    }).then(function (secondCharacter) {


        imgCharacterThumb2 = secondCharacter.data.results[0].thumbnail.path + "." + secondCharacter.data.results[0].thumbnail.extension;
        numCharacterId2 = secondCharacter.data.results[0].id;
        strCharacterName2 = secondCharacter.data.results[0].name;

        if (typeof secondCharacter == "undefined") {
            $('#secondTestImage').html("CANNOT FIND CHARACTER!")

        }
        else {

            database.ref(numCharacterId + "/").set({
                idNumber: numCharacterId2,
                name: strCharacterName2,
                thumbnail: imgCharacterThumb2,

            });
            $('#secondTestImage').html("<img style='width:300px; height:300px' src=" + imgCharacterThumb2 + "></img>")
            $('#secondCharacterName').text(strCharacterName2)
        }
    });
});


//----Collab----


//Stuff to fix:
//Shows first character, but if second character is not found then it runs and shows only first character comics.

//Need to input a if/then searching theCollab.data.results.characters

$('#fusion').on("click", function () {
    var queryURL3 = "https://gateway.marvel.com:443/v1/public/comics?format=comic&noVariants=false&dateRange=1960-01-01%2C%202018-6-22&characters=" + numCharacterId + "&sharedAppearances=" + numCharacterId2 + "&orderBy=onsaleDate&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d"
    console.log(queryURL3)

    $.ajax({
        url: queryURL3,
        method: "GET",
    }).then(function (theCollab) {

        //just to shorten the code
        var results = theCollab.data.results

        //this loops through the results array
        for (i = 0; i < results.length; i++) {
            //this loops through the items array which is inside the results array
            for (k = 0; k < results[i].characters.items.length; k++) {
                var strNameLoop = results[i].characters.items[i].name

                // console.log(strNameLoop) // this spits out character names that are inside the comics. 
                console.log(strNameLoop == strCharacterName2); //console logs the loop and sees if it's true.


                //needs code that checks if the second character name shows up. 


                //if second character's name does not show up, must show error message saying it does not. 


                //these will be changed to the comics that show up with matching characters.
                strCollabTitle1 = theCollab.data.results[0].title;
                numCollabId1 = theCollab.data.results[0].id;
                imgCollabThumb1 = theCollab.data.results[0].thumbnail.path + "." + theCollab.data.results[0].thumbnail.extension

                strCollabTitle2 = theCollab.data.results[1].title;
                numCollabId2 = theCollab.data.results[1].id;
                imgCollabThumb2 = theCollab.data.results[1].thumbnail.path + "." + theCollab.data.results[1].thumbnail.extension

                strCollabTitle3 = theCollab.data.results[2].title;
                numCollabId3 = theCollab.data.results[2].id;
                imgCollabThumb3 = theCollab.data.results[2].thumbnail.path + "." + theCollab.data.results[2].thumbnail.extension



                $('#comic1').html("<img style='width:300px; height:300px' src=" + imgCollabThumb1 + "></img>")
                $('#comic2').html("<img style='width:300px; height:300px' src=" + imgCollabThumb2 + "></img>")
                $('#comic3').html("<img style='width:300px; height:300px' src=" + imgCollabThumb3 + "></img>")
            }
        }
    });
});