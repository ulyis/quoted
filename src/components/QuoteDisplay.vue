<script setup lang="ts">
defineProps({
  currentQuote: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <p class="quote">{{ currentQuote }}</p>
</template>

<style scoped>
.quote {
  font-size: 1.25rem;
  text-align: center;
  margin-top: 3rem;
  margin-bottom: 3rem;
}
</style>
