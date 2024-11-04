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
        <div class="footer__title">KORDON<span>.UA</span></div>
        <div class="footer__policy" @click="openPolicy">
          Політика приватності
        </div>
      </div>
    </footer>
  </div>
</template>
<style lang="scss">
.footer {
  background: var(--akcentnyy);
}
.footer-row {
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
}
.footer__title {
  font-family: Rubik-Bold;
  line-height: 1.14286;
  color: #141fec;
  span {
    color: var(--tekst-i-elementy-na-temnom-fone);
  }
}

.footer__policy {
  font-family: var(--font-family);
  font-size: 16px;
  line-height: 1.25;
  text-align: center;
  color: var(--tekst-i-elementy-na-temnom-fone);
  cursor: pointer;
  &:hover {
    border-bottom: solid 1px;
  }
}
</style>
