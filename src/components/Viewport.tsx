import { useEffect, useRef } from "react";
import { SceneManager } from "../three/SceneManager";
import "./Viewport.css";

export const Viewport = () => {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const sceneManagerRef = useRef<SceneManager | null>(null);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return
        const sceneManager = new SceneManager(viewport);
        sceneManagerRef.current = sceneManager;

        return () => {
            sceneManager.dispose();
            viewport.innerHTML = "";
        };
    }, []);
    return <div className="viewport" ref={viewportRef} />;
};
