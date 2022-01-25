function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomSign() {
    return Math.random() < 0.5 ? 1 : -1;
}

function intersection(p1, p2, p3, p4) {
    if (p2.x < p1.x) {
        const tmp = p1;
        p1 = p2;
        p2 = tmp;
    }

    if (p4.x < p3.x) {
        const tmp = p3;
        p3 = p4;
        p4 = tmp;
    }

    let Xa = p1.x;
    let A2 = (p3.y - p4.y) / (p3.x - p4.x);
    let b2 = p3.y - A2 * p3.x;
    let Ya = A2 * Xa + b2;

    if (p3.x <= Xa && p4.x >= Xa && Math.min(p1.y, p2.y) <= Ya &&
        Math.max(p1.y, p2.y) >= Ya) {

        return { x: Xa, y: Ya };
    }

    return false;
}

class Particles {
    #canvas;
    #ctx;
    #width;
    #height;
    #topOffset;
    #pointsCount;
    #points;
    #staticPoints;
    #pointsConnectRadius;
    #pointsArea;
    #pointsAreaX;
    #pointsAreaY;
    #pointSpeed;
    #animation;

    #menu;
    #menuItems;
    #menuPoints;
    #menuLines;

    constructor() {
        // Params
        this.topOffset = 70;
        this.pointsCount = 30;
        this.pointsConnectRadius = 200;
        this.maxPointSpeed = 600;
        this.minPointSpeed = 200;
        this.pointsAreaWidth = 1000;
        this.pointsAreaHeight = 390;
        this.pointsAreaX = null;
        this.pointsAreaY = null;
        this.menu = document.getElementById('main-menu');
        this.menuItems = document.getElementsByClassName('menu-item');

        // Create canvas
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.width = 1000;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Init
        this.pointsInit();
        this.createMenuLines();
        this.animate();
    }

    pointsInit() {

        if (this.pointsAreaX == null) {
            this.pointsAreaX = (this.width - this.pointsAreaWidth) / 2;
        }
        if (this.pointsAreaY == null) {
            this.pointsAreaY = ((this.height - this.pointsAreaHeight) / 2) + this.topOffset;
        }

        this.staticPoints = this.createStaticPoints();
        this.menuPoints = this.createMenuPoints();
        this.points = new Array(this.pointsCount + this.staticPoints.length + this.menuPoints.length);

        for (let i = 0; i < this.points.length; i++) {
            if (i < this.staticPoints.length) {
                this.points[i] = this.staticPoints[i];
            } else if (i < this.staticPoints.length + this.menuPoints.length && i >= this.staticPoints.length) {
                const j = i - this.staticPoints.length;
                this.points[i] = this.menuPoints[j];
            } else {
                this.points[i] = {
                    x: Math.random() * (this.pointsAreaWidth) + this.pointsAreaX,
                    y: Math.random() * (this.pointsAreaHeight) + this.pointsAreaY,
                    speedX: getRandom(this.minPointSpeed, this.maxPointSpeed) * getRandomSign() / 1000,
                    speedY: getRandom(this.minPointSpeed, this.maxPointSpeed) * getRandomSign() / 1000,
                    type: 'dynamic',
                }
            }
        }
    }

    createStaticPoints() {
        const staticPoints = [
            {
                x: this.pointsAreaX + 54,
                y: this.pointsAreaY + 180,
                speedX: 0,
                speedY: 0,
                type: 'static'
            },
            {
                x: this.pointsAreaX + 237,
                y: this.pointsAreaY + 58,
                speedX: 0,
                speedY: 0,
                type: 'static'
            },
            {
                x: this.pointsAreaX + 357,
                y: this.pointsAreaY + 27,
                speedX: 0,
                speedY: 0,
                type: 'static'
            },
            {
                x: this.pointsAreaX + 494,
                y: this.pointsAreaY + 32,
                speedX: 0,
                speedY: 0,
                type: 'static'
            },
            {
                x: this.pointsAreaX + 652,
                y: this.pointsAreaY + 1,
                speedX: 0,
                speedY: 0,
                type: 'static'
            },
            {
                x: this.pointsAreaX + 867,
                y: this.pointsAreaY + 5,
                speedX: 0,
                speedY: 0,
                type: 'static'
            },
            {
                x: this.pointsAreaX + 995,
                y: this.pointsAreaY + 142,
                speedX: 0,
                speedY: 0,
                type: 'static'
            },
            {
                x: this.pointsAreaX + 965,
                y: this.pointsAreaY + 356,
                speedX: 0,
                speedY: 0,
                type: 'static'
            },
            {
                x: this.pointsAreaX + 764,
                y: this.pointsAreaY + 402,
                speedX: 0,
                speedY: 0,
                type: 'static'
            },
            {
                x: this.pointsAreaX + 541,
                y: this.pointsAreaY + 370,
                speedX: 0,
                speedY: 0,
                type: 'static'
            },
            {
                x: this.pointsAreaX + 294,
                y: this.pointsAreaY + 361,
                speedX: 0,
                speedY: 0,
                type: 'static'
            },
            {
                x: this.pointsAreaX + 73,
                y: this.pointsAreaY + 291,
                speedX: 0,
                speedY: 0,
                type: 'static'
            }
        ]

        return staticPoints;
    }

