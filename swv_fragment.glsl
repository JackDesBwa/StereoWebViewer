precision mediump float;

uniform sampler2D u_image; // texture data
uniform int u_iMode;       // input mode
uniform int u_oMode;       // output mode

varying vec2 v_texCoord;   // texture coordinates passed from the vertex shader

#define MODE_P 0x70
#define MODE_X 0x78
#define MODE_I 0x69
#define MODE_A 0x61
#define MODE_L 0x6c
#define MODE_R 0x72

vec2 left(vec2 coords) {
	if (u_iMode == MODE_X)
		coords.x += 0.5;
	return coords;
}

vec2 right(vec2 coords) {
	if (u_iMode == MODE_P)
		coords.x += 0.5;
	return coords;
}

void main() {
	vec2 xy = v_texCoord;
	vec4 color = vec4(0, 0, 0, 1);
	int mo = u_oMode;

	if (mo == MODE_P) {
		if (xy.x < .5) {
			color = texture2D(u_image, left(xy));
		} else {
			xy.x -= .5;
			color = texture2D(u_image, right(xy));
		}

	} else if (mo == MODE_X) {
		if (xy.x < .5) {
			color = texture2D(u_image, right(xy));
		} else {
			xy.x -= .5;
			color = texture2D(u_image, left(xy));
		}

	} else if (mo == MODE_I) {
		if (xy.x >= 0.25 && xy.x < 0.75) {
			xy.x -= 0.25;
			if (int(gl_FragCoord.y) / 2 == int(gl_FragCoord.y + 1.0) / 2) {
				color = texture2D(u_image, right(xy));
			} else {
				color = texture2D(u_image, left(xy));
			}
		}

	} else if (mo == MODE_A) {
		if (xy.x >= 0.25 && xy.x < 0.75) {
			xy.x -= 0.25;
			mat4 duboisL = mat4(
				+0.456, -0.040, -0.015, 0.0,
				+0.500, -0.038, -0.021, 0.0,
				+0.176, -0.016, -0.005, 0.0,
				0.0, 0.0, 0.0, 1.0
			);
			mat4 duboisR = mat4(
				-0.043, +0.378, -0.072, 0.0,
				-0.088, +0.734, -0.113, 0.0,
				-0.002, -0.018, +1.226, 0.0,
				0.0, 0.0, 0.0, 1.0
			);
			color = duboisL * texture2D(u_image, left(xy)) + duboisR * texture2D(u_image, right(xy));
		}

	} else if (mo == MODE_L) {
		if (xy.x >= 0.25 && xy.x < 0.75) {
			xy.x -= 0.25;
			color = texture2D(u_image, left(xy));
		}

	} else if (mo == MODE_R) {
		if (xy.x >= 0.25 && xy.x < 0.75) {
			xy.x -= 0.25;
			color = texture2D(u_image, right(xy));
		}
	}

	gl_FragColor = color;
}
