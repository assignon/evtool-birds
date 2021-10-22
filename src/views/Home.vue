<template>
  <div class="home">
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",

  components: {
  },

  data() {
    return {

    }
  },

  created(){
    this.getBirdData()
  },

  methods: {
    getBirdData(){
        // let self = this;
        // let store = self.$store;
        this.$store.dispatch("getRequest", {
            params: {
                
            },
            callback: function(data) {
              console.log(data);
                // store.getters["setData"]([store.state.transfers.productReceivedArr, [data]]);
            },
        });
    },
  }

};
</script>
