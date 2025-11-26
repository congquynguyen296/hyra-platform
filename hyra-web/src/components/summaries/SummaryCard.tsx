import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star, Clock, Eye, Trash2, Languages } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Summary } from '@/store/useAppStore';

interface SummaryCardProps {
  summary: Summary;
  onToggleImportant?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetail?: (id: string) => void;
  // translation may be async, accept both sync and async handlers
  onTranslate?: (id: string, language: string) => void | Promise<void>;
  fullWidth?: boolean;
}

type Language = 'vietnamese' | 'english' | 'chinese';

const languageLabels: Record<Language, string> = {
  vietnamese: 'Vietnamese',
  english: 'English',
  chinese: 'Chinese',
};

const languageFlags: Record<Language, string> = {
  vietnamese: '🇻🇳',
  english: '🇬🇧',
  chinese: '🇨🇳',
};

export function SummaryCard({
  summary,
  onToggleImportant,
  onDelete,
  onViewDetail,
  onTranslate,
  fullWidth = false,
}: SummaryCardProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async (language: Language) => {
    setSelectedLanguage(language);
    setIsTranslating(true);
    
    // Call the translation API if provided
    if (onTranslate) {
      await onTranslate(summary.id, language);
    }
    
    // Simulate translation delay
    setTimeout(() => {
      setIsTranslating(false);
    }, 1000);
  };

  return (
    <Card className={`transition-shadow hover:shadow-lg ${fullWidth ? 'w-full' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Summary</CardTitle>
              {summary.isImportant && (
                <Badge variant="secondary" className="bg-accent/20 text-accent">
                  Important
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Created {formatDistanceToNow(new Date(summary.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onToggleImportant && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleImportant(summary.id)}
              >
                <Star
                  className={`h-4 w-4 ${
                    summary.isImportant ? 'fill-accent text-accent' : 'text-muted-foreground'
                  }`}
                />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          {/* summary.content may contain HTML from the server (excerpt). Render it as HTML.
              Ensure the backend output is trusted or sanitized to avoid XSS. */}
          <div
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: summary.content }}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">Key Concepts:</p>
          <div className="flex flex-wrap gap-2">
            {summary.keyConcepts.map((concept, index) => (
              <Badge key={index} variant="outline">
                {concept}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {onViewDetail && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-w-[140px]"
              onClick={() => onViewDetail(summary.id)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View detail summary
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 min-w-[120px]"
                disabled={isTranslating}
              >
                <Languages className="h-4 w-4 mr-2" />
                {isTranslating ? 'Translating...' : `Translate ${languageFlags[selectedLanguage]}`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(languageLabels) as Language[]).map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => handleTranslate(lang)}
                  className="cursor-pointer"
                >
                  <span className="mr-2">{languageFlags[lang]}</span>
                  <span>{languageLabels[lang]}</span>
                  {selectedLanguage === lang && (
                    <span className="ml-2 text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(summary.id)}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
