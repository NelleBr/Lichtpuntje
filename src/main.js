import * as THREE from 'three';
import './style.css';

const canvas = document.querySelector('#scene');
const scene = new THREE.Scene();
const horizonColor = '#164b85';
scene.background = new THREE.Color(horizonColor);
scene.fog = new THREE.Fog(horizonColor, 10, 40);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(3, 2.5, 4);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

scene.add(new THREE.HemisphereLight(0xffffff, 0x263326, 2));

const keyLight = new THREE.DirectionalLight(0xffffff, 3);
keyLight.position.set(3, 5, 4);
scene.add(keyLight);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: '#071f45', roughness: 1 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.75;
scene.add(ground);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 1.5, 1.5),
  new THREE.MeshStandardMaterial({ color: '#32cd32', roughness: 0.4 }),
);
scene.add(cube);

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', resize);

function animate() {
  cube.rotation.x += 0.005;
  cube.rotation.y += 0.008;
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
