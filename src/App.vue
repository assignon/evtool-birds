<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),

};
</script>

<style lang="scss" scoped>
    html,
    body {
      scroll-behavior: smooth;
      overflow-x: hidden;
      width: 100%;
      margin: 0px;
      padding: 0px;
    }
    #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      margin: 0px;
      padding: 0px;
      width: 100%;
      height: auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
</style>
