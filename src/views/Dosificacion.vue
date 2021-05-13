<template>
  <v-container class="grey lighten-3 fill-height">
        <v-layout column>
            <v-carousel
                cycle
                height="360"
                :show-arrows="false"
            >
                <v-carousel-item
                    v-for="(item,i) in images"
                    :key="i"
                >
                <v-card height="100%">
                    <v-img
                        :src="item.src"
                        ></v-img>
                    <div style="padding:10px;font-size:14pt;">{{ item.descripcion }}</div>
                </v-card>
                </v-carousel-item>
            </v-carousel>
            <v-btn
            tile
            color="success"
            style="margin-top:20px; padding:25px;"
            @click="dialogDosificacion = true">
            <v-icon left>
                mdi-spray
            </v-icon>
            Iniciar
            </v-btn>
            <v-dialog
            v-model="dialogDosificacion"
            fullscreen
            hide-overlay
            transition="false"
            style="z-index:1011;"
            >
            <FormDosificacion @closedialog="closeDialog" v-bind:dialogDosificacion="dialogDosificacion"></FormDosificacion>
            </v-dialog>
        </v-layout>
  </v-container>
</template>
<script>
import $ from 'jquery';
import FormDosificacion from "../components/FormDosificacion";
import { CoffeeCloud } from '../coffeecloud';
var _CoffeeCloud = new CoffeeCloud();
var c = null;

import dosificacion1 from '@/assets/dosificacion1.jpeg';
import dosificacion2 from '@/assets/dosificacion2.jpeg';
import dosificacion3 from '@/assets/dosificacion3.jpeg';
import dosificacion4 from '@/assets/dosificacion4.jpeg';
import dosificacion5 from '@/assets/dosificacion5.jpeg';
import dosificacion6 from '@/assets/dosificacion6.jpeg';
import dosificacion7 from '@/assets/dosificacion7.jpeg';

export default {
  name: 'Dosificacion',
  components: {
    FormDosificacion
  },
  data: () => ({
    dialogDosificacion:false,
    quimicos: [],
    images: [
        { src:dosificacion4, descripcion: 'El módulo de dosificación le ayuda a hacer el cálculo de dilución de productos para plagas y/o enfermedades en 3 simples pasos.' },
        { src:dosificacion5, descripcion: 'Utilice la bomba de espalda o el atomizador que utiliza a la hora de realizar las aplicaciones y aplique agua a 20 plantas o más.' },
        { src:dosificacion3, descripcion: 'Mida la cantidad de agua que gastó en la aplicación de la muestra de plantas.' },
        { src:dosificacion2, descripcion: 'Abra la aplicación y seleccione el tipo de enfermedad que va a tratar. ' },
        { src:dosificacion1, descripcion: 'Incluya la cantidad de litros gastados y plantas atomizadas.' },
        { src:dosificacion7, descripcion: 'Incluya el espaciamiento que tienen las plantas en su cafetal.' },
        { src:dosificacion6, descripcion: 'Y calcule.' }
    ]
  }),
  methods: {
      closeDialog: function() {
          this.dialogDosificacion = false;
      }
  },
  mounted () {
    /*c = this;
    $.ajax({
            url: _CoffeeCloud.rootURL() + '/api/replicacion/getquimicosdosificacion',
            method: 'GET',
            data: {
            },
            dataType: 'json'
    }).done(function (data) {
      //console.log(data);
      c.quimicos = data;
    });*/
  }
};
</script>