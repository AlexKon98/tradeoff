const canvas = document.getElementById('mouse-trail');
const ctx = canvas.getContext('2d');
let width, height;
let forces = [], polys = [];
let nPolys = 250;
let p = 0;
let size = 50;
let isMove = false;
let timeout;

const move_time = 200;
const max_size = 50;
const colors = [
    '#1c250f',
    '#304515',
    '#456717',
    '#5b8c17',
    '#71b313',
    '#88db05',
    '#93de1d',
    '#9fe236',
    '#abe550',
    '#b7e969',
    '#c3ed82',
    '#cff09b',
    '#dbf4b4',
    '#e7f7cd',
    '#f3fbe6',
    '#ffffff'
];

class V2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }
    reset(x, y) {
        this.x = x;
        this.y = y;
    }
    lerp(vector, n) {
        this.x += (vector.x - this.x) * n;
        this.y += (vector.y - this.y) * n;
    }
}

class Poly {
    constructor(x, y) {
        this.position = new V2(-100, -100);
        this.velocity = new V2();
        this.acceleration = new V2();
        this.alpha = 0;
        this.color = '#88db05';
        this.points = [new V2(-10 + Math.random() * size, -10 + Math.random() * size),
        new V2(-10 + Math.random() * size, -10 + Math.random() * size),
        new V2(-10 + Math.random() * size, -10 + Math.random() * size)];
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.reset(0, 0);
        this.alpha -= 0.008;
        if (this.alpha < 0) this.alpha = 0;
        //this.changeAlpha();
    }

    changeAlpha() {
        const center = {
            x: width / 2,
            y: height / 2
        }

        const dx = Math.abs((center.x - mouse.x) / (center.x))
        const dy = Math.abs((center.y - mouse.y) / (center.y))

        const d_alpha = Math.max(dx, dy) * 0.01;

        this.alpha -= d_alpha;
        if (this.alpha < 0) this.alpha = 0;
    }

    follow() {
        var x = Math.floor(this.position.x / 20);
        var y = Math.floor(this.position.y / 20);
        var index = x * Math.floor(height / 20) + y;
        var force = forces[index];
        if (force) this.applyForce(force);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.moveTo(this.position.x + this.points[0].x, this.position.y + this.points[0].y);
        ctx.lineTo(this.position.x + this.points[1].x, this.position.y + this.points[1].y);
        ctx.lineTo(this.position.x + this.points[2].x, this.position.y + this.points[2].y);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initForces();
}

const initForces = () => {
    var i = 0;
    for (var x = 0; x < width; x += 20) {
        for (var y = 0; y < height; y += 20) {
            if (!forces[i]) forces[i] = new V2();
            i++;
        }
    }

    if (i < forces.length) {
        forces.splice(i + 1);
    }
}

const updateForces = (t) => {
    var i = 0;
    var xOff = 0, yOff = 0;
    for (var x = 0; x < width; x += 20) {
        xOff += 0.1;
        for (var y = 0; y < height; y += 20) {
            yOff += 0.1;
            let a = xOff * yOff * Math.PI * 4;
            if (forces[i]) forces[i].reset(Math.cos(a) * 0.1, Math.sin(a) * 0.1);
            i++;
        }
    }
}

const initPolys = () => {
    for (var i = 0; i < nPolys; i++) {
        polys.push(new Poly(Math.random() * width, Math.random() * height));
        polys[i].velocity.y = 0.1;
    }
}

const drawPolys = () => {
    for (var i = 0; i < nPolys; i++) {
        polys[i].update();
        polys[i].follow();
        polys[i].draw();
    }
}

const launchPoly = () => {
    if (isMove) {
        polys[p].position.reset(emitter.x, emitter.y);
        polys[p].velocity.reset(-1 + Math.random() * 2, -1 + Math.random() * 2);
        polys[p].points = [new V2(-10 + Math.random() * size, -10 + Math.random() * size),
        new V2(-10 + Math.random() * size, -10 + Math.random() * size),
        new V2(-10 + Math.random() * size, -10 + Math.random() * size)];

        const colorIndex = Math.floor(Math.random() * (colors.length - 1));
        polys[p].color = colors[colorIndex];

        const center = {
            x: width / 2,
            y: height / 2
        }
        const dx = Math.abs((center.x - mouse.x) / (center.x))
        const dy = Math.abs((center.y - mouse.y) / (center.y))
        const dxy = Math.max(dx, dy);

        polys[p].alpha = 1 - dxy;
        if (polys[p].alpha < 0) polys[p].alpha = 0;

        size = max_size - (max_size * dxy);

        p++;
        if (p === nPolys) p = 0;
    }
}

const updateEmitter = () => {
    emitter.lerp(mouse, 0.2);
}

const animate = (t) => {
    ctx.clearRect(0, 0, width, height);
    updateEmitter();
    launchPoly();
    updateForces(t);
    drawPolys();
    requestAnimationFrame(animate);
}

const pointerMove = (e) => {
    mouse.x = e.touches ? e.touches[0].pageX : e.pageX;
    mouse.y = e.touches ? e.touches[0].pageY : e.pageY;

    isMove = true;
    clearTimeout(timeout);

    timeout = setTimeout(function () {
        isMove = false;
    }, move_time);
}

let mouse = new V2(0, 0);
let emitter = new V2(window.innerWidth / 2, window.innerHeight / 2);

resize();
initPolys();
requestAnimationFrame(animate);

window.addEventListener('resize', resize);
window.addEventListener('mousemove', pointerMove);
window.addEventListener('touchmove', pointerMove);


