import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const socket = io();

let car = null;

let carId = 0;

let connected = false;

const loaderManager = new THREE.LoadingManager();

const loader = new GLTFLoader(loaderManager);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
  alpha: true,
});

const AmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(AmbientLight);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

async function init(voitureObject) {

  socket.emit("newCar");

  socket.on("getCars", async (data) => {
    if (!connected) {
      for (let i = 0; i < data.cars.length; i++) {
        let temp = voitureObject.clone();
        temp.scale.set(0.5, 0.5, 0.5);
        temp.position.x = data.cars[i].x;
        temp.position.z = data.cars[i].z;
        temp.userData.id = data.cars[i].id;
        scene.add(temp);
      }
    }
  });

  socket.on("addCar", (data) => {
    let temp = voitureObject.clone();
    temp.scale.set(0.5, 0.5, 0.5);
    temp.position.x = data.x;
    temp.position.z = data.z;
    temp.userData.id = data.id;
    if (!connected) {
      connected = true;
      car = temp;
      carId = data.id;
      document.getElementById("code").innerHTML = data.code;
    }
    scene.add(temp);
  });

  socket.on("moveCar", (data) => {
    if (carId != data.id) {
      scene.children.forEach((element) => {
        if (element.userData) {
          if (element.userData.id == data.id) {
            element.position.x = data.x;
            element.position.z = data.z;
          }
        }
      });
    }
  });

  socket.on("disconnected", () => {
    socket.emit("disconnectCar", {
      id: carId,
    });
  });

  socket.on("disconnectCar", (data) => {
    data.forEach((element) => {
      scene.children.forEach((element2) => {
        if (element2.userData) {
          if (element2.userData.id == element) {
            scene.remove(element2);
          }
        }
      });
    });
  });

  loaderManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log(
      "Loading progress at " + (itemsLoaded / itemsTotal) * 100 + "%"
    );
  };

  loaderManager.onLoad = function () {
    console.log("Loading complete!");
    console.log(scene.children);
    animate();
    initControls();
  };

  loaderManager.on = function (url) {
    console.log("There was an error loading " + url);
  };

  function initControls() {
    document.addEventListener("keydown", (e) => {
      if (car) {
        if (e.key == "ArrowUp") {
          car.position.z += 0.1;
        }
        if (e.key == "ArrowDown") {
          car.position.z -= 0.1;
        }
        if (e.key == "ArrowLeft") {
          car.position.x += 0.1;
        }
        if (e.key == "ArrowRight") {
          car.position.x -= 0.1;
        }

        socket.emit("moveCar", {
          id: car.userData.id,
          x: car.position.x,
          z: car.position.z,
        });
      }
    });
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  scene.add(AmbientLight);
  camera.position.z = 5;
  const controls = new OrbitControls(camera, renderer.domElement);
}


loader.load("./ressources/voiture.glb", (gltf) => {
  init(gltf.scene);
});

