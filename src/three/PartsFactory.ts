import * as THREE from "three";

export type PartType =
    | "rectangular_extrusion"
    | "flat_plate"
    | "cylindrical_extrusion";

export type PartDefinition = {
    type: PartType;
    label: string;
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
    color: number;
};

export const PARTS_CATALOG: PartDefinition[] = [
    {
        type: "rectangular_extrusion",
        label: "Rectangular Extrusion",
        dimensions: {
            width: 0.45,
            height: 0.45,
            depth: 4,
        },
        color: 0x8a9ba8,
    },
    {
        type: "flat_plate",
        label: "Flat Plate",
        dimensions: {
            width: 2,
            height: 0.1,
            depth: 2,
        },
        color: 0xd3d3d3,
    },
    {
        type: "cylindrical_extrusion",
        label: "Cylindrical Extrusion",
        dimensions: {
            width: 0.45,
            height: 0.45,
            depth: 4,
        },
        color: 0x8a9ba8,
    },
];

const getGeometry = ({
    type,
    width,
    height,
    depth,
}: {
    type: PartType;
    width: number;
    height: number;
    depth: number;
}) => {
    if (type === "rectangular_extrusion" || type === "flat_plate") {
        return new THREE.BoxGeometry(width, height, depth);
    }

    if (type === "cylindrical_extrusion") {
        const geometry = new THREE.CylinderGeometry(
            width / 2,
            width / 2,
            depth,
        );
        geometry.rotateX(Math.PI / 2);
        return geometry;
    }
};

export const createPartMesh = ({
    type,
    id,
}: {
    type: PartType;
    id: string;
}) => {
    const part = PARTS_CATALOG.find((p) => p.type === type);
    if (!part) {
        throw new Error(`Unknown part type: ${type}`);
    }
    const { width, height, depth } = part.dimensions;

    const geometry = getGeometry({ type, width, height, depth });
    const material = new THREE.MeshStandardMaterial({
        color: part.color,
        metalness: 0.6,
        roughness: 0.4,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.partId = id;
    mesh.userData.partType = type;
    mesh.name = "part";
    mesh.position.y = type === "cylindrical_extrusion" ? width / 2 : height / 2;

    return mesh;
};
