import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import { Target } from "./Target";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTF, GLTFLoader } from "three-stdlib";
import { Clone, PositionalAudio } from "@react-three/drei";
import { useBackgroundStore } from "../../store/backgroundColor";
import { useKcalStore } from "../../store/kcal";

export function TargetList() {
  const [list, setList] = useState([]);
  //   const { scene } = useLoader(GLTFLoader, "/model/model.glb");
  //   const copiedScene = useMemo(() => scene.clone(), [scene]);
  const backgroundStore = useBackgroundStore();
  const [isFixed, setIsFixed] = useState(false);
  const kcalStore = useKcalStore();
  const audioRef: any = useRef();

  useEffect(() => {
    let tempList = [];

    for (let index = 0; index < 30; index++) {
      tempList.push({
        n: Math.random() * 0.5 - 0.25,
        c: false,
      });
    }
    setList([...tempList]);
  }, []);

  return (
    <>
      {/* <PositionalAudio
        ref={audioRef}
        autoplay
        loop={false}
        url="/sound/hit.mp3"
        distance={30}
      /> */}
      <group dispose={null}>
        {list.map((item, index) => (
          <RigidBody
            type="dynamic"
            colliders={"cuboid"}
            restitution={0.98}
            mass={40}
            onCollisionEnter={({ manifold, target, other }) => {
              console.log(
                "Collision at world position ",
                manifold.solverContactPoint(0)
              );

              if (other.rigidBodyObject) {
                // audioRef.current.play();
                // setTimeout(() => {
                //   audioRef.current.pause();
                // }, 500);
                console.log(
                  // this rigid body's Object3D
                  target.rigidBodyObject.name,
                  " collided with ",
                  // the other rigid body's Object3D
                  other.rigidBodyObject.name
                );
              }
            }}
            onContactForce={(payload) => {
              if (payload.totalForce.y > 15) {
                backgroundStore.changeColor("#f5e9e9");
                if (isFixed == false) {
                  kcalStore.addKcal(0.05);
                  setTimeout(() => {
                    setIsFixed(false);
                  }, 800);
                }
                setIsFixed(true);
              } else {
                if (isFixed == false) {
                  backgroundStore.changeColor("#ffffff");
                }
              }
            }}
            position={new THREE.Vector3(-0.9 + item.n * 2, 1.5, -0.7 - index)}
          >
            <mesh
              visible
              position={new THREE.Vector3(0, -0.5, 0)}
              geometry={new THREE.BoxGeometry(0.4, 2, 0.5)}
              castShadow={true}
              receiveShadow={true}
            >
              {/* <Clone object={scene} /> */}

              <meshStandardMaterial color={"#ffffff"} />
            </mesh>
          </RigidBody>
        ))}
      </group>
    </>
  );
}

export function TargetModel({ gltf }: any) {
  return (
    <primitive
      visible
      rotation={new THREE.Euler(0, Math.PI, 0)}
      position={new THREE.Vector3(0, -0.4, 0)}
      castShadow={true}
      receiveShadow={true}
      object={gltf}
    />
  );
}
