import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, CheckCircle2, Circle } from "lucide-react";
import fileService, {
  Question,
  QuizApiResponse,
} from "@/services/file.service";
import { toast } from "sonner";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function QuizQuestions() {
  const { quizId } = useParams<{ quizId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quiz, setQuiz] = useState<QuizApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [startTime] = useState<Date>(new Date());
  const isReviewMode = searchParams.get("review") === "true";

  useEffect(() => {
    if (quizId) {
      loadQuizData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, isReviewMode]);

  const loadQuizData = async () => {
    if (!quizId) return;

    try {
      setLoading(true);

      // Load quiz info and questions in parallel
      // Pass isReview parameter to get explain field when in review mode
      const [questionsResponse, quizResponse] = await Promise.allSettled([
        fileService.getQuizQuestions(quizId, isReviewMode),
        fileService.getQuizById(quizId).catch(() => null), // Try to get quiz info, but don't fail if endpoint doesn't exist
      ]);

      if (
        questionsResponse.status === "fulfilled" &&
        questionsResponse.value.success
      ) {
        setQuestions(questionsResponse.value.data);
      }

      if (quizResponse.status === "fulfilled" && quizResponse.value?.success) {
        setQuiz(quizResponse.value.data);
      }
    } catch (error) {
      console.error("Error loading quiz data:", error);
      toast.error("Failed to load quiz data");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    if (isReviewMode) return; // Don't allow changes in review mode
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < questions.length) {
      toast.warning(
        `Please answer all questions. You have answered ${answeredCount}/${questions.length}`
      );
      return;
    }

    if (!quizId) {
      toast.error("Quiz ID is missing");
      return;
    }

    try {
      setSubmitting(true);

      // Format answers array: [{ questionId, selectedAnswer }]
      const answers = questions.map((question) => ({
        questionId: question._id,
        selectedAnswer: selectedAnswers[question._id] ?? -1,
      }));

      // Calculate time spent
      const endTime = new Date();
      const timeSpentMs = endTime.getTime() - startTime.getTime();
      const timeSpentMinutes = Math.floor(timeSpentMs / 60000);
      const timeSpentSeconds = Math.floor((timeSpentMs % 60000) / 1000);
      const timeSpent = `${timeSpentMinutes} minutes ${timeSpentSeconds} seconds`;

      // Submit quiz
      const response = await fileService.submitQuiz(quizId, answers, timeSpent);

      if (response.success) {
        toast.success(`Quiz submitted! Score: ${response.data.score}%`);

        // Navigate to review mode to see results
        navigate(`/quiz/${quizId}/questions?review=true`, { replace: true });
      } else {
        toast.error(response.message || "Failed to submit quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto flex items-center justify-center h-screen">
          <LoadingSpinner message="Loading questions..." variant="inline" size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="-ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-2xl truncate">
                        {quiz?.name || "Quiz Questions"}
                      </CardTitle>
                      {quiz && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge className={getDifficultyColor(quiz.level)}>
                            {getDifficultyLabel(quiz.level)}
                          </Badge>
                          <Badge variant="outline">
                            {questions.length} Question
                            {questions.length !== 1 ? "s" : ""}
                          </Badge>
                          {isReviewMode && quiz.highestScore !== -1 && (
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
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => {
            // In review mode, use userAnswer from API; otherwise use selectedAnswer from state
            const selectedAnswer = isReviewMode 
              ? question.userAnswer 
              : selectedAnswers[question._id];

            return (
              <Card
                key={question._id}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <span className="flex-1 pt-0.5">{question.question}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {question.answers.map((answer, answerIndex) => {
                      const isSelected = selectedAnswer === answerIndex;
                      const isCorrect = answer.isCorrect;
                      const showCorrect = isReviewMode && isCorrect;
                      const showIncorrect =
                        isReviewMode && isSelected && !isCorrect;
                      // Show explain in review mode:
                      // - Always show for correct answer
                      // - Show for selected incorrect answer to explain why it's wrong
                      const showExplain =
                        isReviewMode &&
                        answer.explain &&
                        (isCorrect || (isSelected && !isCorrect));

                      let className =
                        "w-full p-4 rounded-lg border-2 transition-all";

                      if (isReviewMode) {
                        if (isCorrect) {
                          className +=
                            " border-green-500 bg-green-50 cursor-default";
                        } else if (isSelected && !isCorrect) {
                          className +=
                            " border-red-500 bg-red-50 cursor-default";
                        } else {
                          className += " border-gray-200 cursor-default";
                        }
                      } else {
                        className += isSelected
                          ? " border-purple-500 bg-purple-50 cursor-pointer hover:bg-purple-100"
                          : " border-gray-200 cursor-pointer hover:bg-gray-50";
                      }
                      // Show đáp án khi submit xong
                      return (
                        <div
                          key={answerIndex}
                          onClick={() =>
                            handleAnswerSelect(question._id, answerIndex)
                          }
                          className={className}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {isReviewMode ? (
                                isSelected ? (
                                  isCorrect ? (
                                    <Circle className="h-5 w-5 fill-green-600 text-green-600" />
                                  ) : (
                                    <Circle className="h-5 w-5 fill-red-600 text-red-600" />
                                  )
                                ) : isCorrect ? (
                                  <Circle className="h-5 w-5 fill-green-600 text-green-600" />
                                ) : (
                                  <Circle className="h-5 w-5 text-gray-400" />
                                )
                              ) : isSelected ? (
                                <Circle className="h-5 w-5 fill-purple-600 text-purple-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`text-gray-900 ${
                                    showCorrect ? "font-semibold" : ""
                                  }`}
                                >
                                  {answer.content}
                                </span>
                                {showCorrect && (
                                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                )}
                                {showIncorrect && (
                                  <span className="text-xs text-red-600 font-semibold">
                                    Incorrect
                                  </span>
                                )}
                              </div>
                              {showExplain && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0 w-1 h-1 rounded-full bg-blue-500 mt-2"></div>
                                    <div className="flex-1">
                                      <p className="text-xs font-semibold text-blue-700 mb-1">
                                        Explanation:
                                      </p>
                                      <p className="text-sm text-gray-700 leading-relaxed">
                                        {answer.explain}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                <CardFooter>
                  <p>
                      {isReviewMode && selectedAnswer !== undefined && (
                        <span className="text-sm text-gray-600 italic">
                          Explaning: {question.explanation || "N/A"}
                        </span>
                      )}
                    </p>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Submit Button */}
        {!isReviewMode && (
          <Card className="border-0 shadow-xl sticky bottom-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Answered: {Object.keys(selectedAnswers).length} /{" "}
                  {questions.length}
                </div>
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Quiz"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
