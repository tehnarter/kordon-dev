<script setup></script>
<template>
  <div class="burger">
    <span></span>
  </div>
</template>
<style lang="scss" scoped>
.burger {
  display: flex;
  position: relative;
  z-index: 50;
  align-items: center;
  justify-content: flex-end;
  width: 20px;
  height: 12px;
}

.burger span {
  height: 2px;
  width: 100%;
  transform: scale(1);
  background-color: #141fec;
}

.burger:before {
  content: "";
  position: absolute;
  height: 2px;
  width: 100%;
  background-color: #141fec;
  transition: all 0.3s ease 0s;
  top: 0;
}

.burger:after {
  content: "";
  position: absolute;
  height: 2px;
  width: 100%;
  background-color: #141fec;
  transition: all 0.3s ease 0s;
  bottom: 0;
}
.burger.active {
  z-index: 55;
}
.burger.active span {
  transform: scale(0);
}

.burger.active::before {
  background-color: #faf6f2;
  top: 50%;
  transform: rotate(-45deg) translate(0, -50%);
}

.burger.active::after {
  background-color: #faf6f2;
  bottom: 50%;
  transform: rotate(45deg) translate(0, 50%);
}
</style>
