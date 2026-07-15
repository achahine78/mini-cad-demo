import * as THREE from "three";
import type { SceneManager } from "./SceneManager";

export class InteractionManager {
    private sceneManager: SceneManager;
    private canvas: HTMLElement;
    private raycaster = new THREE.Raycaster();
    private dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    private grabOffset = new THREE.Vector3();
    private isDragging = false;

    selectedPart: THREE.Mesh | null = null;

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
        if (part) {
            this.setHighlightValue(part, true);
        }
    }

    onPointerMove = (event: PointerEvent) => {
        if (!this.isDragging || !this.selectedPart) return;
        const pointerNdc = this.getPointerNdc(event);
        this.raycaster.setFromCamera(pointerNdc, this.sceneManager.camera);

        const intersection = new THREE.Vector3();

        if (this.raycaster.ray.intersectPlane(this.dragPlane, intersection)) {
            const target = intersection.add(this.grabOffset);
            this.selectedPart.position.set(
                this.snap(target.x, 0.5),
                this.selectedPart.position.y,
                this.snap(target.z, 0.5),
            );
        }
    };

    snap(value: number, gridSnap: number) {
        return Math.round(value / gridSnap) * gridSnap;
    }

    onPointerUp = () => {
        this.isDragging = false;
        this.sceneManager.controls.enabled = true;
        this.canvas.style.cursor = "";
        this.canvas.removeEventListener("pointermove", this.onPointerMove);
        this.canvas.removeEventListener("pointerup", this.onPointerUp);
    };

    onPointerDown = (event: PointerEvent) => {
        if (event.button !== 0) return;

        const pointerNdc = this.getPointerNdc(event);
        const part = this.pickPart(pointerNdc);
        this.select(part);

        if (!part) return;

        this.dragPlane.setFromNormalAndCoplanarPoint(
            new THREE.Vector3(0, 1, 0),
            part.position,
        );

        const intersection = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(this.dragPlane, intersection)) {
            this.grabOffset.copy(part.position).sub(intersection);
        } else {
            this.grabOffset.set(0, 0, 0);
        }

        this.isDragging = true;
        this.sceneManager.controls.enabled = false;
        this.canvas.style.cursor = "grabbing";

        this.canvas.addEventListener("pointermove", this.onPointerMove);
        this.canvas.addEventListener("pointerup", this.onPointerUp);
    };

    dispose() {
        this.canvas.removeEventListener("pointerdown", this.onPointerDown);
        this.canvas.removeEventListener("pointermove", this.onPointerMove);
        this.canvas.removeEventListener("pointerup", this.onPointerUp);
    }
}
