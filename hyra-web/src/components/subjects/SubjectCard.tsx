import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Edit, Trash2, ArrowRight } from "lucide-react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { EditSubjectDialog } from "./EditSubjectDialog";
import subjectService from "@/services/subject.service";
import { toast } from "sonner";

export interface Subject {
  id: string;
  name: string;
  color: string;
}

interface SubjectStats {
  totalFiles: number;
  totalSummaries: number;
  totalQuizzes: number;
}

interface SubjectCardProps {
  subject: Subject;
  stats: SubjectStats;
  // Callback này chỉ dùng để báo cho cha biết cần xóa item khỏi danh sách UI
  onDeleteSuccess?: (id: string) => void;
}

export function SubjectCard({
  subject,
  stats,
  onDeleteSuccess,
}: SubjectCardProps) {
  const [sub, setSub] = useState<Subject>(subject);
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // --- LOGIC UPDATE (Đã có sẵn, giữ nguyên) ---
  const handleEdit = async (newName: string) => {
    try {
      const data = await subjectService.updateSubject({
        id: sub.id,
        name: newName,
      });
      if (data && data.code === 200) {
        toast.success("Subject updated successfully");
        const updated = data.result;

        // Cập nhật state nội bộ để UI đổi tên ngay lập tức
        setSub((prev) => ({
          ...prev,
          name: updated.name ?? newName,
          // color: updated.color ?? prev.color, // Nếu BE có trả về color
        }));
      } else {
        toast.error(data?.message || "Failed to update subject");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update subject");
    }
  };

  // --- LOGIC DELETE (Mới thêm vào) ---
  const handleDeleteSubject = async () => {
    try {
      const data = await subjectService.deleteSubject(sub.id);
      if (data && data.code === 200) {
        toast.success("Subject deleted successfully");
        // Gọi callback để cha xóa card này khỏi giao diện
        if (onDeleteSuccess) {
          onDeleteSuccess(sub.id);
        }
      } else {
        toast.error(data?.message || "Failed to delete subject");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete subject");
    }
  };

  return (
    <>
      <Card
        className="transition-shadow hover:shadow-lg cursor-pointer group"
        onClick={() => navigate(`/subject/${sub.id}`)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="rounded-lg p-2"
                style={{ backgroundColor: `${sub.color}15` }}
              >
                <FolderOpen className="h-5 w-5" style={{ color: sub.color }} />
              </div>
              <CardTitle className="text-xl line-clamp-1">{sub.name}</CardTitle>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Nút Edit: Tự xử lý mở dialog nội bộ */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEdit(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>

              {/* Nút Delete: Tự xử lý confirm và gọi API nội bộ */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDelete(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              {/* Dialog Confirm nằm ngay trong SubjectCard */}
              <ConfirmDialog
                open={showDelete}
                onOpenChange={setShowDelete}
                title="Xác nhận xóa môn học?"
                description={
                  <span>
                    Bạn có chắc chắn muốn xóa môn <b>{sub.name}</b>? Thao tác
                    này không thể hoàn tác.
                  </span>
                }
                confirmLabel="Xóa"
                cancelLabel="Hủy"
                type="destructive"
                onConfirm={handleDeleteSubject}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted p-2">
                <p className="text-2xl font-bold">{stats.totalFiles}</p>
                <p className="text-xs text-muted-foreground">Files</p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <p className="text-2xl font-bold">{stats.totalSummaries}</p>
                <p className="text-xs text-muted-foreground">Summaries</p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
                <p className="text-xs text-muted-foreground">Quizzes</p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/subject/${sub.id}`);
              }}
            >
              View Files
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditSubjectDialog
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        defaultName={sub.name}
        onSubmit={handleEdit}
      />
    </>
  );
}
