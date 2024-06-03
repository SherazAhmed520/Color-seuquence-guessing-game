let redLight = document.querySelector("#redLight");
let yellowLight = document.querySelector("#yellowLight");
let greenLight = document.querySelector("#greenLight");
let playBtn = document.getElementById("playBtn");
let boxes = document.querySelectorAll(".box");
let circles = document.querySelectorAll(".circle");
let resultMsg = document.getElementById("resultMsg");
let body =  document.querySelector("body");

let trafficColors = [];
let userSequence = [];
let score = 0;
let lightInterval;
let currentLightIndex = 0;

function getRandomColor() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}

function generateTrafficColors() {
    trafficColors = [];
    for (let i = 0; i < 6; i++) {
        trafficColors.push(getRandomColor());
    }
}

function startTraffic() {
    clearInterval(lightInterval);
    currentLightIndex = 0;
    lightInterval = setInterval(() => {
        if (currentLightIndex < 6) {
            let currentColor = trafficColors[currentLightIndex];
            redLight.style.backgroundColor = currentLightIndex % 3 === 0 ? currentColor : body.style.backgroundColor;
            yellowLight.style.backgroundColor = currentLightIndex % 3 === 1 ? currentColor : body.style.backgroundColor;
            greenLight.style.backgroundColor = currentLightIndex % 3 === 2 ? currentColor : body.style.backgroundColor;
            setGlowingEffect(currentColor);
            currentLightIndex++;
        } else {
            clearInterval(lightInterval);
            resetLights();
        }
    }, 1000); // Change color every 1 second
}

function setGlowingEffect(color) {
    let boxShadowValue = `0 0 5px 2px ${color}`;
    redLight.style.boxShadow = currentLightIndex % 3 === 0 ? boxShadowValue : "none";
    yellowLight.style.boxShadow = currentLightIndex % 3 === 1 ? boxShadowValue : "none";
    greenLight.style.boxShadow = currentLightIndex % 3 === 2 ? boxShadowValue : "none";
}

function resetLights() {
    redLight.style.backgroundColor = body.style.backgroundColor;
    yellowLight.style.backgroundColor = body.style.backgroundColor;
    greenLight.style.backgroundColor = body.style.backgroundColor;
    redLight.style.boxShadow = "none";
    yellowLight.style.boxShadow = "none";
    greenLight.style.boxShadow = "none";
}


function resetCirclesAndBoxes() {
    circles.forEach(circle => {
        circle.style.backgroundColor = "white";
    });
    boxes.forEach(box => {
        box.style.backgroundColor = "white";
    });
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("color", ev.target.style.backgroundColor);
}

function drop(ev) {
    ev.preventDefault();
    let color = ev.dataTransfer.getData("color");
    ev.target.style.backgroundColor = color;
    userSequence.push(color);
    checkSequence();
}

function checkSequence() {
    let matchedColors = 0;
    for (let i = 0; i < userSequence.length; i++) {
        if (userSequence[i] === trafficColors[i]) {
            matchedColors++;
        }
    }
    score = matchedColors;
    if (matchedColors === 6) {
        resultMsg.innerHTML = `<span class='win'>Congratulations! You won! and your Score is: ${score}</span>`;

    } else if (userSequence.length === 6) {
        resultMsg.innerHTML = `<span class='lose'>You lose the game! and your Score is: ${score}</span>`;

    } else {
        resultMsg.innerHTML = `<span class='lose'>You didn't select any color!! and your Score is: ${score}</span>`;
    }
}

playBtn.addEventListener("click", () => {
    generateTrafficColors();
    startTraffic();
    playBtn.disabled = true;
    userSequence = [];
    score = 0;
    resultMsg.innerHTML = "";
    resetCirclesAndBoxes(); // Reset circles and boxes
    setTimeout(() => {
        boxes.forEach((box, index) => {
            box.style.backgroundColor = trafficColors[index];
        });
        playBtn.disabled = false;
    }, 6000); // Display box colors after 6 seconds
});

circles.forEach(circle => {
    circle.addEventListener("dragover", allowDrop);
    circle.addEventListener("drop", drop);
});

boxes.forEach(box => {
    box.addEventListener("dragstart", drag);
});
