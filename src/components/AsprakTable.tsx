"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AsprakRow {
  id: string;
  nama_lengkap: string;
  kode: string;
  angkatan: number;
  role: string;
}

interface Props {
  initialData: AsprakRow[];
  availableTerms?: string[];
  initialTerm?: string;
}

const PAGE_SIZE = 20;

function formatTermLabel(term: string): string {
  const match = term.match(/^(\d{2})(\d{2})-(\d)$/);
  if (match) {
    const y1 = `20${match[1]}`;
    const y2 = `20${match[2]}`;
    const sem = match[3] === "1" ? "Ganjil" : match[3] === "2" ? "Genap" : `Sem ${match[3]}`;
    return `${y1}/${y2} ${sem}`;
  }
  return term;
}

export function AsprakTable({ initialData, availableTerms = [], initialTerm = "all" }: Props) {
  const [selectedTerm, setSelectedTerm] = React.useState<string>(initialTerm);
  const [data, setData] = React.useState<AsprakRow[]>(initialData);
  const [filterAngkatan, setFilterAngkatan] = React.useState<string>("all");
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const angkatanOptions = React.useMemo(() => {
    return [...new Set(data.map((a) => a.angkatan))].sort((a, b) => b - a);
  }, [data]);

  const termItems = React.useMemo(() => {
    return [
      { label: "Semua Tahun Ajaran", value: "all" },
      ...availableTerms.map((t) => ({
        label: formatTermLabel(t),
        value: t,
      })),
    ];
  }, [availableTerms]);

  const angkatanItems = React.useMemo(() => {
    return [
      { label: "Semua Angkatan", value: "all" },
      ...angkatanOptions.map((y) => ({
        label: `Angkatan ${y}`,
        value: String(y),
      })),
    ];
  }, [angkatanOptions]);

  const filtered = React.useMemo(() => {
    if (filterAngkatan === "all") return data;
    return data.filter((a) => String(a.angkatan) === filterAngkatan);
  }, [data, filterAngkatan]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  async function handleTermChange(newTerm: string) {
    setSelectedTerm(newTerm);
    setFilterAngkatan("all");
    setPage(1);
    setIsLoading(true);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (newTerm === "all") {
        url.searchParams.delete("term");
      } else {
        url.searchParams.set("term", newTerm);
      }
      window.history.replaceState({}, "", url.toString());
    }

    try {
      const res = await fetch(`/api/asprak.json?term=${encodeURIComponent(newTerm)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.ok && Array.isArray(json.data)) {
          setData(json.data);
        }
      }
    } catch (err) {
      console.error("Gagal memuat data asprak:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAngkatan(val: string) {
    setFilterAngkatan(val);
    setPage(1);
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        {/* Filter Tahun Ajaran */}
        {availableTerms.length > 0 && (
          <Select
            items={termItems}
            value={selectedTerm}
            onValueChange={(val) => {
              if (val) handleTermChange(val);
            }}
          >
            <SelectTrigger className="w-52" aria-label="Filter tahun ajaran">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {termItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Filter Angkatan */}
        <Select
          items={angkatanItems}
          value={filterAngkatan}
          onValueChange={(val) => {
            if (val) handleAngkatan(val);
          }}
        >
          <SelectTrigger className="w-44" aria-label="Filter angkatan">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {angkatanItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div
        className={`overflow-hidden rounded-lg border border-border transition-opacity duration-200 ${
          isLoading ? "pointer-events-none opacity-50" : "opacity-100"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="w-12 px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  No
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Nama
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Kode
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Angkatan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageData.length > 0 ? (
                pageData.map((asprak, index) => (
                  <tr key={asprak.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-2.5 text-xs text-muted-foreground tabular-nums">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-foreground">
                      {asprak.nama_lengkap}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {asprak.kode}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground tabular-nums">
                      {asprak.angkatan}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                    Tidak ada data untuk angkatan ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}{" "}
            dari {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft />
            </Button>
            <span className="px-3 text-sm text-foreground tabular-nums">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Halaman berikutnya"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
