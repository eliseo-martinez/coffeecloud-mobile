<template>
    <v-container>
       <v-layout column>
           <v-card>
                <v-toolbar dark style="background-color: #008869 !important; border-color: #008869 !important;">
                    <v-btn icon dark v-on:click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Lote</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                    <v-btn dark text @click="saveLote" v-bind:disabled="btndisabled">Guardar</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-form v-model="valid_lote" style="padding:20px; z-index:1012;">
                    <div v-if="geolocalizando==true">
                    Obteniendo información de GPS
                    <!--<v-progress-linear
                    indeterminate
                    color="cyan"
                    ></v-progress-linear>-->
                    </div>
                    <v-text-field
                    v-model="lote.loteNombre"
                    :rules="reglasValidacion.loteNombre"
                    label="Nombre"
                    required
                    ></v-text-field>
                    <v-row>
                    <v-col sm=4>
                    <v-text-field
                    v-model="lote.loteLatitud"
                    :rules="reglasValidacion.loteLatitud"
                    label="Latitud"
                    type="number"
                    required
                    ></v-text-field>
                    </v-col>
                    <v-col sm=4>
                    <v-text-field
                    v-model="lote.loteLongitud"
                    :rules="reglasValidacion.loteLongitud"
                    type="number"
                    label="Longitud"
                    required
                    ></v-text-field>
                    </v-col>
                    <v-col sm=4>
                    <v-text-field
                    v-model="lote.loteAltitud"
                    :rules="reglasValidacion.loteAltitud"
                    label="Altitud (msnm)"
                    type="number"
                    required
                    ></v-text-field>
                    </v-col>
                    </v-row>
                    <div id="selectorPuntoLote"></div>
                    <v-text-field
                    v-model="lote.loteTamano"
                    :rules="reglasValidacion.loteTamano"
                    label="Tamaño del lote (Manzanas)"
                    type="number"
                    required
                    ></v-text-field>
                    <v-text-field
                    v-model="lote.loteEdad"
                    :rules="reglasValidacion.loteEdad"
                    label="Edad del lote (Desde el establecimiento)"
                    type="number"
                    required
                    ></v-text-field>
                            <v-text-field
                            v-model="lote.loteDistanciaSurco"
                            label="Distancia entre surcos (Metros)"
                            :rules="reglasValidacion.loteDistanciaSurco"
                            type="number"
                            required
                            style="margin-left:16px;margin-right:16px;"
                            ></v-text-field>
                            <div style="text-align:center;">X</div>
                            <v-text-field
                            v-model="lote.loteDistanciaPlanta"
                            :rules="reglasValidacion.loteDistanciaPlanta"
                            label="Distancia entre plantas (Metros)"
                            type="number"
                            required
                            style="margin-left:16px;margin-right:16px;"
                            ></v-text-field>
                    <v-text-field
                    v-model="lote.loteProduccionAnoAnterior"
                    :rules="reglasValidacion.loteProduccionAnoAnterior"
                    label="Producción del año anterior (Quintales maduro por manzana)"
                    type="number"
                    required
                    ></v-text-field>
                    <v-switch
                    v-model="loteSombraSel"
                    label="¿Tiene sombra?"
                    ></v-switch>
                    <v-text-field
                    v-if="loteSombraSel==true"
                    v-model="lote.lotePorcentajeSombra"
                    :rules="reglasValidacion.lotePorcentajeSombra"
                    label="Porcentaje de sombra"
                    type="number"
                    required
                    ></v-text-field>
                    <v-switch
                    v-model="loteCoberturaSel"
                    label="¿Tiene cobertura?"
                    ></v-switch>
                    <!--<label>Variedades de café del lote</label>
                    <v-row no-gutters>
                        <v-col
                            v-for="variedad in variedadesCafeLote"
                            v-bind:key="variedad.variedadCodigo"
                        >
                            <v-checkbox
                            class="pa-2" 
                            v-model="lote.variedadesCafeLote"
                            :value="variedad.variedadCodigo"
                            :id="'chkV'+variedad.variedadCodigo" 
                            :label="variedad.variedadNombre"
                            style="width:150px"
                            >
                            </v-checkbox>
                        </v-col>
                    </v-row>-->
                    <v-select
                        v-model="lote.variedadesCafeLote"
                        v-lazy-input:debounce="1000"
                        :items="variedadesCafeLote"
                        item-text="variedadNombre"
                        item-value="variedadCodigo"
                        label="Variedades de café del lote"
                        ref="VariedadesCafeLote"
                        multiple
                    >
                    <template v-slot:prepend-item>
                        <v-list-item
                        ripple
                        @click="closeVariedadesCafeLote"
                        >
                        <v-list-item-action>
                            <v-icon>close</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>Cerrar</v-list-item-title>
                        </v-list-item-content>
                        </v-list-item>
                        <v-divider class="mt-2"></v-divider>
                    </template>
                    <template v-slot:append-item>
                        <v-divider class="mt-2"></v-divider>
                        <v-list-item
                        ripple
                        @click="closeVariedadesCafeLote"
                        >
                        <v-list-item-action>
                            <v-icon>close</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>Cerrar</v-list-item-title>
                        </v-list-item-content>
                        </v-list-item>
                    </template>
                    </v-select>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="saveLote" v-bind:disabled="btndisabled">Guardar</v-btn>
                </v-card-actions>
           </v-card>
       </v-layout>
    </v-container>
