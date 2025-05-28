<script setup lang="ts">
import TaskCard from './TaskCard.vue';
import { computed } from 'vue';

interface Task {
  id: number;
  title: string;
  status: string;
}

const props = defineProps<{
  tasks: Task[];
}>();

const todoTasks = computed(() => props.tasks.filter(task => task.status === 'todo'));
const doingTasks = computed(() => props.tasks.filter(task => task.status === 'doing'));
const doneTasks = computed(() => props.tasks.filter(task => task.status === 'done'));

</script>

<template>
  <div>
    Flex Board Component
    <div class="flex flex-row p-4">
      <div class="basis-1/3 min-h-150 mx-2 border-dashed border-2 rounded-lg border-gray-700 flex flex-col items-center">
        <h3 class="text-2xl text-center mb-4">
          To Do
        </h3>
        <TaskCard
          v-for="task in todoTasks"
          :key="task.id"
          :task="task"
        />
      </div>
      <div class="basis-1/3 min-h-150 mx-2 border-dashed border-2 rounded-lg border-gray-700 flex flex-col items-center">
        <h3 class="text-2xl text-center mb-4">
          Doing
        </h3>
        <TaskCard
          v-for="task in doingTasks"
          :key="task.id"
          :task="task"
        />
      </div>
      <div class="basis-1/3 min-h-150 mx-2 border-dashed border-2 rounded-lg border-gray-700 flex flex-col items-center">
        <h3 class="text-2xl text-center mb-4">
          Done
        </h3>
        <TaskCard
          v-for="task in doneTasks"
          :key="task.id"
          :task="task"
        />
      </div>
    </div>
  </div>
</template>
