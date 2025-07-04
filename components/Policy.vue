<script setup>
const emit = defineEmits()
// Емітимо подію для додавання класу в батьківському компоненті
const closePolicy = () => {
  emit("closePolicyClick")
}
</script>
<template>
  <div class="policy">
    <div class="policy__content">
      <div class="policy__text">
        <h3>{{ $t("policy.title-1") }}</h3>
        <p>
          {{ $t("policy.text-1") }}
        </p>
        <h4>{{ $t("policy.title-2") }}</h4>
        <p>{{ $t("policy.text-2") }}</p>
        <h4>{{ $t("policy.title-3") }}</h4>
        <p>
          {{ $t("policy.text-3") }}
        </p>
        <h4>{{ $t("policy.title-4") }}</h4>
        <p>
          {{ $t("policy.text-4") }}
        </p>
        <h4>{{ $t("policy.title-5") }}</h4>
        <p>
          {{ $t("policy.text-5") }}
        </p>
        <h4>{{ $t("policy.title-6") }}</h4>
        <p>
          {{ $t("policy.text-6") }}
        </p>
        <button class="policy__button" @click="closePolicy">
          {{ $t("policy.button") }}
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.policy {
  &.open {
    display: block;
  }
  display: none;
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(206, 206, 248, 0.1);

  overflow: auto;
  &__content {
    margin: 45px 0px 0px 0px;
    background-color: var(--themes-bg);
    width: 100%;
  }
  &__text {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    max-width: 768px;
    padding: 50px 20px 50px 20px;

    h3 {
      padding: 0px 0px 20px 0px;
      text-align: center;
      font-size: 25px;
    }
    h4 {
      padding: 0px 0px 10px 0px;
      font-size: 20px;
    }
    p {
      padding: 0px 0px 15px 0px;

      text-indent: 10px;
    }
  }
  &__button {
    display: flex;
    margin: 50px 20px 0px 0px;
    padding: 10px 20px;
    background-color: #6f86a0;
    color: #fff;
    border-radius: 10px;
    align-self: flex-end;
  }
}
</style>
