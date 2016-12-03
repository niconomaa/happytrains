var traindata = traindata[0]

String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

for (var train in traindata) {
  if (traindata.hasOwnProperty(train)) {
    // for each train, create an html sectio that is used to display its data
    $(".content").append("<div class='" + train + "'>" + train + "</div>")
    var jsontraindata = JSON.parse(traindata[train].replaceAll("'", "\"").replaceAll("u\"", "\""))
    $("." + train).append("<div class='joy'>" + jsontraindata["avgJoy"] + "% of people on " + train + " are happy</div><br>")
    $("." + train).append("<div class='fear'>" + jsontraindata["avgFear"] + "% of people on " + train + " are fearful</div><br>")
    $("." + train).append("<div class='distgust'>" + jsontraindata["avgDisgust"] + "% of people on " + train + " are disgusted</div><br>")
    $("." + train).append("<div class='sadness'>" + jsontraindata["avgSadness"] + "% of people on " + train + " are sad</div><br>")
  }
}
