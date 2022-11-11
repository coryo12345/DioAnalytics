<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { AreaChart } from '../charts/AreaChart.js';

const props = defineProps<{
  data: any[];
  id: string;
  x: (d: any) => any;
  y: (d: any) => any;
}>();

const id = computed(() => `${props.id}-area-chart`);

const hoverItem = ref<any>({});
function tooltip(item: any) {
  hoverItem.value = item;
}

onMounted(() => {
  const svg = AreaChart(props.data, {
    x: props.x,
    y: props.y,
    tooltipCallback: tooltip,
  });
  if (svg === null) return;
  const container = document.getElementById(id.value);
  if (!container) return;
  container.innerHTML = '';
  container.appendChild(svg);
});
</script>

<template>
  <div>
    <div :id="id" style="max-width: 90vw"></div>
    <Teleport to=".main-tooltip">
      <slot name="tooltip" :item="hoverItem"></slot>
    </Teleport>
  </div>
</template>
