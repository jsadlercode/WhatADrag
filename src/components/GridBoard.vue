<script setup lang="ts">
import TaskCard from './TaskCard.vue';



</script>

<template>
  <div>
    Grid Board Component
    <div class="grid grid-cols-3 p-4">
      <div
        class="bg-cyan-400 min-h-150 mx-2 px-2"
        id="todo"
      >
        <h3 class="text-2xl text-center">
          To Do
        </h3>

        <TaskCard />
      </div>
      <div
        class="bg-cyan-400 min-h-150 mx-2"
        id="doing"
      >
        <h3 class="text-2xl text-center">
          Doing
        </h3>
      </div>
      <div
        class="bg-cyan-400 min-h-150 mx-2"
        id="done"
      >
        <h3 class="text-2xl text-center">
          Done
        </h3>
      </div>
    </div>
  </div>
</template>
