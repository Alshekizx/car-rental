import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const changeRight = document.getElementById("changeRight");
const changeLeft = document.getElementById("changeLeft");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.05,
  20
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();

let model;
let gClassModel;
let audi1Model;
let fordModel;

renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 15);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 15);
directionalLight2.position.set(-2, 1, -1).normalize();
scene.add(directionalLight2);

loader.load(
  "./assets/range rover.glb",
  function (gltf) {
    model = gltf.scene;
    model.position.set(0, -1.2, 0);
    model.scale.set(1, 1, 1);
    model.rotation.set(0, 0, 0);
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

loader.load(
  "./assets/gclass.glb",
  function (gltf) {
    gClassModel = gltf.scene;
    gClassModel.position.set(12, -1.2, 0); // Adjust position
    gClassModel.scale.set(1, 1, 1); // Adjust scale
    gClassModel.rotation.set(0, 1.5, 0); // Adjust rotation
    scene.add(gClassModel);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Load the third model (Audi)
loader.load(
  "./assets/audi2.glb",
  function (gltf) {
    audi1Model = gltf.scene;
    audi1Model.position.set(24, -1.2, 0); // Adjust position
    audi1Model.scale.set(0.8, 0.8, 0.8); // Adjust scale
    audi1Model.rotation.set(0, 0, 0); // Adjust rotation
    scene.add(audi1Model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Load the fourth model (Ford)
loader.load(
  "./assets/ford.glb",
  function (gltf) {
    fordModel = gltf.scene;
    fordModel.position.set(36, -1.2, 0); // Adjust position
    fordModel.scale.set(0.33, 0.33, 0.33); // Adjust scale
    fordModel.rotation.set(0, 0, 0); // Adjust rotation
    scene.add(fordModel);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

camera.position.set(0, 0, 6);

controls.minPolarAngle = Math.PI / 2; // Lock the minimum polar angle to the vertical axis
controls.maxPolarAngle = Math.PI / 2; // Lock the maximum polar angle to the vertical axis
controls.enableRotate = true; // Allow rotation
controls.enablePan = false; // Disable panning
controls.enableZoom = false;

function animateModelRotation() {
  if (model && gClassModel && audi1Model && fordModel) {
    // Rotate all models around their Y-axis
    model.rotation.y -= 0.01;
    gClassModel.rotation.y -= 0.01;
    audi1Model.rotation.y -= 0.01;
    fordModel.rotation.y -= 0.01;
    // Adjust the rotation speed as needed
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  animateModelRotation(); // Call the rotation function in the animation loop
  renderer.render(scene, camera);
}

animate();
changeRight.addEventListener("click", function () {
  // Define the new positions
  const newModelPosition = new THREE.Vector3(model.position.x - 10, -1.2, 0);
  const newGClassModelPosition = new THREE.Vector3(
    gClassModel.position.x - 12,
    -1.2,
    0
  );
  const newAudi1ModelPosition = new THREE.Vector3(
    audi1Model.position.x - 12,
    -1.2,
    0
  );
  const newFordModelPosition = new THREE.Vector3(
    fordModel.position.x - 12,
    -1.2,
    0
  );

  // Define the animation duration in seconds
  const durationInSeconds = 0.5; // Adjust the duration as needed

  // Calculate the position increment per frame
  const modelPositionIncrement = newModelPosition
    .clone()
    .sub(model.position)
    .divideScalar(durationInSeconds * 60);
  const gClassModelPositionIncrement = newGClassModelPosition
    .clone()
    .sub(gClassModel.position)
    .divideScalar(durationInSeconds * 60);
  const audi1ModelPositionIncrement = newAudi1ModelPosition
    .clone()
    .sub(audi1Model.position)
    .divideScalar(durationInSeconds * 60);
  const fordModelPositionIncrement = newFordModelPosition
    .clone()
    .sub(fordModel.position)
    .divideScalar(durationInSeconds * 60);

  // Define a function for animating the models
  function animateModels() {
    // Update the positions of the models
    model.position.add(modelPositionIncrement);
    gClassModel.position.add(gClassModelPositionIncrement);
    audi1Model.position.add(audi1ModelPositionIncrement);
    fordModel.position.add(fordModelPositionIncrement);

    // Check if the fordModel reached the target position
    if (fordModel.position.x <= 0) {
      fordModel.position.x = 0;
      audi1Model.position.x = -12;
      gClassModel.position.x = -24;
      model.position.x = -30;
      return; // Exit the animation loop if the fordModel is at x = 0 or less
    }

    // Check if models reached their target positions
    if (
      model.position.distanceTo(newModelPosition) >
        modelPositionIncrement.length() ||
      gClassModel.position.distanceTo(newGClassModelPosition) >
        gClassModelPositionIncrement.length() ||
      audi1Model.position.distanceTo(newAudi1ModelPosition) >
        audi1ModelPositionIncrement.length() ||
      fordModel.position.distanceTo(newFordModelPosition) >
        fordModelPositionIncrement.length()
    ) {
      requestAnimationFrame(animateModels);
    }
  }

  // Start the animation loop
  animateModels();
});

changeLeft.addEventListener("click", function () {
  // Define the new positions
  const newModelPosition = new THREE.Vector3(model.position.x + 10, -1.2, 0);
  const newGClassModelPosition = new THREE.Vector3(
    gClassModel.position.x + 12,
    -1.2,
    0
  );
  const newAudi1ModelPosition = new THREE.Vector3(
    audi1Model.position.x + 12,
    -1.2,
    0
  );
  const newFordModelPosition = new THREE.Vector3(
    fordModel.position.x + 12,
    -1.2,
    0
  );

  // Define the animation duration in seconds
  const durationInSeconds = 0.5; // Adjust the duration as needed

  // Calculate the position increment per frame
  const modelPositionIncrement = newModelPosition
    .clone()
    .sub(model.position)
    .divideScalar(durationInSeconds * 60);
  const gClassModelPositionIncrement = newGClassModelPosition
    .clone()
    .sub(gClassModel.position)
    .divideScalar(durationInSeconds * 60);
  const audi1ModelPositionIncrement = newAudi1ModelPosition
    .clone()
    .sub(audi1Model.position)
    .divideScalar(durationInSeconds * 60);
  const fordModelPositionIncrement = newFordModelPosition
    .clone()
    .sub(fordModel.position)
    .divideScalar(durationInSeconds * 60);

  // Define a function for animating the models
  function animateModels() {
    // Update the positions of the models
    model.position.add(modelPositionIncrement);
    gClassModel.position.add(gClassModelPositionIncrement);
    audi1Model.position.add(audi1ModelPositionIncrement);
    fordModel.position.add(fordModelPositionIncrement);

    // Check if the fordModel reached the target position

    // Check if models reached their target positions
    if (model.position.x >= 0) {
      fordModel.position.x = 36;
      audi1Model.position.x = 24;
      gClassModel.position.x = 12;
      model.position.x = 0;
      return; // Exit the animation loop if the fordModel is at x = 0 or less
    }
    if (
      model.position.distanceTo(newModelPosition) >
        modelPositionIncrement.length() ||
      gClassModel.position.distanceTo(newGClassModelPosition) >
        gClassModelPositionIncrement.length() ||
      audi1Model.position.distanceTo(newAudi1ModelPosition) >
        audi1ModelPositionIncrement.length() ||
      fordModel.position.distanceTo(newFordModelPosition) >
        fordModelPositionIncrement.length()
    ) {
      requestAnimationFrame(animateModels);
    }
  }

  // Start the animation loop
  animateModels();
});
