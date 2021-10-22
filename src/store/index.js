import Vue from "vue";
import Vuex from "vuex";

import axios from "axios"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    HOST: "https://maps.amsterdam.nl/open_geodata/geojson_lnglat.php?KAARTLAAG=VOGELS&THEMA=vogels",
    birdsArr: [],
    birdsGroupArr: [],
    totalBirdsData: 0,
  },

  getters: {
    setData: (state) => (data) => {
      console.log(state);
      if (data[0].length > 0) {
        data[0].length = 0
      }
      data[1].forEach((items) => {
        data[0].push(items)
      })
    },

    getBirds: (state) => {
      return state.birdsArr
    },

    getGroupBirds: (state) => {
      return state.birdsGroupArr
    }
  },

  mutations: {
    getAxiosCall(state, payload) {
      axios.get(payload.host, {
        params: payload.params,
        headers: {

        }
      })
      .then(response => {
          let res = response.data;
          payload.callback(res);
        })
        .catch(error => {
        console.log(error)
      })
    }
  },

  actions: {
    getRequest({ commit, rootState }, payload) {
      commit("getAxiosCall", {
        params: payload.params,
        callback: payload.callback,
        host: rootState.HOST
      })
    }
  },

  modules: {},
});
