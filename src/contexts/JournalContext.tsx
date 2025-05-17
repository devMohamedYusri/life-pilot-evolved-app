
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { JournalEntry } from '@/types';
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface JournalContextType {
  entries: JournalEntry[];
  isLoading: boolean;
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, entry: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => JournalEntry | undefined;
  getEntriesByDate: (date: Date) => JournalEntry[];
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize with some sample entries
  useEffect(() => {
    // Check for entries in localStorage
    const storedEntries = localStorage.getItem('lifepilot_journal');
    
    if (storedEntries) {
      try {
        const parsedEntries = JSON.parse(storedEntries);
        // Convert string dates back to Date objects
        const entriesWithDates = parsedEntries.map((entry: any) => ({
          ...entry,
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.updatedAt),
        }));
        setEntries(entriesWithDates);
      } catch (error) {
        console.error('Failed to parse stored journal entries:', error);
        localStorage.removeItem('lifepilot_journal');
        initializeWithSampleEntries();
      }
    } else {
      initializeWithSampleEntries();
    }
    
    setIsLoading(false);
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (entries.length > 0 && !isLoading) {
      localStorage.setItem('lifepilot_journal', JSON.stringify(entries));
    }
  }, [entries, isLoading]);

  const initializeWithSampleEntries = () => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const sampleEntries: JournalEntry[] = [
      {
        id: uuidv4(),
        title: 'My first journal entry',
        content: 'Today was a productive day. I managed to complete all of my tasks and even had time for a walk in the park. The weather was beautiful and I felt very peaceful.',
        mood: 'happy',
        createdAt: yesterday,
        updatedAt: yesterday,
        tags: ['productive', 'peaceful']
      },
      {
        id: uuidv4(),
        title: 'Planning for the week ahead',
        content: 'I need to focus on the upcoming project deadline. It feels challenging but I think I can manage if I break it down into smaller tasks and focus on one at a time.',
        mood: 'neutral',
        createdAt: now,
        updatedAt: now,
        tags: ['planning', 'work']
      }
    ];
    
    setEntries(sampleEntries);
    localStorage.setItem('lifepilot_journal', JSON.stringify(sampleEntries));
  };

  const addEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newEntry: JournalEntry = {
      ...entry,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    setEntries(prevEntries => [...prevEntries, newEntry]);
    
    toast({
      title: "Journal entry saved",
      description: "Your thoughts have been captured successfully.",
    });
  };

  const updateEntry = (id: string, updatedFields: Partial<JournalEntry>) => {
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id
          ? { ...entry, ...updatedFields, updatedAt: new Date() }
          : entry
      )
    );
    
    toast({
      title: "Entry updated",
      description: "Your journal entry has been updated.",
    });
  };

  const deleteEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    
    toast({
      title: "Entry deleted",
      description: "Your journal entry has been deleted.",
    });
  };

  const getEntryById = (id: string): JournalEntry | undefined => {
    return entries.find(entry => entry.id === id);
  };

  const getEntriesByDate = (date: Date): JournalEntry[] => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === targetDate.getTime();
    });
  };

  return (
    <JournalContext.Provider
      value={{
        entries,
        isLoading,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntryById,
        getEntriesByDate,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
