<script setup lang="ts">
import type { OverallData } from '../../models/server';

const props = defineProps<{
  data: OverallData;
}>();
</script>

<template>
  <h1>last 7 days</h1>
  <p>{{ props.data.time }}</p>
</template>
