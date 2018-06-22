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

var strCharacterFolder = ("/characters/");
var strNameFolder;


$("#characterInput").on("click", function (event) {
    event.preventDefault();

    strCharacterName = $("#userInput").val();

    var queryURL = "http://gateway.marvel.com/v1/public/characters?name=" + strCharacterName + "&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d"

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response.data.results[0].name);
        console.log(response.data.results[0].id);
        console.log(response.data.results[0].thumbnail);

        imgCharacterThumb = response.data.results[0].thumbnail.path + "." + response.data.results[0].thumbnail.extension;
        numCharacterId = response.data.results[0].id;

        console.log(imgCharacterThumb)
        
        strNameFolder = response.data.results[0].name;

        database.ref(strCharacterFolder).push({
        //database.ref(strCharacterFolder + "/" + strNameFolder).push({
            name: strCharacterName,
            id: numCharacterId,
            thumbnail: imgCharacterThumb,
        });

        $('#testImage').html("<img src=" + imgCharacterThumb + "></img>")

    });

});