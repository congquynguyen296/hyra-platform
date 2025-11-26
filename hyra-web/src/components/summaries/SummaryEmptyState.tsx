import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export function SummaryEmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium">No summaries found</p>
        <p className="text-sm text-muted-foreground">
          Upload a file to generate your first summary
        </p>
      </CardContent>
    </Card>
  );
}
