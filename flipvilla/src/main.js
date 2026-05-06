import * as Three from 'three';
import {gsap} from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//scene
const scene = new Three.Scene();
scene.background = new Three.Color(0x202025);


// Camera 
const camera = new Three.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

camera.position.set(0,2,5);

//Renderer
const renderer = new Three.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// model
const loader = new GLTFLoader();
loader.load(
  '/flipvilla/models/human.glb', 

  (gltf) => {
    const model = gltf.scene;

    scene.add(model);

    // scale fix (VERY common)
    model.scale.set(1, 1, 1);

    // position fix
    model.position.set(0, -1.5, 0);

    console.log('Model loaded ✅');
  },

  (progress) => {
    console.log((progress.loaded / progress.total) * 100 + '% loaded');
  },

  (error) => {
    console.error('Error loading model ❌', error);
  }
);

//Light
const hemisphereLight = new Three.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(hemisphereLight);

//Directional Light
const dirLight = new Three.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

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