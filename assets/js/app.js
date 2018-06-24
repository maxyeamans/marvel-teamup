
//------Firebase---------
var config = {
    apiKey: "AIzaSyAyM37LB5h7tDTR7vlf2DHYTkCDP5b0VLc",
    authDomain: "soaring-indigo-mimes.firebaseapp.com",
    databaseURL: "https://soaring-indigo-mimes.firebaseio.com",
    projectId: "soaring-indigo-mimes",
    storageBucket: "soaring-indigo-mimes.appspot.com",
    messagingSenderId: "417609766921"
};
firebase.initializeApp(config);
//-----------------------


//-------Variables-------
var database = firebase.database();


//----Character Info----
var strCharacterName;
var strCharacterName2;

var numCharacterId;
var numCharacterId2;

var imgCharacterThumb;
var imgCharacterThumb2;


//----Comics Info-----
var strCollabTitle1;
var numCollabId1;
var imgCollabThumb1;

var strCollabTitle2;
var numCollabId2;
var imgCollabThumb2;


var strCollabTitle3;
var numCollabId3;
var imgCollabThumb3;


//moment js for the ajax team up link
var formatDate = "YYYY-MM-DD";
var strTheDate = moment().format(formatDate);
//-----------------------


$(document).ready(function () {

    //----First Character----

    //stuff to fix
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

            //If search fails
            if (firstCharacter.data.total == 0) {
                $('#testImage').html("CANNOT FIND CHARACTER! PLACEHOLDER")

            }
            else {
                console.log(firstCharacter)
                console.log(firstCharacter.data.count)
    
                imgCharacterThumb = firstCharacter.data.results[0].thumbnail.path + "." + firstCharacter.data.results[0].thumbnail.extension;
                numCharacterId = firstCharacter.data.results[0].id;
                strCharacterName = firstCharacter.data.results[0].name;
    
                database.ref(strCharacterName + "/").set({
                    idNumber: numCharacterId,
                    name: strCharacterName,
                    thumbnail: imgCharacterThumb,

                });
            //Loads the image and then puts the velocity animations in.
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
   
            //If search fails
            if (secondCharacter.data.count == 0) {
                $('#secondTestImage').html("CANNOT FIND CHARACTER PLACEHOLDER!")
            }
            else {
                console.log(secondCharacter.data.count)

                imgCharacterThumb2 = secondCharacter.data.results[0].thumbnail.path + "." + secondCharacter.data.results[0].thumbnail.extension;
                numCharacterId2 = secondCharacter.data.results[0].id;
                strCharacterName2 = secondCharacter.data.results[0].name;
    
                database.ref(strCharacterName2 + "/").set({
                    idNumber: numCharacterId2,
                    name: strCharacterName2,
                    thumbnail: imgCharacterThumb2,

                });

            //Loads the image and then puts the velocity animations in.
                $('#secondTestImage').html("<img style='width:300px; height:300px' src=" + imgCharacterThumb2 + "></img>")
                $('#secondTestImage').velocity("bounceIn");

                $('#secondCharacterName').text(strCharacterName2);
                $('#secondCharacterName').velocity("bounceIn");
            }
        });
    });


    //----Collab----
    $('#fusion').on("click", function () {
        var queryURL3 = "https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&noVariants=true&dateRange=1960-01-01%2C2018-06-23&sharedAppearances=" + numCharacterId + " %2C" + numCharacterId2 + "&orderBy=focDate%2ConsaleDate&limit=3&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d"

        //Ajax for the team up link
        console.log(queryURL3)
        $.ajax({
            url: queryURL3,
            method: "GET",
        }).then(function (theCollab) {

            if (theCollab.data.total == 0) {
                $('#notFound').html("Nothing Found! PLACEHOLDER")
            }
            else {

            //just to shorten the code
            var result = theCollab.data.results
            //code spits out one comic. 
                for (i = 0; i < result.length; i++) {
                    console.log(result[i]);

                    strCollabTitle1 = result[i].title;
                    numCollabId1 = result[i].id;
                    imgCollabThumb1 = result[i].thumbnail.path + "." + result[i].thumbnail.extension


            //This is to test if it can spit out multiple comics, but doesn't work if there is only one comic to display.   
                    // console.log(strCollabTitle1);
                    // console.log(imgCollabThumb1);

                    // strCollabTitle2 = theCollab.data.results[i + 1].title;
                    // numCollabId2 = theCollab.data.results[i + 1].id;
                    // imgCollabThumb2 = theCollab.data.results[i + 1].thumbnail.path + "." + theCollab.data.results[i + 1].thumbnail.extension
                    // console.log(strCollabTitle2);
                    // console.log(imgCollabThumb2);


                    // strCollabTitle3 = theCollab.data.results[i + 2].title;
                    // numCollabId3 = theCollab.data.results[i + 2].id;
                    // imgCollabThumb3 = theCollab.data.results[i + 2].thumbnail.path + "." + theCollab.data.results[i + 2].thumbnail.extension
                    // console.log(strCollabTitle3);
                    // console.log(imgCollabThumb3);


            //Fancy Velocity JS stuff
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

            //Once the code above to get the other comics works.
                    // $('#comic2').html("<img style='width:300px; height:300px' src=" + imgCollabThumb2 + "></img>")
                    // $('#comic2').velocity("bounceIn");

                    // $('#comic3').html("<img style='width:300px; height:300px' src=" + imgCollabThumb3 + "></img>")
                    // $('#comic3').velocity("bounceIn");


            //Makes the searched characters appear below.
                    $('#testImage').velocity("fadeOut");
                    $('#firstCharacterName').velocity("fadeOut");

                    $('#secondTestImage').velocity("fadeOut");
                    $('#secondCharacterName').velocity("fadeOut");


            //Makes the above searched characters disappear... Optional stuff
                    var disappear = function () {
                        $(".characterInfo").empty();
                    }

                    setTimeout(disappear, 1200);
                }
            }

        });
    });

});