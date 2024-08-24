import { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

export function Knife(props: ThreeElements["mesh"]) {
  return (
    <mesh
      visible
      {...props}
      geometry={new THREE.BoxGeometry(0.1, 1, 0.1)}
      castShadow={true}
      receiveShadow={true}
    >
      <meshStandardMaterial color={"#595c6b"} />
    </mesh>
  );
}
