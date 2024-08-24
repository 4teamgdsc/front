import * as THREE from "three";

export function Floor() {
  return (
    <mesh
      visible
      position={new THREE.Vector3(0, 0, 0)}
      rotation={new THREE.Euler(0, 0, 0)}
      geometry={new THREE.BoxGeometry(4, 0.2, 4)}
      castShadow={true}
      receiveShadow={true}
    >
      <meshStandardMaterial color={"#ffffff"} />
    </mesh>
  );
}
