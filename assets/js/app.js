$("document").ready(function () {
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
    var ebayQueryUrl;
    var ebayComic;
    var ebaySearchComic;
    var ebaySearchOne;
    var ebaySearchTwo;
    var ebaySearchCount = 0;
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
            var test = response;
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
            var test = response;
            test = JSON.parse(test);
            console.log(test);
            DisplayEbayResultsSimple(test, target);
        });
    };

    function DisplayEbayResultsSimple(test, target) {
        for (var i = 0; i < test.Item.length; i++) {
            var div = $("<div>");
            div.addClass("ebayCharacterRow");
            div.addClass("ebayRow");
            div.css("height", "300px");
            var img = $("<img>");
            img.attr("src", test.Item[i].GalleryURL);
            img.css("width", "150px");
            img.css("height", "150px");
            img.css("float", "left");
            img.css("margin-right", "10px");
            img.css("margin-left", "10px");
            var title = $('<h4>');
            title.html(test.Item[i].Title)
            var link = $("<a>BUY</a>");
            link.attr("href", test.Item[i].ViewItemURLForNaturalSearch);
            link.attr("target", "_blank");
            link.addClass("btn");
            link.addClass("btn-success");
            var bids = $('<div>');
            bids.html("Total Bids: " + test.Item[i].BidCount + "<br><br>");
            var price = $("<h2>");
            price.text("$" + test.Item[i].ConvertedCurrentPrice.Value);
            var ebayLogo = $("<img>");
            ebayLogo.attr("src", "assets/images/ebayLogo.png");
            ebayLogo.css("height", "25px");
            ebayLogo.css("float", "right");
            div.prepend(img, title, bids, price, ebayLogo, link);
            target.append(div);
        };
    };

    function DisplayEbayResultsAdvanced(test) {
        if (test.TotalItems > 0) {
            for (var i = 0; i < test.SearchResult[0].ItemArray.Item.length; i++) {
                var div = $("<div>");
                div.addClass("ebayComicRow");
                div.addClass("ebayRow");
                div.css("height", "225px");
                var img = $("<img>");
                img.attr("src", test.SearchResult[0].ItemArray.Item[i].GalleryURL);
                img.attr("href", test.SearchResult[0].ItemArray.Item[i].ViewItemURLForNaturalSearch);
                img.css("width", "150px");
                img.css("height", "200px");
                img.css("float", "left");
                img.css("margin-right", "10px");
                img.css("margin-left", "10px");
                var title = $('<h4>');
                title.html(test.SearchResult[0].ItemArray.Item[i].Title);
                var link = $("<a>BUY</a>");
                link.attr("href", test.SearchResult[0].ItemArray.Item[i].ViewItemURLForNaturalSearch);
                link.attr("target", "_blank");
                link.addClass("btn");
                link.addClass("btn-success");
                var bids = $('<div>');
                bids.html("Total Bids: " + test.SearchResult[0].ItemArray.Item[i].BidCount + "<br><br>");
                var price = $("<h2>");
                price.text("$" + test.SearchResult[0].ItemArray.Item[i].ConvertedCurrentPrice.Value);
                var ebayLogo = $("<img>");
                ebayLogo.attr("src", "assets/images/ebayLogo.png");
                ebayLogo.css("height", "25px");
                ebayLogo.css("float", "right");
                div.prepend(img, title, bids, price, ebayLogo, link);
                $('#ebayResults').append(div);
            };
        } else {
            var div = $("<div>");
            div.html("SORRY, COMIC NOT FOUND.")
            div.addClass("ebayRow");
            $("#ebayResults").prepend(div);

        };

    };



    (function () {
        var cors_api_host = 'cors-anywhere.herokuapp.com';
        var cors_api_url = 'https://' + cors_api_host + '/';
        var slice = [].slice;
        var origin = window.location.protocol + '//' + window.location.host;
        var open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
            var args = slice.call(arguments);
            var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
            if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
                targetOrigin[1] !== cors_api_host) {
                args[1] = cors_api_url + args[1];
            }
            return open.apply(this, args);
        };
    })();
    // EBAY SCRIPT ABOVE
    //=======================================================================================================
    // THUMNAILS AND TEAMUP BELOW

    /*  Firebase is being used to hold information for any character that is on the page.
        The information stored is:
            IDnumber: the character's unique ID in Marvel's database
            Name: the character's name
            Thumbnail: the URL for the character's image file
        All of this info will be used later either for displaying info or for AJAX calls. */


    // Variable to hold the name of the character the user wants to add to the page. This gets passed in to the AJAX query url.
    var strCharacterName;

    // On click function for adding more characters to the page
    $("#characterInput").on("click", function (event) {
        event.preventDefault();

        strCharacterName = $("#userInput").val();

        var queryURL = "http://gateway.marvel.com/v1/public/characters?nameStartsWith=" + strCharacterName + "&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // Quick conditional to let us know that a character wasn't found
            // TODO: attach a modal to this condition to let the user know a character wasn't found.
            if (response.data.total == 0) {
                console.log("No character found.");
                $('.modal-body').text("CANNOT FIND CHARACTER PLEASE TRY AGAIN!");
                $('#noCharacterModal').modal('show');
            }
            else {
                console.log(response.data.results[0].name, response.data.results[0].id);
                database.ref(response.data.results[0].id + "/").set({
                    idNumber: response.data.results[0].id,
                    name: response.data.results[0].name,
                    thumbnail: response.data.results[0].thumbnail.path + "." + response.data.results[0].thumbnail.extension
                });

                // TODO: test to make sure this works
                $("#display-button-area").velocity("fadeIn"); // ? What does this do?
            }
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
            if (activeElements === 1) {
                ebaySearchOne = $(this).attr("title");
                console.log(ebaySearchOne);
            }
            else if (activeElements === 2) {
                ebaySearchTwo = $(this).attr("title");
                console.log(ebaySearchTwo);
            };
        }
        else {
            // Real important: don't var clicking inactive elements decrement the count.
            //ebay additions
            if ($(this).hasClass("active")) {
                activeElements--;
            }
            $(this).removeClass("active");
            $(this).addClass("inactive");
            console.log(activeElements);

            // TODO: see if these conditionals can be wrapped into the if (activeElements == 2) conditional below.
            

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
            // ? Do we want to declare these before using them? Or declare/set on the same line?

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
            // $('#display-image-' + incrementer).velocity("bounceIn");
            // ? What does this do?
            $("#display-name-" + incrementer).text(strName);
            // $('#display-name' + incrementer).velocity("bounceIn");
            // ? What does this do?
            incrementer++;
        });

        // Convert the ID array into a string with the array values separated by just commas
        strCombinedIDs = arrayCombinedIDs.toString();
        console.log(strCombinedIDs);

        // Moment JS
        // Make sure we're always looking for comics up to the current date
        var formatDate = "YYYY-MM-DD";
        var strTheDate = moment().format(formatDate);

        // Variabales to hold teamup comic info
        var strCollabTitle1;
        var numCollabId1;
        var imgCollabThumb1;
        
        var strCollabTitle2;
        var numCollabId2;
        var imgCollabThumb2;
        
        
        var strCollabTitle3;
        var numCollabId3;
        var imgCollabThumb3;
        
        

        var teamupQueryURL = "https://gateway.marvel.com/v1/public/comics?format=comic&formatType=comic&noVariants=true&dateRange=1960-01-01%2C" + strTheDate + "&sharedAppearances=" + strCombinedIDs + "&orderBy=focDate%2ConsaleDate&ts=1&apikey=4287eee52c27f292e44137f86910da4a&hash=3f4394a993af3110f684ed8d0f8db35d";
        $.ajax({
            url: teamupQueryURL,
            method: "GET",
            success: function() {
                $('.comic-search-result').text("Now Searching...");
            },
        }).then(function (teamup) {

            if (teamup.data.total == 0) {
                $('.comics').velocity("fadeOut");
                var notFound = function () {
                    $(".comics").empty();
                    $('#comic-search-result').text("No Comics Found!");
                    // $('.modal-body').text("CANNOT FIND ANY COMICS! SORRY!");
                    // $('#noCharacterModal').modal('show');
                    $('#exampleModal').modal('show');

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
                    return key < 2;
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


                    $('#comic2').html("<img style='width:250px; height:300px' src=" + imgCollabThumb2 + "></img>");
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

                    $('#comic3').html("<img style='float:left; width:250px; height:300px' class='img-fluid' src=" + imgCollabThumb3 + "></img>");
                    $('#comic3').velocity("bounceIn");

                }
                else {
                    $('#comic3').empty();
                }
            }
        });

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
            for (var i = 0; i < ebayComic.length; i++) {
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
            ebayQueryUrl = "http://open.api.ebay.com/shopping?version=515&callname=FindItemsAdvanced&appid=ChanceMu-ClassPro-PRD-667ac8c8b-ab199383&QueryKeywords=" + ebayComic + "&ItemSort=BestMatch&SortOrder=Descending&CategoryID=63&responseencoding=JSON&MaxEntries=3";

            setTimeout(() => {

                console.log(ebayQueryUrl);
                $(".ebayRow").css("visibility", "hidden");
                $(".ebayRow").addClass("hideMe");
                callAdvanced();

                    for (var i = 1; i < 3; i++) {
                    if (i === 1) {
                        ebayQueryUrlLeft = "http://open.api.ebay.com/shopping?version=515&callname=FindItems&appid=ChanceMu-ClassPro-PRD-667ac8c8b-ab199383&QueryKeywords=" + ebaySearchOne + "+comics&ItemSort=PricePlusShipping&CategoryID=63&responseencoding=JSON&MaxEntries=3";
                        var target = $("#ebayResultsLeft");
                        callSimple(ebayQueryUrlLeft, target);
                        $("#firstName").html("<h3>" +ebaySearchOne + "</h3>");
                        $("#firstName").css("text-align", "center");


                    } else {
                        ebayQueryUrlRight = "http://open.api.ebay.com/shopping?version=515&callname=FindItems&appid=ChanceMu-ClassPro-PRD-667ac8c8b-ab199383&QueryKeywords=" + ebaySearchTwo + "+comics&ItemSort=PricePlusShipping&SortOrder=Descending&CategoryID=63&responseencoding=JSON&MaxEntries=3";
                        var target = $("#ebayResultsRight");
                        callSimple(ebayQueryUrlRight, target);
                        $("#secondName").html("<h3>" +ebaySearchTwo + "</h3>");
                        $("#secondName").css("text-align", "center");
                    }
                };

                setTimeout(() => {
                    $(".hideMe").css("display", "none");
                }, 200);

            }, 1000);
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