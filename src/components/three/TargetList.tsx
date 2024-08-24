import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import { Target } from "./Target";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTF, GLTFLoader } from "three-stdlib";
import { Clone } from "@react-three/drei";

export function TargetList() {
  const [list, setList] = useState([]);
  //   const { scene } = useLoader(GLTFLoader, "/model/model.glb");
  //   const copiedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    let tempList = [];

    for (let index = 0; index < 10; index++) {
      tempList.push({
        n: Math.random() * 0.5 - 0.25,
      });
    }
    setList([...tempList]);
  }, []);

  return (
    <>
      <group dispose={null}>
        {list.map((item, index) => (
          <RigidBody
            type="dynamic"
            colliders={"cuboid"}
            restitution={0.98}
            mass={40}
            onContactForce={(payload) => {
              console.log(
                `The total force generated was: ${payload.totalForce}`,
                payload.totalForce
              );
            }}
            position={new THREE.Vector3(-0.9 + item.n * 2, 1.5, -0.7 - index)}
          >
            <Target></Target>
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
