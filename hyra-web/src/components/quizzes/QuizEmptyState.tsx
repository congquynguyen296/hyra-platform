import { Card, CardContent } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export function QuizEmptyState() {
  return (
    <Card className="col-span-2">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Brain className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium">No quizzes yet</p>
        <p className="text-sm text-muted-foreground">
          Upload a file and generate a quiz to get started
        </p>
      </CardContent>
    </Card>
  );
}
