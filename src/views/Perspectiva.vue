<template>
  <v-container class="grey lighten-3 fill-height">
      <v-layout column>
        <section class="content-header">
            <h1>
                Informaci&oacute;n climática
                <small>Perspectiva</small>
            </h1>
        </section>
        <v-divider></v-divider>
        <div v-if="sinConexion==false" v-html="contenido" class="contenido"></div>
        <v-alert v-if="sinConexion==true" type="warning">Sin conexión a Internet.</v-alert>
      </v-layout>
  </v-container>
</template>
<script>
import { CoffeeCloud } from '../coffeecloud';
import '../coffeecloud.css'
import axios from 'axios';
var _CoffeeCloud = new CoffeeCloud;

export default {
  name: 'Perspectiva',
  components: {
    
  },
  data: () => ({
    contenido: '',
    sinConexion: false,
    items: [
        {
            text: 'Inicio', href:"/"
        },
        {
            text: 'Información Climática'
        },
        {
            text: 'Perspectiva'
        }
    ]
  }),
  mounted () {
    axios
      .get(_CoffeeCloud.rootURL() + '/scrapping/insivumeh/perspectiva.json')
      .then(response => (this.contenido = response.data.replace(/src=\"../g,"src=\""+_CoffeeCloud.rootURL())))
      .catch(error => {
        if (!error.response) {
            // network error
            this.sinConexion=true;
        } else {
            this.errorStatus = error.response.data.message;
        }
      })
  }
};
</script>
