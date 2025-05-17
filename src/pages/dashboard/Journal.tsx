
import { useState } from 'react';
import { format } from 'date-fns';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { JournalEditor } from '@/components/journal/JournalEditor';
import { useJournal } from '@/contexts/JournalContext';
import { JournalEntry } from '@/types';
import { Plus, Search, CalendarIcon, Filter, MoreVertical, Edit, Trash2 } from 'lucide-react';

export default function Journal() {
  const { entries, getEntriesByDate, deleteEntry } = useJournal();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const entriesByDate = selectedDate ? getEntriesByDate(selectedDate) : [];

  const filteredEntries = entries
    .filter((entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.tags && entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleNewEntry = () => {
    setSelectedEntry(undefined);
    setIsEditorOpen(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsEditorOpen(true);
  };

  const handleDeleteEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEntry) {
      deleteEntry(selectedEntry.id);
      setIsDeleteDialogOpen(false);
      setSelectedEntry(undefined);
    }
  };

  // Function to determine which dates have entries for the calendar
  const hasEntryOnDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return entries.some((entry) => {
      const entryDate = new Date(entry.createdAt);
      return format(entryDate, 'yyyy-MM-dd') === formattedDate;
    });
  };

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'content': return '😌';
      case 'neutral': return '😐';
      case 'sad': return '😔';
      case 'stressed': return '😫';
      default: return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Journal</h1>
            <p className="text-muted-foreground">
              Capture your thoughts and reflections
            </p>
          </div>
          <Button onClick={handleNewEntry}>
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-72 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search journal..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-md">Calendar</CardTitle>
                <CardDescription>Select a date to view entries</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    hasEntry: hasEntryOnDate,
                  }}
                  modifiersStyles={{
                    hasEntry: {
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                      textDecorationColor: 'hsl(var(--primary))',
                    },
                  }}
                  className={`p-3 pointer-events-auto`}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 space-y-4">
            {selectedDate ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{format(selectedDate, 'MMMM d, yyyy')}</h2>
                  {entriesByDate.length === 0 && (
                    <Button size="sm" onClick={handleNewEntry}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Entry for This Date
                    </Button>
                  )}
                </div>

                {entriesByDate.length > 0 ? (
                  <div className="space-y-4">
                    {entriesByDate.map((entry) => (
                      <Card key={entry.id} className="relative">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditEntry(entry)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteEntry(entry)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <CardHeader>
                          <div className="flex justify-between items-center pr-8">
                            <CardTitle>{entry.title}</CardTitle>
                            {entry.mood && <span className="text-xl">{getMoodEmoji(entry.mood)}</span>}
                          </div>
                          <CardDescription>
                            {format(new Date(entry.createdAt), 'h:mm a')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="whitespace-pre-wrap">
                            {entry.content.length > 300
                              ? `${entry.content.substring(0, 300)}...`
                              : entry.content}
                          </p>
                        </CardContent>
                        {entry.tags && entry.tags.length > 0 && (
                          <CardFooter>
                            <div className="flex flex-wrap gap-1">
                              {entry.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </CardFooter>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg bg-card">
                    <p className="text-muted-foreground">No entries for this date</p>
                    <Button className="mt-4" onClick={handleNewEntry}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Entry
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">All Journal Entries</h2>
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => (
                    <Card key={entry.id} className="relative">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditEntry(entry)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteEntry(entry)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <CardHeader>
                        <div className="flex justify-between items-center pr-8">
                          <CardTitle>{entry.title}</CardTitle>
                          {entry.mood && <span className="text-xl">{getMoodEmoji(entry.mood)}</span>}
                        </div>
                        <CardDescription>
                          {format(new Date(entry.createdAt), 'MMMM d, yyyy • h:mm a')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap">
                          {entry.content.length > 300
                            ? `${entry.content.substring(0, 300)}...`
                            : entry.content}
                        </p>
                      </CardContent>
                      {entry.tags && entry.tags.length > 0 && (
                        <CardFooter>
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </CardFooter>
                      )}
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 border rounded-lg bg-card">
                    <p className="text-muted-foreground">No journal entries found</p>
                    <Button className="mt-4" onClick={handleNewEntry}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Entry
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
              </DialogTitle>
            </DialogHeader>
            <JournalEditor
              entryToEdit={selectedEntry}
              onSave={() => setIsEditorOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your journal entry.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
