import { useEffect } from "react";

const parseShortcut = (shortcut: string) => {
    return {
        shift: shortcut.includes("⇧"),
        meta: shortcut.includes("⌘"),
        ctrl: shortcut.includes("⌘") || shortcut.includes("Ctrl"),
        key: shortcut.replace(/⇧|⌘|Ctrl|\+/g, "").toLowerCase()
    };
};

export const useShortcutListener = (
    shortcut: string,
    callback: () => void
) => {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const { shift, meta, ctrl, key } = parseShortcut(shortcut);

            const isMac = navigator.platform.toUpperCase().includes("MAC");
            const isCorrectKey =
                e.key.toLowerCase() === key &&
                (!!e.shiftKey === shift) &&
                ((isMac ? e.metaKey : e.ctrlKey) === ctrl);

            if (isCorrectKey) {
                e.preventDefault();
                callback();
            }
        };

        window.addEventListener("keydown", handler);
        return () => {
            window.removeEventListener("keydown", handler);
        };
    }, [shortcut, callback]);
};
