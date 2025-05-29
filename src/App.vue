<script setup lang="ts">

import { ref } from 'vue';
import FlexBoard from './components/FlexBoard.vue';
import GridBoard from './components/GridBoard.vue';
import { useTaskManagement } from './composables/useTaskManagement';

const boardIsFlex = ref(true);
const newTaskTitle = ref('');

// Initialize task management with sample data
const { tasks, updateTask, addTask } = useTaskManagement([
  { id: 1, title: 'Task 1', status: 'todo', position: 0, description: 'This is task 1' },
  { id: 2, title: 'Task 2', status: 'doing', position: 0, description: 'This is task 2' },
  { id: 3, title: 'Task 3', status: 'done', position: 0, description: 'This is task 3' },
  { id: 4, title: 'Task 4', status: 'todo', position: 1, description: 'This is task 4' },
  { id: 5, title: 'Task 5', status: 'doing', position: 1, description: 'This is task 5' },
  { id: 6, title: 'Task 6', status: 'done', position: 1, description: 'This is task 6' }
]);

function handleAddTask() {
  if (newTaskTitle.value.trim()) {
    addTask({
      title: newTaskTitle.value.trim(),
      description: '',
      status: 'todo',
      position: 0 // This will be recalculated by addTask
    });
    newTaskTitle.value = ''; // Clear the input after adding
  }
}

</script>

<template>
  <header>
    <h1 class="text-3xl text-center">
      Drag and Drop App
    </h1>
  </header>

  <main class="">
    <div class="w-full">
      <div class="button-group min-h-10 my-3 mx-15 flex justify-between items-center">
        <div class="flex items-center">
          <input
            type="text"
            v-model="newTaskTitle"
            placeholder="Add new task here"
            class="input mr-2 w-64"
            @keyup.enter="handleAddTask"
          >
          <button
            class="btn btn-sm btn-success"
            @click="handleAddTask"
            :disabled="!newTaskTitle.trim()"
          >
            Add
          </button>
        </div>
        <button
          class="btn btn-primary"
          @click="boardIsFlex = !boardIsFlex"
        >
          <span v-if="boardIsFlex">Change to Grid</span>
          <span v-else>Change to Flex</span>
        </button>
      </div>
      <div class="w-full min-h-150">
        <div v-if="boardIsFlex">
          <FlexBoard
            :tasks="tasks"
            @update-task="updateTask"
          />
        </div>
        <div v-else>
          <GridBoard
            :tasks="tasks"
            @update-task="updateTask"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
