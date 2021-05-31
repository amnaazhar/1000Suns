// const startButton = document.getElementById( 'startButton' );
// startButton.addEventListener( 'click', main );

//const { Vector3 } = require("three");

//quotes

import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/OBJLoader.js';
import { EXRLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/EXRLoader.js';
//import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js'
import {FBXLoader} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/FBXLoader.js'
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js'
import { TWEEN } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/libs/tween.module.min.js'
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import {FilmPass} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/FilmPass.js';

const quote = [
  '"Marriage can wait,\nEducation cannot."',
  '"One could not count the moons that shimmer on her roofs,\nOr the thousand splendid suns that hide behind her walls."',
  '"Of all the hardships a person had to face,\nNone was more punishing than the simple act of waiting."',
  '"Behind every trial and sorrow that He makes us shoulder,\nGod has a reason."',
  '"Like a compass facing north, a man’s accusing finger always finds a woman."',
  '"You see, some things I can teach you. Some you learn from books. But there are things that, well, you have to see and feel."',
  '"I only have eyes for you."',
  '"And the past held only this wisdom: that love was a damaging mistake, and its accomplice, hope, a treacherous illusion."',
  '"yet love can move people to act in unexpected ways and move them to overcome the most daunting obstacles with startling heroism"',
  '"she was leaving the world as a woman who had love and been loved back"',
  '"But we are like those walls up there. Battered, and nothing pretty to look at, but still standing."',
  '"Each snowflake was a sigh heard by an aggrieved woman somewhere in the world."',
  '"Tell your secret to the wind, but don’t blame it for telling the trees."',
  '"People… should not be allowed to have new children if they had already given away all their love to their old ones."',
  '"You are not going to cry, are you?\n- I am not going to cry! Not over you. Not in a thousand years."'
];


var quote_index = 0;
const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//const controls = new OrbitControls(camera);
//controls.rotateSpeed *= -1;
//controls.target.set(0, 0, 0);
//controls.update();

const scene = new THREE.Scene();
camera.position.z = 3;



const renderScene = new RenderPass( scene, camera );

var bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
var bloomStrength = 3;
var bloomRadius = 1;
var bloomThreshold = 0.1;

bloomPass.threshold =  bloomThreshold;
bloomPass.strength =  bloomStrength;
bloomPass.radius =  bloomRadius;
bloomPass.renderToScreen = true;
const filmPass = new FilmPass(
  0.35,   // noise intensity
  0.025,  // scanline intensity
  648,    // scanline count
  false,  // grayscale
);
filmPass.renderToScreen = true;


let composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );
composer.addPass(filmPass);

var titleWrapper = document.querySelector('.ml12');

var textWrapper = document.querySelector('.ml12quote');
//textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");


function text(){
  var tl = gsap.timeline();
 // tl.set('.ml12quote', { opacity: 0, scale: 1.1});
  //console.log(quote[quote_index]);
  textWrapper.innerHTML = quote[quote_index];
  tl.to('.ml12quote', { opacity: 1, ease: "sine", duration: 2, scale: 0.9});
  tl.to('.ml12quote', {opacity: 0, ease: "linear.out", duration: 4, scale: 1.1, delay: 2, onComplete:updateTXT});
//   anime.timeline({loop: true})//
//   .add({
//       targets: '.ml12 .letter',
//       translateX: [40,0],
//       translateZ: 0,
//       opacity: [0,1],
//       easing: "easeOutExpo",
//       duration: 1500,
//       delay: (el, i) => 500 + 60 * i
//   }).add({
//       targets: '.ml12 .letter',
//       translateX: [0,-30],
//       opacity: [1,0],
//       easing: "easeInExpo",
//       duration: 1100,
//       delay: (el, i) => 100 + 30 * i
//   });

}

function updateTXT() {
  quote_index++;
  if (quote_index >= quote.length) {
    quote_index = 0;
  }
  text();
}

			function onWindowResize() {

				const width = window.innerWidth;
				const height = window.innerHeight;

				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				renderer.setSize( width, height );
				composer.setSize( width, height );

			}



