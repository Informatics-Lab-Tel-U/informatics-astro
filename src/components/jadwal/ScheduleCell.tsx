import React from 'react';
import { getCourseColor } from '@/lib/colorUtils';
import type { JadwalPublic } from '@/types/jadwal';

interface ScheduleCellProps {
  jadwal: JadwalPublic;
  onClick?: () => void;
}

export const ScheduleCell: React.FC<ScheduleCellProps> = ({ jadwal, onClick }) => {
  const isPengganti = jadwal.is_pengganti;
  const bgColor = jadwal.warna || getCourseColor(jadwal.mata_kuliah || '');

  const contentStyle = isPengganti
    ? {
        background: `linear-gradient(${bgColor}, ${bgColor}) padding-box, repeating-linear-gradient(45deg, #facc15, #facc15 10px, #ffffff 10px, #ffffff 20px) border-box`,
        border: '4px solid transparent',
      }
    : {
        backgroundColor: bgColor,
      };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      className={`relative w-full flex-1 flex flex-col items-center justify-center p-1 transition-all overflow-hidden origin-center min-h-[60px] 2xl:min-h-[80px] ${
        onClick
          ? 'cursor-pointer hover:brightness-110 hover:scale-105 hover:z-20 hover:shadow-lg'
          : ''
      } ${isPengganti ? 'z-10' : ''}`}
      style={contentStyle}
      title={onClick ? 'Klik untuk melihat detail jadwal' : `${jadwal.mata_kuliah} - ${jadwal.kelas}`}
    >
      <div className="text-center leading-tight relative z-10">
        <div className="font-bold text-[10px] sm:text-xs 2xl:text-sm text-white drop-shadow-md truncate w-full px-1">
          {jadwal.praktikum || jadwal.mata_kuliah || 'Unknown'}
        </div>
        <div className="text-[9px] sm:text-[10px] 2xl:text-xs text-white/90">{jadwal.kelas}</div>
        <div className="text-[8px] sm:text-[9px] 2xl:text-[10px] text-white/80 truncate px-1">
          {jadwal.total_asprak || 0} asprak
        </div>
      </div>
    </div>
  );
};
