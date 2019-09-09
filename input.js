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