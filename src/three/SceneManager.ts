import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

export class SceneManager {
    scene = new THREE.Scene();
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;

    private animationId = 0;

    constructor(viewport: HTMLElement) {
        const { width, height } = viewport.getBoundingClientRect();

        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        this.camera.position.set(8, 6, 7);
        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        viewport.appendChild(this.renderer.domElement);

        this.scene.background = new THREE.Color(0xf0f2f5);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        const gridHelperSize = 20;
        const gridHelperDivisions = 40;
        const gridHelper = new THREE.GridHelper(
            gridHelperSize,
            gridHelperDivisions,
        );
        this.scene.add(gridHelper);

        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement,
        );
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.05;

        this.animate();
    }

    animate = () => {
        this.animationId = requestAnimationFrame(this.animate);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    };

    dispose() {
        cancelAnimationFrame(this.animationId);
        this.controls.dispose();
        this.renderer.dispose();
    }
}
