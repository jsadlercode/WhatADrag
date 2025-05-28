<script setup lang="ts">
import TaskCard from './TaskCard.vue';
import TaskEditModal from './TaskEditModal.vue';
import { computed, ref } from 'vue';
import { useDragAndDrop } from '../composables/useDragAndDrop';
import type { Task } from '../composables/useTaskManagement';

const props = defineProps<{
  tasks: Task[];
}>();

const emit = defineEmits<{
  updateTask: [task: Task, targetTask?: Task];
}>();

// Modal state
const isModalOpen = ref(false);
const taskToEdit = ref<Task | null>(null);

// Use drag and drop composable
const {
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
} = useDragAndDrop();

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

// Wrapper function to emit updateTask
function onUpdateTask(task: Task, targetTask?: Task) {
  emit('updateTask', task, targetTask);
}

// Modal handlers
function handleEditTask(task: Task) {
  taskToEdit.value = task;
  isModalOpen.value = true;
}

function handleModalClose() {
  isModalOpen.value = false;
  taskToEdit.value = null;
}

function handleModalSave(updatedTask: Task) {
  emit('updateTask', updatedTask);
  handleModalClose();
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
        @drop="handleDrop($event, 'todo', onUpdateTask)"
      >
        <h3 class="text-2xl text-center mb-4">
          To Do
        </h3>
        <TaskCard
          v-for="task in todoTasks"
          :key="task.id"
          :task="task"
          :is-dragged-over="draggedOverTask?.id === task.id"
          :is-dragged="draggedTask?.id === task.id"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
          @drag-over="handleTaskDragOver"
          @drag-leave="handleTaskDragLeave"
          @edit="handleEditTask"
        />
        <!-- Drop zone indicator for empty column or end of column -->
        <div
          v-if="draggedOverColumn === 'todo' && !draggedOverTask"
          class="w-96 h-24 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg mx-1 my-2 opacity-80 shadow-lg border-2 border-amber-300 animate-pulse flex items-center justify-center"
        >
          <span class="text-white font-semibold">Drop here</span>
        </div>
      </div>
      <!-- Doing Column -->
      <div
        class="basis-1/3 min-h-150 mx-2 border-dashed border-2 rounded-lg border-gray-700 flex flex-col items-center"
        :class="{ 'bg-blue-100 border-blue-400': draggedOverColumn === 'doing' }"
        @dragover="handleColumnDragOver($event, 'doing')"
        @dragleave="handleColumnDragLeave"
        @drop="handleDrop($event, 'doing', onUpdateTask)"
      >
        <h3 class="text-2xl text-center mb-4">
          Doing
        </h3>
        <TaskCard
          v-for="task in doingTasks"
          :key="task.id"
          :task="task"
          :is-dragged-over="draggedOverTask?.id === task.id"
          :is-dragged="draggedTask?.id === task.id"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
          @drag-over="handleTaskDragOver"
          @drag-leave="handleTaskDragLeave"
          @edit="handleEditTask"
        />
        <div
          v-if="draggedOverColumn === 'doing' && !draggedOverTask"
          class="w-96 h-24 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg mx-1 my-2 opacity-80 shadow-lg border-2 border-blue-300 animate-pulse flex items-center justify-center"
        >
          <span class="text-white font-semibold">Drop here</span>
        </div>
      </div>
      <!-- Done Column -->
      <div
        class="basis-1/3 min-h-150 mx-2 border-dashed border-2 rounded-lg border-gray-700 flex flex-col items-center"
        :class="{ 'bg-blue-100 border-blue-400': draggedOverColumn === 'done' }"
        @dragover="handleColumnDragOver($event, 'done')"
        @dragleave="handleColumnDragLeave"
        @drop="handleDrop($event, 'done', onUpdateTask)"
      >
        <h3 class="text-2xl text-center mb-4">
          Done
        </h3>
        <TaskCard
          v-for="task in doneTasks"
          :key="task.id"
          :task="task"
          :is-dragged-over="draggedOverTask?.id === task.id"
          :is-dragged="draggedTask?.id === task.id"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
          @drag-over="handleTaskDragOver"
          @drag-leave="handleTaskDragLeave"
          @edit="handleEditTask"
        />
        <div
          v-if="draggedOverColumn === 'done' && !draggedOverTask"
          class="w-96 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-lg mx-1 my-2 opacity-80 shadow-lg border-2 border-green-300 animate-pulse flex items-center justify-center"
        >
          <span class="text-white font-semibold">Drop here</span>
        </div>
      </div>
    </div>

    <!-- Task Edit Modal -->
    <TaskEditModal
      :is-open="isModalOpen"
      :task="taskToEdit"
      @close="handleModalClose"
      @save="handleModalSave"
    />
  </div>
</template>
