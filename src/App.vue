<template>
  <router-view v-slot="{ Component }">
    <transition appear mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 源柔ゴシック */
@font-face {
	font-family: 'MyFont';
	src: url(font/GenJyuuGothic-Regular.ttf);
}

* {
  margin: 0;
  font-family: 'MyFont', sans-serif;
}

.p-component, .p-inputtext {
  font-family: 'MyFont', sans-serif !important;
}

body {
    background-color: #f5f5f5;
}

label {
  font-size: 85%;
}

.required:after {
    content: " ※";
    color: #E00;
}

.v-enter-active, .v-leave-active {
  transition: opacity 0.5s;
}

.v-enter-from {
  opacity: 0.0;
}

.v-enter-to {
  opacity: 1.0;
}

.v-leave-from {
  opacity: 1.0;
}

.v-leave-to {
  opacity: 0.0;
}
</style>
