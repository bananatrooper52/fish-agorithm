class Vec extends Array {
    constructor(v, val = 0) {
        if (Array.isArray(v)) {
            super(v.length);
            for (let i = 0; i < v.length; i++) {
                this[i] = v[i];
            }
        } else if (typeof v === "number") {
            super(v);
            for (let i = 0; i < v; i++) {
                this[i] = val;
            }
        } else throw new Error("Unrecognized constructor parameters");
    }

    get(i) { 
        if (i >= this.length) throw new Error("Component is outside bounds");
        return this[i];
    }

    getX() { return this.get(0); }
    getY() { return this.get(1); }
    getZ() { return this.get(2); }
    getW() { return this.get(3); }

    getR() { return this.get(0); }
    getG() { return this.get(1); }
    getB() { return this.get(2); }
    getA() { return this.get(3); }

    set(i, v) {
        if (i > this.length) throw new Error("Component is outside bounds");
        this[i] = Number(v);
    }

    setX(v) { this.set(0, v); }
    setY(v) { this.set(1, v); }
    setZ(v) { this.set(2, v); }
    setW(v) { this.set(3, v); }

    setR(v) { this.set(0, v); }
    setG(v) { this.set(1, v); }
    setB(v) { this.set(2, v); }
    setA(v) { this.set(3, v); }

    add(v) { 
        if (Array.isArray(v) && v.length !== this.length) throw new Error("Vectors are different lengths");
        if (typeof v === "number") v = new Vec(this.length, v);
        for (let i = 0; i < this.length; i++) {
            this[i] += v[i];
        }
        return this;
    }
    sub(v) { 
        if (Array.isArray(v) && v.length !== this.length) throw new Error("Vectors are different lengths");
        if (typeof v === "number") v = new Vec(this.length, v);
        for (let i = 0; i < this.length; i++) {
            this[i] -= v[i];
        }
        return this;
    }
    mul(v) {  
        if (Array.isArray(v) && v.length !== this.length) throw new Error("Vectors are different lengths");
        if (typeof v === "number") v = new Vec(this.length, v);
        for (let i = 0; i < this.length; i++) {
            this[i] *= v[i];
        }
        return this;
    }
    div(v) { 
        if (Array.isArray(v) && v.length !== this.length) throw new Error("Vectors are different lengths");
        if (typeof v === "number") v = new Vec(this.length, v);
        for (let i = 0; i < this.length; i++) {
            this[i] /= v[i];
        }
        return this;
    }
    rmd(v) { 
        if (Array.isArray(v) && v.length !== this.length) throw new Error("Vectors are different lengths");
        if (typeof v === "number") v = new Vec(this.length, v);
        for (let i = 0; i < this.length; i++) {
            this[i] %= v[i];
        }
        return this;
    }

    static add(a, b) {
        if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) throw new Error("Vectors are different lengths");
        if (typeof a === "number" && Array.isArray(b)) a = new Vec(b.length, a);
        else if (typeof b === "number" && Array.isArray(a)) b = new Vec(a.length, b);
        else if (typeof a === "number" && typeof b === "number") throw new Error("At least one parameter should be a Vec");
        let out = new Vec(a.length);
        for (let i = 0; i < a.length; i++) {
            out[i] = a[i] + b[i];
        }
        return out;
    }
    static sub(a, b) {
        if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) throw new Error("Vectors are different lengths");
        if (typeof a === "number" && Array.isArray(b)) a = new Vec(b.length, a);
        else if (typeof b === "number" && Array.isArray(a)) b = new Vec(a.length, b);
        else if (typeof a === "number" && typeof b === "number") throw new Error("At least one parameter should be a Vec");
        let out = new Vec(a.length);
        for (let i = 0; i < a.length; i++) {
            out[i] = a[i] - b[i];
        }
        return out;
    }
    static mul(a, b) {
        if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) throw new Error("Vectors are different lengths");
        if (typeof a === "number" && Array.isArray(b)) a = new Vec(b.length, a);
        else if (typeof b === "number" && Array.isArray(a)) b = new Vec(a.length, b);
        else if (typeof a === "number" && typeof b === "number") throw new Error("At least one parameter should be a Vec");
        let out = new Vec(a.length);
        for (let i = 0; i < a.length; i++) {
            out[i] = a[i] * b[i];
        }
        return out;
    }
    static div(a, b) {
        if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) throw new Error("Vectors are different lengths");
        if (typeof a === "number" && Array.isArray(b)) a = new Vec(b.length, a);
        else if (typeof b === "number" && Array.isArray(a)) b = new Vec(a.length, b);
        else if (typeof a === "number" && typeof b === "number") throw new Error("At least one parameter should be a Vec");
        let out = new Vec(a.length);
        for (let i = 0; i < a.length; i++) {
            out[i] = a[i] / b[i];
        }
        return out;
    }
    static rmd(a, b) {
        if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) throw new Error("Vectors are different lengths");
        if (typeof a === "number" && Array.isArray(b)) a = new Vec(b.length, a);
        else if (typeof b === "number" && Array.isArray(a)) b = new Vec(a.length, b);
        else if (typeof a === "number" && typeof b === "number") throw new Error("At least one parameter should be a Vec");
        let out = new Vec(a.length);
        for (let i = 0; i < a.length; i++) {
            out[i] = a[i] % b[i];
        }
        return out;
    }
    static magSq(v) {
        let m = 0;
        for (let i = 0; i < v.length; i++) {
            m += v[i] * v[i];
        }
        return m;
    }
    static distSq(a, b) {
        return Vec.magSq(Vec.sub(a, b));
    }
    static mag(v) {
        return Math.sqrt(Vec.magSq(v));
    }
    static dist(a, b) {
        return Vec.mag(Vec.sub(a, b));
    }
}