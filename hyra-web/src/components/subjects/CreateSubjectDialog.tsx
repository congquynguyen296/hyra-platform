import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface CreateSubjectDialogProps {
  onSubmit: (name: string) => void;
  update?: boolean ,
}

export function CreateSubjectDialog({ onSubmit, update=false }: CreateSubjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [subjectName, setSubjectName] = useState('');

  const handleSubmit = () => {
    if (subjectName.trim()) {
      onSubmit(subjectName);
      setSubjectName('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {update ? (<div>Update Subject</div>):(<div>New Subject</div>)}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{update ? (<div>Update Subject</div>):(<div>Create New Subject</div>)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject-name">Subject Name</Label>
            <Input
              id="subject-name"
              placeholder="e.g., Biology, Chemistry, History"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            {update ? (<div>Update Subject</div>):(<div>Create Subject</div>)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
