<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { convertToNow, prettyDate } from '../../../utils/date';
import { DEFAULT_LOOKBACK, LOOKBACKS } from '../../constants';
import type { OverallData } from '../../models/server';
import AreaChart from '../charts/AreaChart.vue';

// props
const props = defineProps<{
  data: OverallData[];
  serverId: string;
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
const x = (item: ConvertedData) => item.ms;
const y = (item: ConvertedData) => item.time;

// lookback
const lookbacks = ref(LOOKBACKS);
const selectedLookback = ref(DEFAULT_LOOKBACK.name);
watch(
  () => selectedLookback.value,
  async (lookbackName) => {
    const lookback = LOOKBACKS.find((l) => l.name === lookbackName);
    if (!lookback) return;
    const resp = await fetch(`/api/totalServerData?serverId=${props.serverId}&lookback=${lookback.hours}`);
    const totalData = (await resp.json()) as OverallData[];
    _data.value = totalData;
  }
);
</script>

<template>
  <select v-model="selectedLookback" class="px-2 py-1">
    <option v-for="lookback in lookbacks" :key="lookback.hours" :value="lookback.name">{{ lookback.name }}</option>
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