</template>
<script>

import { nSQL } from "@nano-sql/core";
import { CoffeeCloud } from '../coffeecloud';
import '../coffeecloud.css'
import axios from 'axios';
import leaflet from 'leaflet';
import $ from 'jquery'
import { GestureHandling } from "leaflet-gesture-handling";
import 'leaflet/dist/leaflet.css';
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import Green from '@/assets/icons8-marker-48.png';
import * as esri from 'esri-leaflet';
var context = null;
var _CoffeeCloud = new CoffeeCloud();
export default {
    name: 'FormLote',
    props: ['id','dialog','dialog2','edicion'],
    components: {
        
    },
    data : () => ({
        map: null,
        marker: null,
        coffeeGreen: Green,
        valid_lote: true,
        geolocalizando: false,
        finca : null,
        btndisabled:false,
        lote : {
            loteCodigo: 0,
            loteNombre: '',
            loteLatitud: '',
            loteLongitud: '',
            loteAltitud: '',
            loteTamano: '',
            loteEdad: '',
            loteDistanciaSurco: null,
            loteDistanciaPlanta: null,
            loteProduccionAnoAnterior: null,
            loteSombra: 'N',
            lotePorcentajeSombra: null,
            loteCoberturaSuelo: 'N',
            fincaCodigo:0,
            fincaCodigoL: null,
            variedadesCafeLote: []
        },
        reglasValidacion: {
            loteNombre: [v=> !!v || 'Nombre del lote es requerido'],
            loteLatitud: [v=> !!v || 'Valor requerido'],
            loteLongitud: [v=> !!v || 'Valor requerido'],
            loteAltitud: [v=> !!v || 'Valor requerido'],
            loteTamano: [v=> v >= 0 || 'No puede ser negativo'],
            loteEdad: [v=> v >= 0 || 'No puede ser negativo'],
            loteDistanciaSurco: [v=> !!v || 'Valor requerido', v=> v >= 0 || 'No Puede ser negativo'],
            loteDistanciaPlanta: [v=> !!v || 'Valor requerido', v=> v >= 0 || 'No Puede ser negativo'],
            loteProduccionAnoAnterior: [v=> !!v || 'Valor requerido', v=> v >= 0 || 'No Puede ser negativo'],
            lotePorcentajeSombra: [v=> !!v || 'Valor requerido', v=> v >= 0 || 'No puede ser negativo']
        },
        loteSombraSel: false,
        loteCoberturaSel: false,
        variedadesCafeLote: []
    }),
    async mounted(){
        //console.log(this.id);
        context = this;

        if(window.navigator.onLine==false) $('#selectorPuntoLote').hide();
        else $('#selectorPuntoLote').show();
        
        try
        {
            document.removeEventListener("backbutton",handleBackbutton);
            if(this.edicion==null) this.clearData();
        }
        catch(ex)
        {
            //console.log(ex);
        }

        try{
            
            document.addEventListener("backbutton",handleBackbutton, false);
        }
        catch(ex)
        {
            //console.log(ex);
        }

        _CoffeeCloud.container = this;
        
        if(this.edicion==null)
        {
            let queryFinca = nSQL("fincas").query("select")
            .where(["fincaCodigoL","=",this.id * 1]).exec();
            this.finca = await queryFinca;
            this.lote.fincaCodigo = this.finca[0].fincaCodigo;

            nSQL("variedadesCafeFinca")
            .query("select")
            .where(["fincaCodigoL","=",this.id * 1])
            .exec().then((rows)=>{
                //console.log(rows);
                var i = 0;
                var variedadesFinca = new Array();
                for(i=0;i<rows.length;i++)
                {
                    variedadesFinca.push(rows[i].variedadesCafevariedadCodigo);
                }
                nSQL("variedadesCafe")
                .query("select")
                .where(["variedadCodigo","IN",variedadesFinca])
                .exec().then((rows)=>{
                    //console.log(rows);
                    this.variedadesCafeLote = rows;
                });
            });

            var cAccuracy = null;
            if(typeof device != 'undefined')
            { 
            if(device.platform === 'Android' && AdvancedGeolocation!=null) {
                context.geolocalizando = true;
                AdvancedGeolocation.start(function(success){
                try{
                    var jsonObject = JSON.parse(success);
                            console.log(jsonObject.provider);
                            switch(jsonObject.provider){
                                case "gps":
                                    if(jsonObject.latitude != "0.0"){
                                        
                                        if(cAccuracy===null) cAccuracy = jsonObject.accuracy;
                                        if(cAccuracy > jsonObject.accuracy) {
                                            cAccuracy = jsonObject.accuracy;
        
                                            context.lote.loteLatitud = jsonObject.bufferedLatitude;
                                            context.lote.loteLongitud = jsonObject.bufferedLongitude;
                                            context.lote.loteAltitud = jsonObject.altitude;
                                            context.geolocalizando = false;
                                            if(context.marker!=null) {
                                            context.marker.setLatLng(L.latLng(context.lote.loteLatitud,context.lote.loteLongitud));
                                            }
                                            AdvancedGeolocation.stop();
                                        }
                                    }
                                break;
                
                                case "network":
                                    if(jsonObject.latitude != "0.0"){
                                        /*if(cAccuracy===null) cAccuracy = jsonObject.accuracy;
                                        if(cAccuracy > jsonObject.accuracy) {
                                            cAccuracy = jsonObject.accuracy;*/
                                        
                                            context.lote.loteLatitud = jsonObject.bufferedLatitude;
                                            context.lote.loteLongitud = jsonObject.bufferedLongitude;
                                            context.lote.loteAltitud = jsonObject.altitude;
                                            context.geolocalizando = false;
                                            if(context.marker!=null) {
                                            context.marker.setLatLng(L.latLng(context.lote.loteLatitud,context.lote.loteLongitud));
                                            }
                                            AdvancedGeolocation.stop();
                                        //}
                                    }
                                break;
                
                                case "satellite":
                                    if(jsonObject.latitude != "0.0"){
                                        /*if(cAccuracy===null) cAccuracy = jsonObject.accuracy;
                                        if(cAccuracy > jsonObject.accuracy) {
                                            cAccuracy = jsonObject.accuracy;*/
                                        
                                            context.lote.loteLatitud = jsonObject.bufferedLatitude;
                                            context.lote.loteLongitud = jsonObject.bufferedLongitude;
                                            context.lote.loteAltitud = jsonObject.altitude;
                                            context.geolocalizando = false;
                                            if(context.marker!=null) {
                                            context.marker.setLatLng(L.latLng(context.lote.loteLatitud,context.lote.loteLongitud));
                                            }
                                            AdvancedGeolocation.stop();
                                        //}
                                    }
                                break;
                                            
                                case "cell_info":
                                    if(jsonObject.latitude != "0.0"){
                                        /*if(cAccuracy===null) cAccuracy = jsonObject.accuracy;
                                        if(cAccuracy > jsonObject.accuracy) {
                                            cAccuracy = jsonObject.accuracy;*/
                                        
                                            context.lote.loteLatitud = jsonObject.bufferedLatitude;
                                            context.lote.loteLongitud = jsonObject.bufferedLongitude;
                                            context.lote.loteAltitud = jsonObject.altitude;
                                            context.geolocalizando = false;
                                            if(context.marker!=null) {
                                            context.marker.setLatLng(L.latLng(context.lote.loteLatitud,context.lote.loteLongitud));
                                            }
                                            AdvancedGeolocation.stop();
                                        //}
                                    }
                                break;
                                            
                                case "cell_location":
                                    if(jsonObject.latitude != "0.0"){
                                        /*if(cAccuracy===null) cAccuracy = jsonObject.accuracy;
                                        if(cAccuracy > jsonObject.accuracy) {
                                            cAccuracy = jsonObject.accuracy;*/
                                        
                                            context.lote.loteLatitud = jsonObject.bufferedLatitude;
                                            context.lote.loteLongitud = jsonObject.bufferedLongitude;
                                            context.lote.loteAltitud = jsonObject.altitude;
                                            context.geolocalizando = false;
                                            if(context.marker!=null) {
                                            context.marker.setLatLng(L.latLng(context.lote.loteLatitud,context.lote.loteLongitud));
                                            }
                                            AdvancedGeolocation.stop();
                                        //}
                                    }
                                break;  
                                        
                                case "signal_strength":
                                    //TODO
                                break;              	
                            }
                        }
                        catch(exc){
                            //console.log("Invalid JSON: " + exc);
                        }   
                    },
                    function(error){
                        //console.log("ERROR! " + JSON.stringify(error));
                    },
                        ////////////////////////////////////////////
                        //
                        // REQUIRED:
                        // These are required Configuration options!
                        // See API Reference for additional details.
                        //
                        ////////////////////////////////////////////
                    {
                            "minTime":500,         // Min time interval between updates (ms)
                            "minDistance":1,       // Min distance between updates (meters)
                            "noWarn":true,         // Native location provider warnings
                            "providers":"all",     // Return GPS, NETWORK and CELL locations
                            "useCache":false,       // Return GPS and NETWORK cached locations
                            "satelliteData":true, // Return of GPS satellite info
                            "buffer":true,        // Buffer location data
                            "bufferSize":10,        // Max elements in buffer
                            "signalStrength":true // Return cell signal strength data
                    });
                }
                else if (navigator.geolocation) {
                    //console.log("Navigator geolocation");
                    navigator.geolocation.getCurrentPosition(function (position) {
                            
                        context.lote.loteLatitud = position.coords.latitude;
                        context.lote.loteLongitud = position.coords.longitude;
                        context.lote.loteAltitud = position.coords.altitude;
                            
                    },function () {
                        //console.log(ex);
                    },
                    {timeout:10000, enableHighAccuracy: true });
                }
            }
            else if (navigator.geolocation) {
                //console.log("Navigator geolocation");
                navigator.geolocation.getCurrentPosition(function (position) {
                        
                    context.lote.loteLatitud = position.coords.latitude;
                    context.lote.loteLongitud = position.coords.longitude;
                    context.lote.loteAltitud = position.coords.altitude;
                        
                },function (ex) {
                    //console.log(ex);
                },
                {timeout:10000, enableHighAccuracy: true });
            }
        }
        else
        {
            console.log("Edicion");
            let queryLotes = nSQL("lotes").query("select").where(["loteCodigoL","=",this.edicion.loteCodigoL]).exec();
            var lote = await queryLotes;
            lote[0].variedadesCafeLote = [];
            this.lote = lote[0];
            if(this.lote.loteSombra=="S")
            {
                this.loteSombraSel = true;
            }
            else
            {
                this.loteSombraSel = false;
            }
            
            if(this.lote.loteCoberturaSuelo == "S")
            {
                this.loteCoberturaSel = true;
            }
            else
            {
                this.loteCoberturaSel = false;
            }
            
            let query = nSQL("variedadesCafeFinca")
            .query("select")
            .where(["fincaCodigoL","=",this.edicion.fincaCodigoL * 1])
            .exec();

            var varcafefinca = await query;

            var i = 0;
            var variedadesFinca = new Array();
            for(i=0;i<varcafefinca.length;i++)
            {
                variedadesFinca.push(varcafefinca[i].variedadesCafevariedadCodigo);
            }
            
            let queryVariedadesCafe = nSQL("variedadesCafe")
            .query("select")
            .where(["variedadCodigo","IN",variedadesFinca])
            .exec();
            var rows = await queryVariedadesCafe;
            this.variedadesCafeLote = rows;
            console.log(variedadesFinca);
            let queryVariedadesCafeLote = nSQL("variedadesCafeLote").query("select").where(["loteCodigoL","=",this.edicion.loteCodigoL]).exec();
            var res = await queryVariedadesCafeLote;

            if(this.lote.variedadesCafeLote==null)
            {
                this.lote.variedadesCafeLote = new Array();
            }

            for(i=0;i<res.length;i++)
            {
                if(res[i].variedadesCafevariedadCodigo!=null)
                {
                    this.lote.variedadesCafeLote.push(res[i].variedadesCafevariedadCodigo);
                }
                else
                {
                    this.lote.variedadesCafeLote.push(res[i].variedadesCafeCPKEY.split(",")[1]);
                }
            }
        }
        
        L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
        if(this.map==null)
            this.map = L.map('selectorPuntoLote',{gestureHandling: false}).setView([15.5, -90.5], 5);
        this.map.touchZoom.disable();
        this.map.scrollWheelZoom.disable();
        console.log("Map mounted");
        var Esri_WorldImagery = leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });

        var greenIcon = L.icon({
                            iconUrl: this.coffeeGreen,
                            iconSize: [28,28]
                        });

        Esri_WorldImagery.addTo(this.map);
        this.marker = new L.marker([14.7,-90.5],{icon: greenIcon, draggable: true});

        this.marker.on('dragend', function(event) {
          var position = context.marker.getLatLng();
          context.marker.setLatLng(position, {
            draggable: 'true'
          });
          context.lote.loteLatitud = position.lat;
          context.lote.loteLongitud = position.lng;
          if(typeof device != 'undefined')
          {
            if(device.platform === 'Android' && AdvancedGeolocation!=null) {
                AdvancedGeolocation.stop();
            }
          }
        });

        this.marker.addTo(this.map);

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

        setTimeout(function(){ context.map.invalidateSize(); },300);
    },
    watch: {
        loteSombraSel: function(val) {
            if(val==true) this.lote.loteSombra = 'S';
            else this.lote.loteSombra = 'N'
        },
        loteCoberturaSel: function(val) {
            if(val==true) this.lote.loteCoberturaSuelo = 'S';
            else this.lote.loteCoberturaSuelo = 'N';
        },
        dialog: async function(val){
            if(window.navigator.onLine==false) $('#selectorPuntoLote').hide();
            else $('#selectorPuntoLote').show();
            if(val==false) {
                    try
                {
                    document.removeEventListener("backbutton",handleBackbutton);
                }
                catch(ex)
                {
                    //console.log(ex);
                }
            } else {
                try{
                    document.addEventListener("backbutton",handleBackbutton, false);
                    if(this.edicion==null) this.clearData();
                    if(this.edicion!=null) {
                        console.log("Edicion");
                        let queryLotes = nSQL("lotes").query("select").where(["loteCodigoL","=",this.edicion.loteCodigoL]).exec();
                        var lote = await queryLotes;
                        lote[0].variedadesCafeLote = [];
                        this.lote = lote[0];
                        if(this.lote.loteSombra=="S")
                        {
                            this.loteSombraSel = true;
                        }
                        else
                        {
                            this.loteSombraSel = false;
                        }
                    
                        if(this.lote.loteCoberturaSuelo == "S")
                        {
                            this.loteCoberturaSel = true;
                        }
                        else
                        {
                            this.loteCoberturaSel = false;
                        }
                    
                        let query = nSQL("variedadesCafeFinca")
                        .query("select")
                        .where(["fincaCodigoL","=",this.edicion.fincaCodigoL * 1])
                        .exec();

                        var varcafefinca = await query;

                        var i = 0;
                        var variedadesFinca = new Array();
                        for(i=0;i<varcafefinca.length;i++)
                        {
                            variedadesFinca.push(varcafefinca[i].variedadesCafevariedadCodigo);
                        }
                    
                        let queryVariedadesCafe = nSQL("variedadesCafe")
                        .query("select")
                        .where(["variedadCodigo","IN",variedadesFinca])
                        .exec();
                        var rows = await queryVariedadesCafe;
                        this.variedadesCafeLote = rows;
                        console.log(variedadesFinca);
                        let queryVariedadesCafeLote = nSQL("variedadesCafeLote").query("select").where(["loteCodigoL","=",this.edicion.loteCodigoL]).exec();
                        var res = await queryVariedadesCafeLote;

                        if(this.lote.variedadesCafeLote==null)
                        {
                            this.lote.variedadesCafeLote = new Array();
                        }

                        for(i=0;i<res.length;i++)
                        {
                            if(res[i].variedadesCafevariedadCodigo!=null)
                            {
                                this.lote.variedadesCafeLote.push(res[i].variedadesCafevariedadCodigo);
                            }
                            else
                            {
                                this.lote.variedadesCafeLote.push(res[i].variedadesCafeCPKEY.split(",")[1]);
                            }
                        }

                    }
                }
                catch(ex)
                {
                    //console.log(ex);
                }
            } 
        },
        dialog2: async function(val){
            if(window.navigator.onLine==false) $('#selectorPuntoLote').hide();
            else $('#selectorPuntoLote').show();
            if(val==false) {
                    try
                {
                    document.removeEventListener("backbutton",handleBackbutton);
                }
                catch(ex)
                {
                    //console.log(ex);
                }
            } else {
                try{
                    document.addEventListener("backbutton",handleBackbutton, false);
                    if(this.edicion==null) this.clearData();
                    if(this.edicion!=null) {
                        console.log("Edicion");
                        let queryLotes = nSQL("lotes").query("select").where(["loteCodigoL","=",this.edicion.loteCodigoL]).exec();
                        var lote = await queryLotes;
                        lote[0].variedadesCafeLote = [];
                        this.lote = lote[0];
                        if(this.lote.loteSombra=="S")
                        {
                            this.loteSombraSel = true;
                        }
                        else
                        {
                            this.loteSombraSel = false;
                        }
                    
                        if(this.lote.loteCoberturaSuelo == "S")
                        {
                            this.loteCoberturaSel = true;
                        }
                        else
                        {
                            this.loteCoberturaSel = false;
                        }
                    
                        let query = nSQL("variedadesCafeFinca")
                        .query("select")
                        .where(["fincaCodigoL","=",this.edicion.fincaCodigoL * 1])
                        .exec();

                        var varcafefinca = await query;

                        var i = 0;
                        var variedadesFinca = new Array();
                        for(i=0;i<varcafefinca.length;i++)
                        {
                            variedadesFinca.push(varcafefinca[i].variedadesCafevariedadCodigo);
                        }
                    
                        let queryVariedadesCafe = nSQL("variedadesCafe")
                        .query("select")
                        .where(["variedadCodigo","IN",variedadesFinca])
                        .exec();
                        var rows = await queryVariedadesCafe;
                        this.variedadesCafeLote = rows;
                        console.log(variedadesFinca);
                        let queryVariedadesCafeLote = nSQL("variedadesCafeLote").query("select").where(["loteCodigoL","=",this.edicion.loteCodigoL]).exec();
                        var res = await queryVariedadesCafeLote;

                        if(this.lote.variedadesCafeLote==null)
                        {
                            this.lote.variedadesCafeLote = new Array();
                        }

                        for(i=0;i<res.length;i++)
                        {
                            if(res[i].variedadesCafevariedadCodigo!=null)
                            {
                                this.lote.variedadesCafeLote.push(res[i].variedadesCafevariedadCodigo);
                            }
                            else
                            {
                                this.lote.variedadesCafeLote.push(res[i].variedadesCafeCPKEY.split(",")[1]);
                            }
                        }
                    }
                }
                catch(ex)
                {
                    //console.log(ex);
                }
            } 
        }
    },
    methods: {
        closeVariedadesCafeLote: function () {
          this.$refs.VariedadesCafeLote.isMenuActive = false;
        },
        closeDialog: function() {
            var mensaje = "";
            if(this.edicion==null)
            {
                mensaje = "Esta acción borrará los datos del formulario.";
            }
            else
            {
                mensaje = "No se guardarán cambios a la información del lote.";
            }
            context.$swal({
              title: '¿Está seguro?',
              text: mensaje,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Aceptar'
            }).then((result) => {
              if(result.value)
                this.$emit('closedialog','close');
            });
        },
        closeDialogAfterSave: function() {
            if(this.edicion==null){
                this.$emit('closedialog','close');
            }
            else
            {
                console.log("Edicion");
                this.$emit('closedialog2','close');
            }
        },
        clearData: function() {
            this.btndisabled=false;
            this.lote.loteCodigo = 0;
            this.lote.loteNombre = '';
            //this.lote.loteLatitud = '';
            //this.lote.loteLongitud = '';
            //this.lote.loteAltitud = '';
            this.lote.loteTamano = '';
            this.lote.loteEdad = '';
            this.lote.loteDistanciaSurco = null;
            this.lote.loteDistanciaPlanta = null;
            this.lote.loteProduccionAnoAnterior = null;
            this.lote.loteSombra = 'N';
            this.lote.lotePorcentajeSombra = null;
            this.lote.loteCoberturaSuelo = 'N';
            this.lote.fincaCodigo = 0;
            this.lote.fincaCodigoL = null;
            this.lote.variedadesCafeLote = [];        
            this.loteSombraSel = false;
            this.loteCoberturaSel = false;
        },
        saveLote: async function() {
            if(this.valid_lote==true) {
                if(this.lote.variedadesCafeLote.length<1)
                {
                    this.$swal('Validación','Debe seleccionar las variedades de café del lote.','warning');
                    return;
                }
                this.btndisabled = true;
                if(this.edicion==null)
                {
                    try {
                        let queryFinca = nSQL("fincas").query("select")
                        .where(["fincaCodigoL","=",this.id * 1]).exec();
                        this.finca = await queryFinca;
                        this.lote.fincaCodigo = this.finca[0].fincaCodigo;

                        this.lote.fincaCodigoL = this.id;
                        nSQL("lotes").query("upsert",this.lote)
                        .exec()
                        .then(()=>{
                            nSQL("lotes").query("select",["MAX(loteCodigoL) as loteCodigoL"])
                            .exec()
                            .then((rows)=>{
                                var loteCodigoL = rows[0].loteCodigoL;
                                var i = 0;
                                for(i=0;i<this.lote.variedadesCafeLote.length;i++) {
                                    (async (loteCodigoL,i)=> {
                                        await nSQL("variedadesCafeLote")
                                        .query("upsert",{'variedadesCafeCPKEY':loteCodigoL + "," + this.lote.variedadesCafeLote[i],
                                                        'variedadesCafevariedadCodigo': this.lote.variedadesCafeLote[i] * 1,
                                                        'loteCodigo':0,
                                                        'loteCodigoL':loteCodigoL
                                                        })
                                        .exec()
                                        .then(()=>{
                                            //console.log("Variedad cafe lote insertada")
                                        });
                                    })(loteCodigoL,i);
                                }
                            });
                            this.$swal('Nuevo lote almacenado');
                            this.closeDialogAfterSave();
                            try
                            {
                                _CoffeeCloud.enviarDatosAlServidor();
                            }
                            catch(Ex)
                            {

                            }
                        });
                    } catch(ex) {
                        this.$swal(ex);
                    }
                }
                else
                {
                    let updateLote = nSQL("lotes").query("upsert",this.lote).exec();
                    await updateLote;

                    let deleteVariedadesLote = nSQL("variedadesCafeLote").query("delete").where(["loteCodigoL","=",this.lote.loteCodigoL]).exec();
                    await deleteVariedadesLote;

                    var i = 0;
                    for(i=0;i<this.lote.variedadesCafeLote.length;i++) {
                        let insert = nSQL("variedadesCafeLote")
                                     .query("upsert",{'variedadesCafeCPKEY':this.lote.loteCodigoL + "," + this.lote.variedadesCafeLote[i],
                                                        'variedadesCafevariedadCodigo': this.lote.variedadesCafeLote[i] * 1,
                                                        'loteCodigo':this.lote.loteCodigo,
                                                        'loteCodigoL':this.lote.loteCodigoL
                                     }).exec();
                        await insert;
                    }
                    
                    let queryVariedadesCafeLote = nSQL("variedadesCafeLote").query("select")
                    .where(["loteCodigoL","=",this.lote.loteCodigoL]).exec();
                    
                    var variedadesCafeLote = await queryVariedadesCafeLote;
                    console.log(variedadesCafeLote);
                    this.lote.variedadesCafeLote = variedadesCafeLote;

                    _CoffeeCloud.actualizarLote(this.lote);
                }
            } 
            else 
            {
                this.$swal('Validación','Debe completar la información requerida','warning');
            }
        }
    }
};

            function handleBackbutton() {
                var mensaje = "";
                if(this.edicion==null)
                {
                    mensaje = "Esta acción borrará los datos del formulario.";
                }
                else
                {
                    mensaje = "No se guardarán cambios a la información del lote.";
                }
                context.$swal({
                    title: '¿Está seguro?',
                    text: mensaje,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Aceptar'
                    }).then((result) => {
                        if (result.value) {
                            context.closeDialog();
                            try
                            {
                                document.removeEventListener("backbutton",handleBackbutton);
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