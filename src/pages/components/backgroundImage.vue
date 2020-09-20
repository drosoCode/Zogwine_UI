<template>
    <div class="bg-image" :style="{backgroundImage: 'url(\''+ $store.getters.imageEndpoint + this.image + '\')'}"></div>
</template>

<style scoped>
.bg-image {
  width: 100%;
  height: 1000%;
  filter: blur(3px) brightness(50%);
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  overflow: hidden;
  position: fixed;
}
</style>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'backgroundImage',
  props: {
    image: {
      required: true
    }
  }
})
</script>
