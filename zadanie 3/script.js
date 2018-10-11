$(() => {

    $("#rgb-button-text").click(() => {
        const rgbColor = $("#rgb-text").val();
        const rgbColorRegex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
        if (rgbColorRegex.test(rgbColor)) {
            $("div#rgb-color-text").css("background", rgbColor);
        } else {
            alert("Please enter correct hexadecimal color!");
            return;
        }
    });

    $("#rgb-button-numbers").click(() => {
        let r = parseInt($("#rgb-number-r").val()).toString(16);
        let g = parseInt($("#rgb-number-g").val()).toString(16);
        let b = parseInt($("#rgb-number-b").val()).toString(16);
        if (r.length === 1) {
            r = `0${r}`;
        }
        if (g.length === 1) {
            g = `0${g}`;
        }
        if (b.length === 1) {
            b = `0${b}`;
        }
        const rgbColor = `#${r}${g}${b}`;
        const hexColorRegex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
        if (hexColorRegex.test(rgbColor)) {
            $("div#rgb-color-numbers").css("background", rgbColor);
        } else {
            alert("Please enter correct hexadecimal color!");
            return;
        }
    });

    $("#cmyk-button").click(() => {
        let c = $("#cmyk-slider-c").val();
        let m = $("#cmyk-slider-m").val();
        let y = $("#cmyk-slider-y").val();
        let k = $("#cmyk-slider-k").val();
        console.log(c, m, y, k);
    });
    console.log("#65586b");
    const x = convertRGB("65586b");
    convertCMYK(x);

});

const convertRGB = (rgb) => {
    const R = parseInt(rgb.substr(0,2), 16) / 255;
    const G = parseInt(rgb.substr(2,2), 16) / 255;
    const B = parseInt(rgb.substr(4,2), 16) / 255;
    let K = 1 - Math.max(R, G, B);
    const C = Math.round(100 * (1 - R - K) / (1 - K));
    const M = Math.round(100 * (1 - G - K) / (1 - K));
    const Y = Math.round(100 * (1 - B - K) / (1 - K));
    K = Math.round(100 * K);
    return {
        C,
        M,
        Y,
        K
    }
};

const convertCMYK = (cmyk) => {
    const {
        C,
        M,
        Y,
        K
    } = cmyk;
    const R = (Math.round(255 * ( 1 - C / 100 ) * ( 1 - K / 100 ))).toString(16);
    const G = (Math.round(255 * ( 1 - M / 100 ) * ( 1 - K / 100 ))).toString(16);
    const B = (Math.round(255 * ( 1 - Y / 100 ) * ( 1 - K / 100 ))).toString(16);
    if (R.length === 1) {
        R = `0${R}`;
    }
    if (G.length === 1) {
        G = `0${G}`;
    }
    if (B.length === 1) {
        B = `0${B}`;
    }
    console.log(`#${R}${G}${B}`);
};
