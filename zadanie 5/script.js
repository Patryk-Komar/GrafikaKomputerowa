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

    $("#canvas").click(() => {
        extendHistogram();
    });

    updateLUT = (a, b, array) => {
        for (let i = 0; i < 256; i++) {
            if ((a * (i + b)) > 255)
                array[i] = 255;
            else if ((a * (i + b)) < 0)
                array[i] = 0;
            else
                array[i] = (a * (i + b));
        }
    };

    const extendHistogram = () => {
        let Rmax = 0;
        let Gmax = 0;
        let Bmax = 0;
        let Rmin = 255;
        let Gmin = 255;
        let Bmin = 255;
        const LUTR = [];
        const LUTG = [];
        const LUTB = [];
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                /*
                const pixelData = context.getImageData(i, j, 1, 1);
                const Imax = 255;
                const Vmin = Math.min(pixelData.data[0], pixelData.data[1], pixelData.data[2]);
                const Vmax = Math.max(pixelData.data[0], pixelData.data[1], pixelData.data[2]);
                if (Vmin !== Vmax) {
                    const ratio = Imax / (Vmax - Vmin);
                    pixelData.data[0] = pixelData.data[0] * ratio * (pixelData.data[0] - Vmin);
                    pixelData.data[1] = pixelData.data[1] * ratio * (pixelData.data[1] - Vmin);
                    pixelData.data[2] = pixelData.data[2] * ratio * (pixelData.data[2] - Vmin);
                    context.putImageData(pixelData, i, j);
                }
                */
                const pixel = context.getImageData(i, j, 1, 1);
                if (pixel.data[0] > Rmax) {
                    Rmax = pixel.data[0];
                }
                if (pixel.data[1] > Gmax) {
                    Gmax = pixel.data[1];
                }
                if (pixel.data[2] > Bmax) {
                    Bmax = pixel.data[2];
                }
                if (pixel.data[0] < Rmin) {
                    Rmin = pixel.data[0];
                }
                if (pixel.data[1] < Gmin) {
                    Gmin = pixel.data[1];
                }
                if (pixel.data[2] < Bmin) {
                    Bmin = pixel.data[2];
                }
            }
        }
        updateLUT(255 / (Rmax - Rmin), -1 * Rmin, LUTR);
        updateLUT(255 / (Gmax - Gmin), -1 * Gmin, LUTG);
        updateLUT(255 / (Bmax - Bmin), -1 * Bmin, LUTB);
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const pixel = context.getImageData(i, j, 1, 1);
                pixel.data[0] = LUTR[pixel.data[0]];
                pixel.data[1] = LUTG[pixel.data[1]];
                pixel.data[2] = LUTB[pixel.data[2]];
                context.putImageData(pixel, i, j);
            }
        }
        console.log(Rmin,Gmin,Bmin,Rmax,Gmax,Bmax);
    };

});
