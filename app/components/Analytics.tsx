'use client';

import { useMemo } from 'react';
import { Todo } from '../types/todo';
import { TrendingUp, Target, Clock, Award, Calendar, Zap } from 'lucide-react';

interface AnalyticsProps {
  todos: Todo[];
}

export default function Analytics({ todos }: AnalyticsProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const completed = todos.filter(t => t.completed);
    const todayTodos = todos.filter(t => {
      const createdDate = new Date(t.createdAt);
      return createdDate >= today;
    });
    const weekTodos = todos.filter(t => {
      const createdDate = new Date(t.createdAt);
      return createdDate >= thisWeek;
    });
    const monthTodos = todos.filter(t => {
      const createdDate = new Date(t.createdAt);
      return createdDate >= thisMonth;
    });

    // Calculate completion streak
    const sortedCompleted = completed
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) {
      const dayCompleted = sortedCompleted.some(todo => {
        const completedDate = new Date(todo.createdAt);
        return completedDate.getDate() === currentDate.getDate() &&
               completedDate.getMonth() === currentDate.getMonth() &&
               completedDate.getFullYear() === currentDate.getFullYear();
      });
      
      if (dayCompleted) {
        streak++;
      } else if (streak > 0) {
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }

    const completionRate = todos.length > 0 ? Math.round((completed.length / todos.length) * 100) : 0;
    const avgPerDay = monthTodos.length > 0 ? Math.round(monthTodos.length / 30) : 0;
    const priorityStats = {
      high: todos.filter(t => t.priority === 'high').length,
      medium: todos.filter(t => t.priority === 'medium').length,
      low: todos.filter(t => t.priority === 'low').length,
    };

    return {
      completionRate,
      streak,
      today: {
        created: todayTodos.length,
        completed: todayTodos.filter(t => t.completed).length,
      },
      week: {
        created: weekTodos.length,
        completed: weekTodos.filter(t => t.completed).length,
      },
      month: {
        created: monthTodos.length,
        completed: monthTodos.filter(t => t.completed).length,
      },
      avgPerDay,
      priorityStats,
    };
  }, [todos]);

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    color, 
    trend 
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <div className={`${color} rounded-xl p-6 text-white relative overflow-hidden`}>
      <div className="absolute top-0 right-0 opacity-10">
        <Icon className="h-16 w-16" />
      </div>
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <Icon className="h-6 w-6" />
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        {subtitle && (
          <div className="text-sm opacity-80 flex items-center gap-1">
            {trend && (
              <TrendingUp 
                className={`h-3 w-3 ${
                  trend === 'up' ? 'rotate-0' : 
                  trend === 'down' ? 'rotate-180' : 
                  'rotate-90'
                }`} 
              />
            )}
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mb-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Your productivity insights
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          subtitle="Overall progress"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          trend={stats.completionRate >= 70 ? 'up' : 'neutral'}
        />
        
        <StatCard
          icon={Award}
          title="Current Streak"
          value={stats.streak}
          subtitle="Days with completed todos"
          color="bg-gradient-to-br from-green-500 to-green-600"
          trend={stats.streak > 3 ? 'up' : 'neutral'}
        />
        
        <StatCard
          icon={Calendar}
          title="This Week"
          value={`${stats.week.completed}/${stats.week.created}`}
          subtitle="Completed/Created"
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        
        <StatCard
          icon={Zap}
          title="Daily Average"
          value={stats.avgPerDay}
          subtitle="Todos per day"
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Priority Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Priority Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-red-600 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                High Priority
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.priorityStats.high}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-yellow-600 flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                Medium Priority
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.priorityStats.medium}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Low Priority
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.priorityStats.low}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Recent Performance
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Today</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {stats.today.completed}/{stats.today.created}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: stats.today.created > 0 
                      ? `${(stats.today.completed / stats.today.created) * 100}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">This Week</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {stats.week.completed}/{stats.week.created}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: stats.week.created > 0 
                      ? `${(stats.week.completed / stats.week.created) * 100}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">This Month</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {stats.month.completed}/{stats.month.created}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: stats.month.created > 0 
                      ? `${(stats.month.completed / stats.month.created) * 100}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}