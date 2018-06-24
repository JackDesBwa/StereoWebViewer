precision mediump float;
uniform sampler2D u_image; // the texture
varying vec2 v_texCoord; // the texCoords passed from the vertex shader.

void main() {
	vec4 color = texture2D(u_image, v_texCoord);
	float grey = (0.2126 * color.r) + (0.7152 * color.g) + (0.0722 * color.b);
	color.rgb += (grey - color.rgb);
	gl_FragColor = color;
}
