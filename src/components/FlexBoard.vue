<script setup lang="ts">
import TaskCard from './TaskCard.vue';
import { computed, ref } from 'vue';

interface Task {
  id: number;
  title: string;
  status: string;
  position: number;
}

const props = defineProps<{
  tasks: Task[];
}>();

const emit = defineEmits<{
  updateTask: [task: Task, targetTask?: Task];
}>();

const draggedTask = ref<Task | null>(null);
const draggedOverTask = ref<Task | null>(null);
const draggedOverColumn = ref<string | null>(null);
// Sort tasks by position within each status
const todoTasks = computed(() =>
  props.tasks
    .filter(task => task.status === 'todo')
    .sort((a, b) => a.position - b.position)
);
const doingTasks = computed(() =>
  props.tasks
    .filter(task => task.status === 'doing')
    .sort((a, b) => a.position - b.position)
);
const doneTasks = computed(() =>
  props.tasks
    .filter(task => task.status === 'done')
    .sort((a, b) => a.position - b.position)
);

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
}

function handleTaskDragOver(task: Task) {
  if (draggedTask.value && draggedTask.value.id !== task.id) {
    draggedOverTask.value = task;
    if (draggedTask.value.status !== task.status) {
      draggedOverColumn.value = null;
    }
  }
}

function handleTaskDragLeave() {
  // Add a small delay to prevent flickering when moving between card elements
  setTimeout(() => {
    draggedOverTask.value = null;
  }, 10);
}

function handleColumnDragOver(event: DragEvent, status: string) {
  event.preventDefault();
  //if (draggedTask.value && draggedTask.value.status !== status) {
    if (!draggedOverTask.value) {
      draggedOverColumn.value = status;
    }
 // }
}

function handleColumnDragLeave() {
  // Add a small delay to prevent flickering
  setTimeout(() => {
    draggedOverColumn.value = null;
  }, 10);
}

function handleDrop(event: DragEvent, status: string) {
  event.preventDefault();

  if (draggedTask.value) {
    const updatedTask = { ...draggedTask.value, status };

    // If dropping over another task, we need to handle positioning
    if (draggedOverTask.value) {
      // For now, just update the status. You could implement more complex positioning logic here
      emit('updateTask', updatedTask, draggedOverTask.value);
    } else {
      // Dropping in empty space or at the end of a column
      emit('updateTask', updatedTask);
    }
  }

  handleDragEnd();
}

</script>

<template>
  <div>
    Flex Board Component
    <div class="flex flex-row p-4">
      <!-- To Do Column -->
      <div
        class="basis-1/3 min-h-150 mx-2 border-dashed border-2 rounded-lg border-gray-700 flex flex-col items-center"
        :class="{ 'bg-blue-100 border-blue-400': draggedOverColumn === 'todo' }"
        @dragover="handleColumnDragOver($event, 'todo')"
        @dragleave="handleColumnDragLeave"
        @drop="handleDrop($event, 'todo')"
      >
        <h3 class="text-2xl text-center mb-4">
          To Do
        </h3>
        <TaskCard
          v-for="task in todoTasks"
          :key="task.id"
          :task="task"
          :is-dragged-over="draggedOverTask?.id === task.id"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
          @drag-over="handleTaskDragOver"
          @drag-leave="handleTaskDragLeave"
        />
        <!-- Drop zone indicator for empty column or end of column -->
        <div
          v-if="draggedOverColumn === 'todo' && !draggedOverTask"
          class="min-h-20 bg-amber-800 w-96 rounded-lg m-1"
        />
      </div>
      <!-- Doing Column -->
      <div
        class="basis-1/3 min-h-150 mx-2 border-dashed border-2 rounded-lg border-gray-700 flex flex-col items-center"
        :class="{ 'bg-blue-100 border-blue-400': draggedOverColumn === 'doing' }"
        @dragover="handleColumnDragOver($event, 'doing')"
        @dragleave="handleColumnDragLeave"
        @drop="handleDrop($event, 'doing')"
      >
        <h3 class="text-2xl text-center mb-4">
          Doing
        </h3>
        <TaskCard
          v-for="task in doingTasks"
          :key="task.id"
          :task="task"
          :is-dragged-over="draggedOverTask?.id === task.id"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
          @drag-over="handleTaskDragOver"
          @drag-leave="handleTaskDragLeave"
        />
        <div
          v-if="draggedOverColumn === 'doing' && !draggedOverTask"
          class="h-2 bg-blue-400 rounded mx-4 mt-2 opacity-75 w-full"
        />
      </div>
      <!-- Done Column -->
      <div
        class="basis-1/3 min-h-150 mx-2 border-dashed border-2 rounded-lg border-gray-700 flex flex-col items-center"
        :class="{ 'bg-blue-100 border-blue-400': draggedOverColumn === 'done' }"
        @dragover="handleColumnDragOver($event, 'done')"
        @dragleave="handleColumnDragLeave"
        @drop="handleDrop($event, 'done')"
      >
        <h3 class="text-2xl text-center mb-4">
          Done
        </h3>
        <TaskCard
          v-for="task in doneTasks"
          :key="task.id"
          :task="task"
          :is-dragged-over="draggedOverTask?.id === task.id"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
          @drag-over="handleTaskDragOver"
          @drag-leave="handleTaskDragLeave"
        />
        <div
          v-if="draggedOverColumn === 'done' && !draggedOverTask"
          class="h-2 bg-blue-400 rounded mx-4 mt-2 opacity-75 w-full"
        />
      </div>
    </div>
  </div>
</template>
