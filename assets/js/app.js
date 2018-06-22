$("document").ready(function () {
    console.log('Ready');

    let queryUrl = "http://open.api.ebay.com/shopping?version=515&callname=FindItems&appid=ChanceMu-ClassPro-PRD-667ac8c8b-ab199383&QueryKeywords=spiderman&ItemSort=PricePlusShipping&responseencoding=JSON";

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
        let img = $("<img>");
        img.attr("src", test.Item[i].GalleryURL);
        img.css("width", "200px");
        img.css("height", "200px");
        $('#ebayResults').append(img);
        let title = $('<h4>');
        title.html(test.Item[i].Title)
        $('#ebayResults').append(title);
        let link = $("<a>BUY</a>");
        link.attr("href", test.Item[i].ViewItemURLForNaturalSearch);
        $('#ebayResults').append(link);
        let bids = $('<div>');
        bids.html("Total Bids: "+test.Item[i].BidCount);
        $('#ebayResults').append(bids);
        let price = $("<h2>");
        price.html(test.Item[i].ConvertedCurrentPrice.Value);
        $('#ebayResults').append(price);
    };
}





});