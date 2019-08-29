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
        this.viewRadius = 100;
        this.fov = Math.PI * 1.5;
    }

    avoid(neighborhood, delta) {
        for (let i in neighborhood) {
            let obstacle = neighborhood[i];

            let diff = Vec.sub(this.pos, obstacle.pos);
            let dist = Vec.dist(this.pos, obstacle.pos);
            
            if (dist < obstacle.rad) {
                let tgtRot = Math.atan2(diff.getY(), diff.getX());
                this.rot = alerp(this.rot, tgtRot, 8 * delta);
            }
        }
    }

    align(neighborhood, delta) {
        for (let i in neighborhood) {
            let other = neighborhood[i];

            if (other.rot === undefined) continue;

            this.rot = alerp(this.rot, other.rot, 1 * delta);
        }
    }

    group(neighborhood, delta) {

        if (neighborhood.length === 0) return;

        let total = new Vec(2);
        let count = 0;

        for (let i in neighborhood) {
            let other = neighborhood[i];

            if (other.rot === undefined) continue;

            total.add(other.pos);
            count++;
        }

        if (count === 0) return;

        let center = total.div(count);
        let diff = center.sub(this.pos);
        let angleToCenter = Math.atan2(diff.getY(), diff.getX());

        this.rot = alerp(this.rot, angleToCenter, 0.3 * delta);
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

    for (let i in boids) {
        let neighborhood = getNeighborhood(boids[i]);
        
        boids[i].align(neighborhood, delta);
        boids[i].group(neighborhood, delta);
        boids[i].avoid(neighborhood, delta);
        boids[i].jitter(delta);
    }

    for (let i in boids) {
        boids[i].integrate(delta);
    }
}

function render() {
    clearScreen();

    renderCursor(ctx);

    for (let i in boids) {
        ctx.fillStyle = "white";
        boids[i].render(ctx);
    }

    requestAnimationFrame(render);
}

function renderCursor(ctx) {
    ctx.fillStyle = "#004000";
    ctx.beginPath();
    ctx.arc(input.mouse.pos.getX(), input.mouse.pos.getY(), 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(input.mouse.pos.getX() - 2, input.mouse.pos.getY() - 2, 4, 4);
}

function addBoid(x, y) {
    boids.push(new Boid([x, y]));
}

function getNeighborhood(boid) {
    let neighborhood = [];
    for (let i in boids) {
        if (boids[i] === boid) continue;
    
        let other = boids[i];
        let dist = Vec.dist(other.pos, boid.pos);
        if (dist < 100) {
            //if (Math.atan2(Vec.sub(boid.pos, boids[i].pos)))
            neighborhood.push({
                pos: new Vec(other.pos),
                rot: other.rot,
                rad: 20
            });
        }
    }
    neighborhood.push({
        pos: new Vec(input.mouse.pos),
        rot: undefined,
        rad: 100
    });
    return neighborhood;
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