let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(0, 0, 280, 280);

let painting = false;

function startPosition(e) {
    painting = true;
    draw(e);
}

function endPosition() {
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";

    let rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

function clearCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 280, 280);
    document.getElementById("result").innerText = "Predicted Digit: ";
}

function sendData() {
    canvas.toBlob(function(blob) {
        let formData = new FormData();
        formData.append("image", blob);

        console.log("🟢 Sending request to API...");

        fetch("http://127.0.0.1:5000/predict", { 
            method: "POST", 
            body: formData
        })
        .then(response => {
            console.log("🟡 Response received:", response);
            return response.json();
        })
        .then(data => { 
            console.log("🟢 Server Response Data:", data);
            if (data.digit !== undefined) {
                document.getElementById("result").innerText = "Predicted Digit: " + data.digit;
            } else {
                document.getElementById("result").innerText = "❌ Error: No digit predicted.";
            }
        })
        .catch(error => {
            console.error("🔴 Fetch Error:", error);
            document.getElementById("result").innerText = "❌ Error: " + error;
        });
    });
}
