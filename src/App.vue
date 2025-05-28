<script setup lang="ts">

import { ref } from 'vue';
import FlexBoard from './components/FlexBoard.vue';
import GridBoard from './components/GridBoard.vue';

interface Task {
  id: number;
  title: string;
  status: string;
  position: number;
}

const boardIsFlex = ref(true);
const tasks = ref<Task[]>([
  { id: 1, title: 'Task 1', status: 'todo', position: 0 },
  { id: 2, title: 'Task 2', status: 'doing', position: 0 },
  { id: 3, title: 'Task 3', status: 'done', position: 0 },
  { id: 4, title: 'Task 4', status: 'todo', position: 1 },
  { id: 5, title: 'Task 5', status: 'doing', position: 1 },
  { id: 6, title: 'Task 6', status: 'done', position: 1 }
]);

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
    oldColumnTasks.forEach((task, index) => {
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
          <GridBoard />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
