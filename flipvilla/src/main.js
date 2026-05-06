import * as Three from 'three';
import {gsap} from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//scene
const scene = new Three.Scene();
scene.background = new Three.Color(0x87CEEB);

// Ground
const groundGeometry = new Three.PlaneGeometry(100, 100);
const groundMaterial = new Three.MeshStandardMaterial({
  color: 0x228B22
})

const ground = new Three.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1.5;
scene.add(ground);

// Loader 
const loader = new GLTFLoader();
function loadModel(path, position = [0,0,0], scale = [1,1,1]){
  loader.load(path, (gltf) => {
    const model = gltf.scene;
    model.position.set(...position);
    model.scale.set(...scale);
    console.log('Model loaded:', path);
    scene.add(model);
  }, undefined, (error) => {
    console.error('Error loading model:', error);
  });
}


// Camera 
const camera = new Three.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(8,6,10);
camera.lookAt(0,0,0);

//Renderer
const renderer = new Three.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// human model
loadModel('/flipvilla/models/human.glb', [0, -1.5, 0], [1, 1, 1]);

loadModel('/flipvilla/models/human.glb', [-5, 0, 3], [1, 1, 1]);
loadModel('/flipvilla/models/human.glb', [5, 0, -3], [1, 1, 1]);


//Light
const hemisphereLight = new Three.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(hemisphereLight);

//Directional Light
const sun = new Three.DirectionalLight(0xffffff, 1.5);
sun.position.set(10, 20, 10);
scene.add(sun);

// resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


function animate(){
    requestAnimationFrame(animate);
    
    controls.update();
    
    renderer.render(scene, camera);
}

animate();