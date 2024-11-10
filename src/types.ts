export interface Task {
  id: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  status: 'pending' | 'completed' | 'partial' | 'skipped';
}

export interface Goal {
  id: string;
  title: string;
  tasks: Task[];
  createdAt: string;
}