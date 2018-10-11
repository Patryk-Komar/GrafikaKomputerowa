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
        const r = parseInt($("#rgb-number-r").val()).toString(16);
        const g = parseInt($("#rgb-number-g").val()).toString(16);
        const b = parseInt($("#rgb-number-b").val()).toString(16);
        const rgbColor = `#${r}${g}${b}`;
        console.log(rgbColor);
        const hexColorRegex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
        if (hexColorRegex.test(rgbColor)) {
            $("div#rgb-color-numbers").css("background", rgbColor);
        } else {
            alert("Please enter correct hexadecimal color!");
            return;
        }
    });

});
