import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Target } from "./Target";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function TargetList() {
  const [list, setList] = useState([1]);

  //   useEffect(() => {
  //     let tempList = [];

  //     for (let index = 0; index < 13; index++) {
  //       tempList.push(Math.random() * 1 - 0.5);
  //     }
  //     setList([...tempList]);
  //   }, []);

  return (
    <>
      {list.map((item, index) => (
        <RigidBody
          type="dynamic"
          colliders={"cuboid"}
          restitution={0.4}
          mass={400}
          onContactForce={(payload) => {
            console.log(
              `The total force generated was: ${payload.totalForce}`,
              payload.totalForce
            );
          }}
          position={new THREE.Vector3(-0.5 + item, 1.5, -0.7 - index)}
        >
          <Target />
        </RigidBody>
      ))}
    </>
  );
}
