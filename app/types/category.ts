export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
  { name: 'Personal', color: 'bg-blue-500', icon: '👤' },
  { name: 'Work', color: 'bg-purple-500', icon: '💼' },
  { name: 'Health', color: 'bg-green-500', icon: '🏃‍♂️' },
  { name: 'Shopping', color: 'bg-yellow-500', icon: '🛒' },
  { name: 'Learning', color: 'bg-indigo-500', icon: '📚' },
  { name: 'Finance', color: 'bg-emerald-500', icon: '💰' },
];