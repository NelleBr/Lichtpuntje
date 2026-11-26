import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const maximumSpeed = 6;
const maximumReverseSpeed = 2.4;
const acceleration = 4;
const deceleration = 3;
const steeringRate = 1.8;

export function createVehicle(scene, { onReady, onAssetError }) {
  const object = new THREE.Group();
  scene.add(object);

  let speed = 0;
  const forward = new THREE.Vector3(0, 0, 1);

  const loadingManager = new THREE.LoadingManager();
  loadingManager.onError = onAssetError;

  const loader = new GLTFLoader(loadingManager);
  loader.load(
    '/models/suv.glb',
    (gltf) => {
      const model = gltf.scene;
      const bounds = new THREE.Box3().setFromObject(model);
      const center = bounds.getCenter(new THREE.Vector3());
      model.position.x -= center.x;
      model.position.y -= bounds.min.y;
      model.position.z -= center.z;
      object.add(model);
      onReady();
    },
    undefined,
    (error) => onAssetError('/models/suv.glb', error),
  );

  return {
    object,
    update(controls, delta) {
      if (controls.throttle > 0) {
        speed = Math.min(speed + acceleration * delta, maximumSpeed);
      } else if (controls.throttle < 0) {
        speed = Math.max(speed - acceleration * delta, -maximumReverseSpeed);
      } else {
        speed =
          Math.sign(speed) * Math.max(0, Math.abs(speed) - deceleration * delta);
      }

      if (controls.steering && Math.abs(speed) > 0.05) {
        object.rotation.y +=
          controls.steering * steeringRate * delta * Math.sign(speed);
      }

      forward.set(0, 0, 1).applyQuaternion(object.quaternion);
      object.position.addScaledVector(forward, speed * delta);
    },
  };
}
