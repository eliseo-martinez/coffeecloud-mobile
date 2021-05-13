<template>
  <v-container class="grey lighten-3 fill-height">
        <v-layout column>
            <section class="content-header">
                <h1>
                    Noticias
                    <small>Ultimas noticias</small>
                </h1>
            </section>
            <v-divider></v-divider>
            <div v-for="item in noticias" :key="item.noticiaCodigo">
              <v-card>
                <v-card-title> {{ item.noticiaTitulo }} </v-card-title>
                <v-card-text>
                  <p v-html="item.noticiaContenido"></p>
                </v-card-text>
              </v-card>
              <br />
            </div>
        </v-layout>
  </v-container>
</template>
<script>
import $ from 'jquery';
import { CoffeeCloud } from '../coffeecloud';
var _CoffeeCloud = new CoffeeCloud();
var c = null;
export default {
  name: 'Estaciones',
  components: {
    
  },
  data: () => ({
    noticias: []
  }),
  mounted () {
    c = this;
    $.ajax({
            url: _CoffeeCloud.rootURL() + '/api/replicacion/getnoticias',
            method: 'GET',
            data: {
            },
            dataType: 'json'
    }).done(function (data) {
      //console.log(data);
      c.noticias = data;
    });
  }
};
</script>