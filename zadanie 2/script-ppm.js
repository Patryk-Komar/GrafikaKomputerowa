(function () {	
	
	
	var Image = function (data) {
		
		var exp = /^(\S+)\s+(\#.*?\n)*\s*(\d+)\s+(\d+)\s+(\d+)?\s*/,
			match = data.match (exp);

		if (match) {
			var width = this.width = parseInt (match[3], 10),
				height = this.height = parseInt (match[4], 10),
				maxVal = parseInt (match[5], 10),
				bytes = (maxVal < 256)? 1 : 2,
				data = data.substr (match[0].length);

			switch (match[1]) {
				
				case 'P1':
					this._parser = new ASCIIParser (maxVal + ' ' + data, bytes);
					this._formatter = new PBMFormatter (width, height);
					break;

				case 'P2':
					this._parser = new ASCIIParser (data, bytes);
					this._formatter = new PGMFormatter (width, height, maxVal);
					break;

				case 'P3':
					this._parser = new ASCIIParser (data, bytes);
					this._formatter = new PPMFormatter (width, height, maxVal);
					break;

				case 'P4':
					this._parser = new BinaryParser (data, bytes);
					this._formatter = new PBMFormatter (width, height);
					break;

				case 'P5':
					this._parser = new BinaryParser (data, bytes);
					this._formatter = new PGMFormatter (width, height, maxVal);
					break;

				case 'P6':
					this._parser = new BinaryParser (data, bytes);
					this._formatter = new PPMFormatter (width, height, maxVal);
					break;
				
				default:
					throw new TypeError ('Sorry, your file format is not supported. [' + match[1] + ']');
					return false;
			}
			
		} else {			
			throw new TypeError ('Sorry, file does not appear to be a Netpbm file.');
			return false;
		}
	};
	
	
	Image.prototype.getPNG = function () {
		var canvas = this._formatter.getCanvas (this._parser);
		return Canvas2Image.saveAsPNG (canvas, true);
	};
	

	
	
	BinaryParser = function (data, bytes) {
		this._data = data;
		this._bytes = bytes;
		this._pointer = 0;
	};
	
	
	BinaryParser.prototype.getNextSample = function () {
		if (this._pointer >= this._data.length) return false;

		var val = 0;
		for (var i = 0; i < this._bytes; i++) {
			val = val * 255 + this._data.charCodeAt (this._pointer++);
		}

		return val;
	};
	

	
	
	ASCIIParser = function (data, bytes) {
		this._data = data.split (/\s+/);
		this._bytes = bytes;
		this._pointer = 0;
	};
	
	
	ASCIIParser.prototype.getNextSample = function () {
		if (this._pointer >= this._data.length) return false;
		
		var val = 0;
		for (var i = 0; i < this._bytes; i++) {
			val = val * 255 + parseInt (this._data[this._pointer++], 10);
		}

		return val;
	};
	
	
	
	PPMFormatter = function (width, height, maxVal) {
		this._width = width;
		this._height = height;
		this._maxVal = maxVal;
	};


	PPMFormatter.prototype.getCanvas = function (parser) {
		var canvas = document.createElement ('canvas'),
			ctx = canvas.getContext ('2d'),
			img;
			
		canvas.width = ctx.width = this._width;
		canvas.height = ctx.height = this._height;

		img = ctx.getImageData (0, 0, this._width, this._height);
		
		for (var row = 0; row < this._height; row++) {
			for (var col = 0; col < this._width; col++) {
				
				var factor = 255 / this._maxVal,
					r = factor * parser.getNextSample (),
					g = factor * parser.getNextSample (),
					b = factor * parser.getNextSample (),
					pos = (row * this._width + col) * 4;

				img.data[pos] = r;
				img.data[pos + 1] = g;
				img.data[pos + 2] = b;
				img.data[pos + 3] = 255;
			}	
		}

		ctx.putImageData (img, 0, 0);
		return canvas;
	};




	PGMFormatter = function (width, height, maxVal) {
		this._width = width;
		this._height = height;
		this._maxVal = maxVal;
	};


	PGMFormatter.prototype.getCanvas = function (parser) {
		var canvas = document.createElement ('canvas'),
			ctx = canvas.getContext ('2d'),
			img;
			
		canvas.width = ctx.width = this._width;
		canvas.height = ctx.height = this._height;

		img = ctx.getImageData (0, 0, this._width, this._height);
		
		for (var row = 0; row < this._height; row++) {
			for (var col = 0; col < this._width; col++) {
				
				var d = parser.getNextSample () * (255 / this._maxVal),
					pos = (row * this._width + col) * 4;

				img.data[pos] = d;
				img.data[pos + 1] = d;
				img.data[pos + 2] = d;
				img.data[pos + 3] = 255;
			}	
		}

		ctx.putImageData (img, 0, 0);
		return canvas;
	};

	


	PBMFormatter = function (width, height) {
		this._width = width;
		this._height = height;
	};


	PBMFormatter.prototype.getCanvas = function (parser) {
		var canvas = document.createElement ('canvas'),
			ctx = canvas.getContext ('2d'),
			img;
		
		if (parser instanceof BinaryParser) {
			var data = '',
				byte,
				bytesPerLine = Math.ceil (this._width / 8);

			for (var i = 0; i < this._height; i++) {
				var line = parser._data.substr (i * bytesPerLine, bytesPerLine),
					lineData = '';

				for (var j = 0; j < line.length; j++) lineData += ('0000000' + line.charCodeAt (j).toString (2)).substr (-8);
				data += lineData.substr (0, this._width);
			}
								
			while ((byte = (parser.getNextSample ())) !== false) {
				data += ('0000000' + byte.toString (2)).substr (-8);
			}

			parser = new ASCIIParser (data.split ('').join (' '), 1);
		}
		
		canvas.width = ctx.width = this._width;
		canvas.height = ctx.height = this._height;

		img = ctx.getImageData (0, 0, this._width, this._height);

		for (var row = 0; row < this._height; row++) {
			for (var col = 0; col < this._width; col++) {
				
				var d = (1 - parser.getNextSample ()) * 255,
					pos = (row * this._width + col) * 4;
				img.data[pos] = d;
				img.data[pos + 1] = d;
				img.data[pos + 2] = d;
				img.data[pos + 3] = 255;
			}	
		}

		ctx.putImageData (img, 0, 0);
		return canvas;
	};

	


	


	
	var landingZone = document.getElementById ('landing-zone'),
		imageList = document.getElementById ('image-list'),
		holder = document.getElementById ('holder');
	

	landingZone.ondragover = function (e) {
		e.preventDefault ();
		return false;	
	};

	
	landingZone.ondrop = function (e) {
		e.preventDefault ();
		
		var outstanding = 0,
			checkOutstanding = function () {
				if (!outstanding) $(landingZone).removeClass ('busy');
			};
			
		$(landingZone).addClass ('busy');
		
		
		for (var i = 0, l = e.dataTransfer.files.length; i < l; i++) {
			outstanding++;
			
			var file = e.dataTransfer.files[i],
				reader = new FileReader();
	
			reader.onload = function (event) {
				var data = event.target.result,
					img;
					
				try {
					img = new Image (data);
					addImage (img);

				} catch (e) {
					alert (e.message);
				}
			
				outstanding--;
				checkOutstanding ();
			};
		
			reader.readAsBinaryString (file);
		}
				
		return false;
	};




	function addImage (img) {
		
		var height = img.height,
			width = img.width,
			png = img.getPNG ();

		$(png).height (0).css ({
			left: '-25px'
		}).animate ({
			top: (-height / 2) + 'px',
			left: '25px',
			height: height + 'px'
		}); 
		
		var $li = $('<li>').append(png).prependTo(imageList);

		var holderHeight = height + 50;
		// if ($(holder).height () < holderHeight) $(holder).animate ({ height: holderHeight + 'px' });

		// var listWidth = $(imageList).width () + width + 25;
		// $(imageList).width (listWidth);

		// $('<span>').css ({paddingLeft:0}).appendTo ($li).animate ({ paddingLeft: width + 'px' });
	}
})();



var Canvas2Image = (function() {

	// check if we have canvas support
	var bHasCanvas = false;
	var oCanvas = document.createElement("canvas");
	if (oCanvas.getContext("2d")) {
		bHasCanvas = true;
	}

	// no canvas, bail out.
	if (!bHasCanvas) {
		return {
			saveAsBMP : function(){},
			saveAsPNG : function(){},
			saveAsJPEG : function(){}
		}
	}

	var bHasImageData = !!(oCanvas.getContext("2d").getImageData);
	var bHasDataURL = !!(oCanvas.toDataURL);
	var bHasBase64 = !!(window.btoa);

	var strDownloadMime = "image/octet-stream";

	// ok, we're good
	var readCanvasData = function(oCanvas) {
		var iWidth = parseInt(oCanvas.width);
		var iHeight = parseInt(oCanvas.height);
		return oCanvas.getContext("2d").getImageData(0,0,iWidth,iHeight);
	}

	// base64 encodes either a string or an array of charcodes
	var encodeData = function(data) {
		var strData = "";
		if (typeof data == "string") {
			strData = data;
		} else {
			var aData = data;
			for (var i=0;i<aData.length;i++) {
				strData += String.fromCharCode(aData[i]);
			}
		}
		return btoa(strData);
	}

	// creates a base64 encoded string containing BMP data
	// takes an imagedata object as argument
	var createBMP = function(oData) {
		var aHeader = [];
	
		var iWidth = oData.width;
		var iHeight = oData.height;

		aHeader.push(0x42); // magic 1
		aHeader.push(0x4D); 
	
		var iFileSize = iWidth*iHeight*3 + 54; // total header size = 54 bytes
		aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
		aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
		aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
		aHeader.push(iFileSize % 256);

		aHeader.push(0); // reserved
		aHeader.push(0);
		aHeader.push(0); // reserved
		aHeader.push(0);

		aHeader.push(54); // dataoffset
		aHeader.push(0);
		aHeader.push(0);
		aHeader.push(0);

		var aInfoHeader = [];
		aInfoHeader.push(40); // info header size
		aInfoHeader.push(0);
		aInfoHeader.push(0);
		aInfoHeader.push(0);

		var iImageWidth = iWidth;
		aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
		aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
		aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
		aInfoHeader.push(iImageWidth % 256);
	
		var iImageHeight = iHeight;
		aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
		aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
		aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
		aInfoHeader.push(iImageHeight % 256);
	
		aInfoHeader.push(1); // num of planes
		aInfoHeader.push(0);
	
		aInfoHeader.push(24); // num of bits per pixel
		aInfoHeader.push(0);
	
		aInfoHeader.push(0); // compression = none
		aInfoHeader.push(0);
		aInfoHeader.push(0);
		aInfoHeader.push(0);
	
		var iDataSize = iWidth*iHeight*3; 
		aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
		aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
		aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
		aInfoHeader.push(iDataSize % 256); 
	
		for (var i=0;i<16;i++) {
			aInfoHeader.push(0);	// these bytes not used
		}
	
		var iPadding = (4 - ((iWidth * 3) % 4)) % 4;

		var aImgData = oData.data;

		var strPixelData = "";
		var y = iHeight;
		do {
			var iOffsetY = iWidth*(y-1)*4;
			var strPixelRow = "";
			for (var x=0;x<iWidth;x++) {
				var iOffsetX = 4*x;

				strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX+2]);
				strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX+1]);
				strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX]);
			}
			for (var c=0;c<iPadding;c++) {
				strPixelRow += String.fromCharCode(0);
			}
			strPixelData += strPixelRow;
		} while (--y);

		var strEncoded = encodeData(aHeader.concat(aInfoHeader)) + encodeData(strPixelData);

		return strEncoded;
	}


	// sends the generated file to the client
	var saveFile = function(strData) {
		document.location.href = strData;
	}

	var makeDataURI = function(strData, strMime) {
		return "data:" + strMime + ";base64," + strData;
	}

	// generates a <img> object containing the imagedata
	var makeImageObject = function(strSource) {
		var oImgElement = document.createElement("img");
		oImgElement.src = strSource;
		return oImgElement;
	}

	var scaleCanvas = function(oCanvas, iWidth, iHeight) {
		if (iWidth && iHeight) {
			var oSaveCanvas = document.createElement("canvas");
			oSaveCanvas.width = iWidth;
			oSaveCanvas.height = iHeight;
			oSaveCanvas.style.width = iWidth+"px";
			oSaveCanvas.style.height = iHeight+"px";

			var oSaveCtx = oSaveCanvas.getContext("2d");

			oSaveCtx.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, 0, 0, iWidth, iHeight);
			return oSaveCanvas;
		}
		return oCanvas;
	}

	return {

		saveAsPNG : function(oCanvas, bReturnImg, iWidth, iHeight) {
			if (!bHasDataURL) {
				return false;
			}
			var oScaledCanvas = scaleCanvas(oCanvas, iWidth, iHeight);
			var strData = oScaledCanvas.toDataURL("image/png");
			if (bReturnImg) {
				return makeImageObject(strData);
			} else {
				saveFile(strData.replace("image/png", strDownloadMime));
			}
			return true;
		},

		saveAsJPEG : function(oCanvas, bReturnImg, iWidth, iHeight) {
			if (!bHasDataURL) {
				return false;
			}

			var oScaledCanvas = scaleCanvas(oCanvas, iWidth, iHeight);
			var strMime = "image/jpeg";
			var strData = oScaledCanvas.toDataURL(strMime);
	
			// check if browser actually supports jpeg by looking for the mime type in the data uri.
			// if not, return false
			if (strData.indexOf(strMime) != 5) {
				return false;
			}

			if (bReturnImg) {
				return makeImageObject(strData);
			} else {
				saveFile(strData.replace(strMime, strDownloadMime));
			}
			return true;
		},

		saveAsBMP : function(oCanvas, bReturnImg, iWidth, iHeight) {
			if (!(bHasImageData && bHasBase64)) {
				return false;
			}

			var oScaledCanvas = scaleCanvas(oCanvas, iWidth, iHeight);

			var oData = readCanvasData(oScaledCanvas);
			var strImgData = createBMP(oData);
			if (bReturnImg) {
				return makeImageObject(makeDataURI(strImgData, "image/bmp"));
			} else {
				saveFile(makeDataURI(strImgData, strDownloadMime));
			}
			return true;
		}
	};

})();