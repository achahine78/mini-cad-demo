import { useEffect, useRef } from "react";
import { SceneManager } from "../three/SceneManager";
import "./Viewport.css";
import { InteractionManager } from "../three/InteractionManager";

type Props = {
    onSceneManagerReady: (manager: SceneManager) => void;
};

export const Viewport = ({ onSceneManagerReady }: Props) => {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const sceneManagerRef = useRef<SceneManager | null>(null);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const sceneManager = new SceneManager(viewport);
        sceneManagerRef.current = sceneManager;

        const interactionManager = new InteractionManager(sceneManager);

        onSceneManagerReady(sceneManager);

        return () => {
            interactionManager.dispose();
            sceneManager.dispose();
            viewport.innerHTML = "";
        };
    }, []);
    return <div className="viewport" ref={viewportRef} />;
};
