var image = document.getElementById('image');
if(image.complete){
	transformImage(image);
} else {
	image.onload = function(){ transformImage(image); };
}

function transformImage(image) {
	// Create canvas
	var canvas = document.createElement('canvas');
	canvas.width  = image.width;
	canvas.height = image.height;

	// Get webGL context
	var ctx;
	try {
		ctx = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	} catch(e) {
		// Do nothing
	}
	if (!ctx) {
		console.error("No webGL to create StereoWebView");
		return;
	}

	// Helper function to load files
	loadFile = function(url, then) {
		var xhr = new XMLHttpRequest();
		xhr.onloadend = function() { then(xhr.responseText, xhr); }
		xhr.overrideMimeType('text/plain');
		xhr.open("GET", url);
		xhr.send();
	}

	// Load shaders
	var program = ctx.createProgram();
	loadFile("swv_vertex.glsl", function(txt) {
		var vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
		ctx.shaderSource(vertexShader, txt);
		ctx.compileShader(vertexShader);
		ctx.attachShader(program, vertexShader);
		loadFile("swv_fragment.glsl", function(txt) {
			var fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);
			ctx.shaderSource(fragmentShader, txt);
			ctx.compileShader(fragmentShader);
			ctx.attachShader(program, fragmentShader);

			ctx.linkProgram(program);
			ctx.useProgram(program);

			if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
				console.error("StereoWebView GLSL program cannot be linked");
				return;
			}

			// Replace image by canvas
			console.info("StereoWebView replaces image", image);
			image.parentNode.insertBefore(canvas, image);
			image.parentNode.removeChild(image);

			// Expose canvas width and height to shader via u_resolution
			var resolutionLocation = ctx.getUniformLocation(program, "u_resolution");
			ctx.uniform2f(resolutionLocation, canvas.width, canvas.height);

			// Position rectangle vertices (2 triangles)
			var positionLocation = ctx.getAttribLocation(program, "a_position");
			var buffer = ctx.createBuffer();
			ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
			ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([
				0, 0,
				image.width, 0,
				0, image.height,
				0, image.height,
				image.width, 0,
				image.width, image.height]), ctx.STATIC_DRAW);
			ctx.enableVertexAttribArray(positionLocation);
			ctx.vertexAttribPointer(positionLocation, 2, ctx.FLOAT, false, 0, 0);

			// Position texture
			var texCoordLocation = ctx.getAttribLocation(program, "a_texCoord");
			var texCoordBuffer = ctx.createBuffer();
			ctx.bindBuffer(ctx.ARRAY_BUFFER, texCoordBuffer);
			ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([
				0.0, 0.0,
				1.0, 0.0,
				0.0, 1.0,
				0.0, 1.0,
				1.0, 0.0,
				1.0, 1.0]), ctx.STATIC_DRAW);
			ctx.enableVertexAttribArray(texCoordLocation);
			ctx.vertexAttribPointer(texCoordLocation, 2, ctx.FLOAT, false, 0, 0);

			// Create a texture from image
			var texture = ctx.createTexture();
			ctx.bindTexture(ctx.TEXTURE_2D, texture);
			ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
			ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
			ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
			ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
			ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);

			// Draw the rectangle
			ctx.drawArrays(ctx.TRIANGLES, 0, 6);
		});
	});
}
