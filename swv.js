// Helper function to compile webGL program
createWebGLProgram = function(ctx, vertexShaderSource, fragmentShaderSource) {
	this.ctx = ctx;
	this.compileShader = function(shaderSource, shaderType) {
		var shader = this.ctx.createShader(shaderType);
		this.ctx.shaderSource(shader, shaderSource);
		this.ctx.compileShader(shader);
		return shader;
	};
	var program = this.ctx.createProgram();
	this.ctx.attachShader(program, this.compileShader(vertexShaderSource, this.ctx.VERTEX_SHADER));
	this.ctx.attachShader(program, this.compileShader(fragmentShaderSource, this.ctx.FRAGMENT_SHADER));
	this.ctx.linkProgram(program);
	this.ctx.useProgram(program);
	return program;
}

// Helper function to get files
getFile = function(url, then) {
	var xhr = new XMLHttpRequest();
	xhr.onloadend = function() { then(xhr.responseText, xhr); }
	xhr.overrideMimeType('text/plain');
	xhr.open("GET", url);
	xhr.send();
}

var image = document.getElementById('image');
if(image.complete){
	desaturateImage(image);
} else {
	image.onload = function(){ desaturateImage(image); };
}

function desaturateImage(image) {

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

	// Load shaders
	getFile("swv_vertex.glsl", function(txt) {
		var vertexShaderSource = txt;
		getFile("swv_fragment.glsl", function(txt) {
			var fragmentShaderSource = txt;
			var program = createWebGLProgram(ctx, vertexShaderSource, fragmentShaderSource);
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
