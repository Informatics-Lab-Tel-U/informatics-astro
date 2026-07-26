import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/api";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  // Format the date (e.g., 20 Jul 2026)
  const formattedDate = new Date(post.pubDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <a href={`/blog/${post.slug}`} className="block group h-full">
      <Card className="flex flex-col h-full overflow-hidden rounded-3xl border border-border shadow-none group-hover:border-primary/20 transition-colors duration-300 bg-background p-0 gap-0 cursor-pointer">
        {post.heroImage && (
          <div className="aspect-video w-full bg-muted rounded-t-3xl overflow-hidden relative">
            <img
              src={post.heroImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader className="flex-1 px-6 pt-4 pb-2">
          <div className="flex items-center justify-between gap-2 mb-3">
            <Badge variant="secondary" className="rounded-md px-2.5 py-0.5 text-xs font-medium">
              {post.category.name}
            </Badge>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
          <CardTitle className="line-clamp-2 text-xl font-semibold tracking-tight text-foreground">
            {post.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 mt-2 text-muted-foreground text-[15px] leading-relaxed">
            {post.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="px-6 pb-6 pt-0 mt-auto flex flex-wrap gap-2">
          {post.tags && post.tags.length > 0 ? (
            post.tags.map((tag) => (
              <Badge
                key={tag.id || tag.slug || tag.name}
                variant="outline"
                className="rounded-md px-2 py-0.5 text-xs font-medium text-muted-foreground bg-muted/50 border-transparent"
              >
                {tag.name}
              </Badge>
            ))
          ) : null}
        </CardFooter>
      </Card>
    </a>
  );
}