function main() {


// add background
  {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      '/assets/sky2.jpeg',
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
      });
  }

    let mixer_birds
    var birds = new THREE.Object3D();;
    let loader_birds = new GLTFLoader();
    loader_birds.load('/1000Suns/assets/birds/scene.gltf', function(gltf){
      gltf.scene.position.set(-120,50, 10);
      gltf.scene.scale.set(2,2,2);
      gltf.scene.rotation.set(0, 1.57079633,-3.141592);
      const clips = gltf.animations;
      mixer_birds = new THREE.AnimationMixer( gltf.scene);
      const clip = THREE.AnimationClip.findByName( clips, "Scene" );
      const action = mixer_birds.clipAction( clip );
      action.play();
      gsap.to(birds.position, {duration:25, x: -birds.position.x, ease: "sine", onComplete: invertBirds});
     // gltf.scene.rotation.set(0,-25,-20);
      scene.add(gltf.scene);
      birds = gltf.scene;
   });

  var orignalpos_birds= birds.position.z;
  var rot_bird = true;
  //invertBirds();
   function invertBirds(){
    if(rot_bird){
      birds.rotation.z = 0;
      rot_bird =  false;
    }else{
      birds.rotation.z = -3.141592;
      rot_bird =  true;
    }

    orignalpos_birds = -1 * birds.position.x;
    gsap.to(birds.position, {duration:25, x: orignalpos_birds, ease: "sine", onComplete: invertBirds});


   }


   // loading 3D object
   let loader_terrain = new FBXLoader();
       loader_terrain.load('/assets/desert/desert_Pillar_terrain.fbx', function(obj){

       obj.position.set(-10,-4,-25);
       obj.scale.set(0.05,0.05,0.05);
       obj.rotation.set(0,90,0);
       scene.add(obj);
   });


   //trees

      // loading 3D object
    let mixer;
    let loader_trees = new GLTFLoader();
        loader_trees.load('/assets/pinktree/source/pinktree.glb', function(obj){

        const clips = obj.animations;
        mixer = new THREE.AnimationMixer( obj.scene);
        const clip = THREE.AnimationClip.findByName( clips, "windAction.001" );
        const action = mixer.clipAction( clip );
        action.play();
        
        obj.scene.position.set(2,-4,-30);
        scene.add(obj.scene);
        //console.log(birds);s
        //animate();
    });


 
   //TEXT
   
   const loader_text = new THREE.FontLoader();

   loader_text.load( '/node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
   
     const geometry = new THREE.TextGeometry( 'Amna Azhar', {
       font: font,
       size: 0.05,
       height: 0.001
     } );
     var text = new THREE.Object3D();
   
     // set the material position and rotation for the text
     var textMaterial = new THREE.MeshBasicMaterial( { color: 0xfff9cc, overdraw: true } );
     text = new THREE.Mesh( geometry, textMaterial );
     text.rotation.set(1.57079633,0,0);
     text.position.set(-2, 1,-21);
    // text.lookAt(camera.position)
     scene.add( text );
     //geometry.position.set(0,-25,-25);
   } );
 




 // adding particles
    const particleGeometry = new THREE.BufferGeometry;
    const particlesCnt= 200;
    const posArray = new Float32Array(particlesCnt * 3);

    for (let i = 0; i < particlesCnt * 3; i++){

        posArray[i] = (Math.random() - 0.5) * 2;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
     
     const cross = new THREE.TextureLoader().load("/assets/glow2.png");
    const particlematerial = new THREE.PointsMaterial({
        size: 0.085,
        map:cross,
        transparent:true,
        blending: THREE.AdditiveBlending
    })
    const particleMesh = new THREE.Points(particleGeometry, particlematerial);
    particleMesh.scale.set(18,18,18)
    particleMesh.position.set(0,0,-25)
    scene.add(particleMesh);


       // adding sphere
   //const geometry_sphere = new THREE.SphereGeometry(7);
   const v = new THREE.Vector3();

   function randomPointInSphere( radius ) {
   
     const x = THREE.Math.randFloat( -1, 1 );
     const y = THREE.Math.randFloat( -1, 1 );
     const z = THREE.Math.randFloat( -1, 1 );
     const normalizationFactor = 1 / Math.sqrt( x * x + y * y + z * z );
   
     v.x = x * normalizationFactor * radius;
     v.y = y * normalizationFactor * radius;
     v.z = z * normalizationFactor * radius;
   
     return v;
   }
   const sphereGeometry = new THREE.BufferGeometry();
  
   var positions = [];
   
   for (var i = 0; i < 5000; i ++ ) {
     
     var vertex = randomPointInSphere(3);
     positions.push( vertex.x, vertex.y, vertex.z );
     
   }
   
   sphereGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
   //geometry_sphere.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
   const material_sphere = new THREE.PointsMaterial({
    size: 0.15,
    map:cross,
    //color: (0,1,0,1),
    transparent:true,
    blending: THREE.AdditiveBlending
  });
   material_sphere.color = new THREE.Color (0xe6e600);

   const sphere = new THREE.Points(sphereGeometry, material_sphere);
   sphere.position.set(30,75,-20);


  scene.add(sphere);
 // sphere.add(sphereMesh1);

      //LIGHT

    const light = new THREE.PointLight( 0xfcd962, 0.1, 100 );
    light.position.set(7,20,-20);

    var ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);



    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

  //Mouse
  document.addEventListener("mousemove", animateParticles);

  let mouseY = 0;
  let mouseX = 0;

  function animateParticles(event){
      mouseY = event.clientX;
      mouseX = event.clientY;
  }

  //hover
  //camera.position.set(3.538957295625084e-7, -1.021684878863786,-9.589670059257917e-7);
  //document.addEventListener('mousemove', onDocumentMouseMove, false);


  const clock = new THREE.Clock();

  var elapsedTime;
  let delta;
  var intersects;
  var time;
  var orbitRadius = 50;
  function onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );
    composer.setSize( width, height );

  }

  function render() {

    
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
   
    


    time = Date.now() / 3000;

    sphere.position.x = orbitRadius * Math.cos( time );
    sphere.position.z = orbitRadius * Math.sin( time ) - 10;

    //camera.position.x += ( mouseX - camera.position.x ) * .05;
    //camera.position.y += ( - ( mouseY - 200 ) - camera.position.y ) * .05;
    delta = clock.getDelta();
    if(mixer)mixer.update( delta ); // problem here
    if(mixer_birds)mixer_birds.update( delta );

        
    elapsedTime = clock.getElapsedTime();

    if(mouseX>0){
      // console.log("amna");
     particleMesh.rotation.x = -mouseY * (elapsedTime* 0.00008);
     particleMesh.rotation.y = mouseX * (elapsedTime* 0.00008);
     }else{
 
       particleMesh.rotation.y = -0.1 * (elapsedTime);
     }
     
    //requestAnimationFrame( animate );
    
    //scamera.lookAt(sphere.position);
    //renderer.render(scene, camera);
    composer.render();
    
    
    requestAnimationFrame(render);
    //console.log(camera.position, camera.rotation);
  
        
  }



  function revealtitle(){

    var tl2 = gsap.timeline();
    titleWrapper.innerHTML = "A Thousand Splendid Suns\n- Khaled Hosseini";
    tl2.to('.ml12', { opacity: 1, scale: 1.1, ease: "sine", duration: 5});
    tl2.to('.ml12', { opacity: 0, scale: 0.8, ease: "sine", duration: 4});

  }

  var tl = gsap.timeline();
  tl.to(camera.position,  {duration:15, z:-20, ease: "sine", onComplete: text});
  tl.to(camera.rotation, {duration:10, x:1.3, ease: "back",}, '-=7');
  tl.to(camera.rotation, {duration:10, x:1.8, repeat: -1,  yoyo: true});


  gsap.to(bloomPass, {duration:6, threshold :0.55, ease: "sine"});
  gsap.to(bloomPass, {duration:6, strength :0.5, ease: "sine"});
  gsap.to(bloomPass, {duration:1, radius :1, ease: "sine", onComplete: revealtitle});
  onWindowResize();

   render();

   //gsap.from(".ml12", {duration:3, opacity:0, ease: "sine", repeat:-1});


  
}

main();




//Notes

//power of 2 image. Make image squared in photoshop
// look into blur
//notmal, tangent, uv, object space, screen space


//uniforms and betas