import * as React from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

export interface SearchPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: { name: string; slug: string };
}

interface CommandMenuProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
  const [posts, setPosts] = React.useState<SearchPost[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Toggle CommandMenu on Ctrl+K / Cmd+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  // Fetch posts when modal opens for the first time
  React.useEffect(() => {
    if (open && posts.length === 0) {
      setLoading(true);
      fetch('/api/search.json')
        .then((res) => res.json())
        .then((data) => {
          setPosts(data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch search index:", err);
          setLoading(false);
        });
    }
  }, [open, posts.length]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="w-full bg-transparent overflow-hidden rounded-xl">
        <CommandInput placeholder="Cari artikel..." />
        <CommandList>
          <CommandEmpty>{loading ? "Memuat..." : "Hasil tidak ditemukan."}</CommandEmpty>
          {!loading && posts.length > 0 && (
            <CommandGroup heading="Artikel">
              {posts.map((post) => (
                <CommandItem
                  key={post.id}
                  value={post.title}
                  onSelect={() => {
                    window.location.href = `/post/${post.slug}`;
                    setOpen(false);
                  }}
                  className="flex items-start gap-3 py-3 cursor-pointer"
                >
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="font-medium text-foreground leading-none">{post.title}</div>
                    {post.description && (
                      <div className="text-xs text-muted-foreground line-clamp-1">{post.description}</div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-4">
                        {post.category?.name || "Uncategorized"}
                      </Badge>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
