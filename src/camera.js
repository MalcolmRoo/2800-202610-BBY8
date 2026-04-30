let VIDEO = null;
let CANVAS = null;
let CONTEXT = null;
let selectedOrgan = "leaf";

document.addEventListener("DOMContentLoaded", function () {
  const CAPTURE = document.getElementById("captureBtn");

  document.querySelectorAll(".organ-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".organ-btn.active").classList.remove("active");
      btn.classList.add("active");
      selectedOrgan = btn.dataset.organ;
    });
  });

  CAPTURE.addEventListener("click", (event) => {
    event.preventDefault();
    takePicture();
  });

  accessCamera();
});

function accessCamera() {
  CANVAS = document.getElementById("camCanvas");
  CONTEXT = CANVAS.getContext("2d");
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;

  navigator.mediaDevices
    .getUserMedia({
      video: { facingMode: "environment" },
    })
    .then(function (stream) {
      VIDEO = document.createElement("video");
      VIDEO.srcObject = stream;
      VIDEO.play();
      VIDEO.onloadeddata = function () {
        updateCanvas();
      };
    })
    .catch(function (err) {
      alert("Camera error: " + err);
    });
}

function updateCanvas() {
  CONTEXT.drawImage(VIDEO, 0, 0, CANVAS.width, CANVAS.height);
  window.requestAnimationFrame(updateCanvas);
}

function takePicture() {
  CONTEXT.drawImage(VIDEO, 0, 0, CANVAS.width, CANVAS.height);

  // this convert to blob instead of base64(needed for plantNet api , it just works better for it ig)
  CANVAS.toBlob(
    function (blob) {
      sendToPlantNet(blob);
    },
    "image/jpeg",
    0.8,
  );
}

async function sendToPlantNet(imageBlob) {
  document.getElementById("loading-overlay").style.display = "flex";
  document.getElementById("captureBtn").style.display = "none";

  const formData = new FormData();
  formData.append("image", imageBlob, "plant.jpg");
  formData.append("organ", selectedOrgan);

  try {
    const response = await fetch("/api/identify", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Identification failed");
    }

    const params = new URLSearchParams({
      name: data.commonName,
      latin: data.scientificName,
      score: data.score,
    });

    window.location.href = `/plant?${params}`;
  } catch (err) {
    alert("Could not identify plant. Try again.");
    document.getElementById("loading-overlay").style.display = "none";
    document.getElementById("captureBtn").style.display = "block";
    document.getElementById("captureBtn").textContent = "Capture";
    document.getElementById("captureBtn").disabled = false;
  }
}
