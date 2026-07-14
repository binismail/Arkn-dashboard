"use client";

import React from "react";
import {
  Shield,
  Key,
  Users,
  Laptop,
  ToggleLeft,
  FileText,
  Gear,
  SignOut,
  Plus,
  Check,
  WarningCircle,
  Question,
  CaretRight,
  ArrowRight,
  Buildings,
  Layout,
  DownloadSimple,
  Cpu,
  Calendar,
} from "@phosphor-icons/react";

interface IconProps {
  size?: number;
  className?: string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
}

export const ShieldIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <Shield size={size} weight={weight} {...props} />
);

export const KeyIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <Key size={size} weight={weight} {...props} />
);

export const UsersIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <Users size={size} weight={weight} {...props} />
);

export const LaptopIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <Laptop size={size} weight={weight} {...props} />
);

export const ToggleLeftIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <ToggleLeft size={size} weight={weight} {...props} />
);

export const FileTextIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <FileText size={size} weight={weight} {...props} />
);

export const SettingsIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <Gear size={size} weight={weight} {...props} />
);

export const LogOutIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <SignOut size={size} weight={weight} {...props} />
);

export const PlusIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <Plus size={size} weight={weight} {...props} />
);

export const CheckIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <Check size={size} weight={weight} {...props} />
);

export const AlertCircleIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <WarningCircle size={size} weight={weight} {...props} />
);

export const HelpCircleIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <Question size={size} weight={weight} {...props} />
);

export const ChevronRightIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <CaretRight size={size} weight={weight} {...props} />
);

export const ArrowRightIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <ArrowRight size={size} weight={weight} {...props} />
);

export const BuildingIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <Buildings size={size} weight={weight} {...props} />
);

export const LayoutDashboardIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <Layout size={size} weight={weight} {...props} />
);

export const DownloadIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <DownloadSimple size={size} weight={weight} {...props} />
);

export const CpuIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <Cpu size={size} weight={weight} {...props} />
);

export const CalendarIcon = ({ size = 20, weight = "regular", ...props }: IconProps) => (
  <Calendar size={size} weight={weight} {...props} />
);
