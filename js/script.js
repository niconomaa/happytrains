var traindata = traindata[0]

String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

$(".content").append("<div class='select'></div>")
$(".content").append("<div class='info'></div>")


for (var train in traindata) {
  if (traindata.hasOwnProperty(train)) {
    // for each train, create an html sectio that is used to display its data
    $(".select").append("<div class='ubahn " + train + "'><p><img src='assets/Berlin_" + train + ".svg.png'></p></div>")
    var jsontraindata = JSON.parse(traindata[train].replaceAll("'", "\"").replaceAll("u\"", "\""))

    // mark endangered ubahns
    if(parseInt(jsontraindata["avgJoy"]) < 50 || parseInt(jsontraindata["avgFear"]) > 50 || parseInt(jsontraindata["avgDisgust"]) > 50 || parseInt(jsontraindata["avgAnger"]) > 50){
      $(".ubahn." + train).find("img").addClass("endangered")
    }

    $(".info").append("<div class='bar " + train + "'></div>");
    $(".info").append("<div class='barinfo " + train + "'></div>");
    $(".info").append("<p class='commentbutton " + train + "'> What's up with " + train + "?</div>");


    $(".bar." + train).append("<div class='joy'></div>");
    $(".bar." + train).append("<div class='anger'></div>");
    $(".bar." + train).append("<div class='sadness'></div>");
    $(".bar." + train).append("<div class='disgust'></div>");
    $(".bar." + train).append("<div class='fear'></div>");





    var barwidth = $(".bar").width();
    var sum_emotions = parseInt(jsontraindata["avgAnger"]) + parseInt(jsontraindata["avgSadness"]) + parseInt(jsontraindata["avgDisgust"]) + parseInt(jsontraindata["avgFear"]) + parseInt(jsontraindata["avgJoy"]);


    var length_joy = (parseInt(jsontraindata["avgJoy"]) / sum_emotions) * barwidth;
    $(".bar." + train).find(".joy").width(length_joy);

    var length_anger = (parseInt(jsontraindata["avgAnger"]) / sum_emotions) * barwidth;
    $(".bar." + train).find(".anger").width(length_anger);


    var length_sadness = (parseInt(jsontraindata["avgSadness"]) / sum_emotions) * barwidth;
    $(".bar." + train).find(".sadness").width(length_sadness);


    var length_fear = (parseInt(jsontraindata["avgFear"]) / sum_emotions) * barwidth;
    $(".bar." + train).find(".fear").width(length_joy);

    var length_disgust = (parseInt(jsontraindata["avgDisgust"]) / sum_emotions) * barwidth;
    $(".bar." + train).find(".disgust").width(length_disgust);

    var length_fear = (parseInt(jsontraindata["avgFear"]) / sum_emotions) * barwidth;
    $(".bar." + train).find(".fear").width(length_fear);


    $(".barinfo." + train).append("<p class='joy' >Joy</div>");
    $(".barinfo." + train).append("<p class='anger' >Anger</div>");
    $(".barinfo." + train).append("<p class='sadness' >Sadness</div>");
    $(".barinfo." + train).append("<p class='disgust' >Disgust</div>");
    $(".barinfo." + train).append("<p class='fear' >Fear</div>");

    $(".barinfo." + train).find(".joy").css("color","#C6FFA3");
    $(".barinfo." + train).find(".anger").css("color","#B23479");
    $(".barinfo." + train).find(".disgust").css("color","#FF63B9");
    $(".barinfo." + train).find(".sadness").css("color","#FFEF7D");
    $(".barinfo." + train).find(".fear").css("color","#091819");

      var rank =  parseInt(jsontraindata["avgJoy"]) * 1000/sum_emotions;

    $(".ubahn." + train).attr("title", parseInt(rank))



    // $(".info").append("<div class=' sentiment joy " + train + "'> Joy <span>" + parseInt(jsontraindata["avgJoy"]) + "%</span></div><br>")
    // $(".info").append("<div class=' sentiment fear " + train + "'> Fear <span>" + parseInt(jsontraindata["avgFear"]) + "%</span></div><br>")
    // $(".info").append("<div class=' sentiment disgust " + train + "'> Disgust <span>" + parseInt(jsontraindata["avgDisgust"]) + "%</span></div><br>")
    // $(".info").append("<div class=' sentiment sadness " + train + "'> Sadness <span>" + parseInt(jsontraindata["avgSadness"]) + "%</span></div><br>")
    // $(".info").append("<div class=' sentiment anger " + train + "'> Anger <span>" + parseInt(jsontraindata["avgAnger"]) + "%</span></div><br>")
    $(".info").append("<div class='comments " + train + "'></div><br>")
    for(var i = 0; i < jsontraindata["answers"].length; i++){
      if( $(".comments." + train).find("." + jsontraindata["answers"][i][1]).length == 0 ){
        $(".comments."+ train).append("<p class='section " + jsontraindata["answers"][i][1] + "'> " + jsontraindata["answers"][i][1] +"</p>")
      }
      $(".comments."+ train).find("." + jsontraindata["answers"][i][1]).append("<p>" + jsontraindata["answers"][i][0 ] + "</p>")
    }
  }
}





$(".bar").hide()
$(".barinfo").hide()
$(".comments").hide()
$(".commentbutton").hide()


$(".ubahn").click(
  function(){
      $(".bar" ).hide()
      $(".info").find(".bar." + $(this).attr("class").split(/\s+/)[1]).show()
      $(".barinfo").hide()
      $(".info").find(".barinfo." + $(this).attr("class").split(/\s+/)[1]).show()
      $(".commentbutton").hide();
      $(".info").find(".commentbutton." + $(this).attr("class").split(/\s+/)[1]).show()
      $(".comments").hide();
      $(".ubahn" ).addClass("deselected");
      $(this ).toggleClass("deselected");

  }
)

$(".commentbutton").click(
  function(){
    $(".comments").hide();
    $(".info").find(".comments." + $(this).attr("class").split(/\s+/)[1]).show()

  }
)

var order = [];

$(".ubahn").each(function(){
  order.push(($(this).attr("title")))
})



for(var i = 0; i < order.length; i++){
  console.log(order[i])
}

console.log("sss");
order.sort();

// for (var i = 0; i < order.length; i++){
//   console.log(order[i])
//   $("[title=" + parseInt(order[i]) + "]").css("order", (i));
// }
