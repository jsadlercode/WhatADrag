<script setup lang="ts">

interface Task {
  id: number;
  title: string;
  status: string;
}
const props = defineProps<{
  task: Task;
}>();




</script>

<template>
  <div class="card w-96 bg-base-100 card-xs shadow-sm m-1">
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
</template>
