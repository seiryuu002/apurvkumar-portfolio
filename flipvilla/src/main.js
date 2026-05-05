import * as Three from 'three';
import {gsap} from 'gsap';

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

//Geometry
const geometry = new Three.BoxGeometry(2,2,2);

//Material
const material = new Three.MeshStandardMaterial({color: 0x00aaff});

//Mesh
const cube = new Three.Mesh(geometry, material);
scene.add(cube);

//Ambient Light
const ambientLight = new Three.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

//Directional Light
const directionalLight = new Three.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5,5,5);
scene.add(directionalLight);

// resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


//camera move on click
window.addEventListener('click', () => {
  gsap.to(camera.position, {
    x: Math.random() * 6 - 3,
    y: Math.random() * 4 + 1,
    z: Math.random() * 6 + 3,
    duration: 1.5,
    ease: "power2.out"
  });
});

function animate(){
    requestAnimationFrame(animate);
    cube.rotation.y += 0.01;
    camera.lookAt(cube.position);
    renderer.render(scene, camera);
}

animate();