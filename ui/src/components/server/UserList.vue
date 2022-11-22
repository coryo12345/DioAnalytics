<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { DiscordUser } from '../../models/discord';
import type { UserTimeSummary } from '../../models/server';

const props = defineProps<{
  userData: UserTimeSummary[];
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

const data = computed(() => {
  const data = [] as any[];
  props.userData.forEach((timeData) => {
    const user = userMapInfo.value.get(timeData.userId);
    if (!user) return;
    data.push({
      username: `${user.username}#${user.discriminator}`,
      time: timeData.time,
      icon: user.icon,
    });
  });
  return data;
});
</script>

<template>
  <EasyDataTable :headers="headers" :items="data">
    <template #item-username="item">
      <div class="flex items-center flex-row">
        <img :src="item.icon" alt="" class="rounded-full w-8 h-8 mr-2 my-1" />
        <span>{{ item.username }}</span>
      </div>
    </template>
    <template #item-time="item">
      <div>{{ item.time }} Minutes</div>
    </template>
  </EasyDataTable>
</template>
