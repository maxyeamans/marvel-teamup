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


//for the ajax
var formatDate = "YYYY-MM-DD";
var strTheDate = moment().format(formatDate);


//animation stuffset

$(document).ready(function () {

    //----First Character----

    //stuff to fix
    // Needs an error message if character isn't found
    // The problem is that if the character is not found, the jquery becomes undefined.
    // also some characters are just not showing up: EX: Venom, Shocker, Green Goblin, Hobgoblin, She-Hulk

    $("#characterInput").on("click", function (event) {
        event.preventDefault();

        strCharacterName = $("#userInput").val();
        var queryURL = "http://gateway.marvel.com/v1/public/characters?name=" + strCharacterName + "&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d"
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (firstCharacter) {
            console.log(firstCharacter)
            console.log(firstCharacter.data.count)

            imgCharacterThumb = firstCharacter.data.results[0].thumbnail.path + "." + firstCharacter.data.results[0].thumbnail.extension;
            numCharacterId = firstCharacter.data.results[0].id;
            strCharacterName = firstCharacter.data.results[0].name;

            if (firstCharacter.data.total == 0) {
                $('#testImage').html("CANNOT FIND CHARACTER!")

            }
            else {

                database.ref(strCharacterName + "/").set({
                    idNumber: numCharacterId,
                    name: strCharacterName,
                    thumbnail: imgCharacterThumb,

                });
                $('#testImage').html("<img style='width:300px; height:300px' src=" + imgCharacterThumb + "></img>"),
                    $('#testImage').velocity("bounceIn");

                $('#firstCharacterName').text(strCharacterName)
                $('#firstCharacterName').velocity("bounceIn");
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
            console.log(secondCharacter.data.count)

            imgCharacterThumb2 = secondCharacter.data.results[0].thumbnail.path + "." + secondCharacter.data.results[0].thumbnail.extension;
            numCharacterId2 = secondCharacter.data.results[0].id;
            strCharacterName2 = secondCharacter.data.results[0].name;

            if (secondCharacter.data.count == 0) {
                $('#secondTestImage').html("CANNOT FIND CHARACTER!")
            }
            else {

                database.ref(strCharacterName2 + "/").set({
                    idNumber: numCharacterId2,
                    name: strCharacterName2,
                    thumbnail: imgCharacterThumb2,

                });
                $('#secondTestImage').html("<img style='width:300px; height:300px' src=" + imgCharacterThumb2 + "></img>")
                $('#secondTestImage').velocity("bounceIn");

                $('#secondCharacterName').text(strCharacterName2);
                $('#secondCharacterName').velocity("bounceIn");
            }
        });
    });


    //----Collab----


    //Stuff to fix:
    //if second character is not found then it runs and shows only first character comics.


    // Maybe use a for loop to check all results and the items of names in those results, then make an if/then searching for the corresponding names. 
    // If match is true display 3 comics
    // if match is false respond with error message. 

    $('#fusion').on("click", function () {
        var queryURL3 = "https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&noVariants=true&dateRange=1960-01-01%2C2018-06-23&sharedAppearances=" + numCharacterId + " %2C" + numCharacterId2 + "&orderBy=focDate%2ConsaleDate&limit=3&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d"

        console.log(queryURL3)
        $.ajax({
            url: queryURL3,
            method: "GET",
        }).then(function (theCollab) {

            //just to shorten the code
            var results = theCollab.data.results
            console.log(theCollab.data.total)
                if (theCollab.data.total == 0) {
                    $('#notFound').html("Nothing Found!")
                }
                else {
                    //these will be changed to the comics that show up with matching characters.
                    strCollabTitle1 = theCollab.data.results[0].title;
                    numCollabId1 = theCollab.data.results[0].id;
                    imgCollabThumb1 = theCollab.data.results[0].thumbnail.path + "." + theCollab.data.results[0].thumbnail.extension

                    console.log(strCollabTitle1);
                    console.log(imgCollabThumb1);

                    // strCollabTitle2 = theCollab.data.results[1].title;
                    // numCollabId2 = theCollab.data.results[1].id;
                    // imgCollabThumb2 = theCollab.data.results[1].thumbnail.path + "." + theCollab.data.results[1].thumbnail.extension
                    // console.log(strCollabTitle2);
                    // console.log(imgCollabThumb2);


                    // strCollabTitle3 = theCollab.data.results[2].title;
                    // numCollabId3 = theCollab.data.results[2].id;
                    // imgCollabThumb3 = theCollab.data.results[2].thumbnail.path + "." + theCollab.data.results[2].thumbnail.extension
                    // console.log(strCollabTitle3);
                    // console.log(imgCollabThumb3);


                    $('#firstNameCollab').text(strCharacterName);
                    $('#firstNameCollab').velocity("fadeIn");

                    $("#firstCharacterCollab").html("<img style='width:300px; height:300px' src=" + imgCharacterThumb + "></img>"); $('#secondNameCollab').text(strCharacterName2);
                    $('#firstCharacterCollab').velocity("fadeIn");

                    $('#secondNameCollab').text(strCharacterName2);
                    $('#secondNameCollab').velocity("fadeIn");

                    $("#secondCharacterCollab").html("<img style='width:300px; height:300px' src=" + imgCharacterThumb2 + "></img>")
                    $('#secondCharacterCollab').velocity("fadeIn");


                    $('#comic1').html("<img style='width:300px; height:300px' src=" + imgCollabThumb1 + "></img>")
                    $('#comic1').velocity("bounceIn");

                    // $('#comic2').html("<img style='width:300px; height:300px' src=" + imgCollabThumb2 + "></img>")
                    // $('#comic2').velocity("bounceIn");

                    // $('#comic3').html("<img style='width:300px; height:300px' src=" + imgCollabThumb3 + "></img>")
                    // $('#comic3').velocity("bounceIn");


                    $('#testImage').velocity("fadeOut");
                    $('#firstCharacterName').velocity("fadeOut");

                    $('#secondTestImage').velocity("fadeOut");
                    $('#secondCharacterName').velocity("fadeOut");

                    var disappear = function () {
                        $(".characterInfo").empty();
                    }

                    setTimeout(disappear, 1200);
        
            }

        });
    });

});