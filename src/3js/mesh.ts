import * as THREE from 'three';

import { CustomColyseusClient, Move, Players } from '../hooks/multiplay/types';

type CubeMap = Record<string, THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>>;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer();

let cubes: CubeMap = {};
let count = 0;

export function canvasInitialize(myPlayer: CustomColyseusClient) {
  let canvasElement =
    document.getElementById('multiplay-area') ??
    (() => {
      const newCanvasElement = document.createElement('div');

      document.body.appendChild(newCanvasElement);

      return newCanvasElement;
    })();

  camera.position.z = 4;
  camera.position.x = 4;
  camera.position.y = 4;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
  canvasElement.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: '#ff0000' });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cubes[myPlayer.sessionId] = cube;

  // 내 행동 계속 감지해서 돌려줌
  function myAnimate() {
    requestAnimationFrame(myAnimate);
    count += 0.03;
    cube.position.x = Math.sin(count) * 2;
    cube.position.z = Math.cos(count) * 2;
    renderer.render(scene, camera);

    myPlayer.send('move', {
      pos: {
        x: cube.position.x,
        y: 0,
        z: cube.position.z,
      },
      rot: {
        x: 0,
        y: 0,
        z: 0,
      },
      ani: 0,
    });
  }

  myAnimate();

  return {
    myPlayer,
    renderer,
    scene,
    camera,
    cube,
  };
}

export function othersAnimate(myPlayer: CustomColyseusClient, players: Players) {
  requestAnimationFrame(() => othersAnimate(myPlayer, players));

  for (const [key, _value] of Object.entries(players)) {
    if (key === myPlayer.sessionId) continue;

    if (key in cubes) {
      cubes[key].position.x = players[key].posx;
      cubes[key].position.z = players[key].posz;
    } else {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: '#ff0000' });
      const newCube = new THREE.Mesh(geometry, material);
      scene.add(newCube);
      cubes[key] = newCube;
    }
  }

  for (const [key, value] of Object.entries(cubes)) {
    if (!(key in players)) {
      scene.remove(value);
      delete cubes[key];
    }
  }
}

// export function animate(params: AnimateParams) {
//   const { renderer, scene, camera, cube, players } = params;

//   console.log(players);

//   requestAnimationFrame(() => animate({ renderer, scene, camera, cube, players, myPlayer }));

//   count += 0.03;
//   cube.position.x = Math.sin(count) * 2;
//   cube.position.z = Math.cos(count) * 2;

//   for (const [key, _value] of Object.entries(players)) {
//     if (key === myPlayer.sessionId) continue;

//     if (key in cubes) {
//       cubes[key].position.x = players[key].posx;
//       cubes[key].position.z = players[key].posz;
//     } else {
//       const geometry = new THREE.BoxGeometry(1, 1, 1);
//       const material = new THREE.MeshBasicMaterial({ color: '#ff0000' });
//       const newCube = new THREE.Mesh(geometry, material);
//       scene.add(newCube);
//       cubes[key] = newCube;
//     }
//   }

//   for (const [key, value] of Object.entries(cubes)) {
//     if (!(key in players)) {
//       scene.remove(value);
//       delete cubes[key];
//     }
//   }

//   const move: Move = {
//     pos: {
//       x: cubes[myPlayer.sessionId].position.x,
//       y: 0,
//       z: cubes[myPlayer.sessionId].position.z,
//     },
//     rot: {
//       x: 0,
//       y: 0,
//       z: 0,
//     },
//     ani: 0,
//   };

//   myPlayer.send('move', move);

//   renderer.render(scene, camera);
// }

// import * as THREE from 'three';

// const sizes = {
//   width: 800,
//   height: 600
// }

// const scene = new THREE.Scene()

// // Camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
// camera.position.z = 4
// camera.position.x = 4
// camera.position.y = 4
// camera.lookAt(new THREE.Vector3(0,0,0))
// scene.add(camera)

// let count = 0;
// //const some_empty_function = () => void;
// let myCharacter: Player = { ani: 0,
//   playType: "multiplayMode",
//   posx: 0,
//   posy: 0,
//   posz: 0,
//   rotx: 0,
//   roty: 0,
//   rotz: 0,
//   username: "",
//   nickname: "",
//   type: "male",
//   hair: 1,
//   face: 1,
//   top: 1,
//   bottom: 1,
//   shoes: 1,
// };
// let meshs: meshsType = {}
// const renderer = new THREE.WebGLRenderer({
//   canvas: canvasRef.current ?? undefined
// })
// renderer.setSize(sizes.width, sizes.height)
// renderer.render(scene, camera)
// //내꺼
// const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// const cubeMaterial = new THREE.MeshBasicMaterial({
//   color: '#ff0000'
// })
// const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
// scene.add(cubeMesh)
// meshs[myPlayer?.sessionId] = cubeMesh;
// console.log("initial");
// const animate = () => {

//   count += 0.03;
//   meshs[myPlayer?.sessionId].position.x = Math.sin(count)*2;
//   meshs[myPlayer?.sessionId].position.z = Math.cos(count)*2;
//   for(const [key, value] of Object.entries(players)){
//       if(key === myPlayer?.sessionId) continue;
//       if(key in meshs){
//           meshs[key].position.x = players[key].posx;
//           meshs[key].position.z = players[key].posz;
//       }
//       else{
//           const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
//           const cubeMaterial = new THREE.MeshBasicMaterial({
//               color: '#ff0000'
//           })
//           const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
//           meshs[key] = cubeMesh;
//           scene.add(cubeMesh)
//       }
//   }
//   for(const [key, value] of Object.entries(meshs)){
//       if(!(key in players)){
//           scene.remove(value);
//           delete meshs[key];
//       }
//   }
//   let move: Move = {
//       pos: {
//           x: meshs[myPlayer?.sessionId].position.x,
//           y: 0,
//           z: meshs[myPlayer?.sessionId].position.z,
//       },
//       rot: {
//           x: 0,
//           y:0,
//           z:0,
//       },
//       ani: 0,
//   };
//   playerMove(move);
//   console.log(players,meshs);
//   // console.log(characterRef.current[sessionIdRef.current].posz);
//   renderer.render(scene, camera);
//   once.current=true;
//   !once.current && requestAnimationFrame(animate);
// }
// animate();
