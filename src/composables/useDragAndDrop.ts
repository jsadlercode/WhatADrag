import { ref } from 'vue';
import type { Task } from './useTaskManagement';

export function useDragAndDrop() {
  const draggedTask = ref<Task | null>(null);
  const draggedOverTask = ref<Task | null>(null);
  const draggedOverColumn = ref<string | null>(null);

  // Debounce timers
  let dragOverTimeout: number | null = null;
  let dragLeaveTimeout: number | null = null;

  function handleDragStart(task: Task) {
    draggedTask.value = task;
    // Clear any existing drag over states
    draggedOverTask.value = null;
    draggedOverColumn.value = null;
  }

  function handleDragEnd() {
    draggedTask.value = null;
    draggedOverTask.value = null;
    draggedOverColumn.value = null;

    // Clear any pending timeouts
    if (dragOverTimeout) {
      clearTimeout(dragOverTimeout);
      dragOverTimeout = null;
    }
    if (dragLeaveTimeout) {
      clearTimeout(dragLeaveTimeout);
      dragLeaveTimeout = null;
    }
  }

  function handleTaskDragOver(task: Task) {
    if (draggedTask.value && draggedTask.value.id !== task.id) {
      // Clear any pending drag leave timeout
      if (dragLeaveTimeout) {
        clearTimeout(dragLeaveTimeout);
        dragLeaveTimeout = null;
      }

      draggedOverTask.value = task;
      draggedOverColumn.value = null;
    }
  }

  function handleTaskDragLeave() {
    // Use a longer delay and clear any existing timeout
    if (dragLeaveTimeout) {
      clearTimeout(dragLeaveTimeout);
    }

    dragLeaveTimeout = setTimeout(() => {
      draggedOverTask.value = null;
      dragLeaveTimeout = null;
    }, 50);
  }

  function handleColumnDragOver(event: DragEvent, status: string) {
    event.preventDefault();

    // Clear any pending timeouts
    if (dragLeaveTimeout) {
      clearTimeout(dragLeaveTimeout);
      dragLeaveTimeout = null;
    }
    if (dragOverTimeout) {
      clearTimeout(dragOverTimeout);
    }

    // Only set column drag over if not currently over a task
    if (!draggedOverTask.value) {
      draggedOverColumn.value = status;
    }
  }

  function handleColumnDragLeave(event: DragEvent) {
    // Only trigger if we're actually leaving the column container
    const currentTarget = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;

    if (!currentTarget.contains(relatedTarget)) {
      if (dragOverTimeout) {
        clearTimeout(dragOverTimeout);
      }

      dragOverTimeout = setTimeout(() => {
        draggedOverColumn.value = null;
        dragOverTimeout = null;
      }, 50);
    }
  }

  function handleDrop(
    event: DragEvent,
    status: string,
    onUpdateTask: (task: Task, targetTask?: Task) => void
  ) {
    event.preventDefault();

    if (draggedTask.value) {
      const updatedTask = { ...draggedTask.value, status };

      // If dropping over another task, we need to handle positioning
      if (draggedOverTask.value) {
        onUpdateTask(updatedTask, draggedOverTask.value);
      } else {
        // Dropping in empty space or at the end of a column
        onUpdateTask(updatedTask);
      }
    }

    handleDragEnd();
  }

  return {
    draggedTask,
    draggedOverTask,
    draggedOverColumn,
    handleDragStart,
    handleDragEnd,
    handleTaskDragOver,
    handleTaskDragLeave,
    handleColumnDragOver,
    handleColumnDragLeave,
    handleDrop
  };
}
