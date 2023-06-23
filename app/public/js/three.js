import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const socket = io();

let connected = false;

// SCENE
const scene = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// RENDERER
const renderer = new THREE.WebGLRenderer();

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// LIGHTS
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);


// GEOMETRY
renderer.domElement.addEventListener('click', (event) => {
    // on click a cube where the user clicked without raycasting
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = (event.clientX / window.innerWidth) * 2 - 1;
    cube.position.y = -(event.clientY / window.innerHeight) * 2 + 1;
    scene.add(cube);
    socket.emit('addCube', {x: cube.position.x, y: cube.position.y});
});

socket.on("getCubes", (data) => {
    if(!connected){
        connected = true;
        data.cube.forEach(element => {
            const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.x = element.x;
            cube.position.y = element.y;
            scene.add(cube);
        });
    }
});


socket.on("addCube", (data) => {
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = data.x;
    cube.position.y = data.y;
    scene.add(cube);
});

// RENDER LOOP
const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    (!connected) ? socket.emit('getCubes') : null;
    renderer.render(scene, camera);
}

// RESIZE

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// INIT
const init = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.position.z = 5;
    animate();
}

init();