    createMenuPoints() {
        let pointsMenuItems = new Array(this.menuItems.length);

        const widthMenuItem = this.menu.clientWidth / this.menuItems.length;
        let currentX = widthMenuItem / 2 + this.pointsAreaX;

        // draw points under menu items
        for (let i = 0; i < pointsMenuItems.length; i++) {
            pointsMenuItems[i] = {
                x: currentX,
                y: this.pointsAreaY - this.topOffset + 30,
                speedX: 0,
                speedY: 0,
                type: 'menu'
            };

            currentX += widthMenuItem;
        }

        return pointsMenuItems;
    }

    createMenuLines() {
        let pointsOnContuor = [];
        this.menuLines = [];

        for (let i = 0; i < this.menuPoints.length; i++) {
            for (let j = 0; j < this.staticPoints.length; j++) {
                const next = j + 1 == this.staticPoints.length ? 0 : j + 1;

                const p1 = this.menuPoints[i];
                const p2 = {
                    x: this.menuPoints[i].x,
                    y: this.height
                }

                const p3 = this.staticPoints[j];
                const p4 = this.staticPoints[next];

                const intersectionPoint = intersection(p1, p2, p3, p4);

                if (intersectionPoint) {
                    intersectionPoint.distance = intersectionPoint.y - p1.y
                    pointsOnContuor.push(intersectionPoint);
                }
            }
        }

        for (let i = 0; i < this.menuPoints.length; i++) {

            let minDistance = this.height;
            let minY = this.menuPoints.y;

            for (let j = 0; j < pointsOnContuor.length; j++) {
                if (this.menuPoints[i].x == pointsOnContuor[j].x) {
                    if (minDistance > pointsOnContuor[j].distance) {
                        minDistance = pointsOnContuor[j].distance;
                        minY = pointsOnContuor[j].y;
                    }
                }
            }

            this.menuLines.push({
                x1: this.menuPoints[i].x,
                y1: this.menuPoints[i].y,
                x2: this.menuPoints[i].x,
                y2: minY
            });
        }
    }

    draw() {
        for (let i = 0; i < this.points.length; i++) {
            this.ctx.beginPath();
            this.ctx.arc(this.points[i].x, this.points[i].y, 2, 0, 2 * Math.PI);
            this.ctx.fillStyle = "white";
            this.ctx.fill();
        }

        this.drawContour();
        this.drawMenu();
    }

    drawContour() {
        for (let i = 0; i < this.staticPoints.length; i++) {
            const next = i + 1 == this.staticPoints.length ? 0 : i + 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.staticPoints[i].x, this.staticPoints[i].y);
            this.ctx.lineTo(this.staticPoints[next].x, this.staticPoints[next].y);
            this.ctx.strokeStyle = `rgba(255, 255, 255, 1)`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }

    drawMenu() {
        for (let i = 0; i < this.menuPoints.length; i++) {
            // draw points under menu items
            this.ctx.beginPath();
            this.ctx.arc(this.menuPoints[i].x, this.menuPoints[i].y, 2, 0, 2 * Math.PI);
            this.ctx.fillStyle = "white";
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.moveTo(this.menuLines[i].x1, this.menuLines[i].y1);
            this.ctx.lineTo(this.menuLines[i].x2, this.menuLines[i].y2);
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }

    connect() {
        for (let i = 0; i < this.points.length; i++) {
            for (let j = i; j < this.points.length; j++) {
                if (this.points[i].type != 'menu' && this.points[j].type != 'menu') {
                    const distance = ((this.points[i].x - this.points[j].x) * (this.points[i].x - this.points[j].x)) + ((this.points[i].y - this.points[j].y) * (this.points[i].y - this.points[j].y));

                    if (distance < this.pointsConnectRadius * 500) {
                        const opacity = 1 - (distance / 30000);
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.points[i].x, this.points[i].y);
                        this.ctx.lineTo(this.points[j].x, this.points[j].y);
                        this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                }
            }
        }
    }

    update() {
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i].type == 'dynamic') {

                if (this.points[i].x < this.pointsAreaX || this.points[i].x > this.pointsAreaWidth + this.pointsAreaX) {
                    this.points[i].speedX = -this.points[i].speedX;
                }

                if (this.points[i].y < this.pointsAreaY || this.points[i].y > this.pointsAreaHeight + this.pointsAreaY) {
                    this.points[i].speedY = -this.points[i].speedY;
                }

                this.points[i].x += this.points[i].speedX;
                this.points[i].y += this.points[i].speedY;
            }
        }

        this.draw();
        this.connect();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.update();
        this.animation = requestAnimationFrame(this.animate.bind(this));
    }

    resize() {
        cancelAnimationFrame(this.animation);
        this.width = 1000;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.pointsAreaX = null;
        this.pointsAreaY = null;

        this.pointsInit();
        this.createMenuLines();
        this.animate();
    }
}
