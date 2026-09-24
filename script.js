// Qixton interactions + lightweight 3D hero
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', e => {
  if (glow) { glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`; }
});

document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(850px) rotateX(${-y*9}deg) rotateY(${x*11}deg) translateY(-3px)`;
  });
  card.addEventListener('pointerleave', () => card.style.transform = '');
});

// Scroll reveals
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.reveal').forEach((el, i) => {
    gsap.to(el, {opacity:1, y:0, duration:.85, delay:(i%4)*.04, ease:'power3.out', scrollTrigger:{trigger:el,start:'top 88%', once:true}});
  });
  gsap.to('.ring-a',{rotation:360,duration:24,repeat:-1,ease:'none'});
  gsap.to('.ring-b',{rotation:-360,duration:32,repeat:-1,ease:'none'});
} else {
  document.querySelectorAll('.reveal').forEach(el => { el.style.opacity=1; el.style.transform='none'; });
}

// 3D scene
(function initThree(){
  if (!window.THREE) return;
  const canvas = document.getElementById('orb-canvas');
  if (!canvas) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  camera.position.set(0,0,7);
  const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const group = new THREE.Group(); scene.add(group);
  const geo = new THREE.SphereGeometry(1.65, 96, 96);
  const mat = new THREE.MeshPhysicalMaterial({
    color:0xff2d86, metalness:.12, roughness:.12, transmission:.2, thickness:1.1,
    clearcoat:1, clearcoatRoughness:.06, emissive:0x4a001f, emissiveIntensity:.32
  });
  const orb = new THREE.Mesh(geo, mat); group.add(orb);
  orb.scale.set(1,1.12,1);

  // Sculpted inner ring / liquid feel
  const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(1.05,.12,180,28,2,3), new THREE.MeshPhysicalMaterial({color:0xff87bb,roughness:.2,metalness:.35,emissive:0x8b0b52,emissiveIntensity:.5}));
  group.add(torus);

  const particleGeo = new THREE.SphereGeometry(.08,24,24);
  const particleMat = new THREE.MeshPhysicalMaterial({color:0xff74b1,metalness:.15,roughness:.15,emissive:0x65002c,emissiveIntensity:.6});
  const droplets=[];
  for(let i=0;i<14;i++){
    const d=new THREE.Mesh(particleGeo,particleMat);
    const a=(i/14)*Math.PI*2;
    const r=2.25+(i%3)*.24;
    d.position.set(Math.cos(a)*r,Math.sin(a*1.3)*1.65,(i%4)*.17-.25);
    d.scale.setScalar(.65+(i%5)*.12); group.add(d); droplets.push(d);
  }

  scene.add(new THREE.AmbientLight(0xffffff,1.4));
  const pink = new THREE.PointLight(0xff2d86,42,18); pink.position.set(3,2,4); scene.add(pink);
  const white = new THREE.PointLight(0xffffff,20,14); white.position.set(-3,3,4); scene.add(white);
  const purple = new THREE.PointLight(0x712bff,26,14); purple.position.set(-2,-2,2); scene.add(purple);

  let targetX=0,targetY=0,scrollY=0;
  window.addEventListener('pointermove',e=>{targetX=(e.clientX/window.innerWidth-.5)*.45;targetY=(e.clientY/window.innerHeight-.5)*.28;});
  window.addEventListener('scroll',()=>{scrollY=window.scrollY;});

  function resize(){
    const r=canvas.getBoundingClientRect();
    renderer.setSize(r.width,r.height,false); camera.aspect=r.width/r.height; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize',resize); resize();
  const clock=new THREE.Clock();
  function tick(){
    const t=clock.getElapsedTime();
    group.rotation.y += (targetX-group.rotation.y)*.035;
    group.rotation.x += (-targetY-group.rotation.x)*.035;
    group.rotation.z=Math.sin(t*.35)*.04 + scrollY*.00008;
    orb.scale.y=1.12+Math.sin(t*1.15)*.025;
    torus.rotation.x=t*.32; torus.rotation.y=t*.23;
    droplets.forEach((d,i)=>{d.position.y += Math.sin(t*1.2+i)*.0018; d.rotation.x += .01;});
    renderer.render(scene,camera); requestAnimationFrame(tick);
  }
  tick();
})();
