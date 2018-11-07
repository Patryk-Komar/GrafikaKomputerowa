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

    $("#laplace-filter").click(() => {
        applyLaplaceFilter();
    });

    $("#minimum-filter").click(() => {
        applyMinimumFilter();
    });

    $("#maximum-filter").click(() => {
        applyMaximumFilter();
    });

    $("#reset").click(() => {
        handleFile(loadedFile);
    });

    const applyLaplaceFilter = () => {
        const newImage = [];
        for (let i = 1; i < canvas.width - 1; i++) {
            newImage[i] = [];
            for (let j = 1; j < canvas.height - 1; j++) {
                const R = Math.round((
                    -1 * context.getImageData(i - 1, j - 1, 1, 1).data[0] +
                    -1 * context.getImageData(i - 1, j, 1, 1).data[0] +
                    -1 * context.getImageData(i - 1, j + 1, 1, 1).data[0] +
                    -1 * context.getImageData(i, j - 1, 1, 1).data[0] +
                    8 * context.getImageData(i, j, 1, 1).data[0] +
                    -1 * context.getImageData(i, j + 1, 1, 1).data[0] +
                    -1 * context.getImageData(i + 1, j - 1, 1, 1).data[0] +
                    -1 * context.getImageData(i + 1, j, 1, 1).data[0] +
                    -1 * context.getImageData(i + 1, j + 1, 1, 1).data[0]) / 9);
                const G = Math.round((
                    -1 * context.getImageData(i - 1, j - 1, 1, 1).data[1] +
                    -1 * context.getImageData(i - 1, j, 1, 1).data[1] +
                    -1 * context.getImageData(i - 1, j + 1, 1, 1).data[1] +
                    -1 * context.getImageData(i, j - 1, 1, 1).data[1] +
                    8 * context.getImageData(i, j, 1, 1).data[1] +
                    -1 * context.getImageData(i, j + 1, 1, 1).data[1] +
                    -1 * context.getImageData(i + 1, j - 1, 1, 1).data[1] +
                    -1 * context.getImageData(i + 1, j, 1, 1).data[1] +
                    -1 * context.getImageData(i + 1, j + 1, 1, 1).data[1]) / 9);
                const B = Math.round((
                    -1 * context.getImageData(i - 1, j - 1, 1, 1).data[2] +
                    -1 * context.getImageData(i - 1, j, 1, 1).data[2] +
                    -1 * context.getImageData(i - 1, j + 1, 1, 1).data[2] +
                    -1 * context.getImageData(i, j - 1, 1, 1).data[2] +
                    8 * context.getImageData(i, j, 1, 1).data[2] +
                    -1 * context.getImageData(i, j + 1, 1, 1).data[2] +
                    -1 * context.getImageData(i + 1, j - 1, 1, 1).data[2] +
                    -1 * context.getImageData(i + 1, j, 1, 1).data[2] +
                    -1 * context.getImageData(i + 1, j + 1, 1, 1).data[2]) / 9);
                newImage[i][j] = { R, G, B };
            }
        }
        for (let i = 1; i < canvas.width - 1; i++) {
            for (let j = 1; j < canvas.height - 1; j++) {
                const pixel = context.getImageData(i, j, 1, 1);
                pixel.data[0] = newImage[i][j].R;
                pixel.data[1] = newImage[i][j].G;
                pixel.data[2] = newImage[i][j].B;
                context.putImageData(pixel, i, j);
            }
        }
    };

    const applyMinimumFilter = () => {
        const newImage = [];
        for (let i = 0; i < canvas.width; i++) {
            newImage[i] = [];
            for (let j = 0; j < canvas.height; j++) {
                const R = Math.min(
                    context.getImageData(i - 1, j - 1, 1, 1).data[0],
                    context.getImageData(i - 1, j, 1, 1).data[0],
                    context.getImageData(i - 1, j + 1, 1, 1).data[0],
                    context.getImageData(i, j - 1, 1, 1).data[0],
                    context.getImageData(i, j, 1, 1).data[0],
                    context.getImageData(i, j + 1, 1, 1).data[0],
                    context.getImageData(i + 1, j - 1, 1, 1).data[0],
                    context.getImageData(i + 1, j, 1, 1).data[0],
                    context.getImageData(i + 1, j + 1, 1, 1).data[0]);
                const G = Math.min(
                    context.getImageData(i - 1, j - 1, 1, 1).data[1],
                    context.getImageData(i - 1, j, 1, 1).data[1],
                    context.getImageData(i - 1, j + 1, 1, 1).data[1],
                    context.getImageData(i, j - 1, 1, 1).data[1],
                    context.getImageData(i, j, 1, 1).data[1],
                    context.getImageData(i, j + 1, 1, 1).data[1],
                    context.getImageData(i + 1, j - 1, 1, 1).data[1],
                    context.getImageData(i + 1, j, 1, 1).data[1],
                    context.getImageData(i + 1, j + 1, 1, 1).data[1]);
                const B = Math.min(
                    context.getImageData(i - 1, j - 1, 1, 1).data[2],
                    context.getImageData(i - 1, j, 1, 1).data[2],
                    context.getImageData(i - 1, j + 1, 1, 1).data[2],
                    context.getImageData(i, j - 1, 1, 1).data[2],
                    context.getImageData(i, j, 1, 1).data[2],
                    context.getImageData(i, j + 1, 1, 1).data[2],
                    context.getImageData(i + 1, j - 1, 1, 1).data[2],
                    context.getImageData(i + 1, j, 1, 1).data[2],
                    context.getImageData(i + 1, j + 1, 1, 1).data[2]);
                newImage[i][j] = { R, G, B };
            }
        }
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const pixel = context.getImageData(i, j, 1, 1);
                pixel.data[0] = newImage[i][j].R;
                pixel.data[1] = newImage[i][j].G;
                pixel.data[2] = newImage[i][j].B;
                context.putImageData(pixel, i, j);
            }
        }
    };

    const applyMaximumFilter = () => {
        const newImage = [];
        for (let i = 0; i < canvas.width; i++) {
            newImage[i] = [];
            for (let j = 0; j < canvas.height; j++) {
                const R = Math.max(
                    context.getImageData(i - 1, j - 1, 1, 1).data[0],
                    context.getImageData(i - 1, j, 1, 1).data[0],
                    context.getImageData(i - 1, j + 1, 1, 1).data[0],
                    context.getImageData(i, j - 1, 1, 1).data[0],
                    context.getImageData(i, j, 1, 1).data[0],
                    context.getImageData(i, j + 1, 1, 1).data[0],
                    context.getImageData(i + 1, j - 1, 1, 1).data[0],
                    context.getImageData(i + 1, j, 1, 1).data[0],
                    context.getImageData(i + 1, j + 1, 1, 1).data[0]);
                const G = Math.max(
                    context.getImageData(i - 1, j - 1, 1, 1).data[1],
                    context.getImageData(i - 1, j, 1, 1).data[1],
                    context.getImageData(i - 1, j + 1, 1, 1).data[1],
                    context.getImageData(i, j - 1, 1, 1).data[1],
                    context.getImageData(i, j, 1, 1).data[1],
                    context.getImageData(i, j + 1, 1, 1).data[1],
                    context.getImageData(i + 1, j - 1, 1, 1).data[1],
                    context.getImageData(i + 1, j, 1, 1).data[1],
                    context.getImageData(i + 1, j + 1, 1, 1).data[1]);
                const B = Math.max(
                    context.getImageData(i - 1, j - 1, 1, 1).data[2],
                    context.getImageData(i - 1, j, 1, 1).data[2],
                    context.getImageData(i - 1, j + 1, 1, 1).data[2],
                    context.getImageData(i, j - 1, 1, 1).data[2],
                    context.getImageData(i, j, 1, 1).data[2],
                    context.getImageData(i, j + 1, 1, 1).data[2],
                    context.getImageData(i + 1, j - 1, 1, 1).data[2],
                    context.getImageData(i + 1, j, 1, 1).data[2],
                    context.getImageData(i + 1, j + 1, 1, 1).data[2]);
                newImage[i][j] = { R, G, B };
            }
        }
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const pixel = context.getImageData(i, j, 1, 1);
                pixel.data[0] = newImage[i][j].R;
                pixel.data[1] = newImage[i][j].G;
                pixel.data[2] = newImage[i][j].B;
                context.putImageData(pixel, i, j);
            }
        }
    };

});
