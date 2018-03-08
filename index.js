var firebase = require('firebase');
var g = require('ngeohash');
require('babel-register');
require("firebase/firestore");

var app = firebase.initializeApp({
    apiKey: "AIzaSyB5u8OSZNYvV9GU49sYIQJERckAZcb1vTg",
    authDomain: "geo-fire-982d9.firebaseapp.com",
    databaseURL: "https://geo-fire-982d9.firebaseio.com",
    projectId: "geo-fire-982d9",
    storageBucket: "geo-fire-982d9.appspot.com",
    messagingSenderId: "371532785963"
});

var store = app.firestore();

// var dummyPoints = [
//     [6.902546, 79.952393],
//     [6.912774, 79.936724],
//     [6.880053, 79.971057],
//     [6.897777, 80.020495],
//     [6.995246, 80.313693]
// ];

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

var addLocation = function(){
   var lat = getRandomInRange(-180,180,3);
   var lng = getRandomInRange(-180,180,3);

    console.log(lat,lng);
  store
    .collection('locations')
    .add({
      g10: g.encode_int(lat, lng, 24), // ~10 km radius
      g5: g.encode_int(lat, lng, 26), // ~5 km radius
      g1: g.encode_int(lat, lng, 30) // ~1 km radius
    });
};

var nearbyLocationsRef = function(lat, lng, d = 10){
  var bits =  d === 10 ? 24 : d === 5 ? 26 : 30;

//   var bits = 24; 
  var h = g.encode_int(lat, lng, bits);

  return store
    .collection('locations')
    .where(`g${d}`, '>=', g.neighbor_int(h, [-1, -1], bits))
    .where(`g${d}`, '<=', g.neighbor_int(h, [1, 1], bits));
};

// for (var i = 0; i < dummyPoints.length ; i++){
//     addLocation(dummyPoints[i][0], dummyPoints[i][1]);    
// }

// var counter = 1000;
// function request_loop() {

//     addLocation();
//     counter--;
//     if (counter > 0) {
//         setTimeout(request_loop, 500);    
//     }
// }

// request_loop();

nearbyLocationsRef(-84.038,-57.726).get().then(function(querySnapshot){
    // console.log(querySnapshot.docs);
    console.log('arrived');
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });
    process.exit(0);
}).catch(function(error) {
    console.log('error');
    console.log("Error getting documents: ", error);
});
    
console.log('success!');
