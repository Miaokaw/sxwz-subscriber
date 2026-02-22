import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useState } from "react";

import { SearchIcon, PlusIcon, XIcon } from "lucide-react";

export function SubAdder({ onAdd }: { onAdd: (query: string) => void }) {
    const [query, setQuery] = useState("");

    const handleAdd = () => {
        if (query.trim()) {
            onAdd(query);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAdd();
        } else if (e.key === 'Escape') {
            setQuery('');
        }
    };

    return (
        <div className="relative flex items-center w-full">
            <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="直播间ID\直播间链接..."
                className="pl-10 pr-8 py-2 w-full rounded-lg border border-input bg-background focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
            />
            <SearchIcon
                className="absolute left-3 h-4 w-4 text-muted-foreground"
            />
            {query && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-10 h-6 w-6 rounded-full p-0 hover:bg-transparent"
                    onClick={() => setQuery('')}
                >
                    <XIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>
            )}
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 rounded-r-xl"
                onClick={() => handleAdd()}
            >
                <PlusIcon />
            </Button>
        </div>
    )
}