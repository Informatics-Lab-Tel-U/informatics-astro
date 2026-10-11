import { navigate } from "astro:transitions/client";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

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
    const abortController = new AbortController();

    const fetchPosts = async () => {
      if (open && posts.length === 0) {
        setLoading(true);
        try {
          const res = await fetch("/api/search.json", { signal: abortController.signal });
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          setPosts(data || []);
        } catch (err: any) {
          if (err.name !== "AbortError") {
            console.error("Failed to fetch search index:", err);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => abortController.abort();
  }, [open, posts.length]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="w-full overflow-hidden rounded-xl bg-transparent">
        <CommandInput
          placeholder="Cari artikel..."
          addonEnd={
            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-sm p-1 text-muted-foreground transition-colors outline-none hover:bg-muted/50 hover:text-foreground"
              aria-label="Tutup pencarian"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          }
        />
        <CommandList>
          <CommandEmpty>{loading ? "Memuat..." : "Hasil tidak ditemukan."}</CommandEmpty>
          {!loading && posts.length > 0 && (
            <>
              {Array.from(new Set(posts.map((post) => post.category?.name || "Uncategorized"))).map(
                (category) => (
                  <CommandGroup heading={category} key={category}>
                    {posts
                      .filter((post) => (post.category?.name || "Uncategorized") === category)
                      .map((post) => (
                        <CommandItem
                          key={post.id}
                          value={post.title}
                          onSelect={() => {
                            navigate(`/post/${post.slug}`);
                            setOpen(false);
                          }}
                          className="flex cursor-pointer items-start gap-3 py-3"
                        >
                          <div className="flex w-full flex-col gap-1.5">
                            <div className="leading-none font-medium text-foreground">
                              {post.title}
                            </div>
                            {post.description && (
                              <div className="line-clamp-1 text-xs text-muted-foreground">
                                {post.description}
                              </div>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                ),
              )}
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
