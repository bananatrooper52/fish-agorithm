const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const input = new Input(canvas);

let boids = [];
let chunks = {};

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