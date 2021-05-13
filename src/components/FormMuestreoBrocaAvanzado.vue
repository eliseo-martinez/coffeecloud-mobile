<template>
        <div>
        <v-card
            color="#008869"
            dark style="margin:8px;padding:4px;">
            <v-card-title class="title" style="padding:4px;"><v-icon style="padding:10px;">fab fa-pagelines</v-icon>&nbsp; Muestreo de Broca</v-card-title>
            <v-card-subtitle style="padding:8px;" align="center">{{ lote.loteNombre }}</v-card-subtitle>
            <v-card-actions>
            <v-spacer></v-spacer>
                <v-btn text small v-on:click="$router.push({name:'Lotes',params:{id:lote.fincaCodigoL,ilote:lote,view:'broca'}})">Cancelar</v-btn>
                <v-btn text small v-on:click="saveBroca" v-bind:disabled="btndisabled && (cnsitio!=20)">Calcular</v-btn>
            </v-card-actions>
        </v-card>
        <v-row style="padding-left:10px;padding-right:10px;padding-top:2px;padding-bottom:2px;margin:2px;">
            <v-col style="margin:0;padding:0">
                <v-select
                id="select_fenologia"
                v-model="fenologia"
                v-lazy-input:debounce="1000"
                :items="listFenologia"
                label="Fenologia"
                item-text="fenologiaNombre"
                item-value="fenologiaCodigo"
                ref="vFenologia"
            >
            </v-select>
            </v-col>
        </v-row>
        <v-form v-model="valid_broca" style="padding:5px;">
          <v-tabs dark background-color="blue darken-3" show-arrows>
            <v-tab :href="'#tab-c1'" v-on:click="changeTipoCalculo(0)">Broca</v-tab>
            <v-tab-item :value="'tab-c1'">
                    <v-card color="#007ac1" dark>
                    <v-card-text>
                            <v-row>
                                <v-col sm="6" class="text-center">
                                    <h3>Sitios a evaluar: </h3>
                                </v-col>
                                <v-col sm="6"><h2> {{ nsitios }}</h2></v-col>   
                            </v-row>
                            <div style="text-align:center;margin-bottom:10px;"><h3>Sitio {{ cnsitio }}: {{ porcentajeinfestacion }}  % infestación. </h3></div>
                            
                            <v-row style="margin-top:10px;">
                                <v-col style="text-align:center;">
                                    <div class="group">
                                    <input
                                    id="frutosP1"
                                    label="Totales"
                                    v-model.lazy="cp_nfrutos_p1"
                                    color="blue-grey darken-4"
                                    type="number"
                                    v-mask="'###'"
                                    ref="frutosP1"
                                    v-on:keyup="validateFP1"
                                    v-lazy-input:debounce="200"
                                    class="inputhtml"
                                    style="width:100%;"
                                    />
                                    <span class="highlight"></span>
                                    <label class="inputlabel">Frutos brocados planta 1</label>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col sm="12" align="center">
                                    <span id="valPlanta1" style="color:red;"></span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col style="text-align:center;">
                                    <div class="group">
                                    <input
                                    id="frutosP2"
                                    v-model.lazy="cp_nfrutos_p2"
                                    label="Afectados"
                                    color="blue-grey darken-4"
                                    type="number"
                                    v-mask="'###'"
                                    ref="frutosP2"
                                    v-on:keyup="validateFP2"
                                    v-lazy-input:debounce="200"
                                    class="inputhtml"
                                    style="width:100%;"
                                    />
                                    <span class="highlight"></span>
                                    <label class="inputlabel">Frutos brocados planta 2</label>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col sm="12" align="center">
                                    <span id="valPlanta2" style="color:red;"></span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col style="text-align:center;">
                                    <div class="group">
                                    <input
                                    id="frutosP3"
                                    v-model.lazy="cp_nfrutos_p3"
                                    label="Afectados"
                                    color="blue-grey darken-4"
                                    type="number"
                                    v-mask="'###'"
                                    ref="frutosP3"
                                    v-on:keyup="validateFP3"
                                    v-lazy-input:debounce="200"
                                    class="inputhtml"
                                    style="width:100%;"
                                    />
                                    <span class="highlight"></span>
                                    <label class="inputlabel">Frutos brocados planta 3</label>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col sm="12" align="center">
                                    <span id="valPlanta3" style="color:red;"></span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col style="text-align:center;">
                                    <div class="group">
                                    <input
                                    id="frutosP4"
                                    v-model.lazy="cp_nfrutos_p4"
                                    label="Afectados"
                                    color="blue-grey darken-4"
                                    type="number"
                                    v-mask="'###'"
                                    ref="frutosP4"
                                    v-on:keyup="validateFP4"
                                    v-lazy-input:debounce="200"
                                    class="inputhtml"
                                    style="width:100%;"
                                    />
                                    <span class="highlight"></span>
                                    <label class="inputlabel">Frutos brocados planta 4</label>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col sm="12" align="center">
                                    <span id="valPlanta4" style="color:red;"></span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col style="text-align:center;">
                                    <div class="group">
                                    <input
                                    id="frutosP5"
                                    v-model.lazy="cp_nfrutos_p5"
                                    label="Afectados"
                                    color="blue-grey darken-4"
                                    type="number"
                                    v-mask="'###'"
                                    ref="frutosP5"
                                    v-on:keyup="validateFP5"
                                    v-lazy-input:debounce="200"
                                    class="inputhtml"
                                    style="width:100%;"
                                    />
                                    <span class="highlight"></span>
                                    <label class="inputlabel">Frutos brocados planta 5</label>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col sm="12" align="center">
                                    <span id="valPlanta5" style="color:red;"></span>
                                </v-col>
                            </v-row>
                            <v-row>
                                    <v-btn 
                                    v-on:click="plantaAnterior()"
                                    color="warning">Anterior</v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn 
                                    v-on:click="plantaSiguiente()"
                                    color="warning">Siguiente</v-btn>
                            </v-row>
                        </v-card-text>
                  </v-card>
            </v-tab-item>
          </v-tabs>
        </v-form>
        </div>
