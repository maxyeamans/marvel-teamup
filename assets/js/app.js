$("document").ready(function () {
    console.log('Ready');
    let ebaySearchWord = "spiderman comics"

    let queryUrl = "http://open.api.ebay.com/shopping?version=515&callname=FindItems&appid=ChanceMu-ClassPro-PRD-667ac8c8b-ab199383&QueryKeywords="+ebaySearchWord+"&ItemSort=PricePlusShipping&responseencoding=JSON&MaxEntries=10";

    $.ajax({
        url: queryUrl,
        method: "GET",

    }).then(function (response) {
        console.log(response);
        let test = response.split(",")
        test = JSON.parse(test);
        console.log(test);
        DisplayEbayResults(test);
    });


function DisplayEbayResults(test){
    for(let i = 0; i < test.Item.length; i++) {
        let div = $("<div>");
        div.addClass("row");
        div.css("margin", "20px");
        let img = $("<img>");
        img.attr("src", test.Item[i].GalleryURL);
        img.css("width", "200px");
        img.css("height", "200px");
        img.css("float", "left");
        img.css("margin-right", "10px");
        // $('#ebayResults').append(img);
        let title = $('<h4>');
        title.html(test.Item[i].Title)
        // $('#ebayResults').append(title);
        let link = $("<a>BUY</a>");
        link.attr("href", test.Item[i].ViewItemURLForNaturalSearch);
        link.addClass("btn");
        link.addClass("btn-success");
        // $('#ebayResults').append(link);
        let bids = $('<div>');
        bids.html("Total Bids: "+test.Item[i].BidCount+"<br><br>");
        // $('#ebayResults').append(bids);
        let price = $("<h2>");
        price.text("$"+test.Item[i].ConvertedCurrentPrice.Value);
        let ebayLogo = $("<img>");
        ebayLogo.attr("src", "assets/images/ebayLogo.png");
        ebayLogo.css("height", "25px");
        ebayLogo.css("float", "right");
        div.append(img, title, bids, price, ebayLogo,link );
        // $('#ebayResults').append(price);
        $('#ebayResults').append(div);
    };
};





});