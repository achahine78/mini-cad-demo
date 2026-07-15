import { useRef, useState } from "react";
import { Viewport } from "./components/Viewport";
import { Sidebar } from "./components/Sidebar";
import type { SceneManager } from "./three/SceneManager";
import {
    createPartMesh,
    PARTS_CATALOG,
    type PartDefinition,
    type PartType,
} from "./three/PartsFactory";

function App() {
    const sceneManagerRef = useRef<SceneManager | null>(null);
    const [, setParts] = useState<PartDefinition[]>([]);
    const [partCounter, setPartCounter] = useState(0);

    const handleAddPart = (type: PartType) => {
        const manager = sceneManagerRef.current;
        if (!manager) return;

        const mesh = createPartMesh({ id: `part_${partCounter}`, type });
        mesh.position.x += (Math.random() - 0.5) * 2;
        mesh.position.z += (Math.random() - 0.5) * 2;

        manager.scene.add(mesh);

        const addedPartDefinition = PARTS_CATALOG.find((p) => p.type === type);
        if (!addedPartDefinition) return;

        setParts((p) => [...p, addedPartDefinition]);
        setPartCounter((c) => c + 1);
    };
    return (
        <div className="app">
            <Sidebar onAddPart={handleAddPart} />
            <div className="viewport-container">
                <Viewport
                    onSceneManagerReady={(manager) => {
                        sceneManagerRef.current = manager;
                    }}
                />
            </div>
        </div>
    );
}

export default App;
