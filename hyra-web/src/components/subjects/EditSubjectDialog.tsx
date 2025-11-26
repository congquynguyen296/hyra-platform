import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface EditSubjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultName: string;
  onSubmit: (name: string) => void;
}

export function EditSubjectDialog({
  isOpen,
  onClose,
  defaultName,
  onSubmit
}: EditSubjectDialogProps) {
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    setName(defaultName); // load lại khi mở dialog
  }, [defaultName]);

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Subject Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
