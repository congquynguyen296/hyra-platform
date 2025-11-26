import { Button } from '@/components/ui/button';
import { FileText, BookOpen, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-4 font-semibold">Quick Actions</h3>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate('/upload')}
        >
          <FileText className="mr-2 h-4 w-4" />
          Upload New File
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate('/summaries')}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          View Summaries
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate('/quizzes')}
        >
          <Brain className="mr-2 h-4 w-4" />
          Take a Quiz
        </Button>
      </div>
    </div>
  );
}
