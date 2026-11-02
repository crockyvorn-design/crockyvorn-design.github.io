const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let noiseCanvas = document.createElement("canvas");
let noiseCtx = noiseCanvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    noiseCanvas.width = 256;
    noiseCanvas.height = 256;
}

function generateGrain() {
    const imageData = noiseCtx.createImageData(256, 256);

    for (let i = 0; i < imageData.data.length; i += 4) {
        const value = Math.random() * 100;

        imageData.data[i] = value;
        imageData.data[i + 1] = value;
        imageData.data[i + 2] = value;
        imageData.data[i + 3] = Math.random() * 90;
    }

    noiseCtx.putImageData(imageData, 0, 0);
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sepia film grain
    generateGrain();

    deltaTime = (performance.now() - lastTime) / 1000;
    lastTime = performance.now();

    if (scrollSpeed > targetScrollSpeed){
        scrollSpeed -= 0.5
    }
    if (scrollSpeed < targetScrollSpeed){
        scrollSpeed = targetScrollSpeed
    }

    scrollProgression -= scrollSpeed;

    ctx.fillStyle = ctx.createPattern(noiseCanvas, "repeat");
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Film perforations
    const holeWidth = window.innerWidth * 0.05;
    const holeHeight = window.innerWidth * 0.01;
    const spacing = window.innerWidth * 0.06;
    const margin = window.innerWidth * 0.026;
    const innerBoarderWidth = window.innerWidth * 0.016;

    const dividerHeight = window.innerWidth * 0.05;
    const dividerFrequency = window.innerWidth * 0.5;

    ctx.fillStyle = "#020100";

    for (let y = 12; y < canvas.height + spacing * 2; y += spacing) {
        ctx.fillRect(
            0,
            0,
            margin,
            window.innerHeight
        );

        ctx.fillRect(
            margin + holeWidth,
            0,
            innerBoarderWidth,
            window.innerHeight
        );

        ctx.fillRect(
            margin,
            y + (scrollProgression % spacing),
            holeWidth,
            holeHeight
        );

        ctx.fillRect(
            canvas.width - margin - holeWidth,
            y + (scrollProgression % spacing),
            holeWidth,
            holeHeight
        );

        ctx.fillRect(
            window.innerWidth - margin,
            0,
            margin,
            window.innerHeight
        );

        ctx.fillRect(
            window.innerWidth - margin - holeWidth - innerBoarderWidth,
            0,
            innerBoarderWidth,
            window.innerHeight
        );

    }

    for (let y = 10; y < dividerFrequency * ((window.innerHeight / dividerFrequency) + 1); y += dividerFrequency) {
        ctx.fillRect(
            margin + holeWidth + innerBoarderWidth,
            y + (scrollProgression % dividerFrequency),
            window.innerWidth - (margin + holeWidth + innerBoarderWidth) * 2,
            dividerHeight
        );
    }

    lastTime = 0;
    requestAnimationFrame(animate);
}

const slides = document.querySelectorAll(".slide");
const nextButton = document.getElementById("next");

let current = 0;
let animating = false;

let lastTime = 0;
let deltaTime = 0;
let scrollProgression = 0;
let dividerPorgression =0;
let targetScrollSpeed = 1.5;
let scrollSpeed = targetScrollSpeed;
let nextSlideScrollSpeed = 50;

function updateSlideStyle(slide) {
    if (slide.dataset.bg) {
        document.body.style.backgroundImage = slide.dataset.bg;
    }
}

nextButton.addEventListener("click", () => {
    if (animating || slides.length < 2) return;

    animating = true;

    const previous = slides[current];
    const nextIndex = (current + 1) % slides.length;
    const next = slides[nextIndex];

    next.classList.add("entering");
    next.offsetHeight;

    next.classList.add("active");
    previous.classList.remove("active");
    previous.classList.add("leaving");

    current = nextIndex;
    updateSlideStyle(next);

    scrollSpeed = nextSlideScrollSpeed

    setTimeout(() => {
        previous.classList.remove("active", "leaving");
        previous.classList.add("entering");
        next.classList.remove("entering");
        animating = false;
    }, 600);
});

window.addEventListener("resize", resize);

resize();

updateSlideStyle(slides[current]);

animate();