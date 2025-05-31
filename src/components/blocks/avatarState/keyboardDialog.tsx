import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Keyboard, Command, Settings2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface ShortcutKey {
  id: string;
  action: string;
  keys: string[];
  description: string;
}

interface KeyboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultShortcuts: ShortcutKey[] = [
  {
    id: "search",
    action: "Quick Search",
    keys: ["Ctrl", "K"],
    description: "Open search dialog"
  },
  {
    id: "save",
    action: "Save Changes",
    keys: ["Ctrl", "S"],
    description: "Save current changes"
  },
  {
    id: "new",
    action: "New Item",
    keys: ["Ctrl", "N"],
    description: "Create new item"
  },
  {
    id: "refresh",
    action: "Refresh",
    keys: ["Ctrl", "R"],
    description: "Refresh current view"
  }
];

const modifierKeys = ["Control", "Alt", "Shift", "Meta"];

export function KeyboardDialog({ open, onOpenChange }: KeyboardDialogProps) {
  const [shortcuts, setShortcuts] = useState<ShortcutKey[]>(defaultShortcuts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempKeys, setTempKeys] = useState<string[]>([]);

  useEffect(() => {
    // Load saved shortcuts from localStorage
    try {
      const savedShortcuts = localStorage.getItem("keyboard-shortcuts");
      if (savedShortcuts) {
        setShortcuts(JSON.parse(savedShortcuts));
      }
    } catch (error) {
      console.error("Error loading shortcuts:", error);
      toast.error("Failed to load keyboard shortcuts");
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, shortcut: ShortcutKey) => {
    e.preventDefault();
    if (editingId !== shortcut.id) return;

    // Handle modifier keys
    const modifiers: string[] = [];
    if (e.ctrlKey) modifiers.push("Ctrl");
    if (e.altKey) modifiers.push("Alt");
    if (e.shiftKey) modifiers.push("Shift");
    if (e.metaKey) modifiers.push("Meta");

    // Get the main key
    let key = e.key;
    if (key === " ") key = "Space";
    if (key.length === 1) key = key.toUpperCase();
    if (!modifierKeys.includes(key) && !tempKeys.includes(key)) {
      const newKeys = [...modifiers, key];
      setTempKeys(newKeys);
    }
  };

  const saveShortcut = (shortcut: ShortcutKey) => {
    if (tempKeys.length === 0) {
      toast.error("Please press some keys to set the shortcut");
      return;
    }

    try {
      const updatedShortcuts = shortcuts.map(s => 
        s.id === shortcut.id ? { ...s, keys: tempKeys } : s
      );
      setShortcuts(updatedShortcuts);
      localStorage.setItem("keyboard-shortcuts", JSON.stringify(updatedShortcuts));
      setEditingId(null);
      setTempKeys([]);
      toast.success("Keyboard shortcut updated successfully");
    } catch (error) {
      console.error("Error saving shortcut:", error);
      toast.error("Failed to save keyboard shortcut");
    }
  };

  const startEditing = (shortcut: ShortcutKey) => {
    setEditingId(shortcut.id);
    setTempKeys([]);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTempKeys([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Keyboard className="h-6 w-6" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Customize your keyboard shortcuts for faster navigation
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="p-6 max-h-[400px]">
          <div className="space-y-6">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.id}
                className="group flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
              >
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Command className="h-4 w-4" />
                    {shortcut.action}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {shortcut.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {editingId === shortcut.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        className="w-[200px] font-mono"
                        value={tempKeys.join(" + ")}
                        placeholder="Press keys..."
                        onKeyDown={(e) => handleKeyDown(e, shortcut)}
                        readOnly
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => saveShortcut(shortcut)}
                        className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700 hover:border-green-300"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={cancelEditing}
                        className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 hover:border-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, index) => (
                          <kbd
                            key={index}
                            className="px-2 py-1 text-xs rounded-md bg-background border shadow-sm"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEditing(shortcut)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
