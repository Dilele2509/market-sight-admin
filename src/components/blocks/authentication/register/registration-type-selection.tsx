"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

type RegistrationTypeSelectionProps = {
    direction: "left" | "right"
    onSelect: (type: "business" | "account") => void
}

export function RegistrationTypeSelection({ direction, onSelect }: RegistrationTypeSelectionProps) {
    return (
        <motion.div
            key="step0"
            initial={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === "left" ? -400 : 400 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
        >
            <div className="grid grid-cols-2 gap-4">
                <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => onSelect("business")}
                >
                    <span className="text-lg font-semibold">Business</span>
                    <span className="text-xs text-muted-foreground">Register a company account</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => onSelect("account")}
                >
                    <span className="text-lg font-semibold">Personal</span>
                    <span className="text-xs text-muted-foreground">Register an individual account</span>
                </Button>
            </div>
        </motion.div>
    )
}
