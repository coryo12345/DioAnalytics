<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { AreaChart } from '../charts/AreaChart.js';

type Props = {
  data: any[];
  id: string;
  x: (d: any) => any;
  y: (d: any) => any;
  yLabel?: string;
};

const props = withDefaults(defineProps<Props>(), {
  yLabel: 'Person-Minutes',
});

const id = computed(() => `${props.id}-area-chart`);

const hoverItem = ref<any>({});
function tooltip(item: any) {
  hoverItem.value = item;
}

function renderChart() {
  const svg = AreaChart(props.data, {
    x: props.x,
    y: props.y,
    tooltipCallback: tooltip,
    yLabel: props.yLabel,
  });
  if (svg === null) return;
  const container = document.getElementById(id.value);
  if (!container) return;
  container.innerHTML = '';
  container.appendChild(svg);
}

onMounted(() => {
  renderChart();
});

watch(
  () => props.data,
  () => {
    renderChart();
  }
);
</script>

<template>
  <div>
    <div v-show="props.data.length > 0" :id="id" class="text-center"></div>
    <div v-show="props.data.length === 0">
      <p class="text-lg my-2">No Data to Display</p>
    </div>
    <Teleport to=".main-tooltip">
      <slot name="tooltip" :item="hoverItem"></slot>
    </Teleport>
  </div>
</template>
