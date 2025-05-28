import { useState } from "react";
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
<<<<<<< HEAD
import ProfileDialog from "./profileDialog";
import { KeyboardDialog } from "./keyboardDialog";
import { useShortcutListener } from "@/hooks/use-shortcut";
import { formatShortcut } from "@/components/utils/shortcutFormatter.ts";
=======
>>>>>>> 82912c6 (update admin)
import { LoaderCircle } from "lucide-react";
import { ProfileDialog } from "./profileDialog";
import { KeyboardDialog } from "./keyboardDialog";
import {
    User,
    LogOut,
    Keyboard,
    ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AvatarConfigProps {
    className?: string;
}

const AvatarConfig: React.FC<AvatarConfigProps> = ({ className = "" }) => {
    const { user, logout } = useContext(AuthContext)
    const [openProfileDialog, setOpenProfileDialog] = useState(false)
    const [openKeyboardDialog, setOpenKeyboardDialog] = useState(false)
<<<<<<< HEAD
=======
    const navigate = useNavigate()
>>>>>>> 82912c6 (update admin)

    const configAvaFromName = () => {
        if (!user || !user.first_name || !user.last_name) return "??";
        const firstChar = user.first_name.charAt(0).toUpperCase();
        const lastChar = user.last_name.charAt(0).toUpperCase();
        return firstChar + lastChar;
    };

<<<<<<< HEAD
    // Menu items
    const menuItems = [
        {
            name: "Profile",
            shortcut: "⇧⌘P",
            onClick: () => setOpenProfileDialog(true),
        },
        {
            name: "Keyboard Shortcuts",
            shortcut: "⌘K",
            onClick: () => setOpenKeyboardDialog(true),
        },
    ];
    menuItems.forEach(item => {
        useShortcutListener(item.shortcut, item.onClick);
    });
    useShortcutListener('⇧⌘L', () => logout())
=======
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }
>>>>>>> 82912c6 (update admin)

    return (
        <>
            <DropdownMenu>
                {user ? (
                    <>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {configAvaFromName()}
                                    </AvatarFallback>
                                </Avatar>
                                <ChevronDown className="h-4 w-4 text-muted-foreground absolute -bottom-1 -right-1 bg-background rounded-full" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-card" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {user.first_name} {user.last_name}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setOpenProfileDialog(true)}
                                className="cursor-pointer hover:bg-background"
                            >
<<<<<<< HEAD
                                <AvatarFallback className="bg-primary-dark text-white">{configAvaFromName()}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mr-4 bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {menuItems.map((item, index) => (
                                <DropdownMenuItem
                                    className="hover:bg-gray-100 hover:rounded-md cursor-pointer"
                                    key={index}
                                    onClick={item.onClick}
                                >
                                    {item.name}
                                    <DropdownMenuShortcut>{formatShortcut(item.shortcut)}</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => logout()} className="hover:bg-error hover:text-secondary hover:rounded-md cursor-pointer">
                            Log out
                            <DropdownMenuShortcut>{formatShortcut('⇧⌘L')}</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    <ProfileDialog
                        openProfileDialog={openProfileDialog}
                        setOpenProfileDialog={setOpenProfileDialog}
                        user={user}
                    />
                    <KeyboardDialog
                        open={openKeyboardDialog}
                        onOpenChange={setOpenKeyboardDialog}
                    />
                </>
            ) : (
                <div className="flex justify-center items-center py-10">
                    <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
        </DropdownMenu>
=======
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setOpenKeyboardDialog(true)}
                                className="cursor-pointer hover:bg-background"
                            >
                                <Keyboard className="mr-2 h-4 w-4" />
                                Keyboard shortcuts
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </>
                ) : (
                    <div className="flex justify-center items-center py-10">
                        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
            </DropdownMenu>

            <ProfileDialog
                open={openProfileDialog}
                onOpenChange={setOpenProfileDialog}
                user={user}
            />

            <KeyboardDialog
                open={openKeyboardDialog}
                onOpenChange={setOpenKeyboardDialog}
            />
        </>
>>>>>>> 82912c6 (update admin)
    )
}

export default AvatarConfig;
