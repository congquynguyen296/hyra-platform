import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { QuizApiResponse } from '@/services/file.service';

interface QuizCardProps {
  quiz: QuizApiResponse;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'ez':
    case 'easy':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'md':
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'hard':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getDifficultyLabel = (level: string) => {
  switch (level.toLowerCase()) {
    case 'ez':
      return 'Easy';
    case 'md':
      return 'Medium';
    case 'hard':
      return 'Hard';
    default:
      return level;
  }
};

export function QuizCard({ quiz }: QuizCardProps) {
  const navigate = useNavigate();
  const hasAttempted = quiz.highestScore !== -1;

  const handleReview = () => {
    navigate(`/quiz/${quiz._id}/questions?review=true`);
  };

  const handleStart = () => {
    navigate(`/quiz/${quiz._id}/questions`);
  };

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-2">{quiz.name}</CardTitle>
              {quiz.content && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {quiz.content}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge className={getDifficultyColor(quiz.level)}>
            {getDifficultyLabel(quiz.level)}
          </Badge>
          {hasAttempted && (
            <Badge
              className={
                quiz.highestScore >= 70
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-orange-100 text-orange-800 border-orange-200'
              }
            >
              Best Score: {quiz.highestScore}%
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Created {formatDistanceToNow(new Date(quiz.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        {hasAttempted ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleReview}
            >
              Review Quiz
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={handleStart}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart
            </Button>
          </div>
        ) : (
          <Button
            variant="default"
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={handleStart}
          >
            Start Quiz
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
