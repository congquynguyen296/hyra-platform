import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Calendar, HardDrive, BookOpen, Brain, Download, Sparkles } from 'lucide-react';
import { useState } from 'react';
import QuizService from '@/services/quiz.service';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface FileInfo {
  name: string;
  subject: string;
  uploadDate: string;
  size: string;
  summaryCount: number;
  quizCount: number;
}

interface FileHeaderProps {
  file: FileInfo;
  subjectColor?: string;
  subjectName?: string;
  onBack: () => void;
  // optional: file id for generating quiz
  fileId?: string;
  // callback invoked after successful generation so parent can reload
  onGenerated?: () => Promise<void> | void;
}

export function FileHeader({ file, subjectColor = '#3B82F6', subjectName, onBack, fileId, onGenerated }: FileHeaderProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<string>('Medium');

  const openGenerateDialog = () => {
    if (!fileId) {
      toast.error('File id missing');
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmGenerate = async () => {
    if (!fileId) {
      toast.error('File id missing');
      return;
    }

    const count = Math.max(1, Math.floor(Number(numQuestions) || 1));
    const diff = (difficulty || 'Medium').toLowerCase();

    try {
      setIsGenerating(true);
      const res = await QuizService.generateQuiz(fileId, count, diff);
      if (res && res.code === 200) {
        toast.success('Quiz generated');
        setIsModalOpen(false);
        if (onGenerated) await onGenerated();
      } else {
        toast.error(res.message ?? 'Failed to generate quiz');
      }
    } catch (err) {
      console.error('Generate quiz failed', err);
      toast.error('Failed to generate quiz');
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to {subjectName || 'Subject'}
      </Button>

      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: subjectColor + '20' }}
                >
                  <FileText className="h-6 w-6" style={{ color: subjectColor }} />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-2xl truncate">{file.name}</CardTitle>
                  <CardDescription className="mt-1">{file.subject}</CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-gray-600 pt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{file.uploadDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-gray-400" />
                  <span>{file.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span>{file.summaryCount} Summaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-gray-400" />
                  <span>{file.quizCount} Quizzes</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  onClick={openGenerateDialog}
                  disabled={isGenerating}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </Button>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                      <DialogTitle>Generate Quiz</DialogTitle>
                      <DialogDescription>Choose number of questions and difficulty for the generated quiz.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                      <div>
                        <Label htmlFor="numQuestions">Number of questions</Label>
                        <Input
                          id="numQuestions"
                          type="number"
                          min={1}
                          value={numQuestions}
                          onChange={(e) => setNumQuestions(Number(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select value={difficulty} onValueChange={(v) => setDifficulty(v)}>
                          <SelectTrigger id="difficulty">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isGenerating}>
                        Cancel
                      </Button>
                      <Button onClick={handleConfirmGenerate} disabled={isGenerating}>
                        {isGenerating ? 'Generating...' : 'Generate'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
