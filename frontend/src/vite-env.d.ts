/// <reference types="vite/client" />

declare module 'lucide-react' {
  import * as React from 'react';
  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  export type Icon = React.FC<IconProps>;
  export const LayoutDashboard: Icon;
  export const FileText: Icon;
  export const Briefcase: Icon;
  export const Layers: Icon;
  export const Sparkles: Icon;
  export const History: Icon;
  export const Settings: Icon;
  export const HelpCircle: Icon;
  export const X: Icon;
  export const ExternalLink: Icon;
  export const Menu: Icon;
  export const Plus: Icon;
  export const Check: Icon;
  export const Loader2: Icon;
  export const ArrowRight: Icon;
  export const CheckCircle2: Icon;
  export const AlertCircle: Icon;
  export const AlertTriangle: Icon;
  export const BookOpen: Icon;
  export const ShieldCheck: Icon;
  export const UploadCloud: Icon;
  export const ChevronRight: Icon;
  export const TrendingUp: Icon;
  export const Cpu: Icon;
  export const Shield: Icon;
  export const Zap: Icon;
  export const Clock: Icon;
  export const Award: Icon;
  export const Download: Icon;
  export const Search: Icon;
  export const Filter: Icon;
  export const ArrowUpDown: Icon;
  export const Trash2: Icon;
  export const Eye: Icon;
  export const Calendar: Icon;
  export const Copy: Icon;
  export const Lightbulb: Icon;
  export const User: Icon;
  export const Bell: Icon;
  export const Sun: Icon;
  export const Moon: Icon;
  export const Laptop: Icon;
  export const Save: Icon;
  export const XCircle: Icon;
  export const FileCheck2: Icon;
  export const FileCode: Icon;
  const icons: { [key: string]: Icon };
  export default icons;
}
