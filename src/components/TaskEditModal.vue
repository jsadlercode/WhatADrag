<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Task } from '../composables/useTaskManagement';

const props = defineProps<{
  isOpen: boolean;
  task: Task | null;
}>();

const emit = defineEmits<{
  close: [];
  save: [task: Task];
}>();

const title = ref('');
const status = ref('');

// Watch for changes to the task prop to populate the form
watch(() => props.task, (newTask) => {
  if (newTask) {
    title.value = newTask.title;
    status.value = newTask.status;
  }
}, { immediate: true });

function handleSave() {
  if (props.task && title.value.trim()) {
    const updatedTask: Task = {
      ...props.task,
      title: title.value.trim(),
      status: status.value
    };
    emit('save', updatedTask);
  }
}

function handleCancel() {
  emit('close');
}

// Close modal when clicking outside
function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('close');
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    class="modal modal-open"
  >
    <div class="modal-box">
      <h3 class="font-bold text-lg">
        Edit Task
      </h3>

      <div class="py-4">
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Title</span>
          </label>
          <input
            v-model="title"
            type="text"
            placeholder="Enter task title"
            class="input input-bordered w-full max-w-xs"
            @keyup.enter="handleSave"
          >
        </div>

        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Status</span>
          </label>
          <select
            v-model="status"
            class="select select-bordered"
          >
            <option value="todo">
              To Do
            </option>
            <option value="doing">
              Doing
            </option>
            <option value="done">
              Done
            </option>
          </select>
        </div>
      </div>

      <div class="modal-action">
        <button
          class="btn"
          @click="handleCancel"
        >
          Cancel
        </button>
        <button
          class="btn btn-primary"
          :disabled="!title.trim()"
          @click="handleSave"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
