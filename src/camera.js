let VIDEO = null;
let CANVAS = null;
let CONTEXT = null;

function accessCamera() {
    CANVAS = document.getElementById("camCanvas");
    CONTEXT = CANVAS.getContext("2d");
    CANVAS.width = window.innerWidth;
    CANVAS.length = window.innerHeight;

    let promise = navigator.mediaDevices.getUserMedia({video:true});
    promise.then(function(signal){
        VIDEO = document.createElement("video");
        VIDEO.srcObject = signal;
        VIDEO.play();

        VIDEO.onloadeddata = function() {
            updateCanvas();
        }
    }).catch(function(err){
        alert("Camera error: " + err);
    });
}

function updateCanvas() {
    CONTEXT.drawImage(VIDEO, 0, 0);
    window.requestAnimationFrame(updateCanvas);
}