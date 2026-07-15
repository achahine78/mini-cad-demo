import * as THREE from "three";
import type { SceneManager } from "./SceneManager";

export class InteractionManager {
    private sceneManager: SceneManager;
    private canvas: HTMLElement;
    private raycaster = new THREE.Raycaster();

    selectedPart: THREE.Mesh | null;

    constructor(sceneManager: SceneManager) {
        this.sceneManager = sceneManager;
        this.canvas = sceneManager.renderer.domElement;

        this.canvas.addEventListener("pointerdown", this.onPointerDown);
    }

    getPointerNdc(event: PointerEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const pointerNdc = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1,
        );

        return pointerNdc;
    }

    pickPart(pointerNdc: THREE.Vector2) {
        this.raycaster.setFromCamera(pointerNdc, this.sceneManager.camera);
        const parts = this.sceneManager.scene.children.filter(
            (child) => child.name === "part",
        );
        const hits = this.raycaster.intersectObjects(parts);
        return hits.length > 0 ? (hits[0].object as THREE.Mesh) : null;
    }

    setHighlightValue(part: THREE.Mesh, value: boolean) {
        const emissiveHexValue = value ? 0x2266ff : 0x000000;
        const material = part.material as THREE.MeshStandardMaterial;
        material.emissive.setHex(emissiveHexValue);
        material.emissiveIntensity = value ? 0.5 : 1;
    }

    select(part: THREE.Mesh | null) {
        if (this.selectedPart === part) return;

        if (this.selectedPart) {
            this.setHighlightValue(this.selectedPart, false);
        }

        this.selectedPart = part;
        if (this.selectedPart) {
            this.setHighlightValue(part, true);
        }
    }

    onPointerDown = (event: PointerEvent) => {
        const pointerNdc = this.getPointerNdc(event);
        const part = this.pickPart(pointerNdc);
        this.select(part);
    };

    dispose() {
        this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    }
}
