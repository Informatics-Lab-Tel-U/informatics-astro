import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SortFilter({ initialSort }: { initialSort: string }) {
  // Normalisasi legacy parameter agar selalu menggunakan newest/oldest di state komponen
  const normalizedValue =
    initialSort === "oldest" || initialSort === "Terlama" ? "oldest" : "newest";

  const handleSortChange = (value: string | null) => {
    if (!value) return;
    const url = new URL(window.location.href);
    url.searchParams.set("sort", value);
    window.location.assign(url.toString());
  };

  const labels: Record<string, string> = {
    newest: "Terbaru",
    oldest: "Terlama",
  };

  return (
    <Select value={normalizedValue} onValueChange={handleSortChange}>
      <SelectTrigger className="h-10 w-full bg-background">
        <SelectValue placeholder="Urutkan">
          {(val: string | null) => (val ? labels[val] : "Urutkan")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Terbaru</SelectItem>
        <SelectItem value="oldest">Terlama</SelectItem>
      </SelectContent>
    </Select>
  );
}
