import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Sparkles,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
} from "lucide-react";
import fileService, { QuizApiResponse } from "@/services/file.service";
import { toast } from "sonner";
import { format } from "date-fns";

interface QuizzesTabProps {
  fileId: string;
  onCountChange?: (count: number) => void;
}

const getDifficultyColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "ez":
    case "easy":
      return "bg-green-100 text-green-800 border-green-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "hard":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getDifficultyLabel = (level: string) => {
  switch (level.toLowerCase()) {
    case "ez":
      return "Easy";
    case "medium":
      return "Medium";
    case "hard":
      return "Hard";
    default:
      return level;
  }
};

export function QuizzesTab({ fileId, onCountChange }: QuizzesTabProps) {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizApiResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        const response = await fileService.getFileQuizzes(fileId);
        if (response.success) {
          setQuizzes(response.data);
          onCountChange?.(response.count);
        }
      } catch (error) {
        console.error("Error loading quizzes:", error);
        toast.error("Failed to load quizzes");
        onCountChange?.(0);
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, [fileId, onCountChange]);
  if (loading) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="py-16">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quizzes.length === 0) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="py-16">
          <div className="text-center space-y-4">
            <Brain className="h-16 w-16 mx-auto text-gray-300" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No quizzes yet
              </h3>
              <p className="text-gray-600 mb-6">
                Generate your first AI-powered quiz to test your knowledge
              </p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasAttempted = (quiz: QuizApiResponse) => quiz.highestScore !== -1;

  const handleStart = (quizId) => {
    navigate(`/quiz/${quizId}/questions`);
  };

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => {
        const attempted = hasAttempted(quiz);
        return (
          <Card
            key={quiz._id}
            className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex-1 space-y-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    {quiz.name}
                  </CardTitle>

                  {/* Content */}
                  {quiz.content && (
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {quiz.content}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge className={getDifficultyColor(quiz.level)}>
                      {getDifficultyLabel(quiz.level)}
                    </Badge>
                    {attempted && (
                      <Badge
                        className={
                          quiz.highestScore >= 70
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-orange-100 text-orange-800 border-orange-200"
                        }
                      >
                        Highest Score: {quiz.highestScore}%
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Icon trạng thái */}
                <div className="flex items-start gap-2 mt-2 sm:mt-0">
                  {attempted ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </div>
            </CardHeader>

            {/* Buttons */}
            <CardContent>
              <div className="flex justify-end gap-2">
                {attempted ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-32 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    onClick={() => handleStart(quiz._id)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restart
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-32 flex items-center justify-center text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                  onClick={() => {
                    const url = attempted
                      ? `/quiz/${quiz._id}/questions?review=true`
                      : `/quiz/${quiz._id}/questions`;
                    navigate(url);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {attempted ? "Review" : "Start Quiz"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-32 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
