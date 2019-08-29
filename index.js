class Input {
    constructor(canvas) {
        this.keys = [];
        this.mouse = {
            pos: new Vec(2)
        };
        document.addEventListener("keydown", (e) => { this.keys[e.keyCode] = true; });
        document.addEventListener("keyup", (e) => { this.keys[e.keyCode] = false; });
        document.addEventListener("mousemove", (e) => {
            let rect = canvas.getBoundingClientRect();
            this.mouse.pos = new Vec([e.clientX - rect.left, e.clientY - rect.top]);
        });
    }
}

class Boid {
    constructor(pos) {
        this.pos = new Vec(pos);
        this.speed = 150;
        this.rot = Math.random() * Math.PI * 2;
        this.collisions = [];
        this.detectionRadius = 100;
    }

    avoid(obstacles, delta) {
        for (let i in obstacles) {
            let obstacle = obstacles[i];

            let diff = Vec.sub(this.pos, obstacle.pos);
            let dist = Vec.dist(this.pos, obstacle.pos);
            
            if (dist < obstacle.radius) {
                let tgtRot = Math.atan2(diff.getX(), diff.getY());
                this.rot = alerp(this.rot, tgtRot, 8 * delta);
            }
        }
    }

    align(nearby, delta) {
        for (let i in nearby) {
            let other = nearby[i];

            if (other === this) continue;

            this.rot = alerp(this.rot, other.rot, 1 * delta);
        }
    }

    group(nearby, delta) {

        if (nearby.length === 0) return;

        let total = new Vec(2);

        for (let i in nearby) {
            let other = nearby[i];

            total.add(other.pos);
        }

        let center = total.div(nearby.length);
        let diff = center.sub(this.pos);
        let angleToCenter = Math.atan2(diff.getY(), diff.getX());

        this.rot = alerp(this.rot, angleToCenter, 0.5 * delta);
    }

    jitter(delta) {
        this.rot += (Math.random() * 5 - 2.5) * delta;
    }

    integrate(delta) {
        this.rot %= Math.PI * 2;

        this.pos.add(Vec.mul([Math.cos(this.rot), Math.sin(this.rot)], this.speed * delta));

        // TODO: change to MODULO
        if (this.pos.getX() > canvas.width) this.pos.sub([canvas.width, 0]);
        if (this.pos.getY() > canvas.height) this.pos.sub([0, canvas.height]);
        if (this.pos.getX() < 0) this.pos.add([canvas.width, 0]);
        if (this.pos.getY() < 0) this.pos.add([0, canvas.height]);
    }

    render(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(this.pos.getX() - 2, this.pos.getY() - 2, 4, 4);

        ctx.strokeStyle = "#1095b8";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.pos.getX(), this.pos.getY());
        ctx.lineTo(this.pos.getX() - Math.cos(this.rot) * 10, this.pos.getY() - Math.sin(this.rot) * 10);
        ctx.stroke();
    }

    renderDetectionRadius(ctx) {
        ctx.fillStyle = "#a045a07f";
        ctx.beginPath();
        ctx.arc(this.pos.getX(), this.pos.getY(), this.detectionRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const input = new Input(canvas);

let boids = [];

function init() {
    requestAnimationFrame(render);

    for (let i = 0; i < 100; i++) {
        addBoid(Math.random() * canvas.width, Math.random() * canvas.height);
    }

    setInterval(tick, 1000 / 60);
}

function tick() {
    const delta = 1 / 60;

    let mousePos = input.mouse.pos;

    for (let i in boids) {
        let nearbyBoids = getNearbyBoids(boids[i].pos, boids[i].detectionRadius, boids[i]);
        let nearbyObstacles = getNearbyObstacles(boids[i].pos, boids[i].detectionRadius, boids[i]);
        nearbyObstacles.push({pos: mousePos, radius: 100});
        
        boids[i].avoid(nearbyObstacles, delta);
        boids[i].align(nearbyBoids, delta);
        boids[i].group(nearbyBoids, delta);
        boids[i].jitter(delta);
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
    }

    ctx.fillStyle = "#00ff00";
    ctx.fillRect(input.mouse.pos.getX() - 2, input.mouse.pos.getY() - 2, 4, 4);

    requestAnimationFrame(render);
}

function addBoid(x, y) {
    boids.push(new Boid([x, y]));
}

function getNearbyBoids(pos, r, exclude) {
    let nearby = [];
    for (let i in boids) {
        if (boids[i] === exclude) continue;
        if (Vec.distSq(pos, boids[i].pos) < r * r) nearby.push(boids[i]);
    }
    return nearby;
}

function getNearbyObstacles(pos, r, exclude) {
    let obstacles = [];

    let nearbyBoids = getNearbyBoids(pos, r, exclude);
    for (let i = 0; i < nearbyBoids.length; i++) {
        obstacles.push({pos: new Vec(nearbyBoids[i].pos), radius: 20});
    }

    return obstacles;
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