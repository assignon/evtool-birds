<template>
  <div class="home" id='app'>
    <MglMap 
       :accessToken="accessToken" 
       :mapStyle.sync="mapStyle"
       :attributionControl="false" 
       @load="onMapLoaded"
    >
      <MglNavigationControl position="top-right" />
      <MglGeolocateControl position="top-right" />

      <MglMarker 
        v-for='(bird, i) in birds[0]' 
        :key='i'
        :coordinates="[bird.geometry.coordinates[0], bird.geometry.coordinates[1]]" 
        :color='getDictVal(colors, bird.properties.Vogel)'
        @click='removed(getDictVal(colors, bird.properties.Vogel))'
      >
      <MglPopup>
          <div>{{bird.properties.Vogel}} | {{bird.properties.Straatnaam}} | {{bird.properties.Verblijfplaats}}</div>
      </MglPopup>
    </MglMarker>
      
    </MglMap>

    <div class='total'>
      <div class='count-container'>
        <label for="Data Count">Current count data loaded</label>
        <input 
          type="number" 
          class='data-count' 
          v-mode='dataCount' 
          name="Data Count" 
          :value='dataCount' 
          min="1" 
          :max="$store.state.totalBirdsData"
          @change="updateDataCount($event)"
        > 
      </div>
      <h3>Filter</h3>
      <div class='filter' v-for="(b, i) in Object.keys(birdsGroup[0])" :key='i'>
        <label :for="b">{{b}}</label>
        <input @change='getBirdData(), updateBirdsCount($event)' type="checkbox" :id="b" class='checkbox' :value="b" v-model="birdsSelected">
      </div>
      <div class='total-by-bird'>
         <div 
            class='birds-sort' 
            v-for="(b, i) in Object.keys(birdsGroup[0])"
            :key='i'
         >
           <h3 class='bird-name' :style='{color: getDictVal(colors, b)}'>{{b}}: <span :class='b' :id='birdsCount(birdsGroup[0], i)'>{{birdsCount(birdsGroup[0], i)}}</span></h3>
         </div>
      </div>
      <div class='total-birds-show'><h2>Total: {{birds[0].length}}</h2></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import Mapbox from "mapbox-gl";
import { 
  MglMap, 
  MglNavigationControl,
  MglGeolocateControl,
  MglPopup,
  MglMarker 
  } from "vue-mapbox";
import { mapGetters} from 'vuex'

export default {
  name: "Home",

  components: {
    MglMap,
    MglNavigationControl,
    MglGeolocateControl,
    MglMarker,
    MglPopup
    // MglAttributionControl,
    // MglFullscreenControl,
    // MglScaleControl
  },

  computed: {
    ...mapGetters({
       birds: 'getBirds',
       birdsGroup: 'getGroupBirds',
    }),

  },

  data() {
    return {
      // accessToken: process.env.MAPBOX_ACCES_TOKEN
      accessToken: 'pk.eyJ1IjoieWFuaWNrMDA3IiwiYSI6ImNrdjFiaTJldTFnYmMyb3FxZTc0dXBqdHoifQ.vTnXbESZKw4K6nomP4zECA',
      mapStyle: 'mapbox://styles/mapbox/light-v10',
      coordinates: [4.896029, 52.371807], //Amsterdam
      colors: {Boerenzwaluw: 'green',
                Gierzwaluw: 'yellow',
                Huismus: 'red',
                Huiszwaluw: 'black',
                Overig: 'blue',
                Spreeuw: 'pink',
                overig: 'magenta',
              },
       birdsSelected: [],
       dataCount: 500,       
    }
  },

  created(){
    this.mapbox = Mapbox;
    this.getBirdData()
  },
  methods: {
    async onMapLoaded(event){
      // this.map = e.map
      // console.log(this.map);
      const asyncActions = event.component.actions

      const newParams = await asyncActions.flyTo({
        center: [4.896029, 52.371807],
        zoom: 9,
        speed: 1
      })
      console.log(newParams);

    },

    removed(c){
      // console.log(m);
      console.log('coloor',c);
      // m.marker.remove()
    },
    groupBirds(birds){

      let group = birds.reduce((r, b) => {
        r[b.properties.Vogel] = [...r[b.properties.Vogel] || [], b];
        return r;
      }, {});
      return group
    },

     filterBirds(data){
      let filteredData = []
      let filterOptions = this.birdsSelected

       if (filterOptions.length == 0){
         // return all bird data
         filteredData = data
       }else{
         // filter bird base on given name(s)
         filterOptions.forEach(fo => {
          //  console.log(fo);
            data.filter(elem => {
            //  console.log('elems', elem);
             if(elem.properties.Vogel == fo){
               filteredData.push(elem)
             }
            })
         })
         
       }

       return filteredData
    },

    getDictVal(dict, key){
      return dict[key]
    },

    birdsCount(dict, index){
      let count = this.getDictVal(dict, Object.keys(dict)[index])
      return count.length
    },

    updateBirdsCount(event){
      let currentBirdsCount = document.querySelector('.'+event.currentTarget.id)

      document.querySelectorAll('.'+event.currentTarget.id).forEach(el => {
        // if all checkbox elements are not checked, reset the birds count
        if (this.birdsSelected.length == 0){
          el.innerHTML = currentBirdsCount.id
        }
      })      

      if(event.currentTarget.checked){
        currentBirdsCount.innerHTML = currentBirdsCount.id
      }
      else if(!event.currentTarget.checked && this.birdsSelected.length != 0){
        currentBirdsCount.innerHTML = 0
      }
    },

    getBirdData(){
        let self = this;
        let store = self.$store;
        this.$store.dispatch("getRequest", {
            params: {
                
            },
            callback: function(data) {
              self.$store.state.totalBirdsData = data.features.length
              let birdsData = data.features.splice(0, self.dataCount)
              
              let filteredBirds = self.filterBirds(birdsData)
              let birdsGroup = self.groupBirds(birdsData)
  
              store.getters["setData"]([store.state.birdsArr, [filteredBirds]]);
              store.getters["setData"]([store.state.birdsGroupArr, [birdsGroup]]);

              // console.log('bird data store', self.$store.state.birdsArr);
              // self.birds[0].forEach(i => {
              //   console.log('bird color', self.getDictVal(self.colors, i.properties.Vogel));
              // })
            },
        });
        console.log('self.$store.state.totalBirdsData', self.$store.state.totalBirdsData)
    },

     updateDataCount(event){
      this.dataCount = event.currentTarget.value
      alert(this.dataCount)
      // refresh map
      this.getBirdData
    },

  }
};
</script>

<style lang="scss" scoped> 
  #app {
   width: 100%;
   height: 80vh;
   display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  } 
  .count-container{
     width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 20px;
  }
  .data-count{
    width: 30%;
    height: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 20px;
  }
  .filter{
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .total{
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .total-by-bird{
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .total-by-bird-show{
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .birds-sort{
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom:-20px;
  }
  .total-birds-show{
    width: 100%;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

</style>
