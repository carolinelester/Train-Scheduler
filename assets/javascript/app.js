$(document).ready(function(){

var firebaseConfig = {
    apiKey: "AIzaSyBoLtmw_etDd8H-V0HIUl8Az-7lRw5jxis",
    authDomain: "train-scheduler-812fb.firebaseapp.com",
    databaseURL: "https://train-scheduler-812fb.firebaseio.com",
    projectId: "train-scheduler-812fb",
    storageBucket: "train-scheduler-812fb.appspot.com",
    messagingSenderId: "1056074639483",
    appId: "1:1056074639483:web:1e8ed4457a6a19f37fdade",
    measurementId: "G-JKSB761GCM"
  };

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// on click event var 
var name;
var destination;
var firstTrain;
var frequency = 0;

$("#add-train").on("click", function() {
    event.preventDefault();
    // store and retreive new train data
    name = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

    // push to database
    database.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
      $("form")[0].reset();
  });

  database.ref().on("child_added", function(childSnapshot) {
    var nextArr;
    var minAway;
    var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTrainNew), "minutes");
    var remainder = diffTime % childSnapshot.val().frequency;
    var minAway = childSnapshot.val().frequency - remainder;
    var nextTrain = moment().add(minAway, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");

    $("#add-row").append("<tr><td>" + childSnapshot.val().name +
            "</td><td>" + childSnapshot.val().destination +
            "</td><td>" + childSnapshot.val().frequency +
            "</td><td>" + nextTrain + 
            "</td><td>" + minAway + "</td></tr>");

    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
    $("#name-display").html(snapshot.val().name);
    $("#email-display").html(snapshot.val().email);
    $("#age-display").html(snapshot.val().age);
    $("#comment-display").html(snapshot.val().comment);
});

});