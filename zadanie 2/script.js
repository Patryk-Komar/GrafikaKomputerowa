window.addEventListener('DOMContentLoaded', function () {
  var Vue = window.Vue;
  var URL = window.URL || window.webkitURL;
  var ImageCompressor = window.ImageCompressor;

  new Vue({
    el: '#app',

    data: function () {
      var vm = this;

      return {
        options: {
          width: undefined,
          height: undefined,
          quality: 1,
          success: function (file) {
            console.log('Output: ', file);

            if (URL) {
              vm.outputURL = URL.createObjectURL(file);
            }

            vm.output = file;
            vm.$refs.input.value = '';
          },
          error: function (e) {
            window.alert(e.message);
          },
        },
        inputURL: '',
        outputURL: '',
        input: {},
        output: {},
      };
    },

    filters: {
      prettySize: function (size) {
        var kilobyte = 1024;
        var megabyte = kilobyte * kilobyte;

        if (size > megabyte) {
          return (size / megabyte).toFixed(2) + ' MB';
        } else if (size > kilobyte) {
          return (size / kilobyte).toFixed(2) + ' KB';
        } else if (size >= 0) {
          return size + ' B';
        }

        return 'N/A';
      },
    },

    methods: {
      compress: function (file) {
        if (!file) {
          return;
        }

        console.log('Input: ', file);

        if (URL) {
          this.inputURL = URL.createObjectURL(file);
        }

        this.input = file;
        new ImageCompressor(file, this.options);
      },

      change: function (e) {
        this.compress(e.target.files ? e.target.files[0] : null);
      },

      dragover: function(e) {
        e.preventDefault();
      },

      drop: function(e) {
        e.preventDefault();
        this.compress(e.dataTransfer.files ? e.dataTransfer.files[0] : null);
      },
    },
  });

  $("button#colors-scaling-button").click(scaleColors);

});

const scaleColors = () => {
  let colorA = $("#color-A").val();
  let colorB = $("#color-B").val();
  const rgbColorRegex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
  if (!rgbColorRegex.test(colorA) || !rgbColorRegex.test(colorB)) {
    alert("Please enter correct RGB colors!");
    return;
  }

  colorA = colorA.replace("#", "");
  colorB = colorB.replace("#", "");

  const x = 500;

  const r_difference = (parseInt(colorB.substr(0,2), 16) - parseInt(colorA.substr(0,2), 16)) / x;
  const g_difference = (parseInt(colorB.substr(2,2), 16) - parseInt(colorA.substr(2,2), 16)) / x;
  const b_difference = (parseInt(colorB.substr(4,2), 16) - parseInt(colorA.substr(4,2), 16)) / x;

  let current_r = parseInt(colorA.substr(0,2), 16);
  let current_g = parseInt(colorA.substr(2,2), 16);
  let current_b = parseInt(colorA.substr(4,2), 16);

  let width = parseInt($("body").css("width").replace("px", ""));
  width = 0.8 * width / x;
  console.log(width);
  
  const style = `display: inline-block; height: 100px; margin-bottom: -8px; width: ${width}px;`

  let content = `<div style="background: #${colorA}; ${style}"></div>`;

  for (let i = 1; i <= x; i++) {
      current_r += r_difference;
      current_g += g_difference;
      current_b += b_difference;
      let rr = Math.round(current_r).toString(16);
      let gg = Math.round(current_g).toString(16);
      let bb = Math.round(current_b).toString(16);
      if (rr.length === 1) {
        rr = `0${rr}`;
      }
      if (gg.length === 1) {
        gg = `0${gg}`;
      }
      if (bb.length === 1) {
        bb = `0${bb}`;
      }
      const hexColor = `${rr}${gg}${bb}`;
      content += `<div style="background: #${hexColor}; ${style}"></div>`;
  }
  $("#colors-scaling-bar").css("border", "2px solid white");
  $("#colors-scaling-bar").html(content);
};
