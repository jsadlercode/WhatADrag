<script setup lang="ts">
import { useTaskDragEvents } from '../composables/useTaskDragEvents';
import type { Task } from '../composables/useTaskManagement';

const props = defineProps<{
  task: Task;
  isDraggedOver?: boolean;
  isDragged?: boolean;
}>();

const emit = defineEmits<{
  dragStart: [task: Task];
  dragEnd: [];
  dragOver: [task: Task];
  dragLeave: [];
}>();

// Use the drag events composable
const {
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDragLeave
} = useTaskDragEvents(props.task, emit);

</script>

<template>
  <div>
    <div
      v-if="isDraggedOver"
      class="w-96 h-24 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg mx-1 mb-2 opacity-90 shadow-lg border-2 border-blue-300 animate-pulse flex items-center justify-center"
    >
      <span class="text-white font-semibold">Drop here</span>
    </div>
    <div
      class="card w-96 bg-base-100 card-xs shadow-sm m-1 transition-all duration-200"
      :class="{
        'transform translate-y-2': isDraggedOver,
        'opacity-50 scale-95 rotate-2 shadow-2xl border-2 border-blue-400': isDragged,
        'hover:shadow-md': !isDragged
      }"
      draggable="true"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <div class="card-body">
        <h2 class="card-title">
          {{ props.task.title }}
        </h2>
        <div class="justify-end card-actions">
          <button class="btn btn-xs btn-primary">
            Edit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
