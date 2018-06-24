precision mediump float;
uniform sampler2D u_image; // the texture
uniform int u_iMode; // input mode
uniform int u_oMode; // output mode
varying vec2 v_texCoord; // the texCoords passed from the vertex shader.

void main() {
	vec4 color = texture2D(u_image, v_texCoord);
	float grey = (0.2126 * color.r) + (0.7152 * color.g) + (0.0722 * color.b);
	if (u_oMode == 0x70) { // p
		color.rgb += (grey - color.rgb);

	} else if (u_oMode == 0x78) { // x
		// Do not alter pixels

	} else {
		color.rgb = vec3(0);
	}

	gl_FragColor = color;
}
