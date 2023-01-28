<script setup lang="ts">
import { computed, ref } from 'vue';
import { DEFAULT_LOOKBACK, LOOKBACKS } from '../../constants';
import type { OverallData } from '../../models/server';
import AreaChart from '../charts/AreaChart.vue';

const props = defineProps<{
  data: OverallData[];
}>();

const lookbacks = ref(LOOKBACKS);
const selectedLookback = ref(DEFAULT_LOOKBACK.name);

const _data = ref(props.data);
const data = computed(() => _data.value);

const x = (i: OverallData) => i.day;
const y = (i: OverallData) => i.time;

// TODO: watch lookback and call /api/userData?userId&serverId&lookback
</script>

<template>
  <select v-model="selectedLookback" class="px-2 py-1 mb-2">
    <option v-for="lookback in lookbacks" :key="lookback.days" :value="lookback.name">{{ lookback.name }}</option>
  </select>

  <!-- This will become an area chart -->
  <area-chart id="user-data-chart" :data="data" :x="x" :y="y" />

  <p>{{ props.data }}</p>
</template>
