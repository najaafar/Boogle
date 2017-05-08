// Import module

$(document).ready(function(){


$('button#search').click(function(){

    $('#output').empty();
    $('#container p').empty();

    var text = $('#input').val();
    var parsedText = parseText(text);

    var result = [];
    result = mineText(text, parsedText);
    console.log(result);
    displayResult(result, text);
});


$('#input').bind("enterKey",function(e){

    $('#output').empty();
    $('#container p').empty();

    var text = $('#input').val();
    var parsedText = parseText(text);

    var result = [];
    result = mineText(text, parsedText)
    displayResult(result, text);
});

$('#input').click(function(){
    $('#bannerLogo').animate({
        width:   "auto",
        height: "8.5vh"
    },"slow");

    $('.page-header').animate({
        marginTop: "2vh",
    },"slow");


    $('div#wrapper').animate({
        marginTop: "0px",
        padding: "1vh",
    },"slow");

    $('div#wrapper').delay(5000)
       .css("border-bottom-color", "#cccccc")
       .css("border-bottom-style","solid")
       .css("border-bottom-width","1px")
       .css("background-color","#fafafa");
});

$('#input').keyup(function(e){

    if(e.keyCode == 13){
        $(this).trigger("enterKey");
    }
});




function parseText(text){
        var array = text.split(" ");
        return array;
}

function mineText(text, parsedText){
    var res1 = [];
    var res2 = [];


    for (var i = 0; i < data.length; i++){
        for (var j = 0; j < data[i].reviews.length; j++) {


        var re = new RegExp((text.toLowerCase()),"g");
        var string = data[i].reviews[j].content;
        var count = ((string.toLowerCase()).match(re) || []).length;
        var string = data[i].reviews[j].content.replace(/<br\/>/g,"").substring(38,200) +'... See more'
        var temp = {
            "id" : data[i].reviews[j].id,
            "reviewNumber" : data[i].reviews[j].reviewNumber,
            "title" : data[i].reviews[j].title + " | " +data[i].bookTitle + " - Boogle.com",
            "content" : string ,
            "frequency" : count
        };


            if( ((data[i].reviews[j].title).match(re) || []).length != 0){
                res1.push(temp);

            }else if(count>0){
                    res2.push(temp);
            }
        }
    }
    console.log(res2);
    res2 = res2.sort(function(a,b){
        return parseInt(b.frequency) - parseInt(a.frequency);
    });
    console.log(res2);
    return res1.concat(res2);
}

function displayResult(result, text){

    if(result.length == 0){
        $("#output").append('<p style="font-size:22px"><strong>No results for "'+text+'"</strong></p>');
    }


    $('p#resultData').append("About " + result.length + " results (0.48 seconds)");

    for (var i = 0; i < result.length; i++) {

        var titleNode = document.createElement("a");
        var titleText = document.createTextNode(result[i].title);         // Create a text node
        titleNode.appendChild(titleText);
        titleNode.href = "#";
        titleNode.id = "title";
        document.getElementById("output").appendChild(titleNode);


        $("#output").append("<br/>");


        var reviewNumberNode = document.createElement("cite");
        reviewNumberNode.id = "cite;"               // Create a <li> node
        var reviewNumberText = document.createTextNode(result[i].reviewNumber);         // Create a text node
        reviewNumberNode.appendChild(reviewNumberText);                              // Append the text to <li>
        document.getElementById("output").appendChild(reviewNumberNode);

        var contentNode = document.createElement("p");
        //console.log(result[i].content);
        var contentText = document.createTextNode(result[i].content);         // Create a text node
        contentNode.appendChild(contentText);                              // Append the text to <li>
        document.getElementById("output").appendChild(contentNode);

    }
}


});
