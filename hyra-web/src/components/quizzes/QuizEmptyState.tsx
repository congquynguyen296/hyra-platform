import { Card, CardContent } from "@/components/ui/card";
import { Brain, FileText } from "lucide-react";

export function QuizEmptyState() {
  return (
    <Card className="col-span-2">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="w-24 h-24 rounded-2xl bg-green-100 flex items-center justify-center">
          <Brain className="h-12 w-12 text-green-600" />
        </div>
        <div className="text-center space-y-4 mt-4">
          <h3 className="text-xl font-semibold text-gray-900">
            No summaries yet
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}
