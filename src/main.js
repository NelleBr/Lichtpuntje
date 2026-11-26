import * as THREE from 'three';
import { createControls } from './controls.js';
import { createVehicle } from './vehicle.js';
import './style.css';

const canvas = document.querySelector('#scene');
const loadingMessage = document.querySelector('#loading');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#101510');

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  250,
);
camera.position.set(0, 3.2, -6.5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

scene.add(new THREE.HemisphereLight(0xffffff, 0x263326, 2));

const keyLight = new THREE.DirectionalLight(0xffffff, 3);
keyLight.position.set(3, 5, 4);
scene.add(keyLight);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000),
  new THREE.MeshStandardMaterial({ color: '#283b2a', roughness: 1 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.02;
scene.add(ground);

let hasMissingAsset = false;
const vehicle = createVehicle(scene, {
  onReady: () => {
    loadingMessage.hidden = !hasMissingAsset;
  },
  onAssetError: (url, error) => {
    hasMissingAsset = true;
    loadingMessage.textContent = url.endsWith('Textures/colormap.png')
      ? 'Kleurtextuur ontbreekt: voeg public/models/Textures/colormap.png toe.'
      : 'Een onderdeel van de SUV kon niet worden geladen.';
    loadingMessage.hidden = false;
    if (error) {
      loadingMessage.textContent = 'De SUV kon niet worden geladen.';
      console.error('Failed to load /models/suv.glb:', error);
    }
  },
});
const controls = createControls();
const up = new THREE.Vector3(0, 1, 0);
const cameraOffset = new THREE.Vector3();
const cameraTarget = new THREE.Vector3();
let previousTime = 0;

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', resize);

function animate(time) {
  const delta = previousTime
    ? Math.min((time - previousTime) / 1000, 0.05)
    : 0;
  previousTime = time;

  vehicle.update(controls, delta);

  cameraOffset
    .set(0, 3.2, -6.5)
    .applyAxisAngle(up, vehicle.object.rotation.y);
  camera.position.lerp(
    cameraTarget.copy(vehicle.object.position).add(cameraOffset),
    1 - Math.exp(-4 * delta),
  );
  camera.lookAt(
    cameraTarget.set(
      vehicle.object.position.x,
      vehicle.object.position.y + 0.7,
      vehicle.object.position.z,
    ),
  );

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
