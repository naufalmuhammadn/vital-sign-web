<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 py-14 overflow-y-auto">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-full overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">{{ title }}</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800">&times;</button>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  emits: ['close'],
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
});
</script>