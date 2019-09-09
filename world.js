class World {
    constructor(chunkSize, worldWidth, worldHeight) {
        this.chunkSize = chunkSize;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        this.chunks = {};
        this.fishes = [];
    }

    getChunk(pos) {
        return chunks[pos.getX() + ":" + pos.getY()];
    }

    tick(delta) {
        for (let i in this.fishes) {
            let fish = this.fishes[i];
            
            let neighborhood = this.getNeighborhood(fish);
        }
    }

    addBoid(x, y) {
        boids.push(new Boid([x, y]));
    }

    getNeighborhood(boid) {
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
}