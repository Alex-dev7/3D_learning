import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import spline from "./spline.js"

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.2);

const fov = 75;
const aspect = w / h;   
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.outputColorSpace = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;


// create line geometry from the spline
const points = spline.getPoints(100);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
const splineObject = new THREE.Line(geometry, material);
// scene.add(splineObject);


// create tube geometry from the spline
const tubeGeometry = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
const tubeMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x0099ff,
    // side: THREE.DoubleSide,
    wireframe: true,
 });
const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
// scene.add(tube);

// create edges geometry from the spline
const edges = new THREE.EdgesGeometry(tubeGeometry, 0.2);
const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
const tubeLines = new THREE.LineSegments(edges, lineMat);
scene.add(tubeLines);

// add lights
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xaa5500);
scene.add(hemiLight);


// camera fly through
function updateCamera(t) {
    const time = t * 0.1;
    const loopTime = 8 * 1000;
    const p = (time % loopTime) / loopTime;
    const pos = tubeGeometry.parameters.path.getPointAt(p);
    const lookAt = tubeGeometry.parameters.path.getPointAt((p + 0.03) % 1);
    camera.position.copy(pos);
    camera.lookAt(lookAt); 
}

function animate(t = 0) {
    requestAnimationFrame(animate)
    updateCamera(t);
    renderer.render(scene, camera);
    controls.update();
}

animate()