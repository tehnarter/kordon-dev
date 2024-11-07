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
    <slot />
    <Footer @openPolicyClick="addClassPolicy" />
    <Policy
      :class="{ open: isClickedPolicy }"
      @closePolicyClick="removeClassPolicy"
    />
  </div>
</template>
