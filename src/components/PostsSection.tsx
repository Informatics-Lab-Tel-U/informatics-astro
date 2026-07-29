import * as React from "react";
import { useState, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import type { BlogPost, Category, Tag } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PostsSectionProps {
  posts: BlogPost[];
  categories: Category[];
  tags: Tag[];
}

export function PostsSection({ posts, categories, tags }: PostsSectionProps) {
  const [selectedTimeline, setSelectedTimeline] = useState<string>("all");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 5);
  const displayedTags = showAllTags ? tags : tags.slice(0, 10);

  const filteredPosts = useMemo(() => {
    if (selectedTimeline === "all") return posts;
    const now = new Date();

    return posts.filter((post) => {
      if (!post.pubDate) return true;
      const postDate = new Date(post.pubDate);
      const diffDays = (now.getTime() - postDate.getTime()) / (1000 * 3600 * 24);

      if (selectedTimeline === "7days") {
        return diffDays <= 7;
      }
      if (selectedTimeline === "30days") {
        return diffDays <= 30;
      }
      if (selectedTimeline === "this_month") {
        return (
          postDate.getMonth() === now.getMonth() &&
          postDate.getFullYear() === now.getFullYear()
        );
      }
      if (selectedTimeline === "this_year") {
        return postDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [posts, selectedTimeline]);

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Main Content: Post Grid */}
      <div className="flex-1">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id || post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-muted-foreground border border-dashed border-border rounded-2xl">
            Tidak ada postingan untuk rentang waktu yang dipilih.
          </div>
        )}
      </div>

      {/* Sidebar: Timeline Filter, Kategori, Tags */}
      <aside className="w-full lg:w-80 flex-shrink-0 space-y-10">
        {/* Timeline Dropdown Filter */}
        <div>
          <h3 className="text-lg font-semibold tracking-tight mb-4 border-b border-border pb-2 text-foreground">
            Timeline
          </h3>
          <Select value={selectedTimeline} onValueChange={(val) => setSelectedTimeline(val ?? "all")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Timeline">
                {selectedTimeline === "all" && "Semua Waktu"}
                {selectedTimeline === "7days" && "7 Hari Terakhir"}
                {selectedTimeline === "30days" && "30 Hari Terakhir"}
                {selectedTimeline === "this_month" && "Bulan Ini"}
                {selectedTimeline === "this_year" && "Tahun Ini"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Waktu</SelectItem>
              <SelectItem value="7days">7 Hari Terakhir</SelectItem>
              <SelectItem value="30days">30 Hari Terakhir</SelectItem>
              <SelectItem value="this_month">Bulan Ini</SelectItem>
              <SelectItem value="this_year">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kategori Links */}
        <div>
          <h3 className="text-lg font-semibold tracking-tight mb-4 border-b border-border pb-2 text-foreground">
            Kategori
          </h3>
          <ul className="space-y-2">
            {displayedCategories.map((cat) => (
              <li key={cat.id || cat.slug}>
                <a
                  href={`/category/${cat.slug}`}
                  className="text-foreground/80 hover:text-primary transition-colors flex items-center justify-between group"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              </li>
            ))}
          </ul>
          {categories.length > 5 && (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setShowAllCategories(!showAllCategories)}
            >
              {showAllCategories ? "Tampilkan Lebih Sedikit" : `Tampilkan Semua Kategori (${categories.length})`}
            </Button>
          )}
        </div>

        {/* Topik Populer (Tags) Links */}
        <div>
          <h3 className="text-lg font-semibold tracking-tight mb-4 border-b border-border pb-2 text-foreground">
            Topik Populer (Tags)
          </h3>
          <div className="flex flex-wrap gap-2">
            {displayedTags.map((tag) => (
              <a
                key={tag.id || tag.slug}
                href={`/tag/${tag.slug}`}
                className="text-xs font-medium text-foreground/80 bg-secondary/30 hover:bg-secondary/60 hover:text-foreground transition-colors px-3 py-1.5 rounded-md border border-transparent"
              >
                #{tag.name}
              </a>
            ))}
            {tags.length > 10 && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setShowAllTags(!showAllTags)}
              >
                {showAllTags ? "Lebih Sedikit" : `+${tags.length - 10} Tag Lainnya`}
              </Button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
