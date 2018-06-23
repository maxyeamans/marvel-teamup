$("document").ready(function () {
    console.log('Ready');
    let ebaySearchWord = "captain america"
                                                                            //FindItems
    let queryUrl = "http://open.api.ebay.com/shopping?version=515&callname=FindItemsAdvanced&appid=ChanceMu-ClassPro-PRD-667ac8c8b-ab199383&QueryKeywords=" + ebaySearchWord + "&ItemSort=PricePlusShipping&SortOrder=Descending&CategoryID=63&responseencoding=JSON&MaxEntries=7";
    //PricePlusShipping //BestMatch
    $.ajax({
        url: queryUrl,
        method: "GET",

    }).then(function (response) {
        console.log(response);
        let test = response.split(",")
        test = JSON.parse(test);
        console.log(test);
        // DisplayEbayResultsSimple(test);
        DisplayEbayResultsAdvanced(test);
    });

    // function DisplayEbayResultsSimple(test){
    //     for(let i = 0; i < test.Item.length; i++) {
    //         let div = $("<div>");
    //         div.addClass("row");
    //         div.css("margin", "20px");
    //         let img = $("<img>");
    //         img.attr("src", test.Item[i].GalleryURL);
    //         img.css("width", "200px");
    //         img.css("height", "200px");
    //         img.css("float", "left");
    //         img.css("margin-right", "10px");
    //         // $('#ebayResults').append(img);
    //         let title = $('<h4>');
    //         title.html(test.Item[i].Title)
    //         // $('#ebayResults').append(title);
    //         let link = $("<a>BUY</a>");
    //         link.attr("href", test.Item[i].ViewItemURLForNaturalSearch);
    //         link.addClass("btn");
    //         link.addClass("btn-success");
    //         // $('#ebayResults').append(link);
    //         let bids = $('<div>');
    //         bids.html("Total Bids: "+test.Item[i].BidCount+"<br><br>");
    //         // $('#ebayResults').append(bids);
    //         let price = $("<h2>");
    //         price.text("$"+test.Item[i].ConvertedCurrentPrice.Value);
    //         let ebayLogo = $("<img>");
    //         ebayLogo.attr("src", "assets/images/ebayLogo.png");
    //         ebayLogo.css("height", "25px");
    //         ebayLogo.css("float", "right");
    //         div.append(img, title, bids, price, ebayLogo,link );
    //         // $('#ebayResults').append(price);
    //         $('#ebayResults').append(div);
    //     };
    // };
    
    function DisplayEbayResultsAdvanced(test) {
        for (let i = 0; i < test.SearchResult[0].ItemArray.Item.length; i++) {
            let div = $("<div>");
            div.addClass("row");
            div.css("margin", "20px");
            let img = $("<img>");
            img.attr("src", test.SearchResult[0].ItemArray.Item[i].GalleryURL);
            img.attr("href", test.SearchResult[0].ItemArray.Item[i].ViewItemURLForNaturalSearch);
            img.css("width", "200px");
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
            div.append(img, title, bids, price, ebayLogo, link);
            $('#ebayResults').append(div);
        };
    };



});


