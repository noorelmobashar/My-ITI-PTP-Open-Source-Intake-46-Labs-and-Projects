<script setup>
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  console.log("App mounted");
});

onUnmounted(() => {
  console.log("App unmounted");
});
</script>

<template>

  <RouterView>
  </RouterView>

</template>
