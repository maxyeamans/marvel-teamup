$("document").ready(function () {
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

    var strCharacterName;

    $("#characterInput").on("click", function (event) {
        event.preventDefault();

        strCharacterName = $("#userInput").val();

        var queryURL = "http://gateway.marvel.com/v1/public/characters?name=" + strCharacterName + "&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            if (response.data.total == 0) {
                console.log("No character found.");
            }
            console.log(response.data.results[0].name, response.data.results[0].id);
            database.ref(response.data.results[0].id + "/").set({
                idNumber: response.data.results[0].id,
                name: response.data.results[0].name,
                thumbnail: response.data.results[0].thumbnail.path + "." + response.data.results[0].thumbnail.extension
            });
        });

        // Clear the search field after submit
        document.getElementById("input-form").reset();
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
            "id-number": snap.idNumber
        })

        // set div class
        divChar.addClass("col-xl-2 col-lg-3 col-md-4 col-4 my-2")

        // add image to div
        divChar.append(imgChar);

        // add image div to page
        $("#display-button-area").append(divChar);
    });

    var activeElements = 0;

    var constMAX_CHARS = 2;

    // On click function that limits user to selecting two characters
    $(document).on("click", ".img-thumbnail", function () {
        if ($(this).hasClass("inactive") && activeElements < constMAX_CHARS) {
            $(this).addClass("active");
            $(this).removeClass("inactive");
            activeElements++;
            console.log(activeElements);
        }
        else {
            // Real important: don't let clicking inactive elements decrement the count.
            if ($(this).hasClass("active")) {
                activeElements--;
            }
            $(this).removeClass("active");
            $(this).addClass("inactive");
            console.log(activeElements);
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

    /*  The code below may be a bit over-engineered for finding a two-character teamup,
        but it's meant to be extended in the future to allow for finding the first teamup
        for as many characters as needed. */

    // Array of ID numbers to iterate through
    var arrayCombinedIDs = [];
    // This will hold all of the IDs so they can be used in the API call
    var strCombinedIDs;

    $("#get-info").on("click", function (event) {

        // Empty the array if a comparison has already been done
        arrayCombinedIDs = [];
        incrementer = 1;

        // Iterate through the selected characters
        $(".active").each(function () {
            var numID = $(this).attr("id-number");
            var urlThumbnail;
            var strName;

            // Push the character ID number to the array
            arrayCombinedIDs.push(numID);
            console.log(numID);
            urlThumbnail = getThumbnailByID(numID);
            strName = getNameByID(numID);
            // Using the incrementer to get the display div here. Eventually, I want to allow the user
            // to choose how many characters they'll lookup, and dynamically generate display divs.
            $("#display-image-" + incrementer).attr("src", urlThumbnail);
            $("#display-name-" + incrementer).text(strName);
            incrementer++;
        });

        // Convert the ID array into a string with the array values separated by just commas
        strCombinedIDs = arrayCombinedIDs.toString();
        console.log(strCombinedIDs);

        var teamupQueryURL = "https://gateway.marvel.com/v1/public/comics?format=comic&formatType=comic&noVariants=true&dateRange=1960-01-01%2C2018-06-21&sharedAppearances=" + strCombinedIDs + "&orderBy=focDate%2ConsaleDate&limit=1&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d";

        $.ajax({
            url: teamupQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(response.data.results["0"].title);
            $("#display-teamup-issue").text(response.data.results["0"].title);
        });
    });


    // Look up a character's thumbnail pic from Firebase by their ID number
    function getThumbnailByID(id) {

        var thumbLink;

        ref = database.ref().child(id);
        ref.once("value", function (snapshot) {
            thumbLink = snapshot.val().thumbnail;
        })
        return thumbLink;
    }

    // Look up a character's name from Firebase by their ID number
    function getNameByID(id) {
        var charName;

        ref = database.ref().child(id);
        ref.once("value", function (snapshot) {
            charName = snapshot.val().name;
        })
        return charName;
    };
});