</template>
<script>
import { nSQL } from "@nano-sql/core";
import { CoffeeCloud } from "../coffeecloud";
import "../coffeecloud.css";
var moment = require('moment-timezone');
import axios from "axios";
var context = null;
var _CoffeeCloud = new CoffeeCloud();
export default {
  name: "FormBroca",
  components: {},
  props: ["id"],
  data: () => ({
    fenologia: null,
    listFenologia: [{ fenologiaCodigo: 'De la cosecha hasta la floración', fenologiaNombre: 'De la cosecha hasta la floración' },
                    { fenologiaCodigo: 'De la floración hasta la cosecha', fenologiaNombre: 'De la floración hasta la cosecha'},
                    { fenologiaCodigo: 'Durante la cosecha', fenologiaNombre: 'Durante la cosecha'}],
    btndisabled: true,
    lote: null,
    valid_broca: true,
    tipocalculo: 1,
    nbandolasList: [2],
    nsitios: 20,
    muestreo_avanzado: null,
    cnsitio: 1,
    cp_nfrutos_p1: null,
    cp_nfrutos_p2: null,
    cp_nfrutos_p3: null,
    cp_nfrutos_p4: null,
    cp_nfrutos_p5: null
  }),
  computed: {
      porcentajeinfestacion: function(){
          return (this.cp_nfrutos_p1 * 1 +
            this.cp_nfrutos_p2 * 1 +
            this.cp_nfrutos_p3 * 1 +
            this.cp_nfrutos_p4 * 1 +
            this.cp_nfrutos_p5 * 1);
      }
  },
  watch: {},
  methods: {
    closeDialogRoya: function(){
        //console.log("Close dialog 3");
        this.$emit('closedialogroya','close')
    },
    validateFP1: function() {
        var val = document.getElementById("frutosP1").value * 1;
        if(val < 0 || val > 20)
        {
            document.getElementById("valPlanta1").innerHTML = "El valor de frutos brocados debe ser mayor o igual a 0 y menor que 20.";
        }
        else
        { 
            document.getElementById("valPlanta1").innerHTML = "";
        }
    },
    validateFP2: function() {
        var val = document.getElementById("frutosP2").value * 1;
        if(val < 0 || val > 20)
        {
            document.getElementById("valPlanta2").innerHTML = "El valor de frutos brocados debe ser mayor o igual a 0 y menor que 20.";
        }
        else
        { 
            document.getElementById("valPlanta2").innerHTML = "";
        }
    },
    validateFP3: function() {
        var val = document.getElementById("frutosP3").value * 1;
        if(val < 0 || val > 20)
        {
            document.getElementById("valPlanta3").innerHTML = "El valor de frutos brocados debe ser mayor o igual a 0 y menor que 20.";
        }
        else
        { 
            document.getElementById("valPlanta3").innerHTML = "";
        }
    },
    validateFP4: function() {
        var val = document.getElementById("frutosP4").value * 1;
        if(val < 0 || val > 20)
        {
            document.getElementById("valPlanta4").innerHTML = "El valor de frutos brocados debe ser mayor o igual a 0 y menor que 20.";
        }
        else
        { 
            document.getElementById("valPlanta4").innerHTML = "";
        }
    },
    validateFP5: function() {
        var val = document.getElementById("frutosP5").value * 1;
        if(val < 0 || val > 20)
        {
            document.getElementById("valPlanta5").innerHTML = "El valor de frutos brocados debe ser mayor o igual a 0 y menor que 20.";
        }
        else
        { 
            document.getElementById("valPlanta5").innerHTML = "";
        }
    },
    plantaSiguiente: function() {
        
        if(this.cnsitio + 1 > 20)
        {
            this.$swal('Evaluación Broca','Ha llegado al fin de la evaluación, presione el botón calcular.','info');
            return;
        }
        if(this.cp_nfrutos_p1==='' || isNaN(parseFloat(this.cp_nfrutos_p1)))
        {
            this.$swal('Evaluación Broca','Debe completar los frutos planta 1 sitio '+ this.cnsitio +'.','info');
            this.$refs.frutosP1.focus();
            return;
        }
        if(this.cp_nfrutos_p2==='' || isNaN(parseFloat(this.cp_nfrutos_p2)))
        {
            this.$swal('Evaluación Broca','Debe completar los frutos planta 2 sitio '+ this.cnsitio +'.','info');
            this.$refs.frutosP2.focus();
            return;
        }
        if(this.cp_nfrutos_p3==='' || isNaN(parseFloat(this.cp_nfrutos_p3)))
        {
            this.$swal('Evaluación Broca','Debe completar los frutos planta 3 sitio '+ this.cnsitio +'.','info');
            this.$refs.frutosP3.focus();
            return;
        }
        if(this.cp_nfrutos_p4==='' || isNaN(parseFloat(this.cp_nfrutos_p4)))
        {
            this.$swal('Evaluación Broca','Debe completar los frutos planta 4 sitio '+ this.cnsitio +'.','info');
            this.$refs.frutosP4.focus();
            return;
        }
        if(this.cp_nfrutos_p5==='' || isNaN(parseFloat(this.cp_nfrutos_p5)))
        {
            this.$swal('Evaluación Broca','Debe completar los frutos planta 5 sitio '+ this.cnsitio +'.','info');
            this.$refs.frutosP5.focus();
            return;
        }
        // ActualizarModelo
        this.actualizarModelo(this.cnsitio-1)
        
        // ActualizarActual
        this.actualizarActual(this.cnsitio);
        this.muestreo_avanzado[this.cnsitio].nsitio = this.cnsitio + 1;
        this.cnsitio++;
    },
    actualizarModelo:  function(iplanta) {
        this.muestreo_avanzado[iplanta].nsitio = this.cnsitio * 1;
        this.muestreo_avanzado[iplanta].nfrutos_p1 = this.cp_nfrutos_p1 * 1;
        this.muestreo_avanzado[iplanta].nfrutos_p2 = this.cp_nfrutos_p2 * 1;
        this.muestreo_avanzado[iplanta].nfrutos_p3 = this.cp_nfrutos_p3 * 1;
        this.muestreo_avanzado[iplanta].nfrutos_p4 = this.cp_nfrutos_p4 * 1;
        this.muestreo_avanzado[iplanta].nfrutos_p5 = this.cp_nfrutos_p5 * 1;
    },
    actualizarActual: function(iplanta) {
        this.cp_nfrutos_p1 = this.muestreo_avanzado[iplanta].nfrutos_p1;
        this.cp_nfrutos_p2 = this.muestreo_avanzado[iplanta].nfrutos_p2;
        this.cp_nfrutos_p3 = this.muestreo_avanzado[iplanta].nfrutos_p3;
        this.cp_nfrutos_p4 = this.muestreo_avanzado[iplanta].nfrutos_p4;
        this.cp_nfrutos_p5 = this.muestreo_avanzado[iplanta].nfrutos_p5;
    },
    plantaAnterior: function() {
        // Validar
        if(this.cnsitio - 1 < 1)
        {
            this.$swal('Evaluación Broca','Se encuentra en el inicio de la evaluación.','information');
            return;
        }
        
        if(this.cp_nfrutos_p1==='' || isNaN(parseFloat(this.cp_nfrutos_p1)))
        {
            this.$swal('Evaluación Broca','Debe completar los frutos planta 1 sitio '+ this.cnsitio +'.','info');
            this.$refs.frutosP1.focus();
            return;
        }
        if(this.cp_nfrutos_p2==='' || isNaN(parseFloat(this.cp_nfrutos_p2)))
        {
            this.$swal('Evaluación Broca','Debe completar los frutos planta 2 sitio '+ this.cnsitio +'.','info');
            this.$refs.frutosP2.focus();
            return;
        }
        if(this.cp_nfrutos_p3==='' || isNaN(parseFloat(this.cp_nfrutos_p3)))
        {
            this.$swal('Evaluación Broca','Debe completar los frutos planta 3 sitio '+ this.cnsitio +'.','info');
            this.$refs.frutosP3.focus();
            return;
        }
        if(this.cp_nfrutos_p4==='' || isNaN(parseFloat(this.cp_nfrutos_p4)))
        {
            this.$swal('Evaluación Broca','Debe completar los frutos planta 4 sitio '+ this.cnsitio +'.','info');
            this.$refs.frutosP4.focus();
            return;
        }
        if(this.cp_nfrutos_p5==='' || isNaN(parseFloat(this.cp_nfrutos_p5)))
        {
            this.$swal('Evaluación Broca','Debe completar los frutos planta 5 sitio '+ this.cnsitio +'.','info');
            this.$refs.frutosP5.focus();
            return;
        }
        
        // ActualizarModelo
        this.actualizarModelo(this.cnsitio-1)
        
        // ActualizarActual
        this.actualizarActual(this.cnsitio-2);
        
        this.muestreo_avanzado[this.cnsitio-2].nsitio = this.cnsitio - 1;
        this.cnsitio--;
    },
    saveBroca: function() {
        try
        {
            this.btndisabled=true;
            var nfrutosBrocadosTotales = 0;
            var i = 0;
            var porcentajeInfestacion = 0;
            var fechaEvaluacion = moment().subtract(6,'hour').format();
            var detalle = new Array();
            var incidencia = 0;

            if(this.fenologia=="" || this.fenologia===null)
            {
                this.$swal('Evaluación Roya','Debe seleccionar la etapa fenológica en la que se encuentra.','info');
                return;
            }

            if(this.cp_nfrutos_p1==='' || isNaN(parseFloat(this.cp_nfrutos_p1)))
            {
                this.$swal('Evaluación Broca','Debe completar los frutos totales bandola 1.','info');
                this.$refs.frutosP1.focus();
                return;
            }
            if(this.cp_nfrutos_p2==='' || isNaN(parseFloat(this.cp_nfrutos_p2)))
            {
                this.$swal('Evaluación Broca','Debe completar los frutos totales bandola 1.','info');
                this.$refs.frutosP2.focus();
                return;
            }
            if(this.cp_nfrutos_p3==='' || isNaN(parseFloat(this.cp_nfrutos_p3)))
            {
                this.$swal('Evaluación Broca','Debe completar los frutos totales bandola 1.','info');
                this.$refs.frutosP3.focus();
                return;
            }
            if(this.cp_nfrutos_p4==='' || isNaN(parseFloat(this.cp_nfrutos_p4)))
            {
                this.$swal('Evaluación Broca','Debe completar los frutos totales bandola 1.','info');
                this.$refs.frutosP4.focus();
                return;
            }
            if(this.cp_nfrutos_p5==='' || isNaN(parseFloat(this.cp_nfrutos_p5)))
            {
                this.$swal('Evaluación Broca','Debe completar los frutos totales bandola 1.','info');
                this.$refs.frutosP5.focus();
                return;
            }
            
            this.actualizarModelo(this.cnsitio-1);

            var clear = 0;
            for(i=0;i<this.nsitios;i++)
            {
                if(this.muestreo_avanzado[i].nfrutos_p1===null ||
                   isNaN(parseFloat(this.muestreo_avanzado[i].nfrutos_p1)) ||
                   this.muestreo_avanzado[i].nfrutos_p1<0)
                {
                    this.$swal('Evaluación Broca',"Favor revisar frutos brocados planta 1 sitio " + (i + 1),"warning");
                    this.actualizarActual(i);
                    this.cnsitio = i + 1;
                    return;
                }
                if(this.muestreo_avanzado[i].nfrutos_p2===null ||
                   isNaN(parseFloat(this.muestreo_avanzado[i].nfrutos_p2)) ||
                   this.muestreo_avanzado[i].nfrutos_p2<0)
                {
                    this.$swal('Evaluación Broca',"Favor revisar frutos procados planta 2 sitio " + (i + 1),"warning");
                    this.actualizarActual(i);
                    this.cnsitio = i + 1;
                    return;
                }
                if(this.muestreo_avanzado[i].nfrutos_p3===null ||
                   isNaN(parseFloat(this.muestreo_avanzado[i].nfrutos_p3)) ||
                   this.muestreo_avanzado[i].nfrutos_p3<0)
                {
                    this.$swal('Evaluación Broca',"Favor revisar frutos procados planta 3 sitio " + (i + 1),"warning");
                    this.actualizarActual(i);
                    this.cnsitio = i + 1;
                    return;
                }
                if(this.muestreo_avanzado[i].nfrutos_p4===null ||
                   isNaN(parseFloat(this.muestreo_avanzado[i].nfrutos_p4)) ||
                   this.muestreo_avanzado[i].nfrutos_p4<0)
                {
                    this.$swal('Evaluación Broca',"Favor revisar frutos procados planta 4 sitio " + (i + 1),"warning");
                    this.actualizarActual(i);
                    this.cnsitio = i + 1;
                    return;
                }
                if(this.muestreo_avanzado[i].nfrutos_p5===null ||
                   isNaN(parseFloat(this.muestreo_avanzado[i].nfrutos_p5)) ||
                   this.muestreo_avanzado[i].nfrutos_p5<0)
                {
                    this.$swal('Evaluación Broca',"Favor revisar frutos procados planta 5 sitio " + (i + 1),"warning");
                    this.actualizarActual(i);
                    this.cnsitio = i + 1;
                    return;
                }
            }

            if(this.valid_broca==false){
                this.$swal('Evaluación Broca',"Favor revisar la información ingresada.","warning");
                this.btndisabled=false;
                return;
            }
            
            for(i=0;i<this.muestreo_avanzado.length;i++)
            {
                this.muestreo_avanzado[i].nsitio = parseInt(this.muestreo_avanzado[i].nsitio);
                this.muestreo_avanzado[i].nfrutos_p1 = parseInt(this.muestreo_avanzado[i].nfrutos_p1);
                this.muestreo_avanzado[i].nfrutos_p2 = parseInt(this.muestreo_avanzado[i].nfrutos_p2);
                this.muestreo_avanzado[i].nfrutos_p3 = parseInt(this.muestreo_avanzado[i].nfrutos_p3);
                this.muestreo_avanzado[i].nfrutos_p4 = parseInt(this.muestreo_avanzado[i].nfrutos_p4);
                this.muestreo_avanzado[i].nfrutos_p5 = parseInt(this.muestreo_avanzado[i].nfrutos_p5);
                        
                detalle.push({'detalleEvaluacionPlanta': 1,
                              'detalleEvaluacionBandola': 1,
                              'detalleEvaluacionGranosTotales': 20,
                              'detalleEvaluacionGranosAfectados': this.muestreo_avanzado[i].nfrutos_p1,
                              'detalleEvaluacionNsitio': this.muestreo_avanzado[i].nsitio  
                            });
                detalle.push({'detalleEvaluacionPlanta': 2,
                              'detalleEvaluacionBandola': 1,
                              'detalleEvaluacionGranosTotales': 20,
                              'detalleEvaluacionGranosAfectados': this.muestreo_avanzado[i].nfrutos_p2,
                              'detalleEvaluacionNsitio': this.muestreo_avanzado[i].nsitio  
                            });
                detalle.push({'detalleEvaluacionPlanta': 3,
                              'detalleEvaluacionBandola': 1,
                              'detalleEvaluacionGranosTotales': 20,
                              'detalleEvaluacionGranosAfectados': this.muestreo_avanzado[i].nfrutos_p3,
                              'detalleEvaluacionNsitio': this.muestreo_avanzado[i].nsitio  
                            });
                detalle.push({'detalleEvaluacionPlanta': 4,
                              'detalleEvaluacionBandola': 1,
                              'detalleEvaluacionGranosTotales': 20,
                              'detalleEvaluacionGranosAfectados': this.muestreo_avanzado[i].nfrutos_p4,
                              'detalleEvaluacionNsitio': this.muestreo_avanzado[i].nsitio  
                            });
                detalle.push({'detalleEvaluacionPlanta': 5,
                              'detalleEvaluacionBandola': 1,
                              'detalleEvaluacionGranosTotales': 20,
                              'detalleEvaluacionGranosAfectados': this.muestreo_avanzado[i].nfrutos_p5,
                              'detalleEvaluacionNsitio': this.muestreo_avanzado[i].nsitio  
                             });
                nfrutosBrocadosTotales += this.muestreo_avanzado[i].nfrutos_p1 +
                                          this.muestreo_avanzado[i].nfrutos_p2 +
                                          this.muestreo_avanzado[i].nfrutos_p3 +
                                          this.muestreo_avanzado[i].nfrutos_p4 +
                                          this.muestreo_avanzado[i].nfrutos_p5;
            }
            
            if(nfrutosBrocadosTotales < 1) {
                incidencia = 0;
            }
            else
            {
                incidencia = ((nfrutosBrocadosTotales / 2000) * 100).toFixed(0);
            } 
            console.log("frutos brocados:" + nfrutosBrocadosTotales);
            console.log("incidencia: " + incidencia);
            var recomendacion = null;
            (async ()=>{
                let query = nSQL("recomendaciones").query("select")
                .where([['recomendacionTipo','=','Broca'],
                        'AND',
                    ['recomendacionCriterioMes1','<=',(moment().month() + 1)],
                        'AND',
                    ['recomendacionCriterioMes2','>=',(moment().month() + 1)],
                        'AND',
                    ['recomendacionCriterioIncidencia1','<=',incidencia],
                        'AND',
                    ['recomendacionCriterioIncidencia2','>=',incidencia]])
                .exec();
                var recomendaciones = await query;
                recomendacion = recomendaciones[0];
                console.log(recomendacion);
                var evaluacionBroca = { 'evaluacionCodigo' : 0,
                                    'evaluacionTipo' : this.tipocalculo,
                                    'evaluacionFecha' : moment().subtract(6,'hour').format(),
                                    'evaluacionBandolas' : 2,
                                    'evaluacionIncidencia': incidencia,
                                    'recomendacionCodigo': recomendacion.recomendacionCodigo,
                                    'loteCodigo':this.lote.loteCodigo,
                                    'loteCodigoL':this.lote.loteCodigoL,
                                    'recomendacionDescripcion':recomendacion.recomendacionText,
                                    'etapaFenologia':this.fenologia
                                    };
                console.log(evaluacionBroca);
                nSQL("evaluacionBroca").query("upsert",evaluacionBroca)
                .exec().then(()=>{
                    nSQL("evaluacionBroca").query("select",["MAX(evaluacionCodigoL) as evaluacionCodigoL"])
                    .exec().then((rows)=>{
                        //Detalle
                        var evaluacionCodigoL = rows[0].evaluacionCodigoL;
                        var j = 0;
                        for(j=0;j<detalle.length;j++)
                        {
                            var pk = evaluacionCodigoL + "," + detalle[j].detalleEvaluacionPlanta + "," + detalle[j].detalleEvaluacionBandola + "," + detalle[j].detalleEvaluacionNsitio;
                            detalle[j].evaluacionPK = pk;
                            detalle[j].evaluacionCodigo = 0;
                            detalle[j].evaluacionCodigoL = evaluacionCodigoL;
                        }
                        nSQL("detalleEvaluacionBroca").query("upsert",detalle)
                        .exec().then(()=>{
                            var mensaje = "Fecha: " + moment().format().substring(0,10) + "\n";
                            mensaje += "% Infestación: " + incidencia + "";
                            this.$swal('Evaluación registrada',mensaje,"success");
                            try
                            {
                                _CoffeeCloud.enviarDatosAlServidor();
                            }
                            catch(Ex)
                            {
                                console.log(Ex);
                            }
                            this.$router.push({name:'Lotes',params:{id:this.lote.fincaCodigoL,ilote:this.lote,view:'broca'}});
                        });
                    });
                });
            })();
        }
        catch(ex)
        {
            alert(ex);
        }
    },
    changeTipoCalculo: function(tipo) {
        this.tipocalculo = tipo;
        this.nbandolasChange();
    },
    nbandolasChange: function() {
        this.nsitios = 20;
        if (this.muestreo_avanzado == null) {
            this.muestreo_avanzado = [];
            for (var i = 0; i < this.nsitios; i++) {
              this.muestreo_avanzado.push({
                nsitio: i + 1,
                nfrutos_p1: null,
                nfrutos_p2: null,
                nfrutos_p3: null,
                nfrutos_p4: null,
                nfrutos_p5: null
              });
            }
        }
    }
  },
  mounted() {
        _CoffeeCloud.container = this;
        context = this;
        try
        {
            document.removeEventListener("backbutton",handleBackbutton);
        }
        catch(ex)
        {
            //console.log(ex);
        }

        try{
            
            document.addEventListener("backbutton", handleBackbutton, false);
        }
        catch(ex)
        {
            //console.log(ex);
        }
        nSQL("lotes").query("select")
        .where(['loteCodigoL','=',this.id * 1])
        .exec().then((rows)=>{
            //console.log(rows);
            this.lote = rows[0];
        })
        this.nbandolasChange();
  }
};

            function handleBackbutton() {
                context.$swal({
                    title: '¿Está seguro?',
                    text: "Esta acción borrará los datos del formulario.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Aceptar'
                    }).then((result) => {
                        if (result.value) {
                            
                            try
                            {
                                document.removeEventListener("backbutton",handleBackbutton);
                            }
                            catch(ex)
                            {
                                //console.log(ex);
                            }
                            context.$router.push({name:'Lotes',params:{id:this.lote.fincaCodigoL,ilote:this.lote,view:'broca'}});
                            return true;
                        } else {
                            return false;
                        }
                });
                return false;
            }
</script>