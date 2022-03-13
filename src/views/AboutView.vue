<template>
  <div class="about">
    <div id="header">
      <menu-component id="menu"/>
    </div>
    <div id="container">
      <router-view v-slot="{ Component }">
        <transition appear mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import MenuComponent from '@/components/MenuComponent.vue'

export default defineComponent({
  components: {
    MenuComponent
  }
})
</script>

<style scoped>
.about {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: calc(100vw - 80px) 80px;
  grid-template-rows: 1fr ;
}

#header {
  grid-column: 2 / 3;
  grid-row: 1 / -1;
  background-color: #262626;
  color: #ffffff;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr ;
}

#menu {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  justify-self: center;
  align-self: start;
  margin-top: 10px;
}

#container {
  grid-column: 1 / 2;
  grid-row: 1 / -1;
}
</style>
