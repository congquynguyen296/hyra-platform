import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function SummaryEmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-24 h-24 rounded-2xl bg-purple-100 flex items-center justify-center">
          <FileText className="h-12 w-12 text-purple-600" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            No summaries yet
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}
