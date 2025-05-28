import type { Task } from './useTaskManagement';

export function useTaskDragEvents(
  task: Task,
  emit: {
    (e: 'dragStart', task: Task): void;
    (e: 'dragEnd'): void;
    (e: 'dragOver', task: Task): void;
    (e: 'dragLeave'): void;
  }
) {
  function handleDragStart(event: DragEvent) {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', JSON.stringify(task));
    }
    emit('dragStart', task);
  }

  function handleDragEnd() {
    emit('dragEnd');
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    emit('dragOver', task);
  }

  function handleDragLeave(event: DragEvent) {
    const currentTarget = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;

    // Only emit drag leave if we're actually leaving the card container
    if (!currentTarget?.contains(relatedTarget)) {
      emit('dragLeave');
    }
  }

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave
  };
}
