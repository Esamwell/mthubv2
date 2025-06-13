import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  textColor?: string;
}

export const StatsCard = ({ title, value, icon: Icon, iconColor = "text-primary", bgColor = "bg-background", textColor = "text-foreground" }: StatsCardProps) => {
  return (
    <div className={`${bgColor} p-6 rounded-lg border border-border`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-muted ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
