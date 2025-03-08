<template>
  <div class="flex flex-col h-screen">
    <div class="flex-grow">
      <router-view />
    </div>
    <BottomMenu />
  </div>
</template>

<script setup>
import BottomMenu from './components/BottomMenu.vue';
</script>

<style>
/* Optional: Add styles here */
</style>