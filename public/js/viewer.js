
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js';

const container = document.getElementById('viewer-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x17182c);

const camera = new THREE.PerspectiveCamera(
  45, container.clientWidth / container.clientHeight, 0.1, 100
);
camera.position.set(4, 3, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 2;
controls.maxDistance = 12;

scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const keyLight = new THREE.DirectionalLight(0xffffff, 3);
keyLight.position.set(4, 6, 5);
scene.add(keyLight);

const purpleLight = new THREE.PointLight(0x9570ff, 35, 15);
purpleLight.position.set(-4, 2, 2);
scene.add(purpleLight);

const blueLight = new THREE.PointLight(0x438dff, 25, 15);
blueLight.position.set(3, -1, -4);
scene.add(blueLight);

const grid = new THREE.GridHelper(14, 28, 0x555078, 0x30304a);
grid.position.y = -1.35;
scene.add(grid);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshStandardMaterial({
    color: 0x17182c,
    roughness: 0.9,
    metalness: 0.1
  })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.36;
scene.add(floor);

const material = new THREE.MeshStandardMaterial({
  color: 0x9875ff,
  metalness: 0.55,
  roughness: 0.25
});

let currentObject = null;
let wireframeEnabled = false;
let loadNumber = 0;

const loader = new GLTFLoader();

function removeCurrentObject() {
  if (!currentObject) return;

  scene.remove(currentObject);

  currentObject.traverse((child) => {
    if (!child.isMesh) return;

    child.geometry?.dispose();

    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];

    materials.forEach((mat) => {
      if (!mat) return;

      Object.values(mat).forEach((value) => {
        if (value && value.isTexture) value.dispose();
      });

      mat.dispose();
    });
  });

  currentObject = null;
}

function setWireframe(object) {
  object.traverse((child) => {
    if (!child.isMesh) return;

    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];

    materials.forEach((mat) => {
      if (mat) mat.wireframe = wireframeEnabled;
    });
  });
}

function createGeometry(prompt = '') {
  const value = prompt.toLowerCase();

  if (value.includes('sphere') || value.includes('ball')) {
    return new THREE.SphereGeometry(1, 48, 32);
  }
  if (value.includes('cube') || value.includes('box')) {
    return new THREE.BoxGeometry(1.8, 1.8, 1.8, 3, 3, 3);
  }
  if (value.includes('torus') || value.includes('ring')) {
    return new THREE.TorusKnotGeometry(0.8, 0.25, 120, 16);
  }
  if (value.includes('cone') || value.includes('rocket')) {
    return new THREE.ConeGeometry(0.9, 2, 48);
  }
  if (value.includes('cylinder')) {
    return new THREE.CylinderGeometry(0.8, 0.8, 1.8, 48);
  }
  if (value.includes('car')) {
    return new THREE.BoxGeometry(2.2, 0.8, 1.2, 4, 2, 3);
  }

  return new THREE.IcosahedronGeometry(1.2, 2);
}

function showPrimitive(prompt = '') {
  removeCurrentObject();

  currentObject = new THREE.Mesh(
    createGeometry(prompt),
    material.clone()
  );

  currentObject.position.y = 0;
  currentObject.rotation.set(0.15, 0.35, 0);
  currentObject.material.wireframe = wireframeEnabled;
  scene.add(currentObject);
}

async function loadRobot() {
  const thisLoad = ++loadNumber;

  try {
    const gltf = await loader.loadAsync('./models/textured.glb');

    if (thisLoad !== loadNumber) return;

    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);

    if (maxDimension > 0) {
      const scale = 3.2 / maxDimension;
      model.scale.setScalar(scale);

      model.position.set(
        -center.x * scale,
        -box.min.y * scale - 1.3,
        -center.z * scale
      );
    }

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    removeCurrentObject();
    currentObject = model;
    setWireframe(model);
    scene.add(model);

    controls.target.set(0, 0.2, 0);
    controls.update();

    console.log('AI-generated robot loaded successfully!');
  } catch (error) {
    console.error('Could not load the GLB model:', error);
    showPrimitive('robot');
  }
}

function showObject(prompt = '') {
  const value = prompt.toLowerCase();

  if (value.includes('robot')) {
    loadRobot();
  } else {
    loadNumber++;
    showPrimitive(prompt);
  }
}

showObject('robot');

export function updatePreview(prompt) {
  showObject(prompt);
}

export function resetView() {
  camera.position.set(4, 3, 6);
  controls.target.set(0, 0.2, 0);
  controls.update();
}

export function toggleWireframe() {
  wireframeEnabled = !wireframeEnabled;

  if (currentObject) setWireframe(currentObject);
}

function resizeViewer() {
  const width = container.clientWidth;
  const height = container.clientHeight;

  if (!width || !height) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

const resizeObserver = new ResizeObserver(resizeViewer);
resizeObserver.observe(container);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
