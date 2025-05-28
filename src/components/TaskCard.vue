<script setup lang="ts">

interface Task {
  id: number;
  title: string;
  status: string;
  position: number;
}
const props = defineProps<{
  task: Task;
  isDraggedOver?: boolean;
}>();

const emit = defineEmits<{
  dragStart: [task: Task];
  dragEnd: [];
  dragOver: [task: Task];
  dragLeave: [];
}>();

function handleDragStart(event: DragEvent) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify(props.task));
  }
  emit('dragStart', props.task);
}

function handleDragEnd() {
  emit('dragEnd');
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  //event.stopPropagation();
  emit('dragOver', props.task);
}

function handleDragLeave(event: DragEvent) {
  if (!event.currentTarget?.contains(event.relatedTarget as Node)) {
    emit('dragLeave');
  }
}

</script>

<template>
  <div>
    <div
      v-if="isDraggedOver"
      class="h-2 bg-blue-400 rounded mx-4 mb-2 opacity-75"
    />
    <div
      class="card w-96 bg-base-100 card-xs shadow-sm m-1"
      :class="{ 'transform translate-y-2': isDraggedOver }"
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
