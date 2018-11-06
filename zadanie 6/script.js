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

let clickedPoints = [];

const steps = 1000;

$(() => {

    context = document.getElementById("canvas").getContext("2d");
    
    posX = $("#canvas").position().left;
    posY = $("#canvas").position().top;

    context.fillStyle = "white";

    width = context.canvas.width;
    height = context.canvas.height;

    start = new Point(200, 200);
    finish = new Point(400, 200);

    const A = new Point(220, 300);
    const B = new Point(310, 100);
    const C = new Point(550, 500);

    const clicks = 4;
    let clicksCounter = 0;

    const factorial = (number) => {
        // validating the input
        number = parseInt(number, 10);
        if (isNaN(number)) return 1;
        
        // if x below 0, return 1
        if (number <= 0) return 1;
        // if x above 170, return infinity
        if (number > 170) return Infinity;
        // calculating the factorial
        var y = 1
        for (var i = number; i>0; i--){
            y *= i;
        }
        return y;
    };

    $("#canvas").click((event) => {
        if (clicksCounter < clicks) {
            const x = event.pageX - posX;
            const y = event.pageY - posY;
            clickedPoints[clicksCounter] = new Point(x, y);
            // console.log(clickedPoints[clicksCounter]);
            context.beginPath();
            if (clicksCounter === 0 || clicksCounter === clicks - 1) {
                context.fillStyle = "#ff0000";
                context.arc(x, y, 5, 0,2 * Math.PI);
            } else {
                context.fillStyle = "#ff8080";
                context.arc(x, y, 3, 0,2 * Math.PI);
            }
            context.fill();
            clicksCounter += 1;
        }
        if (clicksCounter === clicks) {
            context.fillStyle = "#ffffff";
            // console.log(clickedPoints);
            for (let i = 0; i <= steps; i++) {
                let a = 0;
                let b = 0;
                for (let j = 0; j < clicks; j++) {
                    a += (factorial(clicks - 1) / (factorial(j) * factorial(clicks - 1 - j))) * Math.pow((1 - i / steps), clicks - 1 - j) * Math.pow(i / steps, j) * clickedPoints[j].x;
                    b += (factorial(clicks - 1) / (factorial(j) * factorial(clicks - 1 - j))) * Math.pow((1 - i / steps), clicks - 1 - j) * Math.pow(i / steps, j) * clickedPoints[j].y;
                }
                /*
                const x = Math.pow((1 - i / steps), 4) * clickedPoints[0].x
                    + 4 * Math.pow((1 - i / steps), 3) * (i / steps) * clickedPoints[1].x
                    + 4 * Math.pow((1 - i / steps), 2) * Math.pow((i / steps), 2) * clickedPoints[2].x
                    + 4 * (1 - i / steps) * Math.pow((i / steps), 3) * clickedPoints[3].x
                    + Math.pow(i / steps, 4) * clickedPoints[4].x;
                const y = Math.pow((1 - i / steps), 4) * clickedPoints[0].y
                    + 4 * Math.pow((1 - i / steps), 3) * (i / steps) * clickedPoints[1].y
                    + 4 * Math.pow((1 - i / steps), 2) * Math.pow((i / steps), 2) * clickedPoints[2].y
                    + 4 * (1 - i / steps) * Math.pow((i / steps), 3) * clickedPoints[3].y
                    + Math.pow(i / steps, 4) * clickedPoints[4].y;
                */
                context.fillRect(a, b, 1, 1);
            }
        }
    });

    $("#canvas").click(() => {
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
               /*
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
        */
    });

});
