const styleElement = document.createElement("style");
styleElement.innerHTML = `
    body {
        overflow: hidden;
        color: #fff;
        display: flex;
        z-index: 900;
    }

    #particleCanvas {
        z-index: -999999999999;
        position: absolute;
        top: 0;
        left: 0;
    }

    #backgroundCanvas {
        z-index: -999999999999;
        position: absolute;
        top: 0;
        left: 0;
        filter: blur(5px);
    }
`;
document.head.appendChild(styleElement);
const particleCanvas = document.createElement("canvas");
particleCanvas.id = "particleCanvas";
document.body.appendChild(particleCanvas);
const backgroundCanvas = document.createElement("canvas");
backgroundCanvas.id = "backgroundCanvas";
document.body.appendChild(backgroundCanvas);
const backgroundCanvas2 = document.getElementById("backgroundCanvas");
const bgCtx = backgroundCanvas2.getContext("2d");
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
const particles = [];
const blurredParticles = [];
const glow = {
    x: 0,
    y: 0,
    size: 5
};
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
backgroundCanvas2.width = window.innerWidth;
backgroundCanvas2.height = window.innerHeight;
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.growing = true;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
    }
    update() {
        const distanceX = glow.x - this.x;
        const distanceY = glow.y - this.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const acceleration = 2.5 / distance;
        this.speedX += (distanceX / distance) * acceleration;
        this.speedY += (distanceY / distance) * acceleration;
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.x = (this.x + canvas.width) % canvas.width;
            this.y = (this.y + canvas.height) % canvas.height;
        }
        if (this.growing && this.size < 5) {
            this.size += 0.1;
        } else {
            this.growing = false;
        }
        if (!this.growing && this.size > 0.2) {
            this.size -= 0.1;
        } else {
            this.growing = true;
        }
    }
    draw() {
        ctx.fillStyle = "rgba(255, 50, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
class BlurredParticle {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 5;
    }
    update(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }
    draw() {
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(255, 0, 255, 0.8)";
        ctx.fillStyle = "rgba(255, 50, 255, 0.2)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
function createParticles() {
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle());
        blurredParticles.push(new BlurredParticle());
    }
}
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        blurredParticles[i].update(particles[i].x, particles[i].y, particles[i].size);
        glow.x = particles[i].x;
        glow.y = particles[i].y;
        particles[i].draw();
        blurredParticles[i].draw();
    }
    drawBackground();
    requestAnimationFrame(animateParticles);
}
function drawBackground() {
    bgCtx.clearRect(0, 0, backgroundCanvas2.width, backgroundCanvas2.height);
    bgCtx.drawImage(canvas, 0, 0);
}
createParticles();
animateParticles();