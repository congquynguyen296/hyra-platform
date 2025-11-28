import { toast } from "sonner";
import { SubjectCard } from "@/components/subjects/SubjectCard";
import { CreateSubjectDialog } from "@/components/subjects/CreateSubjectDialog";
import { useEffect, useState } from "react";
import subjectService from "@/services/subject.service";
import { SubjectStatsDTO } from "@/types/Subject";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function Subjects() {
  const [subjects, setSubjects] = useState<SubjectStatsDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await subjectService.getAllSubjectByUser();
      if (data && data.code && data.code === 200) {
        setSubjects(data.result);
      }
    } catch (error) {
      console.error("Error loading subjects:", error);
      toast.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreateSubject = async (name: string) => {
    const colors = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const data = await subjectService.createSubject({
      name,
      color: randomColor,
    });
    if (data && data.code && data.code === 200) {
      toast.success("Subject created successfully");
      fetchSubjects();
    }
  };

  // Hàm này chỉ đơn thuần update UI, không gọi API nữa
  const handleRemoveFromList = (id: string) => {
    setSubjects((prev) => prev.filter((subject) => subject.id !== id));
  };

  // Hàm Edit đã bị xóa vì SubjectCard tự quản lý

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] py-6">
        <LoadingSpinner
          message="Loading subjects..."
          variant="inline"
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subjects</h1>
          <p className="text-muted-foreground">
            Organize your study materials by subject
          </p>
        </div>
        <CreateSubjectDialog onSubmit={handleCreateSubject} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          return (
            <SubjectCard
              key={subject.id}
              subject={{
                id: subject.id,
                name: subject.name,
                color: subject.color,
              }}
              stats={subject?.stats}
              // Truyền callback để xóa item khỏi list khi Card xóa thành công
              onDeleteSuccess={handleRemoveFromList}
            />
          );
        })}
      </div>
    </div>
  );
}
