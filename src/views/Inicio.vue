<template>
     <v-container>
       <v-layout column>
         <v-card
          color="#008869"
          dark style="margin-bottom:3px;">
          <v-card-title class="title"><v-icon style="padding:10px;">fab fa-pagelines</v-icon>&nbsp;&nbsp;Unidades Productivas</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog = true">Nueva Unidad Productiva</v-btn>
          </v-card-actions>
        </v-card>
         <div id="mapid"></div>
         <div style="padding:8px;text-align:center;"><h3>Unidades Productivas</h3></div>
         <div style="padding-left:8px;padding-right:8px;">
           <v-select
            id="selenfermedades"
            v-model="view"
            :items="enfermedades"
            label="Enfermedad"
            item-text="enfermedad"
            item-value="cod"
            v-on:change="changeEnfermedad"
           ></v-select>
         </div>
         <div v-if="fincas.length>0" style="padding-top:5px;">
          <div v-for="finca in fincas" v-bind:key="finca.fincaCodigoL">
              <div v-on:click="selectFinca(finca.fincaCodigoL)" v-bind:class="getColorIncidencia(finca.nivelIncidencia)">
                <span class="info-box-icon"><i class="fab fa-pagelines"></i></span>
                <div class="info-box-content">
                  <v-row>
                    <v-col style="padding-right:10px;padding-top:5px;padding-bottom:0px;padding-left:10px;">
                      <span class="info-box-text">{{ finca.fincaNombre }}</span>
                      <span class="info-box-text">Lotes</span>
                      <span class="info-box-number">{{ finca.nlotes }}</span>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col style="padding-right:14px;padding-top:5px;padding-bottom:0px;padding-left:14px;">
                      <div class="progress">
                        <div class="progress-bar" v-bind:style="getProgressBar(finca.incidenciaPromedio)"></div>
                      </div>
                      <span class="progress-description">
                        {{ finca.incidenciaPromedio }} % Incidencia promedio {{ view }}
                      </span>
                    </v-col>
                  </v-row> 
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <br />
            <v-card>
              <v-card-text>
                Para comenzar debe registrar una unidad productiva haciendo uso del botón <b>(+)</b>
              </v-card-text>
            </v-card>
          </div>
       </v-layout>
       <v-dialog v-model="dialog" fullscreen hide-overlay style="z-index:1011;" transition="false">
         <FormFinca @closedialog="closeDialog" v-bind:dialog="dialog" />
       </v-dialog>
       
       <v-btn
        bottom
        color="pink"
        dark
        fab
        fixed
        right
        style="z-index:101"
        @click="nuevaFinca()"
      >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-overlay :value="overlay" style="z-index:1050">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
      {{ status }}
    </v-overlay> 
  </v-container>
