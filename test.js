
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
camera.position.z = 5;

const controls = new THREE.OrbitControls(camera, renderer.domElement);

//controls.update() must be called after any manual changes to the camera's transform
controls.update();
/*
//testing geometry
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
*/

//renderer.render( scene, camera );

const loader = new THREE.TextureLoader();
const texture = loader.load(
  '../assets/desert.jpeg',
  () => {
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt.texture;
  });


function animate() {

	requestAnimationFrame (animate);

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render (scene, camera);

}

animate();
