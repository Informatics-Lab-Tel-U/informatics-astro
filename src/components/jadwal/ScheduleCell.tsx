import React from "react";

import type { JadwalPublic } from "@/types/jadwal";

import { getCourseColor } from "@/lib/colorUtils";

interface ScheduleCellProps {
  jadwal: JadwalPublic;
  onClick?: () => void;
}

export const ScheduleCell: React.FC<ScheduleCellProps> = ({ jadwal, onClick }) => {
  const isPengganti = jadwal.is_pengganti;
  const bgColor = jadwal.warna || getCourseColor(jadwal.mata_kuliah || "");

  const contentStyle = isPengganti
    ? {
        background: `linear-gradient(${bgColor}, ${bgColor}) padding-box, repeating-linear-gradient(45deg, #facc15, #facc15 10px, #ffffff 10px, #ffffff 20px) border-box`,
        border: "4px solid transparent",
      }
    : {
        backgroundColor: bgColor,
      };

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`relative flex min-h-[60px] w-full flex-1 origin-center flex-col items-center justify-center overflow-hidden p-1 transition-all 2xl:min-h-[80px] ${
        onClick
          ? "cursor-pointer hover:z-20 hover:scale-105 hover:shadow-lg hover:brightness-110"
          : ""
      } ${isPengganti ? "z-10" : ""}`}
      style={contentStyle}
      title={
        onClick ? "Klik untuk melihat detail jadwal" : `${jadwal.mata_kuliah} - ${jadwal.kelas}`
      }
    >
      <div className="relative z-10 text-center leading-tight">
        <div className="w-full truncate px-1 text-[10px] font-bold text-white drop-shadow-md sm:text-xs 2xl:text-sm">
          {jadwal.praktikum || jadwal.mata_kuliah || "Unknown"}
        </div>
        <div className="text-[9px] text-white/90 sm:text-[10px] 2xl:text-xs">{jadwal.kelas}</div>
        <div className="truncate px-1 text-[8px] text-white/80 sm:text-[9px] 2xl:text-[10px]">
          {jadwal.total_asprak || 0} asprak
        </div>
      </div>
    </div>
  );
};
