import { Filter, ChevronRight, X, Clock, MapPin, User, Users } from "lucide-react";
import React, { useState } from "react";

import type { JadwalPublic } from "@/types/jadwal";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useScheduleData } from "@/hooks/useScheduleData";

import { ScheduleCell } from "./ScheduleCell";

interface JadwalPublicViewProps {
  initialJadwal: JadwalPublic[];
  error?: string;
}

export default function JadwalPublicView({ initialJadwal, error }: JadwalPublicViewProps) {
  const [programType, setProgramType] = useState<"REGULER" | "PJJ">("REGULER");
  const [showSessionId, setShowSessionId] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalPublic | null>(null);

  const { visibleDays, uniqueRooms, scheduleMatrix, dynamicSessionsByDay } = useScheduleData({
    rawJadwalList: initialJadwal || [],
    selectedModul: "Default",
    programType,
  });

  if (error) {
    return (
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8">
        <h3 className="mb-2 text-lg font-semibold text-destructive">Gagal Memuat Jadwal</h3>
        <p className="text-center text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!initialJadwal || initialJadwal.length === 0) {
    return (
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-lg border border-border bg-muted/10 p-8">
        <Filter size={48} className="mb-4 text-muted-foreground opacity-20" />
        <h3 className="mb-2 text-lg font-semibold">Jadwal Kosong</h3>
        <p className="text-center text-muted-foreground">
          Belum ada data jadwal praktikum yang diterbitkan saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <ToggleGroup
          value={[programType]}
          onValueChange={(val) => {
            if (val && val.length > 0) {
              setProgramType(val[0] as "REGULER" | "PJJ");
            }
          }}
          variant="outline"
          spacing={0}
          aria-label="Pilih jenis program praktikum"
        >
          <ToggleGroupItem value="REGULER" className="px-4">
            Reguler
          </ToggleGroupItem>
          <ToggleGroupItem value="PJJ" className="px-4">
            PJJ
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Table Container */}
      <div className="min-h-[400px] w-full overflow-x-auto rounded-lg border border-border bg-card">
        {uniqueRooms.length > 0 ? (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="min-w-[60px] border-r border-border p-2 text-center text-xs font-bold text-muted-foreground uppercase">
                  Hari
                </th>
                <th
                  className="group min-w-[60px] cursor-pointer border-r border-border p-2 text-center text-xs font-bold text-muted-foreground uppercase transition-colors select-none hover:bg-muted/80"
                  onClick={() => setShowSessionId(!showSessionId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setShowSessionId(!showSessionId);
                    }
                  }}
                  title="Click to toggle between Time/Session"
                >
                  <div className="flex items-center justify-center gap-1">
                    {showSessionId ? "SESI" : "JAM"}
                    <ChevronRight
                      size={12}
                      className={`transition-transform ${showSessionId ? "rotate-90" : ""}`}
                    />
                  </div>
                </th>
                {uniqueRooms.map((room) => (
                  <th
                    key={room}
                    className="min-w-[120px] border-r border-border p-2 text-center text-xs font-bold whitespace-nowrap"
                  >
                    {room}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleDays.map((day) => {
                const daySessions = dynamicSessionsByDay[day] || [];
                if (daySessions.length === 0) return null;

                return daySessions.map((session, sessionIndex) => {
                  const isFirstRow = sessionIndex === 0;

                  return (
                    <tr
                      key={`${day}-${session.rowKey}`}
                      className="border-b border-border/50 transition-colors hover:bg-muted/30"
                    >
                      {isFirstRow && (
                        <td
                          rowSpan={daySessions.length}
                          className="border-r border-b border-border bg-muted/10 p-2 text-center align-middle text-sm font-bold"
                        >
                          {day}
                        </td>
                      )}

                      <td
                        className="cursor-pointer border-r border-border p-2 text-center text-xs font-medium text-muted-foreground hover:bg-muted/50"
                        onClick={() => setShowSessionId(!showSessionId)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setShowSessionId(!showSessionId);
                          }
                        }}
                        title={showSessionId ? session.jam : `Sesi ${session.sesi ?? "-"}`}
                      >
                        {showSessionId ? (session.sesi ?? sessionIndex + 1) : session.jam}
                      </td>

                      {uniqueRooms.map((room) => {
                        const jadwals = scheduleMatrix[day]?.[session.rowKey]?.[room] || [];

                        return (
                          <td
                            key={`${day}-${session.rowKey}-${room}`}
                            className="relative min-w-[120px] border-r border-border p-0 align-top"
                          >
                            <div className="flex h-full min-h-[60px] w-full flex-col">
                              {jadwals.map((jadwal) => (
                                <ScheduleCell
                                  key={jadwal.id}
                                  jadwal={jadwal}
                                  onClick={() => setSelectedJadwal(jadwal)}
                                />
                              ))}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex h-[300px] flex-col items-center justify-center text-muted-foreground">
            <Filter size={48} className="mb-4 opacity-20" />
            <p>Tidak ada jadwal untuk program yang dipilih.</p>
          </div>
        )}

        {/* Legend */}
        {uniqueRooms.length > 0 && (
          <div className="mt-4 flex items-center gap-4 border-t border-border/50 px-2 pt-3 pb-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div
                className="h-4 w-4 rounded-[2px] bg-muted"
                style={{
                  background: `linear-gradient(var(--muted), var(--muted)) padding-box, repeating-linear-gradient(45deg, #facc15, #facc15 5px, #ffffff 5px, #ffffff 10px) border-box`,
                  border: "3px solid transparent",
                }}
              ></div>
              <span>Jadwal Pengganti</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3.5 w-3.5 rounded-sm border border-border bg-muted"></div>
              <span>Jadwal Reguler</span>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal (Read-only version) */}
      <Dialog
        open={!!selectedJadwal}
        onOpenChange={(open) => {
          if (!open) setSelectedJadwal(null);
        }}
      >
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>Detail Jadwal</DialogTitle>
          </DialogHeader>

          {selectedJadwal && (
            <>
              {/* Modal Header Area */}
              <div className="relative border-b border-border/50 bg-muted/10 p-6 pb-4">
                <div className="mb-3 flex flex-wrap gap-2 pr-8">
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {selectedJadwal.program_studi || "N/A"}
                  </span>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                    {selectedJadwal.sesi ? `Sesi ${selectedJadwal.sesi}` : "Non-Sesi"}
                  </span>
                </div>

                <h2 className="mb-1 pr-8 text-xl leading-tight font-bold md:text-2xl">
                  {selectedJadwal.mata_kuliah}
                </h2>
                <p className="text-lg font-medium text-foreground/80">
                  Kelas {selectedJadwal.kelas}
                </p>
              </div>

              {/* Modal Details Grid */}
              <div className="space-y-4 p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
                    <Clock className="mt-0.5 shrink-0 text-muted-foreground" size={18} />
                    <div>
                      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                        Waktu
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedJadwal.hari}, {selectedJadwal.jam}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
                    <MapPin className="mt-0.5 shrink-0 text-muted-foreground" size={18} />
                    <div>
                      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                        Ruangan
                      </p>
                      <p className="text-sm font-semibold">
                        {!selectedJadwal.ruangan || selectedJadwal.ruangan === "Tanpa Ruangan"
                          ? "-"
                          : selectedJadwal.ruangan}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
                    <User className="mt-0.5 shrink-0 text-muted-foreground" size={18} />
                    <div>
                      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                        Dosen
                      </p>
                      <p className="text-sm font-semibold">{selectedJadwal.dosen || "-"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
                    <Users className="mt-0.5 shrink-0 text-muted-foreground" size={18} />
                    <div>
                      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                        Kebutuhan
                      </p>
                      <p className="text-sm font-semibold">{selectedJadwal.total_asprak} Asprak</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-border/50 bg-muted/20 p-4 text-right">
                <Button onClick={() => setSelectedJadwal(null)}>Tutup</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
