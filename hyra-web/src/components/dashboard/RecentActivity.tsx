import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Brain, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'file' | 'summary' | 'quiz';
  title: string;
  subtitle: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const getIcon = (type: Activity['type']) => {
  switch (type) {
    case 'file':
      return FileText;
    case 'summary':
      return BookOpen;
    case 'quiz':
      return Brain;
  }
};

const getIconColor = (type: Activity['type']) => {
  switch (type) {
    case 'file':
      return 'text-primary bg-primary/10';
    case 'summary':
      return 'text-accent bg-accent/10';
    case 'quiz':
      return 'text-success bg-success/10';
  }
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getIcon(activity.type);
            const iconColor = getIconColor(activity.type);

            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`rounded-lg p-2 ${iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.subtitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
