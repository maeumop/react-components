<script setup lang="ts">
import { Icon } from '@iconify/vue';
</script>
<script lang="ts">
export default { name: 'TableSpinner' };
</script>
<template>
  <div class="spinner-wrap">
    <div class="spinner">
      <Icon icon="mdi:loading" size="3.6rem" />
    </div>
  </div>
</template>
