let redLight = document.querySelector("#redLight");
let yellowLight = document.querySelector("#yellowLight");
let greenLight = document.querySelector("#greenLight");
let playBtn = document.getElementById("playBtn");
let boxes = document.querySelectorAll(".box");
let circles = document.querySelectorAll(".circle");
let resultMsg = document.getElementById("resultMsg");
let body = document.querySelector("body");
let modal = document.getElementById("customModal");
let modalText = document.getElementById("modalText");
let span = document.getElementsByClassName("close")[0];

let trafficColors = [];
let userSequence = [];
let score = 0;
let lightInterval;
let currentLightIndex = 0;

const sounds = {
    // light: new Audio('https://www.fesliyanstudios.com/play-mp3/387'),
    light: new Audio('light-sound.wav'),
    win: new Audio('win-sound.wav'),
    lose: new Audio('lose-sound.wav'),
};

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
            sounds.light.play();
            currentLightIndex++;
        } else {
            clearInterval(lightInterval);
            resetLights();
            showModal("Instructions ", "Please select the color sequence and drag and drop the color square into circle...");
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
        showModal("Congratulations!", `You won! Your score is: ${score}`);
        sounds.win.play();
    } else if (userSequence.length === 6) {
        resultMsg.innerHTML = `<span class='lose'>You lose the game! and your Score is: ${score}</span>`;
        showModal("Game Over", `You lose! Your score is: ${score}`);
        sounds.lose.play();
    }else if (userSequence.length === currentLightIndex && currentLightIndex === 6 && !circles[5].style.backgroundColor) {
        resultMsg.innerHTML = `<span class='lose'>You didn't select the complete sequence!! and your Score is: ${score}</span>`;
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
    playBtn.textContent = "Play Again";
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

function showModal(title, message) {
    modalText.innerHTML = `<strong>${title}</strong><br>${message}`;
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
