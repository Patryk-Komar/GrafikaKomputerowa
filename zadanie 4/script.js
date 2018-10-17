$(() => {

    const canvas = $("#canvas")[0];
    const context = canvas.getContext("2d");

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
        }
    }

    const color = "#5599ff";

    $('#canvas').click(event => {
        const posX = $("#canvas").position().left;
        const posY = $("#canvas").position().top;
        const x = event.pageX - posX;
        const y = event.pageY - posY;

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

    });

});
