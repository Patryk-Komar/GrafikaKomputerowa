class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let mouseDown = false;

let canvas, context, posX, poxY, width, height;

let start = new Point(-1, -1);
let finish = new Point(-1, -1);

const steps = 200;

$(() => {

    context = document.getElementById("canvas").getContext("2d");
    
    posX = $("#canvas").position().left;
    posY = $("#canvas").position().top;

    context.strokeStyle = "white";
    context.fillStyle = "white";

    width = context.canvas.width;
    height = context.canvas.height;

    start = new Point(200, 200);
    finish = new Point(400, 200);

    const A = new Point(220, 300);
    const B = new Point(310, 100);
    const C = new Point(550, 500);

    $("#canvas").click(() => {
        console.log("Tutaj");
        for (let i = 0; i <= steps; i++) {
            /*
            const x = Math.pow((1 - i / steps), 3) * start.x
                + 3 * Math.pow((1 - i / steps), 2) * (i / steps) * A.x
                + 3 * (1 - i / steps) * Math.pow((i / steps), 2) * B.x
                + Math.pow(i / steps, 3) * finish.x;
            const y = Math.pow((1 - i / steps), 3) * start.y
                + 3 * Math.pow((1 - i / steps), 2) * (i / steps) * A.y
                + 3 * (1 - i / steps) * Math.pow((i / steps), 2) * B.y
                + Math.pow(i / steps, 3) * finish.y;
                console.log(x, y);
                */
            const x = Math.pow((1 - i / steps), 4) * start.x
                + 4 * Math.pow((1 - i / steps), 3) * (i / steps) * A.x
                + 4 * Math.pow((1 - i / steps), 2) * Math.pow((i / steps), 2) * B.x
                + 4 * (1 - i / steps) * Math.pow((i / steps), 3) * C.x
                + Math.pow(i / steps, 4) * finish.x;

                const y = Math.pow((1 - i / steps), 4) * start.y
                + 4 * Math.pow((1 - i / steps), 3) * (i / steps) * A.y
                + 4 * Math.pow((1 - i / steps), 2) * Math.pow((i / steps), 2) * B.y
                + 4 * (1 - i / steps) * Math.pow((i / steps), 3) * C.y
                + Math.pow(i / steps, 4) * finish.y;
            context.fillRect(x, y, 1, 1);
        }
        console.log("Tutaj 2");
    });

});
