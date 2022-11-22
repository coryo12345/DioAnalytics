<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { UserTimeSummary } from '../../models/server';

const props = defineProps<{
  userData: UserTimeSummary[];
}>();

const headers = [
  { text: 'temp: userid', value: 'userId', sortable: true },
  { text: 'User', value: 'username', sortable: true },
  { text: 'Time', value: 'time', sortable: true },
];

const userMapInfo = ref(new Map<string, Record<string, string>>());
onMounted(() => {
  // TODO - map discord user ids to names & icons
});

const data = computed(() => {
  // TODO: combine with user info to build data
  return props.userData;
});
</script>

<template>
  <EasyDataTable :headers="headers" :items="data" />
</template>
