$("document").ready( function () {
    // Firebase stuff
    var config = {
        apiKey: "AIzaSyAyM37LB5h7tDTR7vlf2DHYTkCDP5b0VLc",
        authDomain: "soaring-indigo-mimes.firebaseapp.com",
        databaseURL: "https://soaring-indigo-mimes.firebaseio.com",
        projectId: "soaring-indigo-mimes",
        storageBucket: "soaring-indigo-mimes.appspot.com",
        messagingSenderId: "417609766921"
    };
    firebase.initializeApp(config);


    console.log('Ready');
    let ebayQueryUrl;
    let ebayComic;
    //========================================================================================================
    //Character Selection and TeamupCall
    var arrayCombinedIDs = [];
    var strCombinedIDs;
    let tester = "tester works!";
    $("#get-info").on("click", function (event) {


        // Empty current array
        arrayCombinedIDs = [];
        incrementer = 1;

        $(".active").each(function () {
            var numID = $(this).attr("id-number");
            var urlThumbnail;
            var strName;
            arrayCombinedIDs.push(numID);
            console.log(numID);
            // urlThumbnail = getThumbnail(numID);
            // strName = getName(numID);
            $("#display-image-" + incrementer).attr("src", urlThumbnail);
            $("#display-name-" + incrementer).text(strName);
            incrementer++;



        });

        strCombinedIDs = arrayCombinedIDs.toString();
        console.log(strCombinedIDs);

        var teamupQueryURL = "https://gateway.marvel.com/v1/public/comics?format=comic&formatType=comic&noVariants=true&dateRange=1960-01-01%2C2018-06-21&sharedAppearances=" + strCombinedIDs + "&orderBy=focDate%2ConsaleDate&limit=1&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d";
        $.ajax({
            url: teamupQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(response.data.results["0"].title);

            // Ebay Additions
            ebayComic = response.data.results["0"].title;
            ebayComic = ebayComic.split(" ");
            console.log(ebayComic);
            for (let i = 0; i < ebayComic.length; i++) {
                ebayComic[i] = ebayComic[i].replace(/[^a-zA-Z0-9 ]/g, "");
                if (i < ebayComic.length - 1) {
                    ebayComic[i] = ebayComic[i] + "+"
                };
            };
            ebayComic[ebayComic.length - 2] = "";
            ebayComic = ebayComic.join();
            ebayComic = ebayComic.replace(/,/g, '');
            console.log(ebayComic);






            console.log(ebayComic);
            // console.log(ebayComic);
            // let comicYear = ebayComic[1].substring(1,5);
            // ebayComic = ebayComic[0]+"+"+comicYear;
            // ebayComic = ebayComic.trim();
            // console.log(comicYear);
            // console.log(ebayComic);//
            ebayQueryUrl = "http://open.api.ebay.com/shopping?version=515&callname=FindItemsAdvanced&appid=ChanceMu-ClassPro-PRD-667ac8c8b-ab199383&QueryKeywords=" + ebayComic + "&ItemSort=BestMatch&SortOrder=Descending&CategoryID=63&responseencoding=JSON&MaxEntries=3";




            //EBAY ADDITIONS
            // NEED TO DO-----
            // #1# 
            // NEED A CALL FOR LISTINGS FOR EACH SPEREATE CHARACTER CHOSEN TO
            // DISPLAY 2 SEPERATE ROWS OF CHARACTER SPECIFIC LISTINGS
            //
            // #3#
            // REASERCH MORE EBAY API FILTERS TO SEE IF YOU CAN GET
            // THE BEST QUALITY SEARCH RESULTS YOU CAN


            setTimeout(() => {




                // ebayQueryUrl = "http://open.api.ebay.com/shopping?version=515&callname=FindItemsAdvanced&appid=ChanceMu-ClassPro-PRD-667ac8c8b-ab199383&QueryKeywords=" +ebayComic+"&ItemSort=BestMatchPlusPrice&SortOrder=Descending&CategoryID=63&responseencoding=JSON&MaxEntries=3";      //ID 1 = collectibles ID 63 = collectibles/comics
                //PricePlusShipping //BestMatch
                console.log(ebayQueryUrl);
                $(".ebayRow").css("visibility", "hidden");
                $(".ebayRow").addClass("hideMe");
                callAdvanced();


                for (let i = 1; i < 3; i++) {
                    if (i === 1) {
                        ebayQueryUrlLeft = "http://open.api.ebay.com/shopping?version=515&callname=FindItems&appid=ChanceMu-ClassPro-PRD-667ac8c8b-ab199383&QueryKeywords=" + ebaySearchOne + "+comics&ItemSort=PricePlusShipping&CategoryID=63&responseencoding=JSON&MaxEntries=3";
                        let target = $("#ebayResultsLeft");
                        callSimple(ebayQueryUrlLeft, target);
                    } else {
                        ebayQueryUrlRight = "http://open.api.ebay.com/shopping?version=515&callname=FindItems&appid=ChanceMu-ClassPro-PRD-667ac8c8b-ab199383&QueryKeywords=" + ebaySearchTwo + "+comics&ItemSort=PricePlusShipping&SortOrder=Descending&CategoryID=63&responseencoding=JSON&MaxEntries=3";
                        let target = $("#ebayResultsRight");
                        callSimple(ebayQueryUrlRight, target);
                    }
                };

                setTimeout(() => {
                    $(".hideMe").css("display", "none");
                }, 200);

            }, 1000);
        });
    });
    //========================================================================================================  
    let ebaySearchComic;
    let ebaySearchOne;
    let ebaySearchTwo;
    // let ebayQueryUrl;
    let ebaySearchCount = 0;
    // let ebayComic;

    function callAdvanced() {
        $.ajax({
            url: ebayQueryUrl,
            method: "GET",

        }).then(function (response) {
            // console.log(response);
            let test = response;
            test = JSON.parse(test);
            console.log(test);
            DisplayEbayResultsAdvanced(test);
        });
    };

    function callSimple(URL, target) {
        $.ajax({
            url: URL,
            method: "GET",

        }).then(function (response) {
            // console.log(response);
            let test = response;
            test = JSON.parse(test);
            console.log(test);
            DisplayEbayResultsSimple(test, target);
        });
    };

    function DisplayEbayResultsSimple(test, target) {
        for (let i = 0; i < test.Item.length; i++) {
            let div = $("<div>");
            div.addClass("row");
            div.addClass("ebayCharacterRow");
            div.addClass("ebayRow");
            div.css("margin", "20px");
            let img = $("<img>");
            img.attr("src", test.Item[i].GalleryURL);
            img.css("width", "150px");
            img.css("height", "150px");
            img.css("float", "left");
            img.css("margin-right", "10px");
            let title = $('<h4>');
            title.html(test.Item[i].Title)
            let link = $("<a>BUY</a>");
            link.attr("href", test.Item[i].ViewItemURLForNaturalSearch);
            link.addClass("btn");
            link.addClass("btn-success");
            let bids = $('<div>');
            bids.html("Total Bids: " + test.Item[i].BidCount + "<br><br>");
            let price = $("<h2>");
            price.text("$" + test.Item[i].ConvertedCurrentPrice.Value);
            let ebayLogo = $("<img>");
            ebayLogo.attr("src", "assets/images/ebayLogo.png");
            ebayLogo.css("height", "25px");
            ebayLogo.css("float", "right");
            div.prepend(img, title, bids, price, ebayLogo, link);
            target.append(div);
        };
    };

    function DisplayEbayResultsAdvanced(test) {
        if (test.TotalItems > 0) {
            for (let i = 0; i < test.SearchResult[0].ItemArray.Item.length; i++) {
                let div = $("<div>");
                div.addClass("row");
                div.addClass("ebayRow");
                div.css("margin", "20px");
                let img = $("<img>");
                img.attr("src", test.SearchResult[0].ItemArray.Item[i].GalleryURL);
                img.attr("href", test.SearchResult[0].ItemArray.Item[i].ViewItemURLForNaturalSearch);
                img.css("width", "150px");
                img.css("height", "200px");
                img.css("float", "left");
                img.css("margin-right", "10px");
                let title = $('<h4>');
                title.html(test.SearchResult[0].ItemArray.Item[i].Title);
                let link = $("<a>BUY</a>");
                link.attr("href", test.SearchResult[0].ItemArray.Item[i].ViewItemURLForNaturalSearch);
                link.addClass("btn");
                link.addClass("btn-success");
                let bids = $('<div>');
                bids.html("Total Bids: " + test.SearchResult[0].ItemArray.Item[i].BidCount + "<br><br>");
                let price = $("<h2>");
                price.text("$" + test.SearchResult[0].ItemArray.Item[i].ConvertedCurrentPrice.Value);
                let ebayLogo = $("<img>");
                ebayLogo.attr("src", "assets/images/ebayLogo.png");
                ebayLogo.css("height", "25px");
                ebayLogo.css("float", "right");
                div.prepend(img, title, bids, price, ebayLogo, link);
                $('#ebayResults').append(div);
            };
        } else {
            let div = $("<div>");
            div.html("SORRY, COMIC NOT FOUND.")
            div.addClass("ebayRow");
            $("#ebayResults").prepend(div);

        };

    };




    // EBAY SCRIPT ABOVE
    //========================================================================================================
    // THUMNAILS AND TEAMUP BELOW


    /*  Firebase is being used to hold information for any character that is on the page.
        The information stored is:
            IDnumber: the character's unique ID in Marvel's database
            Name: the character's name
            Thumbnail: the URL for the character's image file
        All of this info will be used later either for displaying info or for AJAX calls. */

    var database = firebase.database();

    // Variable to hold the name of the character the user wants to add to the page. This gets passed in to the AJAX query url.
    var strCharacterName;

    // On click function for adding more characters to the page
    $("#characterInput").on("click", function (event) {
        event.preventDefault();

        strCharacterName = $("#userInput").val();

        var queryURL = "http://gateway.marvel.com/v1/public/characters?name=" + strCharacterName + "&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // Quick conditional to let us know that a character wasn't found
            // TODO: attach a modal to this condition to let the user know a character wasn't found.
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

    // This code takes all the characters currently in the database and displays them on the page.
    database.ref().on("child_added", function (snapshot) {

        var snap = snapshot.val();
        var charImgPath = snap.thumbnail;

        // create image element
        var imgChar = $("<img>");
        // create div element to hold image
        var divChar = $("<div>");

        // set image attributes
        imgChar.attr({
            // attribute-value pairs to set
            src: charImgPath,
            class: "img-thumbnail inactive",
            title: snap.name,
            "id-number": snap.idNumber
        });

        // set div class
        divChar.addClass("col-xl-2 col-lg-3 col-md-4 col-4 my-2");

        // add image to div
        divChar.append(imgChar);

        // add image div to page
        $("#display-button-area").append(divChar);
    });

    // Set active elements to zero on page load
    var activeElements = 0;

    // I want to extend this code later to allow the user to pick more than two characters, so we're holding the maximum here for now.
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
            //ebay additions
            if ($(this).hasClass("active")) {
                activeElements--;
            }
            $(this).removeClass("active");
            $(this).addClass("inactive");
            console.log(activeElements);

            // TODO: see if these conditionals can be wrapped into the if (activeElements == 2) conditional below.
            if (activeElements === 1) {
                ebaySearchOne = $(this).attr("title");
                console.log(ebaySearchOne);
            }
            else if (activeElements === 2) {
                ebaySearchTwo = $(this).attr("title");
                console.log(ebaySearchTwo);
            };

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
    // This will hold all of the IDs so they can be used in the AJAX call
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
    };

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
