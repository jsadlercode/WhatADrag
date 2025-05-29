import { ref, computed, watch } from 'vue';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  position: number;
}

const STORAGE_KEY = 'whatadrag-tasks';

export function useTaskManagement(initialTasks: Task[] = []) {
  // Load tasks from localStorage or use initial tasks
  const loadTasksFromStorage = (): Task[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedTasks = JSON.parse(stored);
        // Validate that the parsed data is an array of tasks
        if (Array.isArray(parsedTasks) && parsedTasks.every(isValidTask)) {
          return parsedTasks;
        }
      }
    } catch (error) {
      console.warn('Failed to load tasks from localStorage:', error);
    }
    return initialTasks;
  };

  // Type guard to validate task structure
  const isValidTask = (obj: any): obj is Task => {
    return (
      typeof obj === 'object' &&
      typeof obj.id === 'number' &&
      typeof obj.title === 'string' &&
      typeof obj.description === 'string' &&
      typeof obj.status === 'string' &&
      typeof obj.position === 'number'
    );
  };

  // Save tasks to localStorage
  const saveTasksToStorage = (tasksToSave: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  };
  const tasks = ref<Task[]>(loadTasksFromStorage());

   // Watch for changes and save to localStorage
  watch(
    tasks,
    (newTasks) => {
      saveTasksToStorage(newTasks);
    },
    { deep: true }
  );

  // Computed properties for tasks by status
  const todoTasks = computed(() =>
    tasks.value
      .filter(task => task.status === 'todo')
      .sort((a, b) => a.position - b.position)
  );

  const doingTasks = computed(() =>
    tasks.value
      .filter(task => task.status === 'doing')
      .sort((a, b) => a.position - b.position)
  );

  const doneTasks = computed(() =>
    tasks.value
      .filter(task => task.status === 'done')
      .sort((a, b) => a.position - b.position)
  );

  function updateTask(updatedTask: Task, targetTask?: Task) {
    const index = tasks.value.findIndex(task => task.id === updatedTask.id);
    if (index === -1) return;

    const oldTask = tasks.value[index];
    const oldStatus = oldTask.status;
    const newStatus = updatedTask.status;

    // If moving to a different column, recalculate positions
    if (oldStatus !== newStatus) {
      // Remove task from old position and adjust positions in old column
      const oldColumnTasks = tasks.value.filter(task =>
        task.status === oldStatus && task.id !== updatedTask.id
      );
      oldColumnTasks.forEach((task) => {
        if (task.position > oldTask.position) {
          task.position = task.position - 1;
        }
      });

      // Calculate new position in target column
      let newPosition = 0;
      if (targetTask) {
        // Inserting above target task
        const targetIndex = tasks.value.findIndex(t => t.id === targetTask.id);
        const target = tasks.value[targetIndex];
        newPosition = target.position;

        // Shift other tasks down in the target column
        const targetColumnTasks = tasks.value.filter(task =>
          task.status === newStatus && task.position >= newPosition
        );
        targetColumnTasks.forEach(task => {
          task.position = task.position + 1;
        });
      } else {
        // Dropping at the end of the column
        const columnTasks = tasks.value.filter(task => task.status === newStatus);
        newPosition = columnTasks.length;
      }

      updatedTask.position = newPosition;
    } else if (targetTask && oldStatus === newStatus) {
      // Moving within the same column
      const targetIndex = tasks.value.findIndex(t => t.id === targetTask.id);
      const target = tasks.value[targetIndex];
      const newPosition = target.position;

      if (oldTask.position < newPosition) {
        // Moving down: shift tasks up between old and new position
        tasks.value.forEach(task => {
          if (task.status === newStatus &&
              task.position > oldTask.position &&
              task.position <= newPosition &&
              task.id !== updatedTask.id) {
            task.position = task.position - 1;
          }
        });
        updatedTask.position = newPosition;
      } else if (oldTask.position > newPosition) {
        // Moving up: shift tasks down between new and old position
        tasks.value.forEach(task => {
          if (task.status === newStatus &&
              task.position >= newPosition &&
              task.position < oldTask.position &&
              task.id !== updatedTask.id) {
            task.position = task.position + 1;
          }
        });
        updatedTask.position = newPosition;
      }
    }

    // Update the task
    tasks.value[index] = updatedTask;
  }

  function addTask(task: Omit<Task, 'id'>) {
    const newId = Math.max(...tasks.value.map(t => t.id), 0) + 1;
    const columnTasks = tasks.value.filter(t => t.status === task.status);
    const position = columnTasks.length;

    tasks.value.push({
      ...task,
      id: newId,
      position
    });
  }

  function removeTask(taskId: number) {
    const taskIndex = tasks.value.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = tasks.value[taskIndex];
    // Remove task and adjust positions in its column
    tasks.value.splice(taskIndex, 1);

    const columnTasks = tasks.value.filter(t => t.status === task.status);
    columnTasks.forEach(t => {
      if (t.position > task.position) {
        t.position = t.position - 1;
      }
    });
  }

  return {
    tasks,
    todoTasks,
    doingTasks,
    doneTasks,
    updateTask,
    addTask,
    removeTask
  };
}
