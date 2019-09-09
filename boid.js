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