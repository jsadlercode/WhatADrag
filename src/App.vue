<script setup lang="ts">

import { ref } from 'vue';
import FlexBoard from './components/FlexBoard.vue';
import GridBoard from './components/GridBoard.vue';
import { useTaskManagement } from './composables/useTaskManagement';

const boardIsFlex = ref(true);

// Initialize task management with sample data
const { tasks, updateTask } = useTaskManagement([
  { id: 1, title: 'Task 1', status: 'todo', position: 0 },
  { id: 2, title: 'Task 2', status: 'doing', position: 0 },
  { id: 3, title: 'Task 3', status: 'done', position: 0 },
  { id: 4, title: 'Task 4', status: 'todo', position: 1 },
  { id: 5, title: 'Task 5', status: 'doing', position: 1 },
  { id: 6, title: 'Task 6', status: 'done', position: 1 }
]);

</script>

<template>
  <header>
    <h1 class="text-3xl text-center">
      Drag and Drop App
    </h1>
  </header>

  <main>
    <div class="container mx-auto">
      <div class="button-group min-h-10 my-3">
        <button
          class="btn btn-primary"
          @click="boardIsFlex = !boardIsFlex"
        >
          <span v-if="boardIsFlex">Change to Grid</span>
          <span v-else>Change to Flex</span>
        </button>
      </div>
      <div class="container min-h-150 bg-gray-500">
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
