import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, ChevronRight, X, Clock, MapPin, User, Users } from 'lucide-react';
import type { JadwalPublic } from '@/types/jadwal';
import { ScheduleCell } from './ScheduleCell';
import { useScheduleData } from '@/hooks/useScheduleData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface JadwalPublicViewProps {
  initialJadwal: JadwalPublic[];
  error?: string;
}

export default function JadwalPublicView({ initialJadwal, error }: JadwalPublicViewProps) {
  const [programType, setProgramType] = useState<'REGULER' | 'PJJ'>('REGULER');
  const [showSessionId, setShowSessionId] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalPublic | null>(null);

  const { visibleDays, uniqueRooms, scheduleMatrix, dynamicSessionsByDay } = useScheduleData({
    rawJadwalList: initialJadwal || [],
    selectedModul: 'Default',
    programType,
  });

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[400px] border border-destructive/20 bg-destructive/5 rounded-lg p-8">
        <h3 className="text-lg font-semibold text-destructive mb-2">Gagal Memuat Jadwal</h3>
        <p className="text-muted-foreground text-center">{error}</p>
      </div>
    );
  }

  if (!initialJadwal || initialJadwal.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[400px] border border-border bg-muted/10 rounded-lg p-8">
        <Filter size={48} className="mb-4 opacity-20 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Jadwal Kosong</h3>
        <p className="text-muted-foreground text-center">Belum ada data jadwal praktikum yang diterbitkan saat ini.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="bg-muted/50 p-1.5 rounded-lg flex items-center gap-1 border border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setProgramType('REGULER')}
            className={`rounded-md text-sm font-medium transition-all ${
              programType === 'REGULER'
                ? 'bg-background shadow-sm text-foreground hover:bg-background'
                : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
            }`}
          >
            Reguler
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setProgramType('PJJ')}
            className={`rounded-md text-sm font-medium transition-all ${
              programType === 'PJJ'
                ? 'bg-background shadow-sm text-foreground hover:bg-background'
                : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
            }`}
          >
            PJJ
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-lg border border-border shadow-sm bg-card/50 backdrop-blur-sm min-h-[400px]">
        {uniqueRooms.length > 0 ? (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-2 border-r border-border text-center font-bold min-w-[60px] text-xs uppercase text-muted-foreground">
                  Hari
                </th>
                <th
                  className="p-2 border-r border-border text-center font-bold min-w-[60px] text-xs uppercase text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors select-none group"
                  onClick={() => setShowSessionId(!showSessionId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setShowSessionId(!showSessionId);
                    }
                  }}
                  title="Click to toggle between Time/Session"
                >
                  <div className="flex items-center justify-center gap-1">
                    {showSessionId ? 'SESI' : 'JAM'}
                    <ChevronRight
                      size={12}
                      className={`transition-transform ${showSessionId ? 'rotate-90' : ''}`}
                    />
                  </div>
                </th>
                {uniqueRooms.map((room) => (
                  <th
                    key={room}
                    className="p-2 border-r border-border text-center font-bold min-w-[120px] whitespace-nowrap text-xs"
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
                      className="hover:bg-muted/30 transition-colors border-b border-border/50"
                    >
                      {isFirstRow && (
                        <td
                          rowSpan={daySessions.length}
                          className="p-2 border-r border-border border-b border-border text-center font-bold bg-muted/10 align-middle text-sm"
                        >
                          {day}
                        </td>
                      )}

                      <td
                        className="p-2 border-r border-border text-center font-medium text-muted-foreground text-xs cursor-pointer hover:bg-muted/50"
                        onClick={() => setShowSessionId(!showSessionId)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setShowSessionId(!showSessionId);
                          }
                        }}
                        title={showSessionId ? session.jam : `Sesi ${session.sesi ?? '-'}`}
                      >
                        {showSessionId ? (session.sesi ?? sessionIndex + 1) : session.jam}
                      </td>

                      {uniqueRooms.map((room) => {
                        const jadwals = scheduleMatrix[day]?.[session.rowKey]?.[room] || [];

                        return (
                          <td
                            key={`${day}-${session.rowKey}-${room}`}
                            className="p-0 border-r border-border align-top relative min-w-[120px]"
                          >
                            <div className="flex flex-col w-full h-full min-h-[60px]">
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
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <Filter size={48} className="mb-4 opacity-20" />
            <p>Tidak ada jadwal untuk program yang dipilih.</p>
          </div>
        )}

        {/* Legend */}
        {uniqueRooms.length > 0 && (
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground border-t border-border/50 pt-3 px-2 pb-3">
            <div className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 bg-muted rounded-[2px]"
                style={{
                  background: `linear-gradient(var(--muted), var(--muted)) padding-box, repeating-linear-gradient(45deg, #facc15, #facc15 5px, #ffffff 5px, #ffffff 10px) border-box`,
                  border: '3px solid transparent',
                }}
              ></div>
              <span>Jadwal Pengganti</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-sm bg-muted border border-border"></div>
              <span>Jadwal Reguler</span>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal (Read-only version) */}
      <Dialog open={!!selectedJadwal} onOpenChange={(open) => { if (!open) setSelectedJadwal(null); }}>
        <DialogContent className="p-0 gap-0 overflow-hidden sm:max-w-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>Detail Jadwal</DialogTitle>
          </DialogHeader>
          
          {selectedJadwal && (
            <>
              {/* Modal Header Area */}
              <div className="relative p-6 pb-4 border-b border-border/50 bg-muted/10">
                <div className="flex flex-wrap gap-2 mb-3 pr-8">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    {selectedJadwal.program_studi || 'N/A'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                    {selectedJadwal.sesi ? `Sesi ${selectedJadwal.sesi}` : 'Non-Sesi'}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold leading-tight mb-1 pr-8">
                  {selectedJadwal.mata_kuliah}
                </h2>
                <p className="text-lg font-medium text-foreground/80">
                  Kelas {selectedJadwal.kelas}
                </p>
              </div>

              {/* Modal Details Grid */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Clock className="text-blue-500 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Waktu
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedJadwal.hari}, {selectedJadwal.jam}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <MapPin className="text-emerald-500 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Ruangan
                      </p>
                      <p className="text-sm font-semibold">
                        {!selectedJadwal.ruangan || selectedJadwal.ruangan === 'Tanpa Ruangan'
                          ? '-'
                          : selectedJadwal.ruangan}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <User className="text-amber-500 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Dosen
                      </p>
                      <p className="text-sm font-semibold">{selectedJadwal.dosen || '-'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Users className="text-violet-500 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Kebutuhan
                      </p>
                      <p className="text-sm font-semibold">{selectedJadwal.total_asprak} Asprak</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-muted/20 border-t border-border/50 text-right">
                <Button onClick={() => setSelectedJadwal(null)}>Tutup</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
