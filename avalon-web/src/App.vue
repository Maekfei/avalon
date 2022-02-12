<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name:'app',
  data() {
    return {
      activeIndex: '/',
    };
  },
  methods:{
    handleSelect(key, keyPath) {
      console.log(key, keyPath, this.activeIndex);
    }
  }
}
</script>
<style lang="scss">

</style>
