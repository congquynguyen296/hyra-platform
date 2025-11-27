import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';

// Mock activities data - replace with API call
const mockActivities = [
  { id: '1', type: 'quiz' as const, title: 'Completed Quiz', subtitle: 'Binary Trees - Hard', timestamp: '2025-01-16' },
  { id: '2', type: 'summary' as const, title: 'Generated Summary', subtitle: 'Binary Trees.pdf', timestamp: '2025-01-15' },
  { id: '3', type: 'file' as const, title: 'Uploaded File', subtitle: 'Maxwell Equations.pdf', timestamp: '2025-01-14' },
  { id: '4', type: 'file' as const, title: 'Uploaded File', subtitle: 'Vector Mechanics.docx', timestamp: '2025-01-12' },
  { id: '5', type: 'quiz' as const, title: 'Completed Quiz', subtitle: 'Limits and Continuity - Medium', timestamp: '2025-01-11' },
];

export default function Dashboard() {
  const { files, summaries, quizzes } = useAppStore();
  const navigate = useNavigate();

  const stats = {
    totalFiles: files.length,
    totalSummaries: summaries.length,
    totalQuizzes: quizzes.length,
    averageScore: '85%',
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your learning overview.</p>
        </div>
        <Button onClick={() => navigate('/upload')}>
          Upload New File
        </Button>
      </div>

      <StatsGrid />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity activities={mockActivities} />
        </div>
        
        <div className="space-y-4">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
