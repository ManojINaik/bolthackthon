import * as THREE from "three";
import ScreenRenderEngine from "./renderEngine";
import ScreenTextEngine from "./textEngine";
import { Assists } from "../loader";
import Terminal from "../../terminal";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export default function Screen(
  assists: Assists,
  renderer: THREE.WebGLRenderer
) {
  const sceneRTT = new THREE.Scene();
  
  // Create a dark blue gradient background to match the bolt.new branding
  const gradientMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color(0x050b14) }, // Dark blue/black
      color2: { value: new THREE.Color(0x0c2241) }  // Blue
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      void main() {
        gl_FragColor = vec4(mix(color1, color2, vUv.x), 1.0);
      }
    `,
    transparent: true
  });
  
  const backGround = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 1, 1),
    gradientMaterial
  );
  backGround.position.set(0.5, -0.5, -0.02);
  sceneRTT.add(backGround);

  // Create bolt text using TextGeometry
  if (assists.publicPixelFont) {
    // Create "bolt" part - the main logo text
    const boltGeometry = new TextGeometry("bolt", {
      font: assists.publicPixelFont,
      size: 0.18,
      height: 0.01,
      curveSegments: 6,
      bevelEnabled: false
    });
    
    // Center the geometry properly
    boltGeometry.computeBoundingBox();
    const boltWidth = boltGeometry.boundingBox ? 
      (boltGeometry.boundingBox.max.x - boltGeometry.boundingBox.min.x) : 0.5;
    
    // Create a metallic material with gradient effect for bolt
    const boltMaterial = new THREE.MeshPhongMaterial({
      color: 0xa8c0d8,      // Base color (metallic silver)
      specular: 0xffffff,   // Specular highlights
      shininess: 90,        // Shininess for metallic look
      transparent: true,
      opacity: 0.95
    });
    
    const boltMesh = new THREE.Mesh(boltGeometry, boltMaterial);
    // Position centered horizontally, higher up on screen for more space
    boltMesh.position.set(0.5 - boltWidth/2, -0.25, -0.015);
    sceneRTT.add(boltMesh);
    
    // Create ".new" part - smaller, positioned right after bolt
    const newGeometry = new TextGeometry(".new", {
      font: assists.publicPixelFont,
      size: 0.11,
      height: 0.01,
      curveSegments: 6,
      bevelEnabled: false
    });
    
    // Calculate the right position to place it after "bolt"
    const newMaterial = new THREE.MeshPhongMaterial({
      color: 0x7b9bbd,      // Slightly lighter blue
      specular: 0xaaaaaa,   // Less intense specular
      shininess: 80,        // Slightly less shiny
      transparent: true,
      opacity: 0.9
    });
    
    const newMesh = new THREE.Mesh(newGeometry, newMaterial);
    // Position right after "bolt"
    newMesh.position.set(0.5 + boltWidth/2 - 0.04, -0.25, -0.015);
    sceneRTT.add(newMesh);
  }

  // Add a subtle highlight/glow to enhance the metallic effect
  const light = new THREE.PointLight(0xffffff, 0.8);
  light.position.set(0.5, -0.2, 0.3);
  sceneRTT.add(light);

  // Add a subtle ambient light for general illumination
  const ambientLight = new THREE.AmbientLight(0x404050, 0.5);
  sceneRTT.add(ambientLight);

  // Create a subtle grid pattern overlay
  const patternGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  const patternMaterial = new THREE.MeshBasicMaterial({
    color: 0x3498db,
    wireframe: true,
    transparent: true,
    opacity: 0.03
  });
  const pattern = new THREE.Mesh(patternGeometry, patternMaterial);
  pattern.position.set(0.5, -0.5, -0.005);
  sceneRTT.add(pattern);

  const screenTextEngine = ScreenTextEngine(
    assists,
    sceneRTT,
  );

  const screenRenderEngine = ScreenRenderEngine(assists, renderer, sceneRTT);

  // Display welcome message with better clarity (moved to bottom for logo visibility)
  screenTextEngine.placeMarkdown("\n\n\n\n\n\n\n# World's Largest Hackathon\n\n## $1M+ Prize Pool\n\n### May 2025\n\n> Join 100,000 builders for this historic event!\n\n");
  
  const tick = (deltaTime: number, elapsedTime: number) => {
    // Animate the background pattern very subtly
    pattern.rotation.z = elapsedTime * 0.02;
    
    // Subtle movement of the light to create a shimmer effect on the metallic text
    if (light) {
      light.position.x = 0.5 + Math.sin(elapsedTime * 0.6) * 0.15;
      light.position.z = 0.3 + Math.cos(elapsedTime * 0.5) * 0.05;
    }
    
    screenRenderEngine.tick(deltaTime, elapsedTime);
    screenTextEngine.tick(deltaTime, elapsedTime);
  };

  return { tick, screenRenderEngine, screenTextEngine };
}
