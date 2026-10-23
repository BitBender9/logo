#version 300 es
uniform mat4 uMvp;
layout(location = 0) in vec4 aPosition;
void main() {
    gl_Position = uMvp * aPosition;
}