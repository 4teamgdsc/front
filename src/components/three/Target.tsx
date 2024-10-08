import { Clone } from "@react-three/drei";
import * as THREE from "three";

export function Target({ scene }: any) {
  return (
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
  );
}
