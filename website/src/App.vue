<template>
  <div>
    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>
  </div>
  <Footer />
</template>
<script setup>
import Footer from "./components/Footer.vue";
</script>