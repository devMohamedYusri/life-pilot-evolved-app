
// User
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

// Task
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  tags?: string[];
  isRoutine?: boolean;
  routineFrequency?: 'daily' | 'weekly' | 'monthly' | 'custom';
  routineDays?: number[]; // 0-6 for days of week
}

// Journal Entry
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: 'happy' | 'content' | 'neutral' | 'sad' | 'stressed';
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  isPrivate?: boolean;
}

// Life Area
export interface LifeArea {
  id: string;
  name: string;
  color: string;
  icon: string;
  progress: number; // 0-100
  priority: number;
  isActive: boolean;
}

// Goal
export interface Goal {
  id: string;
  title: string;
  description?: string;
  lifeAreaId: string;
  startDate: Date;
  endDate?: Date;
  progress: number; // 0-100
  milestones: Milestone[];
  isCompleted: boolean;
}

// Milestone
export interface Milestone {
  id: string;
  title: string;
  dueDate?: Date;
  isCompleted: boolean;
  progressPercentage: number; // What percentage of the parent goal this milestone represents
}

// Notification
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'journal' | 'goal' | 'system' | 'ai';
  isRead: boolean;
  createdAt: Date;
  link?: string; // Link to related content
}

// Statistics
export interface DailyStats {
  date: Date;
  tasksCompleted: number;
  tasksCreated: number;
  journalEntries: number;
  moodAverage?: number; // 1-5
  focusTime?: number; // minutes
}
