var traindata = traindata[0]

String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

$(".content").append("<div class='select'></div>")

for (var train in traindata) {
  if (traindata.hasOwnProperty(train)) {
    // for each train, create an html sectio that is used to display its data
    $(".content").append("<div class='ubahn " + train + "'><p><img src='assets/Berlin_" + train + ".svg.png'></p></div>")
    var jsontraindata = JSON.parse(traindata[train].replaceAll("'", "\"").replaceAll("u\"", "\""))
    $(".select").append("<div class=' sentiment joy'>" + parseInt(jsontraindata["avgJoy"]) + "% of people on " + train + " are happy</div><br>")
    $(".select").append("<div class=' sentiment fear'>" + parseInt(jsontraindata["avgFear"]) + "% of people on " + train + " are fearful</div><br>")
    $(".select").append("<div class='sentiment distgust'>" + parseInt(jsontraindata["avgDisgust"]) + "% of people on " + train + " are disgusted</div><br>")
    $(".select").append("<div class='sentiment sadness'>" + parseInt(jsontraindata["avgSadness"]) + "% of people on " + train + " are sad</div><br>")
    $(".select").append("<div class='sentiment anger'>" + parseInt(jsontraindata["avgAnger"]) + "% of people on " + train + " are angry</div><br>")
    $(".select").append("<div class='sentiment comments'></div><br>")
    for(var i = 0; i < jsontraindata["answers"].length; i++){
      $("." + train + " " + ".comments").append(jsontraindata["answers"][i])
    }
  }
}

$(".sentiment").hide()


$(".ubahn").click(
  function(){
      $(".sentiment").hide()
      $(this).find(".sentiment").show()
  }

)
