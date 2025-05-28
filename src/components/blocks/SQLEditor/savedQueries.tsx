import { useState } from "react"
import { ChevronDown, ChevronRight, Database, Star, StarOff } from "lucide-react"
import { Button } from "@/components/ui/button"

function SavedQueries({ privateQueries, setQuery, toggleFavorite }) {
    const [isOpen, setIsOpen] = useState(true) // mặc định mở, bạn có thể đổi thành false

    return (
        <div className="mb-4">
            <button
                className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-left hover:bg-muted"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                    <span>SAVED ({privateQueries.length})</span>
                </div>
            </button>

            {isOpen && (
                <div className="mt-1 pl-4">
                    {privateQueries.map((query) => (
                        <button
                            key={query.id}
                            className="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left hover:bg-muted"
                            onClick={() => setQuery(query.query)}
                        >
                            <Database className="h-4 w-4 text-muted-foreground" />
                            <span className="flex-1 truncate">{query.name}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFavorite(query.id)
                                }}
                            >
                                {query.isFavorite ? (
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                ) : (
                                    <StarOff className="h-3.5 w-3.5" />
                                )}
                            </Button>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SavedQueries