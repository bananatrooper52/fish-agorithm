class Input {
    constructor(canvas) {
        this.keys = [];
        this.mouse = {
            x: 0,
            y: 0
        }
        document.addEventListener("keydown", (e) => { this.keys[e.keyCode] = true; });
        document.addEventListener("keyup", (e) => { this.keys[e.keyCode] = false; });
        document.addEventListener("mousemove", (e) => {
            let rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }
}

class Boid {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 150;
        this.rot = Math.random() * Math.PI * 2;
        this.collisions = [];
        this.detectionRadius = 50;
    }

    calculateForces(nearby, delta) {
        this.separate(nearby, delta);
        this.align(nearby, delta);
        this.group(nearby, delta);

        this.rot %= Math.PI * 2;
    }

    separate(nearby, delta) {
        for (let i in nearby) {
            let other = nearby[i];

            if (other === this) continue;
            
            let diffX = this.x - other.x;
            let diffY = this.y - other.y;
            
            let dist = Math.sqrt(diffX * diffX + diffY * diffY);
            
            if (dist < 20) {
                let tgtRot = Math.atan2(diffY, diffX);
                this.rot = alerp(this.rot, tgtRot, 2 * delta);
            }
        }
    }

    align(nearby, delta) {
        for (let i in nearby) {
            let other = nearby[i];

            if (other === this) continue;

            this.rot = alerp(this.rot, other.rot, 0.5 * delta);
        }
    }

    group(nearby, delta) {

        if (nearby.length === 1) return;

        let totalX = 0;
        let totalY = 0;

        let count = 0;

        for (let i in nearby) {
            let other = nearby[i];
            
            if (other === this) continue;

            totalX += other.x;
            totalY += other.y;

            count++;
        }

        let cx = totalX / count;
        let cy = totalY / count;

        let angleToCenter = Math.atan2(cy - this.y, cx - this.x);

        this.rot = alerp(this.rot, angleToCenter, delta);
    }

    integrate(delta) {
        this.x += this.speed * Math.cos(this.rot) * delta;
        this.y += this.speed * Math.sin(this.rot) * delta;

        if (this.x > canvas.width) this.x -= canvas.width;
        if (this.y > canvas.height) this.y -= canvas.height;
        if (this.x < 0) this.x += canvas.width;
        if (this.y < 0) this.y += canvas.height;
    }

    setDir(dx, dy) {
        this.rot = Math.atan2(dy, dx);
    }

    render(ctx) {
        ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
    }

    renderDetectionRadius(ctx) {
        ctx.fillStyle = "#a045a07f";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.detectionRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    renderDirection(ctx) {
        ctx.strokeStyle = "#1095b8";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - Math.cos(this.rot) * 10, this.y - Math.sin(this.rot) * 10);
        ctx.stroke();
    }
}

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

let boids = [];

function init() {
    requestAnimationFrame(render);

    for (let i = 0; i < 300; i++) {
        addBoid(Math.random() * canvas.width, Math.random() * canvas.height);
    }

    setInterval(tick, 1000 / 60);
}

function tick() {
    const delta = 1 / 60;

    for (let i in boids) {
        boids[i].calculateForces(getNearbyBoids(boids[i].x, boids[i].y, boids[i].detectionRadius), delta);
    }

    for (let i in boids) {
        boids[i].integrate(delta);
    }
}

function render() {
    clearScreen();

    for (let i in boids) {
        ctx.fillStyle = "white";
        boids[i].render(ctx);
        boids[i].renderDirection(ctx);
    }

    requestAnimationFrame(render);
}

function addBoid(x, y) {
    boids.push(new Boid(x, y));
}

function getNearbyBoids(x, y, r) {
    let nearby = [];
    for (let i in boids) {
        let diffX = x - boids[i].x;
        let diffY = y - boids[i].y;
        let magSq = diffX * diffX + diffY * diffY;

        if (magSq < r * r) nearby.push(boids[i]);
    }
    return nearby;
}

function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function alerp(a, b, t) {
    return a + shortAngleDist(a, b) * t;
}

function shortAngleDist(a, b) {
    let max = Math.PI * 2;
    let da = (b - a) % max;
    return 2 * da % max - da;
}

function sign(val) {
    return val > 0 ? 1 : val < 0 ? -1 : 0;
}

init();