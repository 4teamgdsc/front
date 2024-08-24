import { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { GLTF, GLTFLoader } from "three-stdlib";

export function Knife(props: ThreeElements["mesh"]) {
  const gltf = useLoader(GLTFLoader, "/model/Katana_export.glb");
  return (
    <mesh {...props}>
      <primitive
        visible
        rotation={new THREE.Euler(0, Math.PI, 0)}
        position={new THREE.Vector3(0, -0.4, 0)}
        castShadow={true}
        receiveShadow={true}
        object={gltf.scene}
      />
      {/* <mesh>
        <meshStandardMaterial color={"#595c6b"} />
      </mesh> */}
    </mesh>
  );
}
