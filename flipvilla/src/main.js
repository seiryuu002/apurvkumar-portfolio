import * as Three from 'three';
import {gsap} from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// clickable objects
const clickableObjects = [];

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
function loadModel(path, position = [0,0,0], scale = [1,1,1], name = 'object'){
  loader.load(path, (gltf) => {
    const model = gltf.scene;

    model.position.set(...position);
    model.scale.set(...scale);

    model.traverse(child => { if(child.isMesh) child.userData.name = name;});

    console.log('Model loaded:', path);

    scene.add(model);

    clickableObjects.push(model);

  }, undefined, (error) => {
    console.error('Error loading model:', error);
  });
}

// raycaster
const raycaster = new Three.Raycaster();
const mouse = new Three.Vector2();

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
loadModel('/flipvilla/models/human.glb', [0, -1.5, 0], [1, 1, 1], 'host');

loadModel('/flipvilla/models/human.glb', [-5, 0, 3], [1, 1, 1], 'human2');
loadModel('/flipvilla/models/human.glb', [5, 0, -3], [1, 1, 1], 'human3');


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

// click event 
window.addEventListener('pointerdown', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  //update raycaster
  raycaster.setFromCamera(mouse, camera);

  //detect intersections
  const intersects = raycaster.intersectObjects(clickableObjects, true);

  if(intersects.length > 0){

    let obj = intersects[0].object;
    
    while(obj){
      if(obj.parent && !obj.userData.name){
        break;
      }
      obj = obj.parent;
    }
    
    const clicked = intersects[0].object; 
    console.log('Clicked on:', clicked.userData.name);

    if (lastClicked) {
    lastClicked.traverse(child => {
      
      if (child.isMesh) 
        {
          child.material.emissive?.set(0x000000);
        }

    });
    }

    obj.traverse(child => {

      if (child.isMesh) {
        child.material.emissive?.set(0x333333);
      }

    });

  lastClicked = obj;
  }
});


function animate(){
    requestAnimationFrame(animate);
    
    controls.update();
    
    renderer.render(scene, camera);
}

animate();