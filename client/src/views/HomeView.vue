<template>
   <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">Welcome!</h1>
      <p class="text-xl mb-6">Let's create Vital Sign for our patient!</p>
      <button
        @click="goToDashboard"
        class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition duration-300"
      >
        Go to Dashboard
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();

    const goToDashboard = () => {
      router.push('/dashboard');
    };

    return {
      goToDashboard,
    };
  },
});
</script>