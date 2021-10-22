<template>
  <div class="home">
    <mapbox
      :access-token='accessToken'
      :map-options="{
        style: 'mapbox://styles/mapbox/light-v9',
        center: [-96, 37.8],
        zoom: 3,
      }"
      :geolocate-control="{
        show: true,
        position: 'top-left',
      }"
      @map-load="loaded"
      @map-zoomend="zoomend"
      @map-click:points="clicked"
      @geolocate-error="geolocateError"
      @geolocate-geolocate="geolocate"
    />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import { mapGetters} from 'vuex'
import Mapbox from 'mapbox-gl-vue'

export default {
  name: "Home",

  components: {
    Mapbox
  },

  computed: {
    ...mapGetters({

    })
  },

  data() {
    return {
      accessToken: process.env.MAPBOX_ACCES_TOKEN
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

<style lang="" scoped>
  
</style>
