$(() => {

    const canvas = $("#canvas")[0];
    const context = canvas.getContext("2d");

    let loadedFile;

    document.getElementById("drop-area").addEventListener("dragover", event => {
        event.preventDefault();
    }, true);

    document.getElementById("drop-area").addEventListener("drop", event => {
        const data = event.dataTransfer;
        event.preventDefault();
        handleFile(data.files[0]);
    }, true);

    const handleFile = file => {
        const imageType = /image.*/;
        if (file.type.match(imageType)) {
            const reader = new FileReader();
            reader.onloadend = event => {
                const image = new Image();
                image.onload = e => {
                    canvas.height = e.target.height;
                    canvas.width = e.target.width;
                    context.drawImage(e.target, 0, 0);
                };
                image.src = event.target.result;
            };
            reader.readAsDataURL(file);
            loadedFile = file;
        }
    };

    $('#canvas').click(event => {
        /*
        const posX = $("#canvas").position().left;
        const posY = $("#canvas").position().top;
        const x = event.pageX - posX;
        const y = event.pageY - posY;
        */
        // addColor("#5599ff");
        // detectEdges();
        // StackBlur.canvasRGB(canvas, 0, 0, canvas.width, canvas.height, 5);
        // averageFilter();
        sharpenFilter();
    });

    $("#button-add").click(() => {
        const rgbColor = $("#rgb-color").val();
        const hexColorRegex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
        if (hexColorRegex.test(rgbColor)) {
            addColor(rgbColor.replace("#", ""));
        } else {
            alert("Enter valid RGB value");
        }
    });

    $("#button-subtract").click(() => {
        const rgbColor = $("#rgb-color").val();
        const hexColorRegex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
        if (hexColorRegex.test(rgbColor)) {
            subtractColor(rgbColor.replace("#", ""));
        } else {
            alert("Enter valid RGB value");
        }
    });

    $("#button-multiply").click(() => {
        const rgbColor = $("#rgb-color").val();
        const hexColorRegex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
        if (hexColorRegex.test(rgbColor)) {
            multiplyByColor(rgbColor.replace("#", ""));
        } else {
            alert("Enter valid RGB value");
        }
    });

    $("#button-brightness").click(() => {
        const brightness = parseInt($("#slider-brightness").val());
        changeBrightness(brightness);
    });

    $("#button-grayscale-1").click(() => {
        grayscaleAverage();
    });

    $("#button-grayscale-2").click(() => {
        grayscaleLightness();
    });

    $("#button-average-filter").click(() => {
        averageFilter();
    });

    $("#button-median-filter").click(() => {
        medianFilter();
    });

    $("#button-sobel-filter").click(() => {
        detectEdges();
    });

    $("#button-sharpen-filter").click(() => {
        sharpenFilter();
    });

    $("#button-gaussian-filter").click(() => {
        const radius = parseInt($("#gaussian-blur-radius").val());
        StackBlur.canvasRGB(canvas, 0, 0, canvas.width, canvas.height, radius);
    });

    const addColor = color => {
        const addRGB = color.replace("#", "");
        const addR = parseInt(addRGB.substr(0,2), 16);
        const addG = parseInt(addRGB.substr(2,2), 16);
        const addB = parseInt(addRGB.substr(4,2), 16);
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const pixelData = context.getImageData(i, j, 1, 1);
                pixelData.data[0] = pixelData.data[0] + addR <= 255 ? pixelData.data[0] + addR : 255;
                pixelData.data[1] = pixelData.data[1] + addG <= 255 ? pixelData.data[0] + addG : 255;
                pixelData.data[2] = pixelData.data[2] + addB <= 255 ? pixelData.data[0] + addB : 255;
                context.putImageData(pixelData, i, j);
            }
        }
    };

    const subtractColor = color => {
        const subtractRGB = color.replace("#", "");
        const subtractR = parseInt(subtractRGB.substr(0,2), 16);
        const subtractG = parseInt(subtractRGB.substr(2,2), 16);
        const subtractB = parseInt(subtractRGB.substr(4,2), 16);
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const pixelData = context.getImageData(i, j, 1, 1);
                pixelData.data[0] = pixelData.data[0] - subtractR >= 0 ? pixelData.data[0] - subtractR : 0;
                pixelData.data[1] = pixelData.data[1] - subtractG >= 0 ? pixelData.data[1] - subtractG : 0;
                pixelData.data[2] = pixelData.data[2] - subtractB >= 0 ? pixelData.data[2] - subtractB : 0;
                context.putImageData(pixelData, i, j);
            }
        }
    };

    const multiplyByColor = color => {
        const multiplyRGB = color.replace("#", "");
        const multiplyR = parseInt(multiplyRGB.substr(0,2), 16);
        const multiplyG = parseInt(multiplyRGB.substr(2,2), 16);
        const multiplyB = parseInt(multiplyRGB.substr(4,2), 16);
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const pixel = context.getImageData(i, j, 1, 1);
                pixel.data[0] = Math.round((pixel.data[0] * multiplyR) / 255);
                pixel.data[1] = Math.round((pixel.data[1] * multiplyG) / 255);
                pixel.data[2] = Math.round((pixel.data[2] * multiplyB) / 255);
                context.putImageData(pixel, i, j);
            }
        }
    };

    const changeBrightness = brightnessLevel => {
        console.log(brightnessLevel);
        if (brightnessLevel < -255 || brightnessLevel > 255) {
            alert("Enter correct brighter level! (-255 ... 255)");
            return;
        }
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const pixel = context.getImageData(i, j, 1, 1);
                for (let k = 0; k < 3; k++) {
                    pixel.data[k] += brightnessLevel;
                    if (pixel.data[k] < 0) pixel.data[k] = 0;
                    else if (pixel.data[k] > 255) pixel.data[k] = 255;
                }
                context.putImageData(pixel, i, j);
            }
        } 
    };

    const grayscaleAverage = () => {
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const pixel = context.getImageData(i, j, 1, 1);
                const grayColor = Math.round((pixel.data[0] + pixel.data[1] + pixel.data[2]) / 3);
                pixel.data[0] = pixel.data[1] = pixel.data[2] = grayColor;
                context.putImageData(pixel, i, j);
            }
        } 
    };

    const grayscaleLightness = () => {
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const pixel = context.getImageData(i, j, 1, 1);
                const grayColor = Math.round((Math.max(pixel.data[0], pixel.data[1], pixel.data[2]) + Math.min(pixel.data[0], pixel.data[1], pixel.data[2])) / 2);
                pixel.data[0] = pixel.data[1] = pixel.data[2] = grayColor;
                context.putImageData(pixel, i, j);
            }
        } 
    };

    const grayscaleLuminosity = () => {
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const pixel = context.getImageData(i, j, 1, 1);
                const grayColor = Math.round(0.21 * pixel.data[0] + 0.72 * pixel.data[1] + 0.07 * pixel.data[2]);
                pixel.data[0] = pixel.data[1] = pixel.data[2] = grayColor;
                context.putImageData(pixel, i, j);
            }
        } 
    };

    const averageFilter = () => {
        const start = Date.now();
        const filteredImage = [];
        for (let i = 0; i < canvas.width; i++) {
            filteredImage[i] = [];
            for (let j = 0; j < canvas.height; j++) {
                filteredImage[i][j] = [];
                let R, G, B;
                if (i === 0) {
                    if (j === 0) {
                        R = Math.round((
                            context.getImageData(i, j, 1, 1).data[0] +
                            context.getImageData(i, j + 1, 1, 1).data[0] +
                            context.getImageData(i + 1, j, 1, 1).data[0] +
                            context.getImageData(i + 1, j + 1, 1, 1).data[0]) / 4);
                        G = Math.round((
                            context.getImageData(i, j, 1, 1).data[1] +
                            context.getImageData(i, j + 1, 1, 1).data[1] +
                            context.getImageData(i + 1, j, 1, 1).data[1] +
                            context.getImageData(i + 1, j + 1, 1, 1).data[1]) / 4);
                        B = Math.round((
                            context.getImageData(i, j, 1, 1).data[2] +
                            context.getImageData(i, j + 1, 1, 1).data[2] +
                            context.getImageData(i + 1, j, 1, 1).data[2] +
                            context.getImageData(i + 1, j + 1, 1, 1).data[2]) / 4);
                    } else if (j < canvas.height - 1) {
                        R = Math.round((
                            context.getImageData(i, j - 1, 1, 1).data[0] +
                            context.getImageData(i, j, 1, 1).data[0] +
                            context.getImageData(i, j + 1, 1, 1).data[0] +
                            context.getImageData(i + 1, j - 1, 1, 1).data[0] +
                            context.getImageData(i + 1, j, 1, 1).data[0] +
                            context.getImageData(i + 1, j + 1, 1, 1).data[0]) / 6);
                        G = Math.round((
                            context.getImageData(i, j - 1, 1, 1).data[1] +
                            context.getImageData(i, j, 1, 1).data[1] +
                            context.getImageData(i, j + 1, 1, 1).data[1] +
                            context.getImageData(i + 1, j - 1, 1, 1).data[1] +
                            context.getImageData(i + 1, j, 1, 1).data[1] +
                            context.getImageData(i + 1, j + 1, 1, 1).data[1]) / 6);
                        B = Math.round((
                            context.getImageData(i, j - 1, 1, 1).data[2] +
                            context.getImageData(i, j, 1, 1).data[2] +
                            context.getImageData(i, j + 1, 1, 1).data[2] +
                            context.getImageData(i + 1, j - 1, 1, 1).data[2] +
                            context.getImageData(i + 1, j, 1, 1).data[2] +
                            context.getImageData(i + 1, j + 1, 1, 1).data[2]) / 6);
                    } else if (j === canvas.height - 1) {
                        R = Math.round((
                            context.getImageData(i, j - 1, 1, 1).data[0] +
                            context.getImageData(i, j, 1, 1).data[0] +
                            context.getImageData(i + 1, j - 1, 1, 1).data[0] +
                            context.getImageData(i + 1, j, 1, 1).data[0]) / 4);
                        G = Math.round((
                            context.getImageData(i, j - 1, 1, 1).data[1] +
                            context.getImageData(i, j, 1, 1).data[1] +
                            context.getImageData(i + 1, j - 1, 1, 1).data[1] +
                            context.getImageData(i + 1, j, 1, 1).data[1]) / 4);
                        B = Math.round((
                            context.getImageData(i, j - 1, 1, 1).data[2] +
                            context.getImageData(i, j, 1, 1).data[2] +
                            context.getImageData(i + 1, j - 1, 1, 1).data[2] +
                            context.getImageData(i + 1, j, 1, 1).data[2]) / 4);
                    }
                } else if (i < canvas.width - 1) {
                    if (j === 0) {
                        R = Math.round((
                            context.getImageData(i - 1, j, 1, 1).data[0] +
                            context.getImageData(i - 1, j + 1, 1, 1).data[0] +
                            context.getImageData(i, j, 1, 1).data[0] +
                            context.getImageData(i, j + 1, 1, 1).data[0] +
                            context.getImageData(i + 1, j, 1, 1).data[0] +
                            context.getImageData(i + 1, j + 1, 1, 1).data[0]) / 6);
                        G = Math.round((
                            context.getImageData(i - 1, j, 1, 1).data[1] +
                            context.getImageData(i - 1, j + 1, 1, 1).data[1] +
                            context.getImageData(i, j, 1, 1).data[1] +
                            context.getImageData(i, j + 1, 1, 1).data[1] +
                            context.getImageData(i + 1, j, 1, 1).data[1] +
                            context.getImageData(i + 1, j + 1, 1, 1).data[1]) / 6);
                        B = Math.round((
                            context.getImageData(i - 1, j, 1, 1).data[2] +
                            context.getImageData(i - 1, j + 1, 1, 1).data[2] +
                            context.getImageData(i, j, 1, 1).data[2] +
                            context.getImageData(i, j + 1, 1, 1).data[2] +
                            context.getImageData(i + 1, j, 1, 1).data[2] +
                            context.getImageData(i + 1, j + 1, 1, 1).data[2]) / 6);
                    } else if (j < canvas.height - 1) {
                        R = Math.round((
                            context.getImageData(i - 1, j - 1, 1, 1).data[0] +
                            context.getImageData(i - 1, j, 1, 1).data[0] +
                            context.getImageData(i - 1, j + 1, 1, 1).data[0] +
                            context.getImageData(i, j - 1, 1, 1).data[0] +
                            context.getImageData(i, j, 1, 1).data[0] +
                            context.getImageData(i, j + 1, 1, 1).data[0] +
                            context.getImageData(i + 1, j - 1, 1, 1).data[0] +
                            context.getImageData(i + 1, j, 1, 1).data[0] +
                            context.getImageData(i + 1, j + 1, 1, 1).data[0]) / 9);
                        G = Math.round((
                            context.getImageData(i - 1, j - 1, 1, 1).data[1] +
                            context.getImageData(i - 1, j, 1, 1).data[1] +
                            context.getImageData(i - 1, j + 1, 1, 1).data[1] +
                            context.getImageData(i, j - 1, 1, 1).data[1] +
                            context.getImageData(i, j, 1, 1).data[1] +
                            context.getImageData(i, j + 1, 1, 1).data[1] +
                            context.getImageData(i + 1, j - 1, 1, 1).data[1] +
                            context.getImageData(i + 1, j, 1, 1).data[1] +
                            context.getImageData(i + 1, j + 1, 1, 1).data[1]) / 9);
                        B = Math.round((
                            context.getImageData(i - 1, j - 1, 1, 1).data[2] +
                            context.getImageData(i - 1, j, 1, 1).data[2] +
                            context.getImageData(i - 1, j + 1, 1, 1).data[2] +
                            context.getImageData(i, j - 1, 1, 1).data[2] +
                            context.getImageData(i, j, 1, 1).data[2] +
                            context.getImageData(i, j + 1, 1, 1).data[2] +
                            context.getImageData(i + 1, j - 1, 1, 1).data[2] +
                            context.getImageData(i + 1, j, 1, 1).data[2] +
                            context.getImageData(i + 1, j + 1, 1, 1).data[2]) / 9);
                    } else if (j === canvas.height - 1) {
                        R = Math.round((
                            context.getImageData(i - 1, j, 1, 1).data[0] +
                            context.getImageData(i - 1, j - 1, 1, 1).data[0] +
                            context.getImageData(i, j, 1, 1).data[0] +
                            context.getImageData(i, j - 1, 1, 1).data[0] +
                            context.getImageData(i + 1, j, 1, 1).data[0] +
                            context.getImageData(i + 1, j - 1, 1, 1).data[0]) / 6);
                        G = Math.round((
                            context.getImageData(i - 1, j, 1, 1).data[1] +
                            context.getImageData(i - 1, j - 1, 1, 1).data[1] +
                            context.getImageData(i, j, 1, 1).data[1] +
                            context.getImageData(i, j - 1, 1, 1).data[1] +
                            context.getImageData(i + 1, j, 1, 1).data[1] +
                            context.getImageData(i + 1, j - 1, 1, 1).data[1]) / 6);
                        B = Math.round((
                            context.getImageData(i - 1, j, 1, 1).data[2] +
                            context.getImageData(i - 1, j - 1, 1, 1).data[2] +
                            context.getImageData(i, j, 1, 1).data[2] +
                            context.getImageData(i, j - 1, 1, 1).data[2] +
                            context.getImageData(i + 1, j, 1, 1).data[2] +
                            context.getImageData(i + 1, j - 1, 1, 1).data[2]) / 6);
                    }
                } else if (i === canvas.width - 1) {
                    if (j === 0) {
                        R = Math.round((
                            context.getImageData(i, j, 1, 1).data[0] +
                            context.getImageData(i, j + 1, 1, 1).data[0] +
                            context.getImageData(i - 1, j, 1, 1).data[0] +
                            context.getImageData(i - 1, j + 1, 1, 1).data[0]) / 4);
                        G = Math.round((
                            context.getImageData(i, j, 1, 1).data[1] +
                            context.getImageData(i, j + 1, 1, 1).data[1] +
                            context.getImageData(i - 1, j, 1, 1).data[1] +
                            context.getImageData(i - 1, j + 1, 1, 1).data[1]) / 4);
                        B = Math.round((
                            context.getImageData(i, j, 1, 1).data[2] +
                            context.getImageData(i, j + 1, 1, 1).data[2] +
                            context.getImageData(i - 1, j, 1, 1).data[2] +
                            context.getImageData(i - 1, j + 1, 1, 1).data[2]) / 4);
                    } else if (j < canvas.height - 1) {
                        R = Math.round((
                            context.getImageData(i, j - 1, 1, 1).data[0] +
                            context.getImageData(i, j, 1, 1).data[0] +
                            context.getImageData(i, j + 1, 1, 1).data[0] +
                            context.getImageData(i - 1, j - 1, 1, 1).data[0] +
                            context.getImageData(i - 1, j, 1, 1).data[0] +
                            context.getImageData(i - 1, j + 1, 1, 1).data[0]) / 6);
                        G = Math.round((
                            context.getImageData(i, j - 1, 1, 1).data[1] +
                            context.getImageData(i, j, 1, 1).data[1] +
                            context.getImageData(i, j + 1, 1, 1).data[1] +
                            context.getImageData(i - 1, j - 1, 1, 1).data[1] +
                            context.getImageData(i - 1, j, 1, 1).data[1] +
                            context.getImageData(i - 1, j + 1, 1, 1).data[1]) / 6);
                        B = Math.round((
                            context.getImageData(i, j - 1, 1, 1).data[2] +
                            context.getImageData(i, j, 1, 1).data[2] +
                            context.getImageData(i, j + 1, 1, 1).data[2] +
                            context.getImageData(i - 1, j - 1, 1, 1).data[2] +
                            context.getImageData(i - 1, j, 1, 1).data[2] +
                            context.getImageData(i - 1, j + 1, 1, 1).data[2]) / 6);
                    } else if (j === canvas.height - 1) {
                        R = Math.round((
                            context.getImageData(i, j - 1, 1, 1).data[0] +
                            context.getImageData(i, j, 1, 1).data[0] +
                            context.getImageData(i - 1, j - 1, 1, 1).data[0] +
                            context.getImageData(i - 1, j, 1, 1).data[0]) / 4);
                        G = Math.round((
                            context.getImageData(i, j - 1, 1, 1).data[1] +
                            context.getImageData(i, j, 1, 1).data[1] +
                            context.getImageData(i - 1, j - 1, 1, 1).data[1] +
                            context.getImageData(i - 1, j, 1, 1).data[1]) / 4);
                        B = Math.round((
                            context.getImageData(i, j - 1, 1, 1).data[2] +
                            context.getImageData(i, j, 1, 1).data[2] +
                            context.getImageData(i - 1, j - 1, 1, 1).data[2] +
                            context.getImageData(i - 1, j, 1, 1).data[2]) / 4);
                    }
                }
                filteredImage[i][j][0] = R;
                filteredImage[i][j][1] = G;
                filteredImage[i][j][2] = B;
            }
        }
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const pixel = context.getImageData(i, j, 1, 1);
                pixel.data[0] = filteredImage[i][j][0];
                pixel.data[1] = filteredImage[i][j][1];
                pixel.data[2] = filteredImage[i][j][2];
                context.putImageData(pixel, i, j);
            }
        }
        const stop = Date.now();
        console.log(stop - start);
    };




    const medianFilter = () => {
        const start = Date.now();
        const filteredImage = [];
        for (let i = 0; i < canvas.width; i++) {
            filteredImage[i] = [];
            for (let j = 0; j < canvas.height; j++) {
                filteredImage[i][j] = [];
                let R, G, B;
                if (i === 0) {
                    if (j === 0) {
                        let Rs = [
                            context.getImageData(i, j, 1, 1).data[0],
                            context.getImageData(i, j + 1, 1, 1).data[0],
                            context.getImageData(i + 1, j, 1, 1).data[0],
                            context.getImageData(i + 1, j + 1, 1, 1).data[0]
                        ];
                        Rs = Rs.sort((a, b) => a - b);
                        R = Rs.length % 2 === 0 ?
                            Math.round((Rs[Rs.length / 2 - 1] + Rs[Rs.length / 2]) / 2) :
                            Rs[Math.round(Rs.length / 2) - 1];
                        let Gs = [
                            context.getImageData(i, j, 1, 1).data[1],
                            context.getImageData(i, j + 1, 1, 1).data[1],
                            context.getImageData(i + 1, j, 1, 1).data[1],
                            context.getImageData(i + 1, j + 1, 1, 1).data[1]
                        ];
                        Gs = Gs.sort((a, b) => a - b);
                        G = Gs.length % 2 === 0 ?
                            Math.round((Gs[Gs.length / 2 - 1] + Gs[Gs.length / 2]) / 2) :
                            Gs[Math.round(Gs.length / 2) - 1];
                        let Bs = [
                            context.getImageData(i, j, 1, 1).data[2],
                            context.getImageData(i, j + 1, 1, 1).data[2],
                            context.getImageData(i + 1, j, 1, 1).data[2],
                            context.getImageData(i + 1, j + 1, 1, 1).data[2]
                        ];
                        Bs = Bs.sort((a, b) => a - b);
                        B = Bs.length % 2 === 0 ?
                            Math.round((Bs[Bs.length / 2 - 1] + Bs[Bs.length / 2]) / 2) :
                            Bs[Math.round(Bs.length / 2) - 1];
                    } else if (j < canvas.height - 1) {
                        let Rs = [
                            context.getImageData(i, j, 1, 1).data[0],
                            context.getImageData(i, j - 1, 1, 1).data[0],
                            context.getImageData(i, j + 1, 1, 1).data[0],
                            context.getImageData(i + 1, j, 1, 1).data[0],
                            context.getImageData(i + 1, j - 1, 1, 1).data[0],
                            context.getImageData(i + 1, j + 1, 1, 1).data[0]
                        ];
                        Rs = Rs.sort((a, b) => a - b);
                        R = Rs.length % 2 === 0 ?
                            Math.round((Rs[Rs.length / 2 - 1] + Rs[Rs.length / 2]) / 2) :
                            Rs[Math.round(Rs.length / 2) - 1];
                        let Gs = [
                            context.getImageData(i, j, 1, 1).data[1],
                            context.getImageData(i, j - 1, 1, 1).data[1],
                            context.getImageData(i, j + 1, 1, 1).data[1],
                            context.getImageData(i + 1, j, 1, 1).data[1],
                            context.getImageData(i + 1, j - 1, 1, 1).data[1],
                            context.getImageData(i + 1, j + 1, 1, 1).data[1]
                        ];
                        Gs = Gs.sort((a, b) => a - b);
                        G = Gs.length % 2 === 0 ?
                            Math.round((Gs[Gs.length / 2 - 1] + Gs[Gs.length / 2]) / 2) :
                            Gs[Math.round(Gs.length / 2) - 1];
                        let Bs = [
                            context.getImageData(i, j, 1, 1).data[2],
                            context.getImageData(i, j - 1, 1, 1).data[2],
                            context.getImageData(i, j + 1, 1, 1).data[2],
                            context.getImageData(i + 1, j, 1, 1).data[2],
                            context.getImageData(i + 1, j - 1, 1, 1).data[2],
                            context.getImageData(i + 1, j + 1, 1, 1).data[2]
                        ];
                        Bs = Bs.sort((a, b) => a - b);
                        B = Bs.length % 2 === 0 ?
                            Math.round((Bs[Bs.length / 2 - 1] + Bs[Bs.length / 2]) / 2) :
                            Bs[Math.round(Bs.length / 2) - 1];
                    } else if (j === canvas.height - 1) {
                        let Rs = [
                            context.getImageData(i, j, 1, 1).data[0],
                            context.getImageData(i, j - 1, 1, 1).data[0],
                            context.getImageData(i + 1, j, 1, 1).data[0],
                            context.getImageData(i + 1, j - 1, 1, 1).data[0]
                        ];
                        Rs = Rs.sort((a, b) => a - b);
                        R = Rs.length % 2 === 0 ?
                            Math.round((Rs[Rs.length / 2 - 1] + Rs[Rs.length / 2]) / 2) :
                            Rs[Math.round(Rs.length / 2) - 1];
                        let Gs = [
                            context.getImageData(i, j, 1, 1).data[1],
                            context.getImageData(i, j - 1, 1, 1).data[1],
                            context.getImageData(i + 1, j, 1, 1).data[1],
                            context.getImageData(i + 1, j - 1, 1, 1).data[1]
                        ];
                        Gs = Gs.sort((a, b) => a - b);
                        G = Gs.length % 2 === 0 ?
                            Math.round((Gs[Gs.length / 2 - 1] + Gs[Gs.length / 2]) / 2) :
                            Gs[Math.round(Gs.length / 2) - 1];
                        let Bs = [
                            context.getImageData(i, j, 1, 1).data[2],
                            context.getImageData(i, j - 1, 1, 1).data[2],
                            context.getImageData(i + 1, j, 1, 1).data[2],
                            context.getImageData(i + 1, j - 1, 1, 1).data[2]
                        ];
                        Bs = Bs.sort((a, b) => a - b);
                        B = Bs.length % 2 === 0 ?
                            Math.round((Bs[Bs.length / 2 - 1] + Bs[Bs.length / 2]) / 2) :
                            Bs[Math.round(Bs.length / 2) - 1];
                    }
                } else if (i < canvas.width - 1) {
                    if (j === 0) {
                        let Rs = [
                            context.getImageData(i, j, 1, 1).data[0],
                            context.getImageData(i, j + 1, 1, 1).data[0],
                            context.getImageData(i - 1, j, 1, 1).data[0],
                            context.getImageData(i - 1, j + 1, 1, 1).data[0],
                            context.getImageData(i + 1, j, 1, 1).data[0],
                            context.getImageData(i + 1, j + 1, 1, 1).data[0]
                        ];
                        Rs = Rs.sort((a, b) => a - b);
                        R = Rs.length % 2 === 0 ?
                            Math.round((Rs[Rs.length / 2 - 1] + Rs[Rs.length / 2]) / 2) :
                            Rs[Math.round(Rs.length / 2) - 1];
                        let Gs = [
                            context.getImageData(i, j, 1, 1).data[1],
                            context.getImageData(i, j + 1, 1, 1).data[1],
                            context.getImageData(i - 1, j, 1, 1).data[1],
                            context.getImageData(i - 1, j + 1, 1, 1).data[1],
                            context.getImageData(i + 1, j, 1, 1).data[1],
                            context.getImageData(i + 1, j + 1, 1, 1).data[1]
                        ];
                        Gs = Gs.sort((a, b) => a - b);
                        G = Gs.length % 2 === 0 ?
                            Math.round((Gs[Gs.length / 2 - 1] + Gs[Gs.length / 2]) / 2) :
                            Gs[Math.round(Gs.length / 2) - 1];
                        let Bs = [
                            context.getImageData(i, j, 1, 1).data[2],
                            context.getImageData(i, j + 1, 1, 1).data[2],
                            context.getImageData(i - 1, j, 1, 1).data[2],
                            context.getImageData(i - 1, j + 1, 1, 1).data[2],
                            context.getImageData(i + 1, j, 1, 1).data[2],
                            context.getImageData(i + 1, j + 1, 1, 1).data[2]
                        ];
                        Bs = Bs.sort((a, b) => a - b);
                        B = Bs.length % 2 === 0 ?
                            Math.round((Bs[Bs.length / 2 - 1] + Bs[Bs.length / 2]) / 2) :
                            Bs[Math.round(Bs.length / 2) - 1];
                    } else if (j < canvas.height - 1) {
                        let Rs = [
                            context.getImageData(i, j, 1, 1).data[0],
                            context.getImageData(i, j - 1, 1, 1).data[0],
                            context.getImageData(i, j + 1, 1, 1).data[0],
                            context.getImageData(i - 1, j, 1, 1).data[0],
                            context.getImageData(i - 1, j - 1, 1, 1).data[0],
                            context.getImageData(i - 1, j + 1, 1, 1).data[0],
                            context.getImageData(i + 1, j, 1, 1).data[0],
                            context.getImageData(i + 1, j - 1, 1, 1).data[0],
                            context.getImageData(i + 1, j + 1, 1, 1).data[0]
                        ];
                        Rs = Rs.sort((a, b) => a - b);
                        R = Rs.length % 2 === 0 ?
                            Math.round((Rs[Rs.length / 2 - 1] + Rs[Rs.length / 2]) / 2) :
                            Rs[Math.round(Rs.length / 2) - 1];
                        let Gs = [
                            context.getImageData(i, j, 1, 1).data[1],
                            context.getImageData(i, j - 1, 1, 1).data[1],
                            context.getImageData(i, j + 1, 1, 1).data[1],
                            context.getImageData(i - 1, j, 1, 1).data[1],
                            context.getImageData(i - 1, j - 1, 1, 1).data[1],
                            context.getImageData(i - 1, j + 1, 1, 1).data[1],
                            context.getImageData(i + 1, j, 1, 1).data[1],
                            context.getImageData(i + 1, j - 1, 1, 1).data[1],
                            context.getImageData(i + 1, j + 1, 1, 1).data[1]
                        ];
                        Gs = Gs.sort((a, b) => a - b);
                        G = Gs.length % 2 === 0 ?
                            Math.round((Gs[Gs.length / 2 - 1] + Gs[Gs.length / 2]) / 2) :
                            Gs[Math.round(Gs.length / 2) - 1];
                        let Bs = [
                            context.getImageData(i, j, 1, 1).data[2],
                            context.getImageData(i, j - 1, 1, 1).data[2],
                            context.getImageData(i, j + 1, 1, 1).data[2],
                            context.getImageData(i - 1, j, 1, 1).data[2],
                            context.getImageData(i - 1, j - 1, 1, 1).data[2],
                            context.getImageData(i - 1, j + 1, 1, 1).data[2],
                            context.getImageData(i + 1, j, 1, 1).data[2],
                            context.getImageData(i + 1, j - 1, 1, 1).data[2],
                            context.getImageData(i + 1, j + 1, 1, 1).data[2]
                        ];
                        Bs = Bs.sort((a, b) => a - b);
                        B = Bs.length % 2 === 0 ?
                            Math.round((Bs[Bs.length / 2 - 1] + Bs[Bs.length / 2]) / 2) :
                            Bs[Math.round(Bs.length / 2) - 1];
                    } else if (j === canvas.height - 1) {
                        let Rs = [
                            context.getImageData(i, j, 1, 1).data[0],
                            context.getImageData(i, j - 1, 1, 1).data[0],
                            context.getImageData(i - 1, j, 1, 1).data[0],
                            context.getImageData(i - 1, j - 1, 1, 1).data[0],
                            context.getImageData(i + 1, j, 1, 1).data[0],
                            context.getImageData(i + 1, j - 1, 1, 1).data[0]
                        ];
                        Rs = Rs.sort((a, b) => a - b);
                        R = Rs.length % 2 === 0 ?
                            Math.round((Rs[Rs.length / 2 - 1] + Rs[Rs.length / 2]) / 2) :
                            Rs[Math.round(Rs.length / 2) - 1];
                        let Gs = [
                            context.getImageData(i, j, 1, 1).data[1],
                            context.getImageData(i, j - 1, 1, 1).data[1],
                            context.getImageData(i - 1, j, 1, 1).data[1],
                            context.getImageData(i - 1, j - 1, 1, 1).data[1],
                            context.getImageData(i + 1, j, 1, 1).data[1],
                            context.getImageData(i + 1, j - 1, 1, 1).data[1]
                        ];
                        Gs = Gs.sort((a, b) => a - b);
                        G = Gs.length % 2 === 0 ?
                            Math.round((Gs[Gs.length / 2 - 1] + Gs[Gs.length / 2]) / 2) :
                            Gs[Math.round(Gs.length / 2) - 1];
                        let Bs = [
                            context.getImageData(i, j, 1, 1).data[2],
                            context.getImageData(i, j - 1, 1, 1).data[2],
                            context.getImageData(i - 1, j, 1, 1).data[2],
                            context.getImageData(i - 1, j - 1, 1, 1).data[2],
                            context.getImageData(i + 1, j, 1, 1).data[2],
                            context.getImageData(i + 1, j - 1, 1, 1).data[2]
                        ];
                        Bs = Bs.sort((a, b) => a - b);
                        B = Bs.length % 2 === 0 ?
                            Math.round((Bs[Bs.length / 2 - 1] + Bs[Bs.length / 2]) / 2) :
                            Bs[Math.round(Bs.length / 2) - 1];
                    }
                } else if (i === canvas.width - 1) {
                    if (j === 0) {
                        let Rs = [
                            context.getImageData(i, j, 1, 1).data[0],
                            context.getImageData(i, j + 1, 1, 1).data[0],
                            context.getImageData(i - 1, j, 1, 1).data[0],
                            context.getImageData(i - 1, j + 1, 1, 1).data[0]
                        ];
                        Rs = Rs.sort((a, b) => a - b);
                        R = Rs.length % 2 === 0 ?
                            Math.round((Rs[Rs.length / 2 - 1] + Rs[Rs.length / 2]) / 2) :
                            Rs[Math.round(Rs.length / 2) - 1];
                        let Gs = [
                            context.getImageData(i, j, 1, 1).data[1],
                            context.getImageData(i, j + 1, 1, 1).data[1],
                            context.getImageData(i - 1, j, 1, 1).data[1],
                            context.getImageData(i - 1, j + 1, 1, 1).data[1]
                        ];
                        Gs = Gs.sort((a, b) => a - b);
                        G = Gs.length % 2 === 0 ?
                            Math.round((Gs[Gs.length / 2 - 1] + Gs[Gs.length / 2]) / 2) :
                            Gs[Math.round(Gs.length / 2) - 1];
                        let Bs = [
                            context.getImageData(i, j, 1, 1).data[2],
                            context.getImageData(i, j + 1, 1, 1).data[2],
                            context.getImageData(i - 1, j, 1, 1).data[2],
                            context.getImageData(i - 1, j + 1, 1, 1).data[2]
                        ];
                        Bs = Bs.sort((a, b) => a - b);
                        B = Bs.length % 2 === 0 ?
                            Math.round((Bs[Bs.length / 2 - 1] + Bs[Bs.length / 2]) / 2) :
                            Bs[Math.round(Bs.length / 2) - 1];
                    } else if (j < canvas.height - 1) {
                        let Rs = [
                            context.getImageData(i, j, 1, 1).data[0],
                            context.getImageData(i, j - 1, 1, 1).data[0],
                            context.getImageData(i, j + 1, 1, 1).data[0],
                            context.getImageData(i - 1, j, 1, 1).data[0],
                            context.getImageData(i - 1, j - 1, 1, 1).data[0],
                            context.getImageData(i - 1, j + 1, 1, 1).data[0]
                        ];
                        Rs = Rs.sort((a, b) => a - b);
                        R = Rs.length % 2 === 0 ?
                            Math.round((Rs[Rs.length / 2 - 1] + Rs[Rs.length / 2]) / 2) :
                            Rs[Math.round(Rs.length / 2) - 1];
                        let Gs = [
                            context.getImageData(i, j, 1, 1).data[1],
                            context.getImageData(i, j - 1, 1, 1).data[1],
                            context.getImageData(i, j + 1, 1, 1).data[1],
                            context.getImageData(i - 1, j, 1, 1).data[1],
                            context.getImageData(i - 1, j - 1, 1, 1).data[1],
                            context.getImageData(i - 1, j + 1, 1, 1).data[1]
                        ];
                        Gs = Gs.sort((a, b) => a - b);
                        G = Gs.length % 2 === 0 ?
                            Math.round((Gs[Gs.length / 2 - 1] + Gs[Gs.length / 2]) / 2) :
                            Gs[Math.round(Gs.length / 2) - 1];
                        let Bs = [
                            context.getImageData(i, j, 1, 1).data[2],
                            context.getImageData(i, j - 1, 1, 1).data[2],
                            context.getImageData(i, j + 1, 1, 1).data[2],
                            context.getImageData(i - 1, j, 1, 1).data[2],
                            context.getImageData(i - 1, j - 1, 1, 1).data[2],
                            context.getImageData(i - 1, j + 1, 1, 1).data[2]
                        ];
                        Bs = Bs.sort((a, b) => a - b);
                        B = Bs.length % 2 === 0 ?
                            Math.round((Bs[Bs.length / 2 - 1] + Bs[Bs.length / 2]) / 2) :
                            Bs[Math.round(Bs.length / 2) - 1];
                    } else if (j === canvas.height - 1) {
                        let Rs = [
                            context.getImageData(i, j, 1, 1).data[0],
                            context.getImageData(i, j - 1, 1, 1).data[0],
                            context.getImageData(i - 1, j, 1, 1).data[0],
                            context.getImageData(i - 1, j - 1, 1, 1).data[0]
                        ];
                        Rs = Rs.sort((a, b) => a - b);
                        R = Rs.length % 2 === 0 ?
                            Math.round((Rs[Rs.length / 2 - 1] + Rs[Rs.length / 2]) / 2) :
                            Rs[Math.round(Rs.length / 2) - 1];
                        let Gs = [
                            context.getImageData(i, j, 1, 1).data[1],
                            context.getImageData(i, j - 1, 1, 1).data[1],
                            context.getImageData(i - 1, j, 1, 1).data[1],
                            context.getImageData(i - 1, j - 1, 1, 1).data[1]
                        ];
                        Gs = Gs.sort((a, b) => a - b);
                        G = Gs.length % 2 === 0 ?
                            Math.round((Gs[Gs.length / 2 - 1] + Gs[Gs.length / 2]) / 2) :
                            Gs[Math.round(Gs.length / 2) - 1];
                        let Bs = [
                            context.getImageData(i, j, 1, 1).data[2],
                            context.getImageData(i, j - 1, 1, 1).data[2],
                            context.getImageData(i - 1, j, 1, 1).data[2],
                            context.getImageData(i - 1, j - 1, 1, 1).data[2]
                        ];
                        Bs = Bs.sort((a, b) => a - b);
                        B = Bs.length % 2 === 0 ?
                            Math.round((Bs[Bs.length / 2 - 1] + Bs[Bs.length / 2]) / 2) :
                            Bs[Math.round(Bs.length / 2) - 1];
                    }
                }
                filteredImage[i][j][0] = R;
                filteredImage[i][j][1] = G;
                filteredImage[i][j][2] = B;
            }
        }
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const pixel = context.getImageData(i, j, 1, 1);
                pixel.data[0] = filteredImage[i][j][0];
                pixel.data[1] = filteredImage[i][j][1];
                pixel.data[2] = filteredImage[i][j][2];
                context.putImageData(pixel, i, j);
            }
        }
        const stop = Date.now();
        console.log(stop - start);
    };







    const detectEdges = () => {
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const pixel = context.getImageData(i, j, 1, 1);
                const [
                    r,
                    g,
                    b
                ] = pixel.data;
                let edge = false;
                if (j + 1 < canvas.height) {
                    const downPixel = context.getImageData(i, j + 1, 1, 1);
                    const [
                        downR,
                        downB,
                        downG
                    ] = downPixel.data;
                    if (Math.min(Math.abs(r - downR), Math.abs(g - downG), Math.abs(b - downB)) > 15) {
                        edge = true;
                    }
                }
                if (i + 1 < canvas.width) {
                    const rightPixel = context.getImageData(i + 1, j, 1, 1);
                    const [
                        rightR,
                        rightG,
                        rightB
                    ] = rightPixel.data;
                    if (Math.min(Math.abs(r - rightR), Math.abs(g - rightG), Math.abs(b - rightB)) > 15) {
                        edge = true;
                    }
                }
                if (edge) {
                    pixel.data[0] = pixel.data[1] = pixel.data[2] = 255;
                } else {
                    pixel.data[0] = pixel.data[1] = pixel.data[2] = 0;
                }
                context.putImageData(pixel, i, j);
            }
        }
    };

    const sharpenFilter = () => {
        const start = Date.now();
        const filteredImage = [];
        for (let i = 0; i < canvas.width; i++) {
            filteredImage[i] = [];
            for (let j = 0; j < canvas.height; j++) {
                filteredImage[i][j] = [];
                let R, G, B;
                if (i === 0) {
                    if (j === 0) {
                        R = Math.round((
                            9 * context.getImageData(i, j, 1, 1).data[0] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[0] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[0] +
                            -1 * context.getImageData(i + 1, j + 1, 1, 1).data[0]) / 6);
                        G = Math.round((
                            9 * context.getImageData(i, j, 1, 1).data[1] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[1] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[1] +
                            -1 * context.getImageData(i + 1, j + 1, 1, 1).data[1]) / 6);
                        B = Math.round((
                            9 * context.getImageData(i, j, 1, 1).data[2] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[2] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[2] +
                            -1 * context.getImageData(i + 1, j + 1, 1, 1).data[2]) / 6);
                    } else if (j < canvas.height - 1) {
                        R = Math.round((
                            -1 * context.getImageData(i, j - 1, 1, 1).data[0] +
                            9 * context.getImageData(i, j, 1, 1).data[0] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[0] +
                            -1 * context.getImageData(i + 1, j - 1, 1, 1).data[0] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[0] +
                            -1 * context.getImageData(i + 1, j + 1, 1, 1).data[0]) / 4);
                        G = Math.round((
                            -1 * context.getImageData(i, j - 1, 1, 1).data[1] +
                            9 * context.getImageData(i, j, 1, 1).data[1] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[1] +
                            -1 * context.getImageData(i + 1, j - 1, 1, 1).data[1] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[1] +
                            -1 * context.getImageData(i + 1, j + 1, 1, 1).data[1]) / 4);
                        B = Math.round((
                            context.getImageData(i, j - 1, 1, 1).data[2] +
                            context.getImageData(i, j, 1, 1).data[2] +
                            context.getImageData(i, j + 1, 1, 1).data[2] +
                            context.getImageData(i + 1, j - 1, 1, 1).data[2] +
                            context.getImageData(i + 1, j, 1, 1).data[2] +
                            context.getImageData(i + 1, j + 1, 1, 1).data[2]) / 4);
                    } else if (j === canvas.height - 1) {
                        R = Math.round((
                            -1 * context.getImageData(i, j - 1, 1, 1).data[0] +
                            9 * context.getImageData(i, j, 1, 1).data[0] +
                            -1 * context.getImageData(i + 1, j - 1, 1, 1).data[0] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[0]) / 6);
                        G = Math.round((
                            -1 * context.getImageData(i, j - 1, 1, 1).data[1] +
                            9 * context.getImageData(i, j, 1, 1).data[1] +
                            -1 * context.getImageData(i + 1, j - 1, 1, 1).data[1] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[1]) / 6);
                        B = Math.round((
                            -1 * context.getImageData(i, j - 1, 1, 1).data[2] +
                            9 * context.getImageData(i, j, 1, 1).data[2] +
                            -1 * context.getImageData(i + 1, j - 1, 1, 1).data[2] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[2]) / 6);
                    }
                } else if (i < canvas.width - 1) {
                    if (j === 0) {
                        R = Math.round((
                            -1 * context.getImageData(i - 1, j, 1, 1).data[0] +
                            -1 *  context.getImageData(i - 1, j + 1, 1, 1).data[0] +
                            9 * context.getImageData(i, j, 1, 1).data[0] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[0] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[0] +
                            -1 * context.getImageData(i + 1, j + 1, 1, 1).data[0]) / 4);
                        G = Math.round((
                            -1 * context.getImageData(i - 1, j, 1, 1).data[1] +
                            -1 * context.getImageData(i - 1, j + 1, 1, 1).data[1] +
                            9 * context.getImageData(i, j, 1, 1).data[1] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[1] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[1] +
                            -1 * context.getImageData(i + 1, j + 1, 1, 1).data[1]) / 4);
                        B = Math.round((
                            -1 * context.getImageData(i - 1, j, 1, 1).data[2] +
                            -1 * context.getImageData(i - 1, j + 1, 1, 1).data[2] +
                            9 * context.getImageData(i, j, 1, 1).data[2] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[2] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[2] +
                            -1 * context.getImageData(i + 1, j + 1, 1, 1).data[2]) / 4);
                    } else if (j < canvas.height - 1) {
                        R = Math.round((
                            -1 * context.getImageData(i - 1, j - 1, 1, 1).data[0] +
                            -1 * context.getImageData(i - 1, j, 1, 1).data[0] +
                            -1 * context.getImageData(i - 1, j + 1, 1, 1).data[0] +
                            -1 * context.getImageData(i, j - 1, 1, 1).data[0] +
                            9 * context.getImageData(i, j, 1, 1).data[0] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[0] +
                            -1 * context.getImageData(i + 1, j - 1, 1, 1).data[0] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[0] +
                            -1 * context.getImageData(i + 1, j + 1, 1, 1).data[0]));
                        G = Math.round((
                            -1 * context.getImageData(i - 1, j - 1, 1, 1).data[1] +
                            -1 * context.getImageData(i - 1, j, 1, 1).data[1] +
                            -1 * context.getImageData(i - 1, j + 1, 1, 1).data[1] +
                            -1 * context.getImageData(i, j - 1, 1, 1).data[1] +
                            9 * context.getImageData(i, j, 1, 1).data[1] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[1] +
                            -1 * context.getImageData(i + 1, j - 1, 1, 1).data[1] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[1] +
                            -1 * context.getImageData(i + 1, j + 1, 1, 1).data[1]));
                        B = Math.round((
                            -1 * context.getImageData(i - 1, j - 1, 1, 1).data[2] +
                            -1 * context.getImageData(i - 1, j, 1, 1).data[2] +
                            -1 * context.getImageData(i - 1, j + 1, 1, 1).data[2] +
                            -1 * context.getImageData(i, j - 1, 1, 1).data[2] +
                            9 * context.getImageData(i, j, 1, 1).data[2] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[2] +
                            -1 * context.getImageData(i + 1, j - 1, 1, 1).data[2] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[2] +
                            -1 * context.getImageData(i + 1, j + 1, 1, 1).data[2]));
                    } else if (j === canvas.height - 1) {
                        R = Math.round((
                            -1 * context.getImageData(i - 1, j, 1, 1).data[0] +
                            -1 * context.getImageData(i - 1, j - 1, 1, 1).data[0] +
                            9 * context.getImageData(i, j, 1, 1).data[0] +
                            -1 * context.getImageData(i, j - 1, 1, 1).data[0] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[0] +
                            -1 * context.getImageData(i + 1, j - 1, 1, 1).data[0]) / 4);
                        G = Math.round((
                            -1 * context.getImageData(i - 1, j, 1, 1).data[1] +
                            -1 * context.getImageData(i - 1, j - 1, 1, 1).data[1] +
                            9 * context.getImageData(i, j, 1, 1).data[1] +
                            -1 * context.getImageData(i, j - 1, 1, 1).data[1] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[1] +
                            -1 * context.getImageData(i + 1, j - 1, 1, 1).data[1]) / 4);
                        B = Math.round((
                            -1 * context.getImageData(i - 1, j, 1, 1).data[2] +
                            -1 * context.getImageData(i - 1, j - 1, 1, 1).data[2] +
                            9 * context.getImageData(i, j, 1, 1).data[2] +
                            -1 * context.getImageData(i, j - 1, 1, 1).data[2] +
                            -1 * context.getImageData(i + 1, j, 1, 1).data[2] +
                            -1 * context.getImageData(i + 1, j - 1, 1, 1).data[2]) / 4);
                    }
                } else if (i === canvas.width - 1) {
                    if (j === 0) {
                        R = Math.round((
                            9 * context.getImageData(i, j, 1, 1).data[0] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[0] +
                            -1 * context.getImageData(i - 1, j, 1, 1).data[0] +
                            -1 * context.getImageData(i - 1, j + 1, 1, 1).data[0]) / 6);
                        G = Math.round((
                            9 * context.getImageData(i, j, 1, 1).data[1] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[1] +
                            -1 * context.getImageData(i - 1, j, 1, 1).data[1] +
                            -1 * context.getImageData(i - 1, j + 1, 1, 1).data[1]) / 6);
                        B = Math.round((
                            9 * context.getImageData(i, j, 1, 1).data[2] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[2] +
                            -1 * context.getImageData(i - 1, j, 1, 1).data[2] +
                            -1 * context.getImageData(i - 1, j + 1, 1, 1).data[2]) / 6);
                    } else if (j < canvas.height - 1) {
                        R = Math.round((
                            -1 * context.getImageData(i, j - 1, 1, 1).data[0] +
                            9 * context.getImageData(i, j, 1, 1).data[0] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[0] +
                            -1 * context.getImageData(i - 1, j - 1, 1, 1).data[0] +
                            -1 * context.getImageData(i - 1, j, 1, 1).data[0] +
                            -1 * context.getImageData(i - 1, j + 1, 1, 1).data[0]) / 4);
                        G = Math.round((
                            -1 * context.getImageData(i, j - 1, 1, 1).data[1] +
                            9 * context.getImageData(i, j, 1, 1).data[1] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[1] +
                            -1 * context.getImageData(i - 1, j - 1, 1, 1).data[1] +
                            -1 * context.getImageData(i - 1, j, 1, 1).data[1] +
                            -1 * context.getImageData(i - 1, j + 1, 1, 1).data[1]) / 4);
                        B = Math.round((
                            -1 * context.getImageData(i, j - 1, 1, 1).data[2] +
                            9 * context.getImageData(i, j, 1, 1).data[2] +
                            -1 * context.getImageData(i, j + 1, 1, 1).data[2] +
                            -1 * context.getImageData(i - 1, j - 1, 1, 1).data[2] +
                            -1 * context.getImageData(i - 1, j, 1, 1).data[2] +
                            -1 * context.getImageData(i - 1, j + 1, 1, 1).data[2]) / 4);
                    } else if (j === canvas.height - 1) {
                        R = Math.round((
                            -1 * context.getImageData(i, j - 1, 1, 1).data[0] +
                            9 * context.getImageData(i, j, 1, 1).data[0] +
                            -1 * context.getImageData(i - 1, j - 1, 1, 1).data[0] +
                            -1 * context.getImageData(i - 1, j, 1, 1).data[0]) / 6);
                        G = Math.round((
                            -1 * context.getImageData(i, j - 1, 1, 1).data[1] +
                            9 * context.getImageData(i, j, 1, 1).data[1] +
                            -1 * context.getImageData(i - 1, j - 1, 1, 1).data[1] +
                            -1 * context.getImageData(i - 1, j, 1, 1).data[1]) / 6);
                        B = Math.round((
                            -1 * context.getImageData(i, j - 1, 1, 1).data[2] +
                            9 * context.getImageData(i, j, 1, 1).data[2] +
                            -1 * context.getImageData(i - 1, j - 1, 1, 1).data[2] +
                            -1 * context.getImageData(i - 1, j, 1, 1).data[2]) / 6);
                    }
                }
                filteredImage[i][j][0] = R;
                filteredImage[i][j][1] = G;
                filteredImage[i][j][2] = B;
            }
        }
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const pixel = context.getImageData(i, j, 1, 1);
                pixel.data[0] = filteredImage[i][j][0];
                pixel.data[1] = filteredImage[i][j][1];
                pixel.data[2] = filteredImage[i][j][2];
                context.putImageData(pixel, i, j);
            }
        }
        const stop = Date.now();
        console.log(stop - start);
    };

});
