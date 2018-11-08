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

    $("#binarization-entropy-selection").click(() => {
        const entropyThreshold = $("#entropy-threshold").val();
        entropySelection(entropyThreshold);
    });

    const updateExtensionLUT = (a, b, LUT) => {
        for (let i = 0; i < 256; i++) {
            if ((a * (i + b)) > 255) {
                LUT[i] = 255;
            } else if ((a * (i + b)) < 0) {
                LUT[i] = 0;
            } else {
                LUT[i] = (a * (i + b));
            }
        }
    };

    const updateEqualizationLUT = (array, LUT) => {
        let i = 0;
        let D0min;
        while (array[i] == 0){
            i++;
        }
        D0min = array[i];
        for (i = 0; i < 256; i++) {
            LUT[i] = (((array[i] - D0min) / (1 - D0min)) * (256 - 1));
        }
    };

    const getMinMaxValues = () => {
        let Rmin, Gmin, Bmin, Rmax, Gmax, Bmax;
        Rmin = Gmin = Bmin = 255;
        Rmax = Gmax = Bmax = 0;
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const [
                    r,
                    g,
                    b
                ] = context.getImageData(i, j, 1, 1).data;
                if (r < Rmin) {
                    Rmin = r;
                }
                if (g < Gmin) {
                    Gmin = g;
                }
                if (b < Bmin) {
                    Bmin = b;
                }
                if (r > Rmax) {
                    Rmax = r;
                }
                if (g > Gmax) {
                    Gmax = g;
                }
                if (b > Bmax) {
                    Bmax = b;
                }
            }
        }
        return {
            Rmin,
            Gmin,
            Bmin,
            Rmax,
            Gmax,
            Bmax
        };
    };

    const createGrayscaleHistogram = () => {
        const grayscaleArray = [];
        const grayscalePixels = [];
        const numberOfPixels = canvas.width * canvas.height;
        for (let i = 0; i < 256; i++) {
            grayscaleArray[i] = 0;
        }
        for (let i = 0; i < canvas.width; i++) {
            grayscalePixels[i] = [];
            for (let j = 0; j < canvas.height; j++) {
                const [
                    r,
                    g,
                    b
                ] = context.getImageData(i, j, 1, 1).data;
                const pixelGrayscale = Math.round((0.299 * r + 0.587 * g + 0.114 * b));
                grayscalePixels[i][j] = pixelGrayscale;
                grayscaleArray[pixelGrayscale]++;
            }
        }
        const grayscaleProbability = [];
        for (let i = 0; i < 256; i++) {
            grayscaleProbability[i] = grayscaleArray[i] / numberOfPixels;
        }
        return {
            grayscaleArray,
            grayscalePixels,
            grayscaleProbability
        };
    };

    const entropySelection = (thresholdValue) => {
        const {
            grayscalePixels,
            grayscaleProbability
        } = createGrayscaleHistogram();
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const pixel = context.getImageData(i, j, 1, 1);
                let entropy = 0;
                for (let k = 0; k < 256; k++) {
                    entropy += grayscaleProbability[grayscalePixels[i][j]] * Math.log2(grayscaleProbability[grayscalePixels[i][j]]);
                }
                entropy *= -1;
                if (entropy <= thresholdValue) {
                    pixel.data[0] = 0;
                    pixel.data[1] = 0;
                    pixel.data[2] = 0;
                } else {
                    pixel.data[0] = 255;
                    pixel.data[1] = 255;
                    pixel.data[2] = 255;
                }
                context.putImageData(pixel, i, j);
            }
        }
    };

    $("#reset").click(() => {
        handleFile(loadedFile);
    });

});
