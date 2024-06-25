<template>
  <Header></Header>
  <RouterView />
</template>

<script lang="ts">
import { RouterView } from "vue-router";
import { defineComponent } from 'vue';

import Header from "./components/Header.vue";

export default defineComponent({
  components: {
    Header,
  }
});


</script>