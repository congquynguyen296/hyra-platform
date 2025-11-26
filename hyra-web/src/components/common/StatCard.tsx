import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  colorClass?: string;
  bgColorClass?: string;
}

export function StatCard({ title, value, icon: Icon, trend, colorClass = 'text-primary', bgColorClass = 'bg-primary/10' }: StatCardProps) {
  return (
    <Card className="transition-all hover:border-primary duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="mt-3 text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {value || 0}
            </p>
            {trend && (
              <p className="mt-2 text-xs font-medium text-muted-foreground flex items-center gap-1">
                <span className="text-green-600">↗</span>
                {trend}
              </p>
            )}
          </div>
          <div className={`rounded-xl ${bgColorClass} p-4 ${colorClass} shadow-sm`}>
            <Icon className="h-8 w-8" strokeWidth={2} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