</template>
<script>
import FormFinca from "../components/FormFinca";
import { nSQL } from "@nano-sql/core";
import { CoffeeCloud } from '../coffeecloud';
import '../coffeecloud.css'
import $ from 'jquery'
import axios from 'axios';
import leaflet from 'leaflet';
import { GestureHandling } from "leaflet-gesture-handling";
import 'leaflet/dist/leaflet.css';
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import * as esri from 'esri-leaflet';
import Blue from '@/assets/coffee_grain_blue.png';
import Green from '@/assets/coffee_grain_green.png';
import Yellow from '@/assets/coffee_grain_yellow.png';
import Orange from '@/assets/coffee_grain_orange.png';
import Red from '@/assets/coffee_grain_red.png';
var _CoffeeCloud = new CoffeeCloud();
var inicio = null;
export default {
  name: 'Inicio',
  components: {
    FormFinca
  },
  data: () => ({
    overlay:false,
    status: 'Cargando',
    test:'Hola',
    view: 'roya',
    markerGroup: null,
    enfermedades: [
      {cod:'roya',enfermedad:'Roya'},
      {cod:'broca',enfermedad:'Broca'},
      {cod:'ojo de gallo',enfermedad:'Ojo de Gallo'}
    ],
    dialog:false,
    formFinca: '/formFinca',
    fincas: [],
    departamentos: [],
    municipios: [],
    map: null,
    coffeeBlue: Blue,
    coffeeGreen: Green,
    coffeeYellow: Yellow,
    coffeeOrange: Orange,
    coffeeRed: Red,
    formData: FormFinca.data,
    form: FormFinca.methods,
  }),
  methods: {
    changeEnfermedad: function()
    {
      _CoffeeCloud.loadFincaDataFromLDB();
    },
    getColorIncidencia: function (nivel){
        var colores = ['info-box bg-blue','info-box bg-green','info-box bg-yellow','info-box bg-orange','info-box bg-red'];
        return colores[nivel];
    },
    nuevaFinca: function() {
      this.dialog = true;
    },
    getProgressBar: function(incidenciaPromedio) {
      return "width: " + incidenciaPromedio + "%";
    },
    closeDialog: function(e) {
      //console.log("Close dialog 2");
      this.dialog=false;
      _CoffeeCloud.loadFincaDataFromLDB();
    },
    selectFinca: function(fincaCodigoL) {
        this.$router.push('/Lotes/' + fincaCodigoL);
    }
  },
  mounted () {
    
    try
    {
      document.removeEventListener("backbutton",handleBackButton);
    }
    catch(ex)
    {
      //console.log(ex);
    }

    try{
      document.addEventListener("backbutton",handleBackButton, false);
    }
    catch(ex)
    {
      //console.log(ex);
    }

    inicio = this;
    this.overlay=true;
    var storage = window.localStorage;
    var token = storage.getItem("token");
    var refreshToken = storage.getItem("refreshtoken");
    _CoffeeCloud.container = this;
    
    try
    {
      _CoffeeCloud.init();
    }
    catch(ex)
    {
      _CoffeeCloud.initOnlyData();
    }

    if(window.navigator.onLine==false) $('#mapid').hide();
    else $('#mapid').show();

    this.map = L.map('mapid',{gestureHandling: true}).setView([15.5, -90.5], 7);
    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
    this.map.touchZoom.disable();
    this.map.scrollWheelZoom.disable();

    var Esri_WorldImagery = leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        tileerror: function() {
          alert("not loading");
        }
    });

    Esri_WorldImagery.addTo(this.map);

    esri.featureLayer({
            url: _CoffeeCloud.rootURL() + '/arcgis/rest/services/wmLimites/MapServer/1',
            style: function (feature) {
                var color = "#94001b";
                if (feature.id == 0) {
                    color = "#94001b";
                }
                if (feature.id == 1) {
                    color = "#06313a";
                }
                if (feature.id == 2) {
                    color = "#f27507";
                }
                if (feature.id == 3) {
                    color = "#355074";
                }
                if (feature.id == 4) {
                    color = "#8c00a5";
                }
                if (feature.id == 5) {
                    color = "#139562";
                }
                if (feature.id == 6) {
                    color = "#2d006d";
                }
                if (feature.id == 7) {
                    color = "#94001b";
                }
                if (feature.id == 8) {
                    color = "#06313a";
                }
                if (feature.id == 9) {
                    color = "#f27507";
                }
                if (feature.id == 10) {
                    color = "#355074";
                }
                if (feature.id == 11) {
                    color = "#8c00a5";
                }
                if (feature.id == 12) {
                    color = "#139562";
                }
                if (feature.id == 13) {
                    color = "#2d006d";
                }
                if (feature.id == 14) {
                    color = "#94001b";
                }
                if (feature.id == 15) {
                    color = "#06313a";
                }
                if (feature.id == 16) {
                    color = "#f27507";
                }
                if (feature.id == 17) {
                    color = "#355074";
                }
                if (feature.id == 18) {
                    color = "#8c00a5";
                }
                if (feature.id == 19) {
                    color = "#139562";
                }
                if (feature.id == 20) {
                    color = "#2d006d";
                }
                return { color: color, opacity: 1, weight: 1 }
            }
        }).addTo(this.map);

  },
  updated() {
    //_CoffeeCloud.loadFincaDataFromLDB();
  }
};
function handleBackButton() {
    //console.log(context.dialog);
    context.$swal({
        title: '¿Está seguro?',
        text: "Desea salir de la aplicación?.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar'
        }).then((result) => {
          if (result.value) {
            // Cerrando sesion
            var storage = window.localStorage;
            storage.setItem('logged','false');
            storage.setItem('token','');
            storage.setItem('refreshtoken','');
            storage.setItem('userid','');
            this.logged = false;
            this.$router.push('/login');
            try
            {
              document.removeEventListener("backbutton",handleBackButton);
            }
              catch(ex)
            {
              console.log(ex);
            }
            return true;
          } else {
                                    return false;
          }
    });
    return false;
}
</script>