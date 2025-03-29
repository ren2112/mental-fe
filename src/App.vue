<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

import { useRoute } from 'vue-router'
 
const route = useRoute()
const routerKey = computed(() => {
  return route.path + Math.random()
})
</script>

<template>
  <RouterView :key="routerKey"></RouterView>
</template>

<style >
body {

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f5f5f5;

}

</style>
