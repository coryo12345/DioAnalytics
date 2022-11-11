<script setup lang="ts">
import { ref } from 'vue';

const serverId = ref('');

function goToServerPage() {
  if (serverId.value.length > 0) {
    window.location.href = `/server?id=${serverId.value}`;
  }
}
</script>

<template>
  <div class="w-52 mx-auto mb-2">
    <input
      v-model="serverId"
      @keyup.enter="goToServerPage"
      type="text"
      class="border border-black rounded block w-full py-1 px-2"
    />
  </div>
  <button @click="goToServerPage" class="border border-slate-400 rounded text-2xl font-semibold px-3 bg-gradient">
    Go
  </button>
</template>
