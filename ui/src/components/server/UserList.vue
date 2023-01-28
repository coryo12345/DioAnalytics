<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { DEFAULT_LOOKBACK, LOOKBACKS } from '../../constants';
import type { DiscordUser } from '../../models/discord';
import type { UserTimeSummary } from '../../models/server';

const props = defineProps<{
  userData: UserTimeSummary[];
  serverId: string;
}>();

const headers = [
  { text: 'User', value: 'username', sortable: true },
  { text: 'Time', value: 'time', sortable: true },
];

const userMapInfo = ref(new Map<string, DiscordUser>());
onMounted(() => {
  props.userData.forEach(({ userId }) => {
    getUserInfo(userId);
  });
});
async function getUserInfo(userId: string) {
  fetch(`/api/discordUserInfo?userId=${userId}`)
    .then((r) => r.json())
    .then((data) => {
      userMapInfo.value.set(data.id, data);
    });
}

type UserRow = {
  id: string;
  username: string;
  time: number;
  icon: string;
};
const _data = ref(props.userData);
const data = computed(() => {
  const data = [] as UserRow[];
  _data.value.forEach((timeData) => {
    const user = userMapInfo.value.get(timeData.userId);
    if (!user) return;
    data.push({
      id: user.id,
      username: `${user.username}#${user.discriminator}`,
      time: timeData.time,
      icon: user.icon,
    });
  });
  return data;
});

const lookbacks = ref(LOOKBACKS);
const selectedLookback = ref(DEFAULT_LOOKBACK.name);
watch(
  () => selectedLookback.value,
  async (lookbackName) => {
    const lookback = LOOKBACKS.find((l) => l.name === lookbackName);
    if (!lookback) return;
    const resp = await fetch(`/api/serverUserData?serverId=${props.serverId}&lookback=${lookback.days}`);
    const totalData = (await resp.json()) as UserTimeSummary[];
    _data.value = totalData;
    _data.value.forEach(({ userId }) => {
      getUserInfo(userId);
    });
  }
);

function viewUser(user: UserRow) {
  window.location.href = `/user?userId=${user.id}&serverId=${props.serverId}`;
}
</script>

<template>
  <select v-model="selectedLookback" class="px-2 py-1 mb-2">
    <option v-for="lookback in lookbacks" :key="lookback.days" :value="lookback.name">{{ lookback.name }}</option>
  </select>
  <EasyDataTable :headers="headers" :items="data" table-class-name="datatable">
    <template #item-username="item">
      <div class="flex items-center flex-row cursor-pointer" @click="viewUser(item)">
        <img :src="item.icon" alt="" class="rounded-full w-8 h-8 mr-2 my-1" />
        <span>{{ item.username }}</span>
      </div>
    </template>
    <template #item-time="item">
      <div>{{ item.time }} Minutes</div>
    </template>
  </EasyDataTable>
</template>
