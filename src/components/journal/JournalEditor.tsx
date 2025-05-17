
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { useJournal } from '@/contexts/JournalContext';
import { JournalEntry } from '@/types';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  mood: z.enum(['happy', 'content', 'neutral', 'sad', 'stressed']).optional(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface JournalEditorProps {
  entryToEdit?: JournalEntry;
  onSave: () => void;
}

export function JournalEditor({ entryToEdit, onSave }: JournalEditorProps) {
  const { addEntry, updateEntry } = useJournal();
  const isEditing = !!entryToEdit;
  const [wordCount, setWordCount] = useState(0);

  const defaultValues: Partial<FormData> = {
    title: entryToEdit?.title || '',
    content: entryToEdit?.content || '',
    mood: entryToEdit?.mood,
    tags: entryToEdit?.tags?.join(', ') || '',
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const watchContent = form.watch('content');
  
  useEffect(() => {
    if (watchContent) {
      const words = watchContent.split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    } else {
      setWordCount(0);
    }
  }, [watchContent]);

  const handleAutoSave = () => {
    // In a real app, we'd implement auto-saving here
    console.log('Auto-saving journal entry...');
  };

  useEffect(() => {
    // Auto save every 30 seconds
    const interval = setInterval(handleAutoSave, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (data: FormData) => {
    const tags = data.tags
      ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];

    const entryData = {
      title: data.title,
      content: data.content,
      mood: data.mood,
      tags,
    };

    if (isEditing && entryToEdit) {
      updateEntry(entryToEdit.id, entryData);
    } else {
      addEntry(entryData);
    }

    onSave();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a title for your journal entry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How are you feeling?</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your mood" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="happy">Happy 😊</SelectItem>
                  <SelectItem value="content">Content 😌</SelectItem>
                  <SelectItem value="neutral">Neutral 😐</SelectItem>
                  <SelectItem value="sad">Sad 😔</SelectItem>
                  <SelectItem value="stressed">Stressed 😫</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Content</FormLabel>
                <div className="text-xs text-muted-foreground">
                  {wordCount} {wordCount === 1 ? 'word' : 'words'}
                </div>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Write your thoughts here..."
                  className="min-h-[300px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter tags separated by commas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Last edited: {format(new Date(), 'MMM d, yyyy h:mm a')}
          </div>
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={onSave}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Entry' : 'Save Entry'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
