import { computed } from 'vue';
import type { Task } from './useTaskManagement';

export function useColumnTasks(tasks: Task[]) {
  const todoTasks = computed(() =>
    tasks
      .filter(task => task.status === 'todo')
      .sort((a, b) => a.position - b.position)
  );

  const doingTasks = computed(() =>
    tasks
      .filter(task => task.status === 'doing')
      .sort((a, b) => a.position - b.position)
  );

  const doneTasks = computed(() =>
    tasks
      .filter(task => task.status === 'done')
      .sort((a, b) => a.position - b.position)
  );

  const getTasksByStatus = (status: string) => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => a.position - b.position);
  };

  return {
    todoTasks,
    doingTasks,
    doneTasks,
    getTasksByStatus
  };
}
