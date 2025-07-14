<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="floating-back-button" @click="goBack">
    <Icon icon="mdi:arrow-left" width="24" height="24" />
    <span class="button-text">목록으로</span>
  </div>
</template>

<style lang="scss" scoped>
.floating-back-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  z-index: 1000;
  font-weight: 500;
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
  }

  &:active {
    transform: translateY(0);
  }

  .button-text {
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
    padding: 0.8rem 1.2rem;
    font-size: 0.8rem;

    .button-text {
      display: none;
    }
  }
}
</style>
