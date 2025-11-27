import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, FileText, Calendar } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import fileService from '@/services/file.service';
import { FileDto } from '@/types/File';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface SummarySearchProps {
  onSelectFile: (fileId: string, fileName: string) => void;
  selectedFileName?: string;
}

export function SummarySearch({ onSelectFile, selectedFileName }: SummarySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState<FileDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load all files on mount
  useEffect(() => {
    loadAllFiles();
  }, []);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      searchFiles(debouncedSearch);
    } else {
      loadAllFiles();
    }
  }, [debouncedSearch]);

  const loadAllFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fileService.getAllFiles();
      if (response.result?.files) {
        setFiles(response.result.files);
      }
    } catch (error) {
      console.error('Error loading files:', error);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchFiles = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await fileService.searchFiles(query);
      if (response.result?.files) {
        setFiles(response.result.files);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('Error searching files:', error);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFile = (file: FileDto) => {
    onSelectFile(file.id, file.name);
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={selectedFileName || "Search files by name..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          className="pl-9 pr-10"
        />
      </div>

      {isLoading && (
        <div className="mt-4">
          <LoadingSpinner message="Loading files..." variant="inline" size="sm" />
        </div>
      )}

      {showDropdown && !isLoading && files.length > 0 && (
        <Card className="absolute z-50 w-full mt-2 max-h-[400px] overflow-auto shadow-lg">
          <CardContent className="p-0">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => handleSelectFile(file)}
                className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {file.name}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    {file.uploadDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </span>
                    )}
                    {file.size && <span>{file.size}</span>}
                    {file.summaryCount !== undefined && (
                      <span className="text-purple-600 font-medium">
                        {file.summaryCount} {file.summaryCount === 1 ? 'summary' : 'summaries'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {showDropdown && !isLoading && files.length === 0 && searchQuery.trim() && (
        <Card className="absolute z-50 w-full mt-2 shadow-lg">
          <CardContent className="p-4 text-center text-sm text-gray-500">
            No files found for "{searchQuery}"
          </CardContent>
        </Card>
      )}
    </div>
  );
}
