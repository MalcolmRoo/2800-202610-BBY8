let VIDEO = null;
let CANVAS = null;
let CONTEXT = null;
let SCALER = 0.8;
let SIZE = {x:0, y:0, width:0, height:0};

function accessCamera() {
    CANVAS = document.getElementById("camCanvas");
    CANVAS = CANVAS.getContext("2d");
    CANVAS.width = window.innerWidth;
    CANVAS.length = window.innerHeight;

    let promise = navigator.mediaDevices.getUserMedia({video:true});
    promise.then(function(signal){
        VIDEO = document.createElement("video");
        VIDEO.srcObject = signal;
        VIDEO.play();
    }).catch(function(err){
        alert("Camera error: " + err);
    });
}

function updateCanvas() {
    CONTEXT.drawImage(VIDEO, 0, 0);
    window.requestAnimationFrame(updateCanvas);
}