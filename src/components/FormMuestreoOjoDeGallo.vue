<template>
        <div>
        <v-card
            color="#008869"
            dark style="margin:8px;padding:4px;">
            <v-card-title class="title" style="padding:4px;"><v-icon style="padding:10px;">fab fa-pagelines</v-icon>&nbsp; Muestreo Ojo de Gallo</v-card-title>
            <v-card-subtitle align="center" style="padding:8px;">{{ lote.loteNombre }}</v-card-subtitle>
            <v-card-actions>
            <v-spacer></v-spacer>
                <v-btn text small v-on:click="$router.push({name:'Lotes',params:{id:lote.fincaCodigoL,ilote:lote,view:'ojodegallo'}})">Cancelar</v-btn>
                <v-btn text small v-on:click="saveOjoDeGallo" v-bind:disabled="btndisabled && (cnplanta!=30)">Calcular</v-btn>
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
        <v-form v-model="valid_ojodegallo" style="padding:5px;">
          <v-tabs dark background-color="blue darken-3" show-arrows>
            <v-tab :href="'#tab-c1'" v-on:click="changeTipoCalculo(0)">Ojo de Gallo</v-tab>
            <v-tab-item :value="'tab-c1'">
              <v-card tile color="#007ac1" dark>
                <v-card-text>
                  <v-row>
                      <v-col sm="6" class="text-center">
                                    <h3>Plantas a evaluar: </h3>
                                </v-col>
                                <v-col sm="6"><h2> {{ nplantas }}</h2></v-col>    
                  </v-row>
                            <h3>Planta {{ cnplanta }} bándola 1</h3>
                            <!--Hojas totales:-->
                            <v-row style="margin-top:10px;">
                                <v-col sm="6">
                                    <div class="group">
                                    <input
                                    label="Totales"
                                    v-model.number.lazy="cp_nhojas_b1"
                                    color="blue-grey darken-4"
                                    type="number"
                                    v-mask="'###'"
                                    id="hojasTotalesB1"
                                    ref="hojasTotalesB1"
                                    v-lazy-input:debounce="500"
                                    v-on:keyup="validateHTB1"
                                    class="inputhtml"
                                    style="width:100%;"
                                    />
                                    <span class="highlight"></span>
                                    <label class="inputlabel">Hojas totales</label>
                                    </div>
                                </v-col>
                                <v-col sm="6">
                                    <div class="group">
                                    <input
                                    v-model.number.lazy="cp_nhojasafectadas_b1"
                                    label="Afectadas"
                                    color="blue-grey darken-4"
                                    v-mask="'###'"
                                    type="number"
                                    id="hojasAfectadasB1"
                                    ref="hojasAfectadasB1"
                                    v-lazy-input:debounce="500"
                                    v-on:keyup="validateHAB1"
                                    class="inputhtml"
                                    style="width:100%;"
                                    />
                                    <span class="highlight"></span>
                                    <label class="inputlabel">Hojas afectadas</label>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col sm="12" align="center">
                                    <span id="valPlanta1" style="color:red;"></span>
                                </v-col>
                            </v-row>
                            <h3>Planta {{ cnplanta }} bándola 2</h3>
                            <!--Hojas totales:-->
                            <v-row style="margin-top:10px;">
                                <v-col sm="6">
                                    <div class="group">
                                    <input
                                    label="Totales"
                                    v-model.number.lazy="cp_nhojas_b2"
                                    color="blue-grey darken-4"
                                    v-mask="'###'"
                                    type="number"
                                    id="hojasTotalesB2"
                                    ref="hojasTotalesB2"
                                    v-lazy-input:debounce="500"
                                    v-on:keyup="validateHTB2"
                                    class="inputhtml"
                                    style="width:100%;"
                                    />
                                    <span class="highlight"></span>
                                    <label class="inputlabel">Hojas totales</label>
                                    </div>
                                </v-col>
                                <v-col sm="6">
                                    <div class="group">
                                    <input
                                    label="Afectadas"
                                    v-model.number.lazy="cp_nhojasafectadas_b2"
                                    color="blue-grey darken-4"
                                    v-mask="'###'"
                                    type="number"
                                    id="hojasAfectadasB2"
                                    ref="hojasAfectadasB2"
                                    v-on:keyup="validateHAB2"
                                    v-lazy-input:debounce="500"
                                    class="inputhtml"
                                    style="width:100%;"
                                    />
                                    <span class="highlight"></span>
                                    <label class="inputlabel">Hojas afectadas</label>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col sm="12" align="center">
                                    <span id="valPlanta2" style="color:red;"></span>
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
  name: "FormMuestreoOjoDeGallo",
  components: {},
  props: ["id"],
  data: () => ({
    fenologia: null,
    listFenologia: [{ fenologiaCodigo: 'De la cosecha hasta la floración', fenologiaNombre: 'De la cosecha hasta la floración' },
                    { fenologiaCodigo: 'De la floración hasta la cosecha', fenologiaNombre: 'De la floración hasta la cosecha'},
                    { fenologiaCodigo: 'Durante la cosecha', fenologiaNombre: 'Durante la cosecha'}],
    btndisabled: true,
    lote: null,
    valid_ojodegallo: true,
    tipocalculo: 0,
    nbandolasList: [1, 2],
    tipocalculo: 0,
    nbandolas: 2,
    nplantas: 30,
    muestreo_1bandolas_basico: null,
    muestreo_2bandolas_basico: null,
    muestreo_1bandolas_avanzado: null,
    muestreo_2bandolas_avanzado: null,
    muestreo_seleccionado: null,
    cnplanta: 1,
    cp_nhojas_b1: null,
    cp_nhojasafectadas_b1: null,
    cp_nhojas_b2: null,
    cp_nhojasafectadas_b2: null
  }),
  computed: {

  },
  watch: {},
  methods: {
    closeDialogRoya: function(){
        //console.log("Close dialog 3");
        this.$emit('closedialogroya','close')
    },
    validateHTB1: function() {
        var val = document.getElementById("hojasTotalesB1").value * 1;
        if(val <= 0 || val > 100)
        {
            document.getElementById("valPlanta1").innerHTML = "El valor de hojas totales debe ser mayor que 0 y menor que 100.";
        }
        else
        { 
            document.getElementById("valPlanta1").innerHTML = "";
        }
    },
    validateHAB1: function() {
        var val = document.getElementById("hojasAfectadasB1").value * 1;
        var val_ = document.getElementById("hojasTotalesB1").value * 1;
        if(val < 0 || val > 100)
        {
            document.getElementById("valPlanta1").innerHTML = "El valor de las hojas totales debe ser mayor o igual que 0 y menor que 100.";
        }
        else if(val > val_) 
        {
            document.getElementById("valPlanta1").innerHTML = "El valor de las hojas afectadas no puede ser mayor que el de hojas totales.";
        }
        else
        { 
            document.getElementById("valPlanta1").innerHTML = "";
        }
    },
    validateHTB2: function() {
        var val = document.getElementById("hojasTotalesB2").value * 1;
        if(val <= 0 || val > 100)
        {
            document.getElementById("valPlanta2").innerHTML = "El valor de hojas las totales debe ser mayor que 0 y menor que 100.";
        }
        else
        { 
            document.getElementById("valPlanta2").innerHTML = "";
        }
    },
    validateHAB2: function() {
        var val = document.getElementById("hojasAfectadasB2").value * 1;
        var val_ = document.getElementById("hojasTotalesB2").value * 1;
        if(val < 0 || val > 100)
        {
            document.getElementById("valPlanta2").innerHTML = "El valor de las hojas afectadas debe ser mayor o igual que 0 y menor que 100.";
        }
        else if(val > val_)
        {
            document.getElementById("valPlanta2").innerHTML = "El valor de las hojas afectadas no puede ser mayor que las hojas totales.";
        }
        else
        { 
            document.getElementById("valPlanta2").innerHTML = "";
        }
    },
    plantaSiguiente: function() {
        
        if(this.cnplanta + 1 > 30)
        {
            this.$swal('Evaluación Ojo de Gallo','Ha llegado al fin de la evaluación, presione el botón calcular.','info');
            return;
        }
        if(this.cp_nhojas_b1==='' || isNaN(parseFloat(this.cp_nhojas_b1)))
            {
                this.$swal('Evaluación Ojo de Gallo','Debe completar las hojas totales bandola 1.','info');
                this.$refs.hojasTotalesB1.focus();
                return;
            }
            if(this.cp_nhojas_b1 * 1 < 1)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas totales bandola 1 debe ser un número mayor que 0.','info');
                this.$refs.hojasTotalesB1.focus();
                return;
            }
            if(this.cp_nhojas_b1 * 1 > 100)
            {
                this.$swal('Evaluación Ojo de Gallo','El valor máximo de hojas totales bandola 1 es 100','info');
                this.$refs.hojasTotalesB1.focus();
                return;
            }
            if(this.cp_nhojas_b2==='' || isNaN(parseFloat(this.cp_nhojas_b2)))
            {
                this.$swal('Evaluación Ojo de Gallo','Debe completar las hojas totales bandola 2.','info');
                this.$refs.hojasTotalesB2.focus();
                return;
            }
            if(this.cp_nhojas_b2 * 1 < 1)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas totales bandola 2 debe ser un número mayor que 0.','info');
                this.$refs.hojasTotalesB2.focus();
                return;
            }
            if(this.cp_nhojas_b2 * 1 > 100)
            {
                this.$swal('Evaluación Ojo de Gallo','El valor máximo de hojas totales bandola 2 es 100','info');
                this.$refs.hojasTotalesB2.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b1==='' || isNaN(parseFloat(this.cp_nhojasafectadas_b1)))
            {
                this.$swal('Evaluación Ojo de Gallo','Debe completar las hojas afectadas bandola 1.','info');
                this.$refs.hojasAfectadasB1.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b2==='' || isNaN(parseFloat(this.cp_nhojasafectadas_b2)))
            {
                this.$swal('Evaluación Ojo de Gallo','Debe completar las hojas afectadas bandola 2.','info');
                this.$refs.hojasAfectadasB2.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b1 * 1 < 0)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas afectadas bandola 1 debe ser un número mayor que 0.','info');
                this.$refs.hojasAfectadasB1.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b1 * 1 > 100)
            {
                this.$swal('Evaluación Ojo de Gallo','El valor máximo de hojas afectadas bandola 1 es 100','info');
                this.$refs.hojasAfectadasB1.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b2 * 1 < 0)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas afectadas bandola 2 debe ser un número mayor que 0.','info');
                this.$refs.hojasAfectadasB2.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b2 * 1 > 100)
            {
                this.$swal('Evaluación Ojo de Gallo','El valor máximo de hojas afectadas bandola 2 es 100','info');
                this.$refs.hojasAfectadasB2.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b1 * 1 > this.cp_nhojas_b1 * 1)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas afectadas bandola 1 no pueden ser mayor a las totales','info');
                this.$refs.hojasAfectadasB1.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b2 * 1 > this.cp_nhojas_b2 * 1)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas afectadas bandola 2 no pueden ser mayor a las totales','info');
                this.$refs.hojasAfectadasB2.focus();
                return;
            }
        // ActualizarModelo
        this.actualizarModelo(this.cnplanta-1)
        
        // ActualizarActual
        this.actualizarActual(this.cnplanta);
        this.muestreo_2bandolas_basico[this.cnplanta].nplanta = this.cnplanta + 1;
        this.cnplanta++;
    },
    actualizarModelo:  function(iplanta) {
        this.muestreo_2bandolas_basico[iplanta].nplanta = this.cnplanta * 1;
        this.muestreo_2bandolas_basico[iplanta].nhojas_b1 = this.cp_nhojas_b1 * 1;
        this.muestreo_2bandolas_basico[iplanta].nhojasafectadas_b1 = this.cp_nhojasafectadas_b1 * 1;
        this.muestreo_2bandolas_basico[iplanta].nhojas_b2 = this.cp_nhojas_b2 * 1;
        this.muestreo_2bandolas_basico[iplanta].nhojasafectadas_b2 = this.cp_nhojasafectadas_b2 * 1;
    },
    actualizarActual: function(iplanta) {
        this.cp_nhojas_b1 = this.muestreo_2bandolas_basico[iplanta].nhojas_b1;
        this.cp_nhojasafectadas_b1 = this.muestreo_2bandolas_basico[iplanta].nhojasafectadas_b1;
        this.cp_nhojas_b2 = this.muestreo_2bandolas_basico[iplanta].nhojas_b2;
        this.cp_nhojasafectadas_b2 = this.muestreo_2bandolas_basico[iplanta].nhojasafectadas_b2;
    },
    plantaAnterior: function() {
        // Validar
        if(this.cnplanta - 1 < 1)
        {
            this.$swal('Evaluación Ojo de Gallo','Se encuentra en el inicio de la evaluación.','information');
            return;
        }
        if(this.cp_nhojas_b1==='' || isNaN(parseFloat(this.cp_nhojas_b1)))
            {
                this.$swal('Evaluación Ojo de Gallo','Debe completar las hojas totales bandola 1.','info');
                this.$refs.hojasTotalesB1.focus();
                return;
            }
            if(this.cp_nhojas_b1 * 1 < 1)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas totales bandola 1 debe ser un número mayor que 0.','info');
                this.$refs.hojasTotalesB1.focus();
                return;
            }
            if(this.cp_nhojas_b1 * 1 > 100)
            {
                this.$swal('Evaluación Ojo de Gallo','El valor máximo de hojas totales bandola 1 es 100','info');
                this.$refs.hojasTotalesB1.focus();
                return;
            }
            if(this.cp_nhojas_b2==='' || isNaN(parseFloat(this.cp_nhojas_b2)))
            {
                this.$swal('Evaluación Ojo de Gallo','Debe completar las hojas totales bandola 2.','info');
                this.$refs.hojasTotalesB2.focus();
                return;
            }
            if(this.cp_nhojas_b2 * 1 < 1)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas totales bandola 2 debe ser un número mayor que 0.','info');
                this.$refs.hojasTotalesB2.focus();
                return;
            }
            if(this.cp_nhojas_b2 * 1 > 100)
            {
                this.$swal('Evaluación Ojo de Gallo','El valor máximo de hojas totales bandola 2 es 100','info');
                this.$refs.hojasTotalesB2.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b1==='' || isNaN(parseFloat(this.cp_nhojasafectadas_b1)))
            {
                this.$swal('Evaluación Ojo de Gallo','Debe completar las hojas afectadas bandola 1.','info');
                this.$refs.hojasAfectadasB1.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b2==='' || isNaN(parseFloat(this.cp_nhojasafectadas_b2)))
            {
                this.$swal('Evaluación Ojo de Gallo','Debe completar las hojas afectadas bandola 2.','info');
                this.$refs.hojasAfectadasB2.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b1 * 1 < 0)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas afectadas bandola 1 debe ser un número mayor que 0.','info');
                this.$refs.hojasAfectadasB1.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b1 * 1 > 100)
            {
                this.$swal('Evaluación Ojo de Gallo','El valor máximo de hojas afectadas bandola 1 es 100','info');
                this.$refs.hojasAfectadasB1.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b2 * 1 < 0)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas afectadas bandola 2 debe ser un número mayor que 0.','info');
                this.$refs.hojasAfectadasB2.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b2 * 1 > 100)
            {
                this.$swal('Evaluación Ojo de Gallo','El valor máximo de hojas afectadas bandola 2 es 100','info');
                this.$refs.hojasAfectadasB2.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b1 * 1 > this.cp_nhojas_b1 * 1)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas afectadas bandola 1 no pueden ser mayor a las totales','info');
                this.$refs.hojasAfectadasB1.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b2 * 1 > this.cp_nhojas_b2 * 1)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas afectadas bandola 2 no pueden ser mayor a las totales','info');
                this.$refs.hojasAfectadasB2.focus();
                return;
            }
        // ActualizarModelo
        this.actualizarModelo(this.cnplanta-1)
        
        // ActualizarActual
        this.actualizarActual(this.cnplanta-2);
        
        this.muestreo_2bandolas_basico[this.cnplanta-2].nplanta = this.cnplanta - 1;
        this.cnplanta--;
    },
    saveOjoDeGallo: function() {
        try
        {
            this.btndisabled = true;
            var nhojasTotales = 0;
            var nhojasAfectadasTotales = 0;
            var chojasAfectadas = 0;
            var i = 0;
            var incidencia = 0;
            var severidad = 0;
            var severidadTotal = 0;
            var fechaEvaluacion = moment().subtract(6,'hour').format();
            var detalle = new Array();

            if(this.fenologia=="" || this.fenologia===null)
            {
                this.$swal('Evaluación Roya','Debe seleccionar la etapa fenológica en la que se encuentra.','info');
                return;
            }

            if(this.cp_nhojas_b1==='' || isNaN(parseFloat(this.cp_nhojas_b1)))
            {
                this.$swal('Evaluación Ojo de Gallo','Debe completar las hojas totales bandola 1.','info');
                this.$refs.hojasTotalesB1.focus();
                return;
            }
            if(this.cp_nhojas_b1 * 1 < 1)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas totales bandola 1 debe ser un número mayor que 0.','info');
                this.$refs.hojasTotalesB1.focus();
                return;
            }
            if(this.cp_nhojas_b1 * 1 > 100)
            {
                this.$swal('Evaluación Ojo de Gallo','El valor máximo de hojas totales bandola 1 es 100','info');
                this.$refs.hojasTotalesB1.focus();
                return;
            }
            if(this.cp_nhojas_b2==='' || isNaN(parseFloat(this.cp_nhojas_b2)))
            {
                this.$swal('Evaluación Ojo de Gallo','Debe completar las hojas totales bandola 2.','info');
                this.$refs.hojasTotalesB2.focus();
                return;
            }
            if(this.cp_nhojas_b2 * 1 < 1)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas totales bandola 2 debe ser un número mayor que 0.','info');
                this.$refs.hojasTotalesB2.focus();
                return;
            }
            if(this.cp_nhojas_b2 * 1 > 100)
            {
                this.$swal('Evaluación Ojo de Gallo','El valor máximo de hojas totales bandola 2 es 100','info');
                this.$refs.hojasTotalesB2.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b1==='' || isNaN(parseFloat(this.cp_nhojasafectadas_b1)))
            {
                this.$swal('Evaluación Ojo de Gallo','Debe completar las hojas afectadas bandola 1.','info');
                this.$refs.hojasAfectadasB1.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b2==='' || isNaN(parseFloat(this.cp_nhojasafectadas_b2)))
            {
                this.$swal('Evaluación Ojo de Gallo','Debe completar las hojas afectadas bandola 2.','info');
                this.$refs.hojasAfectadasB2.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b1 * 1 < 0)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas afectadas bandola 1 debe ser un número mayor que 0.','info');
                this.$refs.hojasAfectadasB1.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b1 * 1 > 100)
            {
                this.$swal('Evaluación Ojo de Gallo','El valor máximo de hojas afectadas bandola 1 es 100','info');
                this.$refs.hojasAfectadasB1.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b2 * 1 < 0)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas afectadas bandola 2 debe ser un número mayor que 0.','info');
                this.$refs.hojasAfectadasB2.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b2 * 1 > 100)
            {
                this.$swal('Evaluación Ojo de Gallo','El valor máximo de hojas afectadas bandola 2 es 100','info');
                this.$refs.hojasAfectadasB2.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b1 * 1 > this.cp_nhojas_b1 * 1)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas afectadas bandola 1 no pueden ser mayor a las totales','info');
                this.$refs.hojasAfectadasB1.focus();
                return;
            }
            if(this.cp_nhojasafectadas_b2 * 1 > this.cp_nhojas_b2 * 1)
            {
                this.$swal('Evaluación Ojo de Gallo','Las hojas afectadas bandola 2 no pueden ser mayor a las totales','info');
                this.$refs.hojasAfectadasB2.focus();
                return;
            }

            this.actualizarModelo(this.cnplanta-1);

            var clear = 0;
            for(i=0;i<this.nplantas;i++)
            {
                if(this.muestreo_2bandolas_basico[i].nhojas_b1===null ||
                   isNaN(parseFloat(this.muestreo_2bandolas_basico[i].nhojas_b1)) ||
                   this.muestreo_2bandolas_basico[i].nhojas_b1==0)
                {
                    this.$swal('Evaluación Ojo de Gallo',"Favor revisar hojas totales bandola 1.","warning");
                    this.actualizarActual(i);
                    this.ncplanta = i + 1;
                    return;
                }
                if(this.muestreo_2bandolas_basico[i].nhojas_b2===null ||
                   isNaN(parseFloat(this.muestreo_2bandolas_basico[i].nhojas_b2)) ||
                   this.muestreo_2bandolas_basico[i].nhojas_b2==0)
                {
                    this.$swal('Evaluación Ojo de Gallo',"Favor revisar hojas totales bandola 2.","warning");
                    this.actualizarActual(i);
                    this.ncplanta = i + 1;
                    return;
                }
                if(this.muestreo_2bandolas_basico[i].nhojasafectadas_b1===null ||
                   isNaN(parseFloat(this.muestreo_2bandolas_basico[i].nhojasafectadas_b1)))
                {
                    this.$swal('Evaluación Ojo de Gallo',"Favor revisar hojas afectadas bandola 1.","warning");
                    this.actualizarActual(i);
                    this.ncplanta = i + 1;
                    return;
                }
                if(this.muestreo_2bandolas_basico[i].nhojasafectadas_b2===null ||
                   isNaN(parseFloat(this.muestreo_2bandolas_basico[i].nhojasafectadas_b2)))
                {
                    this.$swal('Evaluación Ojo de Gallo',"Favor revisar hojas afectadas bandola 2.","warning");
                    this.actualizarActual(i);
                    this.ncplanta = i + 1;
                    return;
                }
            }

            if(this.valid_ojodegallo==false){
                this.$swal('Evaluación Ojo de Gallo',"Favor revisar la información ingresada.","warning");
                this.btndisabled=false;
                return;
            }

            if(this.tipocalculo==0)
            {
                if(this.nbandolas==1) {
                    for(i=0;i<this.muestreo_seleccionado.length;i++)
                    {
                        this.muestreo_seleccionado[i].nplanta = parseInt(this.muestreo_seleccionado[i].nplanta);
                        this.muestreo_seleccionado[i].nhojas_b1 = parseInt(this.muestreo_seleccionado[i].nhojas_b1);
                        this.muestreo_seleccionado[i].nhojasafectadas_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_b1);
                        
                        nhojasTotales += this.muestreo_seleccionado[i].nhojas_b1;

                        if(Number.isNaN(nhojasTotales) || nhojasTotales==0)
                        {
                            this.$swal('Evaluación Ojo de Gallo',"Favor revisar la información ingresada.","warning");
                            this.btndisabled = false;
                            return;
                        }

                        nhojasAfectadasTotales += this.muestreo_seleccionado[i].nhojasafectadas_b1;
                        if(this.muestreo_seleccionado[i].nhojasafectadas_b1>0) chojasAfectadas+=1;
                        detalle.push({'detalleEvaluacionPlanta': this.muestreo_seleccionado[i].nplanta,
                                    'detalleEvaluacionHojasTotales':this.muestreo_seleccionado[i].nhojas_b1,
                                    'detalleEvaluacionHojasAfectadas':this.muestreo_seleccionado[i].nhojasafectadas_b1,
                                    'detalleEvaluacionHojasAfectadas0':null,
                                    'detalleEvaluacionHojasAfectadas1':null,
                                    'detalleEvaluacionHojasAfectadas2':null,
                                    'detalleEvaluacionHojasAfectadas7':null,
                                    'detalleEvaluacionHojasAfectadas20':null,
                                    'detalleEvaluacionHojasAfectadas45':null,
                                    'detalleEvaluacionHojasAfectadas70':null,
                                    'detalleEvaluacionBandola':1,
                                    'detalleEvaluacionServeridadPlanta':null
                                    });
                    }
                    var promedioHojas = nhojasTotales / this.nplantas;
                    var promedioAfectadas = 0;
                        
                    if(chojasAfectadas > 0)
                        promedioAfectadas = nhojasAfectadasTotales / this.nplantas;

                    incidencia = ((promedioAfectadas / promedioHojas) * 100).toFixed(0);
                    /*console.log("promedioHojas: " + promedioHojas);
                    console.log("promedioAfectadas: " + promedioAfectadas);
                    console.log("incidencia: " + incidencia);
                    console.log("conteo de hojas: " + chojasAfectadas);*/            
                }
                else
                {
                    for(i=0;i<this.muestreo_seleccionado.length;i++)
                    {
                        this.muestreo_seleccionado[i].nplanta = parseInt(this.muestreo_seleccionado[i].nplanta);
                        this.muestreo_seleccionado[i].nhojas_b1 = parseInt(this.muestreo_seleccionado[i].nhojas_b1);
                        this.muestreo_seleccionado[i].nhojasafectadas_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_b1);
                        this.muestreo_seleccionado[i].nhojas_b2 = parseInt(this.muestreo_seleccionado[i].nhojas_b2);
                        this.muestreo_seleccionado[i].nhojasafectadas_b2 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_b2);

                        nhojasTotales += this.muestreo_seleccionado[i].nhojas_b1 + this.muestreo_seleccionado[i].nhojas_b2;
                        nhojasAfectadasTotales += this.muestreo_seleccionado[i].nhojasafectadas_b1 + this.muestreo_seleccionado[i].nhojasafectadas_b2;
                        if(this.muestreo_seleccionado[i].nhojasafectadas_b1 > 0 || 
                        this.muestreo_seleccionado[i].nhojasafectadas_b2 > 0)
                        {
                            chojasAfectadas+=1;
                        }
                        detalle.push({'detalleEvaluacionPlanta': this.muestreo_seleccionado[i].nplanta,
                                    'detalleEvaluacionHojasTotales':this.muestreo_seleccionado[i].nhojas_b1,
                                    'detalleEvaluacionHojasAfectadas':this.muestreo_seleccionado[i].nhojasafectadas_b1,
                                    'detalleEvaluacionHojasAfectadas0':null,
                                    'detalleEvaluacionHojasAfectadas1':null,
                                    'detalleEvaluacionHojasAfectadas2':null,
                                    'detalleEvaluacionHojasAfectadas7':null,
                                    'detalleEvaluacionHojasAfectadas20':null,
                                    'detalleEvaluacionHojasAfectadas45':null,
                                    'detalleEvaluacionHojasAfectadas70':null,
                                    'detalleEvaluacionBandola':1,
                                    'detalleEvaluacionServeridadPlanta':null
                                    });
                        detalle.push({'detalleEvaluacionPlanta': this.muestreo_seleccionado[i].nplanta,
                                    'detalleEvaluacionHojasTotales':this.muestreo_seleccionado[i].nhojas_b2,
                                    'detalleEvaluacionHojasAfectadas':this.muestreo_seleccionado[i].nhojasafectadas_b2,
                                    'detalleEvaluacionHojasAfectadas0':null,
                                    'detalleEvaluacionHojasAfectadas1':null,
                                    'detalleEvaluacionHojasAfectadas2':null,
                                    'detalleEvaluacionHojasAfectadas7':null,
                                    'detalleEvaluacionHojasAfectadas20':null,
                                    'detalleEvaluacionHojasAfectadas45':null,
                                    'detalleEvaluacionHojasAfectadas70':null,
                                    'detalleEvaluacionBandola':2,
                                    'detalleEvaluacionServeridadPlanta':null
                                    });
                    }
                    var promedioHojas = nhojasTotales / this.nplantas;
                    var promedioAfectadas = 0;
                        
                        if(chojasAfectadas > 0)
                            promedioAfectadas = nhojasAfectadasTotales / this.nplantas;
                    incidencia = ((promedioAfectadas / promedioHojas) * 100).toFixed(0); 
                }
            }
            else
            {
                if(this.nbandolas==1) {
                    for(i=0;i<this.muestreo_seleccionado.length;i++)
                    {
                        this.muestreo_seleccionado[i].nplanta = parseInt(this.muestreo_seleccionado[i].nplanta);
                        this.muestreo_seleccionado[i].nhojas_b1 = parseInt(this.muestreo_seleccionado[i].nhojas_b1);
                        this.muestreo_seleccionado[i].nhojasafectadas_0_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_0_b1),
                        this.muestreo_seleccionado[i].nhojasafectadas_1_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_1_b1);
                        this.muestreo_seleccionado[i].nhojasafectadas_2_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_2_b1);
                        this.muestreo_seleccionado[i].nhojasafectadas_7_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_7_b1);
                        this.muestreo_seleccionado[i].nhojasafectadas_20_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_20_b1);
                        this.muestreo_seleccionado[i].nhojasafectadas_45_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_45_b1);
                        this.muestreo_seleccionado[i].nhojasafectadas_70_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_70_b1);
                        
                        nhojasTotales += this.muestreo_seleccionado[i].nhojas_b1;
                        
                        if(Number.isNaN(nhojasTotales) || nhojasTotales==0)
                        {
                            this.$swal('Evaluación Roya',"Favor revisar la información ingresada.","warning");
                            this.btndisabled = false;
                            return;
                        }

                        var nhojasAfectadasPlanta = this.muestreo_seleccionado[i].nhojasafectadas_1_b1 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_2_b1 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_7_b1 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_20_b1 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_45_b1 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_70_b1;
                        nhojasAfectadasTotales += nhojasAfectadasPlanta;
                        
                        if(this.muestreo_seleccionado[i].nhojasafectadas_1_b1 > 0 || 
                        this.muestreo_seleccionado[i].nhojasafectadas_2_b1 > 0 ||
                        this.muestreo_seleccionado[i].nhojasafectadas_7_b1 > 0 ||
                        this.muestreo_seleccionado[i].nhojasafectadas_20_b1 > 0 ||
                        this.muestreo_seleccionado[i].nhojasafectadas_45_b1 > 0 ||
                        this.muestreo_seleccionado[i].nhojasafectadas_70_b1 > 0)
                        {
                            chojasAfectadas+=1;
                        }

                        severidad = ((this.muestreo_seleccionado[i].nhojasafectadas_1_b1 * 1 +
                                    this.muestreo_seleccionado[i].nhojasafectadas_2_b1 * 2 +
                                    this.muestreo_seleccionado[i].nhojasafectadas_7_b1  * 3 +
                                    this.muestreo_seleccionado[i].nhojasafectadas_20_b1 * 4 +
                                    this.muestreo_seleccionado[i].nhojasafectadas_45_b1 * 5 +
                                    this.muestreo_seleccionado[i].nhojasafectadas_70_b1 * 6) / (this.muestreo_seleccionado[i].nhojas_b1 * 6)) / 100;
                        
                        severidadTotal += severidad;

                        detalle.push({'detalleEvaluacionPlanta': this.muestreo_seleccionado[i].nplanta,
                                        'detalleEvaluacionHojasTotales':this.muestreo_seleccionado[i].nhojas_b1,
                                        'detalleEvaluacionHojasAfectadas':nhojasAfectadasPlanta,
                                        'detalleEvaluacionHojasAfectadas0':this.muestreo_seleccionado[i].nhojasafectadas_0_b1,
                                        'detalleEvaluacionHojasAfectadas1':this.muestreo_seleccionado[i].nhojasafectadas_1_b1,
                                        'detalleEvaluacionHojasAfectadas2':this.muestreo_seleccionado[i].nhojasafectadas_2_b1,
                                        'detalleEvaluacionHojasAfectadas7':this.muestreo_seleccionado[i].nhojasafectadas_7_b1,
                                        'detalleEvaluacionHojasAfectadas20':this.muestreo_seleccionado[i].nhojasafectadas_20_b1,
                                        'detalleEvaluacionHojasAfectadas45':this.muestreo_seleccionado[i].nhojasafectadas_45_b1,
                                        'detalleEvaluacionHojasAfectadas70':this.muestreo_seleccionado[i].nhojasafectadas_70_b1,
                                        'detalleEvaluacionBandola':1,
                                        'detalleEvaluacionServeridadPlanta':severidad
                                        });
                    }
                    var promedioHojas = nhojasTotales / this.nplantas;
                    var promedioAfectadas = 0;
                        
                        if(chojasAfectadas > 0)
                            promedioAfectadas = nhojasAfectadasTotales / this.nplantas;
                    incidencia = ((promedioAfectadas / promedioHojas) * 100).toFixed(0);
                }
                else
                {
                    for(i=0;i<this.muestreo_seleccionado.length;i++)
                    {
                        this.muestreo_seleccionado[i].nplanta = parseInt(this.muestreo_seleccionado[i].nplanta);
                        this.muestreo_seleccionado[i].nhojas_b1 = parseInt(this.muestreo_seleccionado[i].nhojas_b1);
                        this.muestreo_seleccionado[i].nhojasafectadas_0_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_0_b1),
                        this.muestreo_seleccionado[i].nhojasafectadas_1_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_1_b1);
                        this.muestreo_seleccionado[i].nhojasafectadas_2_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_2_b1);
                        this.muestreo_seleccionado[i].nhojasafectadas_7_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_7_b1);
                        this.muestreo_seleccionado[i].nhojasafectadas_20_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_20_b1);
                        this.muestreo_seleccionado[i].nhojasafectadas_45_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_45_b1);
                        this.muestreo_seleccionado[i].nhojasafectadas_70_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_70_b1);
                        this.muestreo_seleccionado[i].nhojasafectadas_0_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_0_b2),
                        this.muestreo_seleccionado[i].nhojasafectadas_1_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_1_b2);
                        this.muestreo_seleccionado[i].nhojasafectadas_2_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_2_b2);
                        this.muestreo_seleccionado[i].nhojasafectadas_7_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_7_b2);
                        this.muestreo_seleccionado[i].nhojasafectadas_20_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_20_b2);
                        this.muestreo_seleccionado[i].nhojasafectadas_45_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_45_b2);
                        this.muestreo_seleccionado[i].nhojasafectadas_70_b1 = parseInt(this.muestreo_seleccionado[i].nhojasafectadas_70_b2);
                        
                        nhojasTotales += this.muestreo_seleccionado[i].nhojas_b1 + this.muestreo_seleccionado[i].nhojas_b2;
                        
                        if(Number.isNaN(nhojasTotales) || nhojasTotales==0)
                        {
                            this.$swal('Evaluación Ojo de Gallo',"Favor revisar la información ingresada.","warning");
                            this.btndisabled = false;
                            return;
                        }

                        var nhojasAfectadasPlanta = this.muestreo_seleccionado[i].nhojasafectadas_1_b1 + this.muestreo_seleccionado[i].nhojasafectadas_1_b2 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_2_b1 + this.muestreo_seleccionado[i].nhojasafectadas_2_b2 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_7_b1 + this.muestreo_seleccionado[i].nhojasafectadas_7_b2 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_20_b1 + this.muestreo_seleccionado[i].nhojasafectadas_20_b2 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_45_b1 + this.muestreo_seleccionado[i].nhojasafectadas_45_b2 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_70_b1 + this.muestreo_seleccionado[i].nhojasafectadas_70_b2;
                        var hojasAfectadas_b1 = this.muestreo_seleccionado[i].nhojasafectadas_1_b1 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_2_b1 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_7_b1 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_20_b1 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_45_b1 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_70_b1;
                        var hojasAfectadas_b2 = this.muestreo_seleccionado[i].nhojasafectadas_1_b2 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_2_b2 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_7_b2 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_20_b2 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_45_b2 +
                                                this.muestreo_seleccionado[i].nhojasafectadas_70_b2;
                        nhojasAfectadasTotales += nhojasAfectadasPlanta;
                        if(this.muestreo_seleccionado[i].nhojasafectadas_1_b1 > 0 || this.muestreo_seleccionado[i].nhojasafectadas_1_b2 > 0 ||
                        this.muestreo_seleccionado[i].nhojasafectadas_2_b1 > 0 || this.muestreo_seleccionado[i].nhojasafectadas_2_b2 > 0 ||
                        this.muestreo_seleccionado[i].nhojasafectadas_7_b1 > 0 || this.muestreo_seleccionado[i].nhojasafectadas_7_b2 > 0 ||
                        this.muestreo_seleccionado[i].nhojasafectadas_20_b1 > 0 || this.muestreo_seleccionado[i].nhojasafectadas_20_b2 > 0 ||
                        this.muestreo_seleccionado[i].nhojasafectadas_45_b1 > 0 || this.muestreo_seleccionado[i].nhojasafectadas_45_b2 > 0 ||
                        this.muestreo_seleccionado[i].nhojasafectadas_70_b1 > 0 || this.muestreo_seleccionado[i].nhojasafectadas_70_b2 > 0)
                        {
                            chojasAfectadas+=1;
                        }

                        severidad = (((this.muestreo_seleccionado[i].nhojasafectadas_1_b1 + this.muestreo_seleccionado[i].nhojasafectadas_1_b2) * 1 +
                                    (this.muestreo_seleccionado[i].nhojasafectadas_2_b1 + this.muestreo_seleccionado[i].nhojasafectadas_2_b2) * 2 +
                                    (this.muestreo_seleccionado[i].nhojasafectadas_7_b1 + this.muestreo_seleccionado[i].nhojasafectadas_7_b2) * 3 +
                                    (this.muestreo_seleccionado[i].nhojasafectadas_20_b1 + this.muestreo_seleccionado[i].nhojasafectadas_20_b2) * 4 +
                                    (this.muestreo_seleccionado[i].nhojasafectadas_45_b1 + this.muestreo_seleccionado[i].nhojasafectadas_45_b2) * 5 +
                                    (this.muestreo_seleccionado[i].nhojasafectadas_70_b1 + this.muestreo_seleccionado[i].nhojasafectadas_70_b2) * 6) / ((this.muestreo_seleccionado[i].nhojas_b1 + this.muestreo_seleccionado[i].nhojas_b2) * 6)) / 100;
                        severidadTotal += severidad;
                        detalle.push({'detalleEvaluacionPlanta': this.muestreo_seleccionado[i].nplanta,
                                        'detalleEvaluacionHojasTotales':this.muestreo_seleccionado[i].nhojas_b1,
                                        'detalleEvaluacionHojasAfectadas':hojasAfectadas_b1,
                                        'detalleEvaluacionHojasAfectadas0':this.muestreo_seleccionado[i].nhojasafectadas_0_b1,
                                        'detalleEvaluacionHojasAfectadas1':this.muestreo_seleccionado[i].nhojasafectadas_1_b1,
                                        'detalleEvaluacionHojasAfectadas2':this.muestreo_seleccionado[i].nhojasafectadas_2_b1,
                                        'detalleEvaluacionHojasAfectadas7':this.muestreo_seleccionado[i].nhojasafectadas_7_b1,
                                        'detalleEvaluacionHojasAfectadas20':this.muestreo_seleccionado[i].nhojasafectadas_20_b1,
                                        'detalleEvaluacionHojasAfectadas45':this.muestreo_seleccionado[i].nhojasafectadas_45_b1,
                                        'detalleEvaluacionHojasAfectadas70':this.muestreo_seleccionado[i].nhojasafectadas_70_b1,
                                        'detalleEvaluacionBandola':1,
                                        'detalleEvaluacionServeridadPlanta':severidad
                                        });
                        detalle.push({'detalleEvaluacionPlanta': this.muestreo_seleccionado[i].nplanta,
                                        'detalleEvaluacionHojasTotales': this.muestreo_seleccionado[i].nhojas_b2,
                                        'detalleEvaluacionHojasAfectadas':hojasAfectadas_b2,
                                        'detalleEvaluacionHojasAfectadas0':this.muestreo_seleccionado[i].nhojasafectadas_0_b2,
                                        'detalleEvaluacionHojasAfectadas1':this.muestreo_seleccionado[i].nhojasafectadas_1_b2,
                                        'detalleEvaluacionHojasAfectadas2':this.muestreo_seleccionado[i].nhojasafectadas_2_b2,
                                        'detalleEvaluacionHojasAfectadas7':this.muestreo_seleccionado[i].nhojasafectadas_7_b2,
                                        'detalleEvaluacionHojasAfectadas20':this.muestreo_seleccionado[i].nhojasafectadas_20_b2,
                                        'detalleEvaluacionHojasAfectadas45':this.muestreo_seleccionado[i].nhojasafectadas_45_b2,
                                        'detalleEvaluacionHojasAfectadas70':this.muestreo_seleccionado[i].nhojasafectadas_70_b2,
                                        'detalleEvaluacionBandola':2,
                                        'detalleEvaluacionServeridadPlanta':severidad
                                        });
                    }
                    var promedioHojas = nhojasTotales / this.nplantas;
                    var promedioAfectadas = 0;
                        
                        if(chojasAfectadas > 0)
                            promedioAfectadas = nhojasAfectadasTotales / this.nplantas;
                    incidencia = ((promedioAfectadas / promedioHojas) * 100).toFixed(0);
                }
            }
            //console.log("incidencia: " + incidencia);
            var recomendacion = null;
            (async ()=>{
                let query = nSQL("recomendaciones").query("select")
                .where([['recomendacionTipo','=','Gallo'],
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
                var recomendacion = recomendaciones[0];
                //console.log(recomendacion);
                var evaluacionGallo = { 'evaluacionCodigo' : 0,
                                    'evaluacionTipo' : this.tipocalculo,
                                    'evaluacionFecha' : moment().subtract(6,'hour').format(),
                                    'evaluacionBandolas' : this.nbandolas,
                                    'evaluacionIncidencia': incidencia,
                                    'recomendacionCodigo': recomendacion.recomendacionCodigo,
                                    'loteCodigo':this.lote.loteCodigo,
                                    'loteCodigoL':this.lote.loteCodigoL,
                                    'evaluacionSeveridad':severidadTotal,
                                    'recomendacionDescripcion':recomendacion.recomendacionText,
                                    'etapaFenologia':this.fenologia
                                    };
            
                nSQL("evaluacionOjoDeGallo").query("upsert",evaluacionGallo)
                .exec().then(()=>{
                    nSQL("evaluacionOjoDeGallo").query("select",["MAX(evaluacionCodigoL) as evaluacionCodigoL"])
                    .exec().then((rows)=>{
                        //Detalle
                        var evaluacionCodigoL = rows[0].evaluacionCodigoL;
                        var j = 0;
                        for(j=0;j<detalle.length;j++)
                        {
                            var pk = evaluacionCodigoL + "," + detalle[j].detalleEvaluacionPlanta + "," + detalle[j].detalleEvaluacionBandola;
                            detalle[j].evaluacionPK = pk;
                            detalle[j].evaluacionCodigo = 0;
                            detalle[j].evaluacionCodigoL = evaluacionCodigoL;
                        }
                        nSQL("detalleEvaluacionOjoDeGallo").query("upsert",detalle)
                        .exec().then(()=>{
                            var mensaje = "Fecha: " + moment().format().substring(0,10) + "\n";
                            mensaje += "Incidencia: " + incidencia + "";
                            this.$swal('Evaluación registrada',mensaje,"success");
                            try
                            {
                                _CoffeeCloud.enviarDatosAlServidor();
                            }
                            catch(Ex)
                            {
                                //console.log(Ex);
                            }
                            this.$router.push({name:'Lotes',params:{id:this.lote.fincaCodigoL,ilote:this.lote,view:'ojodegallo'}});
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
      if (this.tipocalculo == 0) {
        if (this.nbandolas == "1") {
          this.nplantas = 50;
          if (this.muestreo_1bandolas_basico == null) {
            this.muestreo_1bandolas_basico = [];
            for (var i = 0; i < this.nplantas; i++) {
              this.muestreo_1bandolas_basico.push({
                nplanta: i + 1,
                nhojas_b1: null,
                nhojasafectadas_b1: null
              });
            }
          }
          this.muestreo_seleccionado = this.muestreo_1bandolas_basico;
        } else {
          this.nplantas = 30;
          if (this.muestreo_2bandolas_basico == null) {
            this.muestreo_2bandolas_basico = [];
            for (var i = 0; i < this.nplantas; i++) {
              this.muestreo_2bandolas_basico.push({
                nplanta: i + 1,
                nhojas_b1: null,
                nhojasafectadas_b1: null,
                nhojas_b2: null,
                nhojasafectadas_b2: null
              });
            }
          }
          this.muestreo_seleccionado = this.muestreo_2bandolas_basico;
        }
      } else {
        if (this.nbandolas == "1") {
          this.nplantas = 50;
          if (this.muestreo_1bandolas_avanzado == null) {
            this.muestreo_1bandolas_avanzado = [];
            for (var i = 0; i < this.nplantas; i++) {
              this.muestreo_1bandolas_avanzado.push({
                nplanta: i + 1,
                nhojas_b1: 1,
                nhojasafectadas_0_b1: 0,
                nhojasafectadas_1_b1: 0,
                nhojasafectadas_2_b1: 0,
                nhojasafectadas_7_b1: 0,
                nhojasafectadas_20_b1: 0,
                nhojasafectadas_45_b1: 0,
                nhojasafectadas_70_b1: 0
              });
            }
          }
          this.muestreo_seleccionado = this.muestreo_1bandolas_avanzado;
        } else {
          this.nplantas = 30;
          if (this.muestreo_2bandolas_avanzado == null) {
            this.muestreo_2bandolas_avanzado = [];
            for (var i = 0; i < this.nplantas; i++) {
              this.muestreo_2bandolas_avanzado.push({
                nplanta: i + 1,
                nhojas_b1: 1,
                nhojasafectadas_0_b1: 0,
                nhojasafectadas_1_b1: 0,
                nhojasafectadas_2_b1: 0,
                nhojasafectadas_7_b1: 0,
                nhojasafectadas_20_b1: 0,
                nhojasafectadas_45_b1: 0,
                nhojasafectadas_70_b1: 0,
                nhojas_b2: 1,
                nhojasafectadas_0_b2: 0,
                nhojasafectadas_1_b2: 0,
                nhojasafectadas_2_b2: 0,
                nhojasafectadas_7_b2: 0,
                nhojasafectadas_20_b2: 0,
                nhojasafectadas_45_b2: 0,
                nhojasafectadas_70_b2: 0
              });
            }
          }
          this.muestreo_seleccionado = this.muestreo_2bandolas_avanzado;
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
            
            document.addEventListener("backbutton",handleBackbutton, false);
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
                            context.$router.push({name:'Lotes',params:{id:this.lote.fincaCodigoL,ilote:this.lote,view:'ojodegallo'}});
                            return true;
                        } else {
                            return false;
                        }
                });
                return false;
            }
</script>