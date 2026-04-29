let VIDEO = null;
let CANVAS = null;
let CONTEXT = null;
let CAPTURE = document.getElementById("captureBtn");

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


CAPTURE.addEventListener("click", (event) =>{
    takePicture();
    event.preventDefault();
});


function takePicture(){
    CONTEXT.drawImage(VIDEO, 0, 0);//, width, height);
    console.log("Button pressed");
    const data = CANVAS.toDataURL("image/png");
    console.log(data); //data is the image to be passed
}

