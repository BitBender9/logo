async function setup()
{
    window.gl = document.querySelector('canvas').getContext('webgl2')
    const vs = await fetch('glsl/vertex_shader.glsl').then(res => res.text())
    const fs = await fetch('glsl/fragment_shader.glsl').then(res => res.text())
    window.program = compile(vs, fs)
    gl.useProgram(program)
    fillBuffers()
    tick(0) // call once, at the end of setup
}

/**
 * Compiles two shaders, links them together, looks up their uniform locations,
 * and returns the result. Reports any shader errors to the console.
 *
 * @param {string} vs_source - the source code of the vertex shader
 * @param {string} fs_source - the source code of the fragment shader
 * @return {WebGLProgram} the compiled and linked program
 */
function compile(vs_source, fs_source) {
    const vs = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vs, vs_source)
    gl.compileShader(vs)
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(vs))
        throw Error("Vertex shader compilation failed")
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fs, fs_source)
    gl.compileShader(fs)
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(fs))
        throw Error("Fragment shader compilation failed")
    }

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program))
        throw Error("Linking failed")
    }
    
    const uniforms = {}
    for(let i=0; i<gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); i+=1) {
        let info = gl.getActiveUniform(program, i)
        uniforms[info.name] = gl.getUniformLocation(program, info.name)
    }
    program.uniforms = uniforms

    return program
}

function fillBuffers()
{
    const vertices = new Float32Array([
        // top serif  (x: -0.35..0.35, y: 0.28..0.50)
        -0.35, 0.28,   0.35, 0.28,   0.35, 0.50,
        -0.35, 0.28,   0.35, 0.50,  -0.35, 0.50,
        // stem       (x: -0.12..0.12, y: -0.28..0.28)
        -0.12,-0.28,   0.12,-0.28,   0.12, 0.28,
        -0.12,-0.28,   0.12, 0.28,  -0.12, 0.28,
        // bottom serif (x: -0.35..0.35, y: -0.50..-0.28)
        -0.35,-0.50,   0.35,-0.50,   0.35,-0.28,
        -0.35,-0.50,   0.35,-0.28,  -0.35,-0.28,
    ])
    window.vertexCount = vertices.length / 2

    window.vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)
  
    return buffer
}

function tick(milliseconds)
{
    // build mat4 from milliseconds, uniformMatrix4fv, clear, draw
    gl.clearColor(0.1, 0.1, 0.15, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    // later: gl.uniformMatrix4fv(program.uniforms.uMvp, false, M)
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount)
    requestAnimationFrame(tick)
}

window.addEventListener('load', setup)




