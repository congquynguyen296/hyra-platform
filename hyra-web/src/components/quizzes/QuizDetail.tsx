import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { QuizData } from './QuizCard';

interface QuizDetailProps {
  quiz: QuizData;
  onBack: () => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-success/20 text-success';
    case 'Medium':
      return 'bg-chart-4/20 text-chart-4';
    case 'Hard':
      return 'bg-destructive/20 text-destructive';
    default:
      return 'bg-muted';
  }
};

export function QuizDetail({ quiz, onBack }: QuizDetailProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          Back to Quizzes
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{quiz.fileName}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{quiz.subject}</span>
            <span>•</span>
            <Badge className={getDifficultyColor(quiz.difficulty)}>
              {quiz.difficulty}
            </Badge>
            <span>•</span>
            <span>{quiz.questions.length} questions</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Questions</CardTitle>
          {quiz.completed && quiz.score !== undefined && (
            <div className="mt-2 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="font-semibold text-success">
                Score: {quiz.score}%
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="rounded-lg border p-4">
              <p className="mb-4 font-medium">
                {index + 1}. {question.question}
              </p>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => {
                  const isCorrect = optionIndex === question.correctAnswer;
                  const isUserAnswer = optionIndex === question.userAnswer;

                  let className = 'rounded-lg border p-3 text-sm';
                  if (quiz.completed) {
                    if (isCorrect) {
                      className += ' border-success bg-success/10';
                    } else if (isUserAnswer && !isCorrect) {
                      className += ' border-destructive bg-destructive/10';
                    }
                  }

                  return (
                    <div key={optionIndex} className={className}>
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {quiz.completed && isCorrect && (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                        {quiz.completed && isUserAnswer && !isCorrect && (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
