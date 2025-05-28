// utils/shortcutFormatter.ts
export const isMac = () => {
    return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}

export const formatShortcut = (shortcut: string): string => {
    if (isMac()) return shortcut;

    return shortcut
        .replace(/⌘/g, "Ctrl")
        .replace(/⇧/g, "Shift")
        .replace(/⌥/g, "Alt")
        .replace(/⎋/g, "Esc");
};
