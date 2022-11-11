<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { convertToNow, prettyDate } from '../../../utils/date';
import type { OverallData } from '../../models/server';
import AreaChart from '../charts/AreaChart.vue';

// props
const props = defineProps<{
  data: OverallData[];
}>();

// data
type ConvertedData = {
  day: string;
  ms: number;
  time: number;
};
const _data = ref<OverallData[]>(props.data);
const data = computed<ConvertedData[]>(() => {
  return _data.value.map((item: OverallData) => {
    const d = convertToNow(item.day);
    const ms = new Date(d).getTime();
    return {
      day: d,
      ms,
      time: item.time,
    };
  });
});

// Chart funcs
const x = (item: any) => item.ms;
const y = (item: OverallData) => item.time;

// lookback
const lookbacks = ref(['Last 7 Days', 'Last 24 Hours', 'Last 30 Days']);
const selectedLookback = ref(lookbacks.value[0]);
watch(
  () => selectedLookback.value,
  async (lookback) => {
    // fetch new data
    const resp = await fetch(``);
  }
);
</script>

<template>
  <select v-model="selectedLookback" class="px-2 py-1">
    <option v-for="lookback in lookbacks" :key="lookback">{{ lookback }}</option>
  </select>
  <area-chart id="overall-server-data" :data="data" :x="x" :y="y">
    <template #tooltip="{ item }">
      <div class="text-center">
        <p>{{ prettyDate(item.day) }}</p>
        <p>Total Minutes: {{ item.time }}</p>
      </div>
    </template>
  </area-chart>
</template>
