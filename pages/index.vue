<script setup>
const isClickedPolicy = ref(false)
const addClassPolicy = () => {
  isClickedPolicy.value = true
}
const removeClassPolicy = () => {
  isClickedPolicy.value = false
}
</script>
<template>
  <div class="wrapper">
    <Header />
    <main></main>
    <Footer @openPolicyClick="addClassPolicy" />
    <Policy
      :class="{ open: isClickedPolicy }"
      @closePolicyClick="removeClassPolicy"
    />
  </div>
</template>

<style lang="scss" scoped>
main {
  background-color: var(--temnyy-tekst);
}
</style>
