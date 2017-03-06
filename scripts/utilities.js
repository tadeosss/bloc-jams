/*
Use a loop to go through all elements in the points array.
Execute a callback for each element.
*/
function forEach(array, callback) {
    for (var i = 0; i < array.length; i++) {
        callback(array[i]);
    }
}
var pointsArray = document.getElementsByClassName('point');

function pointsLoop(element) {
    
}

pointsArray.forEach(pointsLoop)