<script setup>
const emit = defineEmits()
// Емітимо подію для додавання класу в батьківському компоненті
const openPolicy = () => {
  emit("openPolicyClick")
}
</script>
<template>
  <div>
    <footer class="footer">
      <div class="footer__container footer-row">
        <div class="footer__title">KORDON</div>
        <div class="footer__policy" @click="openPolicy">
          {{ $t("footer-policy") }}
        </div>
      </div>
    </footer>
  </div>
</template>
<style lang="scss">
.footer {
  background-color: var(--themes-bg-footer);
  transition: background-color 3s ease;
}
.footer-row {
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
}
.footer__title {
  font-weight: 700;
  line-height: 1.14286;
  color: #fff;
}

.footer__policy {
  font-size: 16px;
  line-height: 1.25;
  text-align: center;
  color: #141fec;
  cursor: pointer;
}
</style>
