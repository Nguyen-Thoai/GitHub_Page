import * as THREE from 'three';

const shaderCanvas = document.getElementById('shader-canvas');
const renderer = new THREE.WebGLRenderer({
    canvas: shaderCanvas,
    alpha: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

const vertexShader = `
  attribute vec3 position;
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform vec2 resolution;
  uniform float time;
  uniform float xScale;
  uniform float yScale;
  uniform float distortion;

  void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float d = length(p) * distortion;
    float rx = p.x * (1.0 + d);
    float gx = p.x;
    float bx = p.x * (1.0 - d);
    float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
    float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
    float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

const uniforms = {
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    time: { value: 0.0 },
    xScale: { value: 1.0 },
    yScale: { value: 0.5 },
    distortion: { value: 0.05 }
};

const positions = new Float32Array([
    -1, -1, 0,
    1, -1, 0,
    -1, 1, 0,
    1, -1, 0,
    -1, 1, 0,
    1, 1, 0
]);

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    side: THREE.DoubleSide
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function animateShader() {
    uniforms.time.value += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(animateShader);
}
animateShader();

function resizeShader() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    uniforms.resolution.value.set(w, h);
}
window.addEventListener('resize', resizeShader);
resizeShader();

const introSection = document.getElementById('introSection');
const mainContent = document.getElementById('mainContent');
const letsGoBtn = document.getElementById('letsGoBtn');

letsGoBtn.addEventListener('click', () => {
    introSection.classList.add('hide-intro');
    mainContent.classList.add('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});