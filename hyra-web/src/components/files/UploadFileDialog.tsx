import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { Upload, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import FileService from '@/services/file.service';
import { useToast } from '@/hooks/use-toast';

interface UploadFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  // optional callback if parent wants to be notified after upload
  onSubmit?: (fileName: string, file: File) => void;
}

export function UploadFileDialog({
  isOpen,
  onClose,
  onSubmit,
}: UploadFileDialogProps) {
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { subjectId: subjectId } = useParams();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!fileName.trim() || !file) return;

    setIsLoading(true);
    try {
      const res = await FileService.uploadFile(file, fileName, subjectId);
      
      toast({
        title: 'Upload successful',
        description: res?.message ?? 'File uploaded and queued for processing.',
      });

      setFileName('');
      setFile(null);
      
      // Call parent callback after successful upload
      if (res && res.code === 200 && res.result && onSubmit) {
        onSubmit(fileName, file);
      }
      
      onClose();
    } catch (err: unknown) {
      console.error('Upload failed', err);
      const message =
        typeof err === 'object' && err !== null && 'message' in err
          ? (err as { message?: string }).message
          : undefined;
      toast({
        title: 'Upload failed',
        description: message ?? 'An error occurred while uploading the file.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a new file. Supported formats: PDF, DOCX, TXT
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              placeholder="e.g., Chapter 5 - Calculus.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setFile(selectedFile);
                  if (!fileName) {
                    setFileName(selectedFile.name);
                  }
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
