<template>
        <div>
        <v-card
            color="#008869"
            dark style="margin:8px;padding:4px;">
            <v-card-title class="title" style="padding:4px;"><v-icon style="padding:10px;">fab fa-pagelines</v-icon>&nbsp; Muestreo Avanzado de Roya</v-card-title>
            <v-card-subtitle align="center" style="padding:8px;">{{ lote.loteNombre }}</v-card-subtitle>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text small v-on:click="$router.push({name:'Lotes',params:{id:lote.fincaCodigoL,ilote:lote,view:'roya'}})">Cancelar</v-btn>
                <v-btn text small v-on:click="saveRoya" v-bind:disabled="btndisabled && (cnplanta!=30)">Calcular</v-btn>
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
        <v-form v-model="valid_roya" style="padding:5px;">
                <v-card tile color="#fff" light style="border-color:#008869;border-style:solid;border-width:1px;">
                <v-card-text>
                    <v-row>
                      <v-col sm="6" class="text-center">
                          <h3>Plantas a evaluar: </h3>
                      </v-col>
                      <v-col sm="6"><h2> {{ nplantas }}</h2></v-col>    
                    </v-row>
                    <center><h3>Planta {{ cnplanta }} bandola {{ ibandola }}</h3></center>
                    <v-row style="margin-top:10px; height:75px;">
                                <v-col sm="6">
                                    <div class="group"> 
                                        <input
                                        id="hojasTotales"
                                        label="Hojas totales"
                                        v-model="cp_hojas_totales"
                                        v-lazy-input:debounce="500"
                                        color="blue-grey darken-4"
                                        type="number"
                                        v-mask="'###'"
                                        ref="hojasTotales"
                                        v-on:keyup="validateHT"
                                        class="inputhtml2"
                                        style="width:100%;"
                                        />
                                        <span class="highlight"></span>
                                        <label class="inputlabel2">Hojas totales</label>
                                    </div>
                                </v-col>
                                <v-col sm="6">
                                    <label>Hojas Ingresadas: {{ cp_hojas_registradas }}</label>
                                </v-col>
                    </v-row>
                    <v-row>
                        <v-col sm="12" align="center">
                            <span id="valPlanta1" style="color:red;"></span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-btn 
                            v-on:click="plantaAnterior()"
                            color="warning" v-bind:disabled="cp_hojas_registradas!=cp_hojas_totales">Anterior</v-btn>
                            <v-spacer></v-spacer>
                        <v-btn 
                            v-on:click="plantaSiguiente()"
                            color="warning" v-bind:disabled="cp_hojas_registradas!=cp_hojas_totales">Siguiente</v-btn>  
                    </v-row>
                    <div style="background-color:#fff; height:340px; overflow:auto; margin-top:3px;">
                        <v-row style="margin-top:10px;margin-left:2px;margin-right:2px; border-style:solid;border-width:1px;border-radius:5px;">
                            <v-col sm="6" style="text-align:center;">
                                <img src="../assets/0.75x/0@0.75x.png" style="max-width:90px; margin:auto;" />
                            </v-col>
                            <v-col sm="6" style="display: flex; justify-content: center;align-items: center;">
                                <div class="group"> 
                                        <input
                                        id="hojasClase0"
                                        label="Clase 0 (Sev. 0%)"
                                        v-model="cp_hojas_clase_0"
                                        v-lazy-input:debounce="500"
                                        color="blue-grey darken-4"
                                        type="number"
                                        v-mask="'###'"
                                        ref="hojasClase0"
                                        v-on:keyup="validateHC0"
                                        class="inputhtml2"
                                        style="width:100%;"
                                        />
                                        <span class="highlight"></span>
                                        <label class="inputlabel2">Clase 0 (Sev. 0%)</label>
                                    </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" align="center">
                                <span id="valClase0" style="color:red;"></span>
                            </v-col>
                        </v-row>
                        <v-row style="margin-top:10px;margin-left:2px;margin-right:2px; border-style:solid;border-width:1px;border-radius:5px;">
                            <v-col sm="6" style="text-align:center;">
                                <img src="../assets/0.75x/1@0.75x.png" style="max-width:90px; margin:auto;" />
                            </v-col>
                            <v-col sm="6" style="display: flex; justify-content: center;align-items: center;">
                                <div class="group"> 
                                        <input
                                        id="hojasClase1"
                                        label="Hojas totales"
                                        v-model="cp_hojas_clase_1"
                                        v-lazy-input:debounce="500"
                                        color="blue-grey darken-4"
                                        type="number"
                                        v-mask="'###'"
                                        ref="hojasClase1"
                                        v-on:keyup="validateHC1"
                                        class="inputhtml2"
                                        style="width:100%;"
                                        />
                                        <span class="highlight"></span>
                                        <label class="inputlabel2" style="font-size:8pt;">Clase 1 Puntos Cloróticos</label>
                                    </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" align="center">
                                <span id="valClase1" style="color:red;"></span>
                            </v-col>
                        </v-row>
                        <v-row style="margin-top:10px;margin-left:2px;margin-right:2px; border-style:solid;border-width:1px;border-radius:5px;">
                            <v-col sm="6" style="text-align:center;">
                                <img src="../assets/0.75x/2@0.75x.png" style="max-width:90px; margin:auto;" />
                            </v-col>
                            <v-col sm="6" style="display: flex; justify-content: center;align-items: center;">
                                <div class="group"> 
                                        <input
                                        id="hojasClase2"
                                        label="Hojas totales"
                                        v-model="cp_hojas_clase_2"
                                        v-lazy-input:debounce="500"
                                        color="blue-grey darken-4"
                                        type="number"
                                        v-mask="'###'"
                                        ref="hojasClase2"
                                        v-on:keyup="validateHC2"
                                        class="inputhtml2"
                                        style="width:100%;"
                                        />
                                        <span class="highlight"></span>
                                        <label class="inputlabel2">Clase 2 (Sev. 2%)</label>
                                    </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" align="center">
                                <span id="valClase2" style="color:red;"></span>
                            </v-col>
                        </v-row>
                        <v-row style="margin-top:10px;margin-left:2px;margin-right:2px; border-style:solid;border-width:1px;border-radius:5px;">
                            <v-col sm="6" style="text-align:center;">
                                <img src="../assets/0.75x/3@0.75x.png" style="max-width:90px; margin:auto;" />
                            </v-col>
                            <v-col sm="6" style="display: flex; justify-content: center;align-items: center;">
                                <div class="group"> 
                                        <input
                                        id="hojasClase3"
                                        label="Hojas totales"
                                        v-model="cp_hojas_clase_3"
                                        v-lazy-input:debounce="500"
                                        color="blue-grey darken-4"
                                        type="number"
                                        v-mask="'###'"
                                        ref="hojasClase3"
                                        v-on:keyup="validateHC3"
                                        class="inputhtml2"
                                        style="width:100%;"
                                        />
                                        <span class="highlight"></span>
                                        <label class="inputlabel2">Clase 3 (Sev. 7%)</label>
                                    </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" align="center">
                                <span id="valClase3" style="color:red;"></span>
                            </v-col>
                        </v-row>
                        <v-row style="margin-top:10px;margin-left:2px;margin-right:2px; border-style:solid;border-width:1px;border-radius:5px;">
                            <v-col sm="6" style="text-align:center;">
                                <img src="../assets/0.75x/4@0.75x.png" style="max-width:90px; margin:auto;" />
                            </v-col>
                            <v-col sm="6" style="display: flex; justify-content: center;align-items: center;">
                                <div class="group"> 
                                        <input
                                        id="hojasClase4"
                                        label="Hojas totales"
                                        v-model="cp_hojas_clase_4"
                                        v-lazy-input:debounce="500"
                                        color="blue-grey darken-4"
                                        type="number"
                                        v-mask="'###'"
                                        ref="hojasClase4"
                                        v-on:keyup="validateHC4"
                                        class="inputhtml2"
                                        style="width:100%;"
                                        />
                                        <span class="highlight"></span>
                                        <label class="inputlabel2">Clase 4 (Sev. 20%)</label>
                                    </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" align="center">
                                <span id="valClase4" style="color:red;"></span>
                            </v-col>
                        </v-row>
                        <v-row style="margin-top:10px;margin-left:2px;margin-right:2px; border-style:solid;border-width:1px;border-radius:5px;">
                            <v-col sm="6" style="text-align:center;">
                                <img src="../assets/0.75x/5@0.75x.png" style="max-width:90px; margin:auto;" />
                            </v-col>
                            <v-col sm="6" style="display: flex; justify-content: center;align-items: center;">
                                <div class="group"> 
                                        <input
                                        id="hojasClase5"
                                        label="Hojas totales"
                                        v-model="cp_hojas_clase_5"
                                        v-lazy-input:debounce="500"
                                        color="blue-grey darken-4"
                                        type="number"
                                        v-mask="'###'"
                                        ref="hojasClase5"
                                        v-on:keyup="validateHC5"
                                        class="inputhtml2"
                                        style="width:100%;"
                                        />
                                        <span class="highlight"></span>
                                        <label class="inputlabel2">Clase 5 (Sev. 45%)</label>
                                    </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" align="center">
                                <span id="valClase5" style="color:red;"></span>
                            </v-col>
                        </v-row>
                        <v-row style="margin-top:10px;margin-left:2px;margin-right:2px; border-style:solid;border-width:1px;border-radius:5px;">
                            <v-col sm="6" style="text-align:center;">
                                <img src="../assets/0.75x/6@0.75x.png" style="max-width:90px; margin:auto;" />
                            </v-col>
                            <v-col sm="6" style="display: flex; justify-content: center;align-items: center;">
                                <div class="group"> 
                                        <input
                                        id="hojasClase6"
                                        label="Hojas totales"
                                        v-model="cp_hojas_clase_6"
                                        v-lazy-input:debounce="500"
                                        color="blue-grey darken-4"
                                        type="number"
                                        v-mask="'###'"
                                        ref="hojasClase6"
                                        v-on:keyup="validateHC6"
                                        class="inputhtml2"
                                        style="width:100%;"
                                        />
                                        <span class="highlight"></span>
                                        <label class="inputlabel2">Clase 6 (Sev. >70%)</label>
                                    </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" align="center">
                                <span id="valClase6" style="color:red;"></span>
                            </v-col>
                        </v-row>            
                    </div>
                    </v-card-text>
                </v-card>
        </v-form>
    </div>
</template>
<script>
import { nSQL } from "@nano-sql/core";
import { CoffeeCloud } from "../coffeecloud";
import "../coffeecloud.css";
import axios from "axios";
var moment = require('moment-timezone');
var context = null;
var _CoffeeCloud = new CoffeeCloud();
export default {
  name: "FormRoya",
  components: {},
  props: ["id"],
  data: () => ({
    fenologia: null,
    listFenologia: [{ fenologiaCodigo: 'De la cosecha hasta la floración', fenologiaNombre: 'De la cosecha hasta la floración' },
                    { fenologiaCodigo: 'De la floración hasta la cosecha', fenologiaNombre: 'De la floración hasta la cosecha'},
                    { fenologiaCodigo: 'Durante la cosecha', fenologiaNombre: 'Durante la cosecha'}],
    lote: null,
    btndisabled: true,
    valid_roya: true,
    tipocalculo: 1,
    nbandolasList: [1, 2],
    nbandolas: 2,
    ibandola: 1,
    nplantas: 30,
    muestreo_1bandolas_basico: null,
    muestreo_2bandolas_basico: null,
    muestreo_1bandolas_avanzado: null,
    muestreo_2bandolas_avanzado: null,
    muestreo_seleccionado: null,
    cnplanta: 1,
    cp_hojas_totales: null,
    cp_hojas_clase_0: null,
    cp_hojas_clase_1: null,
    cp_hojas_clase_2: null,
    cp_hojas_clase_3: null,
    cp_hojas_clase_4: null,
    cp_hojas_clase_5: null,
    cp_hojas_clase_6: null
  }),
  computed: {
      cp_hojas_registradas: function() {
          var hojas_registradas = 
          hojas_registradas = this.cp_hojas_clase_0 * 1 + 
                      this.cp_hojas_clase_1 * 1 + 
                      this.cp_hojas_clase_2 * 1 + 
                      this.cp_hojas_clase_3 * 1 +
                      this.cp_hojas_clase_4 * 1 +
                      this.cp_hojas_clase_5 * 1 +
                      this.cp_hojas_clase_6 * 1;
          
          if(hojas_registradas==this.cp_hojas_totales)
          {
              if(this.cp_hojas_clase_0 == "" || this.cp_hojas_clase_0 == null) this.cp_hojas_clase_0 = 0;
              if(this.cp_hojas_clase_1 == "" || this.cp_hojas_clase_1 == null) this.cp_hojas_clase_1 = 0;
              if(this.cp_hojas_clase_2 == "" || this.cp_hojas_clase_2 == null) this.cp_hojas_clase_2 = 0;
              if(this.cp_hojas_clase_3 == "" || this.cp_hojas_clase_3 == null) this.cp_hojas_clase_3 = 0;
              if(this.cp_hojas_clase_4 == "" || this.cp_hojas_clase_4 == null) this.cp_hojas_clase_4 = 0;
              if(this.cp_hojas_clase_5 == "" || this.cp_hojas_clase_5 == null) this.cp_hojas_clase_5 = 0;
              if(this.cp_hojas_clase_6 == "" || this.cp_hojas_clase_6 == null) this.cp_hojas_clase_6 = 0;
          }

          return hojas_registradas;
      }
  },
  watch: {},
  methods: {
    closeDialogRoya: function(){
        //console.log("Close dialog 3");
        this.$emit('closedialogroya','close')
    },
    validateTotalHojasSeveridad: function() {
        var totales = document.getElementById("hojasTotales").value * 1;
        var clase0 = document.getElementById("hojasClase0").value * 1;
        var clase1 = document.getElementById("hojasClase1").value * 1;
        var clase2 = document.getElementById("hojasClase2").value * 1;
        var clase3 = document.getElementById("hojasClase3").value * 1;
        var clase4 = document.getElementById("hojasClase4").value * 1;
        var clase5 = document.getElementById("hojasClase5").value * 1;
        var clase6 = document.getElementById("hojasClase6").value * 1;
        var registradas = clase0 + clase1 + clase2 + clase3 + clase4 + clase5 + clase6;
        
        if(registradas>totales)
        {
            document.getElementById("valPlanta1").innerHTML = "El valor de hojas registradas no puede ser mayor al de hojas totales.";
        } else {
            document.getElementById("valPlanta1").innerHTML = "";
        }
        
    },
    validateHT: function() {
        var val = document.getElementById("hojasTotales").value * 1;
        if(val <= 0 || val > 100)
        {
            document.getElementById("valPlanta1").innerHTML = "El valor de hojas totales debe ser mayor que 0 y menor que 100.";
        }
        else
        { 
            document.getElementById("valPlanta1").innerHTML = "";
        }
    },
    validateHC0: function() {
        var val = document.getElementById("hojasClase0").value * 1;
        if(val < 0 || val > 100)
        {
            document.getElementById("valClase0").innerHTML = "El valor de hojas totales debe ser mayor que 0 y menor que 100.";
        }
        else
        { 
            document.getElementById("valClase0").innerHTML = "";
        }
        this.validateTotalHojasSeveridad();
    },
    validateHC1: function() {
        var val = document.getElementById("hojasClase1").value * 1;
        if(val < 0 || val > 100)
        {
            document.getElementById("valClase1").innerHTML = "El valor de hojas totales debe ser mayor que 0 y menor que 100.";
        }
        else
        { 
            document.getElementById("valClase1").innerHTML = "";
        }
        this.validateTotalHojasSeveridad();
    },
    validateHC2: function() {
        var val = document.getElementById("hojasClase2").value * 1;
        if(val < 0 || val > 100)
        {
            document.getElementById("valClase2").innerHTML = "El valor de hojas totales debe ser mayor que 0 y menor que 100.";
        }
        else
        { 
            document.getElementById("valClase2").innerHTML = "";
        }
        this.validateTotalHojasSeveridad();
    },
    validateHC3: function() {
        var val = document.getElementById("hojasClase3").value * 1;
        if(val < 0 || val > 100)
        {
            document.getElementById("valClase3").innerHTML = "El valor de hojas totales debe ser mayor que 0 y menor que 100.";
        }
        else
        { 
            document.getElementById("valClase3").innerHTML = "";
        }
        this.validateTotalHojasSeveridad();
    },
    validateHC4: function() {
        var val = document.getElementById("hojasClase4").value * 1;
        if(val < 0 || val > 100)
        {
            document.getElementById("valClase4").innerHTML = "El valor de hojas totales debe ser mayor que 0 y menor que 100.";
        }
        else
        { 
            document.getElementById("valClase4").innerHTML = "";
        }
        this.validateTotalHojasSeveridad();
    },
    validateHC5: function() {
        var val = document.getElementById("hojasClase5").value * 1;
        if(val < 0 || val > 100)
        {
            document.getElementById("valClase5").innerHTML = "El valor de hojas totales debe ser mayor que 0 y menor que 100.";
        }
        else
        { 
            document.getElementById("valClase5").innerHTML = "";
        }
        this.validateTotalHojasSeveridad();
    },
    validateHC6: function() {
        var val = document.getElementById("hojasClase6").value * 1;
        if(val < 0 || val > 100)
        {
            document.getElementById("valClase6").innerHTML = "El valor de hojas totales debe ser mayor que 0 y menor que 100.";
        }
        else
        { 
            document.getElementById("valClase6").innerHTML = "";
        }
        this.validateTotalHojasSeveridad();
    },
    plantaSiguiente: function() {
        
        if(this.cp_hojas_totales==='' || isNaN(parseFloat(this.cp_hojas_totales)))
        {
            this.$swal('Evaluación Roya','Debe completar las hojas totales bandola ' + this.ibandola,'info');
            this.$refs.hojasTotales.focus();
            return;
        }
        if(this.cp_hojas_totales != this.cp_hojas_registradas){
            this.$swal('Evaluación Roya','Las hojas registradas no coinciden con las hojas totales.','info');
            return;
        }
        if(this.cp_hojas_totales * 1 < 1)
        {
            this.$swal('Evaluación Roya','Las hojas totales bandola ' + this.ibandola + ' debe ser un número mayor que 0.','info');
            this.$refs.hojasTotales.focus();
            return;
        }
        if(this.cp_hojas_totales * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas totales bandola ' + this.ibandola + ' es 100','info');
            this.$refs.hojasTotales.focus();
            return;
        }
        
        if(this.cp_hojas_clase_0==='' || isNaN(parseFloat(this.cp_hojas_clase_0)))
        {
            this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 0.','info');
            this.$refs.hojasClase0.focus();
            return;
        }
        if(this.cp_hojas_clase_0 * 1 < 0)
        {
            this.$swal('Evaluación Roya','El número de hojas en clase 0 no puede ser negativo.','info');
            this.$refs.hojasClase0.focus();
            return;
        }
        if(this.cp_hojas_clase_0 * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
            this.$refs.hojasClase0.focus();
            return;
        }

        if(this.cp_hojas_clase_1==='' || isNaN(parseFloat(this.cp_hojas_clase_1)))
        {
            this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 1.','info');
            this.$refs.hojasClase1.focus();
            return;
        }
        if(this.cp_hojas_clase_1 * 1 < 0)
        {
            this.$swal('Evaluación Roya','El número de hojas en clase 1 no puede ser negativo.','info');
            this.$refs.hojasClase1.focus();
            return;
        }
        if(this.cp_hojas_clase_1 * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
            this.$refs.hojasClase1.focus();
            return;
        }
        
        if(this.cp_hojas_clase_2==='' || isNaN(parseFloat(this.cp_hojas_clase_2)))
        {
            this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 2.','info');
            this.$refs.hojasClase2.focus();
            return;
        }
        if(this.cp_hojas_clase_2 * 1 < 0)
        {
            this.$swal('Evaluación Roya','El número de hojas en clase 2 no puede ser negativo.','info');
            this.$refs.hojasClase2.focus();
            return;
        }
        if(this.cp_hojas_clase_2 * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
            this.$refs.hojasClase0.focus();
            return;
        }

        if(this.cp_hojas_clase_3==='' || isNaN(parseFloat(this.cp_hojas_clase_3)))
        {
            this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 3.','info');
            this.$refs.hojasClase3.focus();
            return;
        }
        if(this.cp_hojas_clase_3 * 1 < 0)
        {
            this.$swal('Evaluación Roya','El número de hojas en clase 3 no puede ser negativo.','info');
            this.$refs.hojasClase3.focus();
            return;
        }
        if(this.cp_hojas_clase_3 * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
            this.$refs.hojasClase3.focus();
            return;
        }

        if(this.cp_hojas_clase_4==='' || isNaN(parseFloat(this.cp_hojas_clase_4)))
        {
            this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 4.','info');
            this.$refs.hojasClase4.focus();
            return;
        }
        if(this.cp_hojas_clase_4 * 1 < 0)
        {
            this.$swal('Evaluación Roya','El número de hojas en clase 4 no puede ser negativo.','info');
            this.$refs.hojasClase4.focus();
            return;
        }
        if(this.cp_hojas_clase_4 * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
            this.$refs.hojasClase4.focus();
            return;
        }

        if(this.cp_hojas_clase_5==='' || isNaN(parseFloat(this.cp_hojas_clase_5)))
        {
            this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 5.','info');
            this.$refs.hojasClase0.focus();
            return;
        }
        if(this.cp_hojas_clase_5 * 1 < 0)
        {
            this.$swal('Evaluación Roya','El número de hojas en clase 5 no puede ser negativo.','info');
            this.$refs.hojasClase5.focus();
            return;
        }
        if(this.cp_hojas_clase_5 * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
            this.$refs.hojasClase5.focus();
            return;
        }

        if(this.cp_hojas_clase_6==='' || isNaN(parseFloat(this.cp_hojas_clase_6)))
        {
            this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 6.','info');
            this.$refs.hojasClase6.focus();
            return;
        }
        if(this.cp_hojas_clase_6 * 1 < 0)
        {
            this.$swal('Evaluación Roya','El número de hojas en clase 6 no puede ser negativo.','info');
            this.$refs.hojasClase0.focus();
            return;
        }
        if(this.cp_hojas_clase_6 * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
            this.$refs.hojasClase6.focus();
            return;
        }

        if(this.ibandola == 2 && this.cnplanta + 1 > 30)
        {
            this.$swal('Evaluación Roya','Ha llegado al fin de la evaluación, presione el botón calcular.','info');
            return;
        }
        
        // ActualizarModelo
        this.actualizarModelo(this.cnplanta-1,this.ibandola)

        if(this.ibandola==1)
        {
            this.ibandola = 2;
            this.actualizarActual(this.cnplanta-1,this.ibandola);
        }
        else 
        {
            // ActualizarActual
            this.ibandola = 1;
            this.actualizarActual(this.cnplanta,this.ibandola);
            this.muestreo_2bandolas_avanzado[this.cnplanta].nplanta = this.cnplanta + 1;
            this.cnplanta++;
        }
    },
    actualizarModelo:  function(iplanta,ibandola) {
        if(ibandola==1)
        {
            this.muestreo_2bandolas_avanzado[iplanta].nplanta = this.cnplanta * 1;
            this.muestreo_2bandolas_avanzado[iplanta].nhojas_b1 = this.cp_hojas_totales * 1;
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_0_b1 = this.cp_hojas_clase_0 * 1,
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_1_b1 = this.cp_hojas_clase_1 * 1,
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_2_b1 = this.cp_hojas_clase_2 * 1;
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_7_b1 = this.cp_hojas_clase_7 * 1;
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_20_b1 = this.cp_hojas_clase_20 * 1;
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_45_b1 = this.cp_hojas_clase_45 * 1;
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_70_b1 = this.cp_hojas_clase_70 * 1;
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_b1 = this.cp_hojas_clase_1 * 1 +
                                                                           this.cp_hojas_clase_2 * 1 +
                                                                           this.cp_hojas_clase_3 * 1 +
                                                                           this.cp_hojas_clase_4 * 1 +
                                                                           this.cp_hojas_clase_5 * 1 +
                                                                           this.cp_hojas_clase_6 * 1;
        }
        else
        {
            this.muestreo_2bandolas_avanzado[iplanta].nplanta = this.cnplanta * 1;
            this.muestreo_2bandolas_avanzado[iplanta].nhojas_b2 = this.cp_hojas_totales * 1;
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_0_b2 = this.cp_hojas_clase_0 * 1,
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_1_b2 = this.cp_hojas_clase_1 * 1,
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_2_b2 = this.cp_hojas_clase_2 * 1;
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_7_b2 = this.cp_hojas_clase_3 * 1;
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_20_b2 = this.cp_hojas_clase_4 * 1;
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_45_b2 = this.cp_hojas_clase_5 * 1;
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_70_b2 = this.cp_hojas_clase_6 * 1;
            this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_b2 = this.cp_hojas_clase_1 * 1 +
                                                                           this.cp_hojas_clase_2 * 1 +
                                                                           this.cp_hojas_clase_3 * 1 +
                                                                           this.cp_hojas_clase_4 * 1 +
                                                                           this.cp_hojas_clase_5 * 1 +
                                                                           this.cp_hojas_clase_6 * 1;
        }
    },
    actualizarActual: function(iplanta,ibandola) {
        if(ibandola==1)
        {
            this.cp_hojas_totales = this.muestreo_2bandolas_avanzado[iplanta].nhojas_b1;
            this.cp_hojas_registradas = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_b1;
            this.cp_hojas_clase_0 = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_0_b1;
            this.cp_hojas_clase_1 = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_1_b1;
            this.cp_hojas_clase_2 = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_2_b1;
            this.cp_hojas_clase_3 = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_7_b1;
            this.cp_hojas_clase_4 = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_20_b1;
            this.cp_hojas_clase_5 = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_45_b1;
            this.cp_hojas_clase_6 = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_70_b1;
        }
        else
        {
            this.cp_hojas_totales = this.muestreo_2bandolas_avanzado[iplanta].nhojas_b2;
            this.cp_hojas_afectadas_b = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_b2;
            this.cp_hojas_clase_0 = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_0_b2;
            this.cp_hojas_clase_1 = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_1_b2;
            this.cp_hojas_clase_2 = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_2_b2;
            this.cp_hojas_clase_3 = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_7_b2;
            this.cp_hojas_clase_4 = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_20_b2;
            this.cp_hojas_clase_5 = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_45_b2;
            this.cp_hojas_clase_6 = this.muestreo_2bandolas_avanzado[iplanta].nhojasafectadas_70_b2;
        }
    },
    plantaAnterior: function() {
        // Validar
        if(this.cp_hojas_totales==='' || isNaN(parseFloat(this.cp_hojas_totales)))
        {
            this.$swal('Evaluación Roya','Debe completar las hojas totales bandola ' + this.ibandola,'info');
            this.$refs.hojasTotales.focus();
            return;
        }
        if(this.cp_hojas_totales * 1 < 1)
        {
            this.$swal('Evaluación Roya','Las hojas totales bandola ' + this.ibandola + ' debe ser un número mayor que 0.','info');
            this.$refs.hojasTotales.focus();
            return;
        }
        if(this.cp_hojas_totales * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas totales bandola ' + this.ibandola + ' es 100','info');
            this.$refs.hojasTotales.focus();
            return;
        }
        
        if(this.cp_hojas_clase_0==='' || isNaN(parseFloat(this.cp_hojas_clase_0)))
        {
            this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 0.','info');
            this.$refs.hojasClase0.focus();
            return;
        }
        if(this.cp_hojas_clase_0 * 1 < 0)
        {
            this.$swal('Evaluación Roya','El número de hojas en clase 0 no puede ser negativo.','info');
            this.$refs.hojasClase0.focus();
            return;
        }
        if(this.cp_hojas_clase_0 * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
            this.$refs.hojasClase0.focus();
            return;
        }

        if(this.cp_hojas_clase_1==='' || isNaN(parseFloat(this.cp_hojas_clase_1)))
        {
            this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 1.','info');
            this.$refs.hojasClase1.focus();
            return;
        }
        if(this.cp_hojas_clase_1 * 1 < 0)
        {
            this.$swal('Evaluación Roya','El número de hojas en clase 1 no puede ser negativo.','info');
            this.$refs.hojasClase1.focus();
            return;
        }
        if(this.cp_hojas_clase_1 * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
            this.$refs.hojasClase1.focus();
            return;
        }
        
        if(this.cp_hojas_clase_2==='' || isNaN(parseFloat(this.cp_hojas_clase_2)))
        {
            this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 2.','info');
            this.$refs.hojasClase2.focus();
            return;
        }
        if(this.cp_hojas_clase_2 * 1 < 0)
        {
            this.$swal('Evaluación Roya','El número de hojas en clase 2 no puede ser negativo.','info');
            this.$refs.hojasClase2.focus();
            return;
        }
        if(this.cp_hojas_clase_2 * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
            this.$refs.hojasClase0.focus();
            return;
        }

        if(this.cp_hojas_clase_3==='' || isNaN(parseFloat(this.cp_hojas_clase_3)))
        {
            this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 3.','info');
            this.$refs.hojasClase3.focus();
            return;
        }
        if(this.cp_hojas_clase_3 * 1 < 0)
        {
            this.$swal('Evaluación Roya','El número de hojas en clase 3 no puede ser negativo.','info');
            this.$refs.hojasClase3.focus();
            return;
        }
        if(this.cp_hojas_clase_3 * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
            this.$refs.hojasClase3.focus();
            return;
        }

        if(this.cp_hojas_clase_4==='' || isNaN(parseFloat(this.cp_hojas_clase_4)))
        {
            this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 4.','info');
            this.$refs.hojasClase4.focus();
            return;
        }
        if(this.cp_hojas_clase_4 * 1 < 0)
        {
            this.$swal('Evaluación Roya','El número de hojas en clase 4 no puede ser negativo.','info');
            this.$refs.hojasClase4.focus();
            return;
        }
        if(this.cp_hojas_clase_4 * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
            this.$refs.hojasClase4.focus();
            return;
        }

        if(this.cp_hojas_clase_5==='' || isNaN(parseFloat(this.cp_hojas_clase_5)))
        {
            this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 5.','info');
            this.$refs.hojasClase0.focus();
            return;
        }
        if(this.cp_hojas_clase_5 * 1 < 0)
        {
            this.$swal('Evaluación Roya','El número de hojas en clase 5 no puede ser negativo.','info');
            this.$refs.hojasClase5.focus();
            return;
        }
        if(this.cp_hojas_clase_5 * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
            this.$refs.hojasClase5.focus();
            return;
        }

        if(this.cp_hojas_clase_6==='' || isNaN(parseFloat(this.cp_hojas_clase_6)))
        {
            this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 6.','info');
            this.$refs.hojasClase6.focus();
            return;
        }
        if(this.cp_hojas_clase_6 * 1 < 0)
        {
            this.$swal('Evaluación Roya','El número de hojas en clase 6 no puede ser negativo.','info');
            this.$refs.hojasClase0.focus();
            return;
        }
        if(this.cp_hojas_clase_6 * 1 > 100)
        {
            this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
            this.$refs.hojasClase6.focus();
            return;
        }

        if(this.ibandola == 2 && this.cnplanta + 1 > 30)
        {
            this.$swal('Evaluación Roya','Ha llegado al fin de la evaluación, presione el botón calcular.','info');
            return;
        }

        if(this.ibandola == 1 && this.cnplanta == 1)
        {
            this.$swal('Evaluación Roya','Se encuentra en la primera planta, bandola 1.','info');
            return;
        }

        // ActualizarModelo
        this.actualizarModelo(this.cnplanta-1,this.ibandola)

        if(this.ibandola==1)
        {
            this.ibandola = 2;
            this.actualizarActual(this.cnplanta-2,this.ibandola);
            this.muestreo_2bandolas_basico[this.cnplanta-2].nplanta = this.cnplanta - 1;
            this.cnplanta--;
        }
        else 
        {
            // ActualizarActual
            this.ibandola = 1;
            this.actualizarActual(this.cnplanta-1,this.ibandola);
        }        
    },
    saveRoya: function() {
        try {
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
            // Validar que se haya llenado la información de la evaluación
            // la validacion se hace contra 30 plantas por ser la unica que 
            // quedo habilitada al final
            if(this.cp_hojas_totales==='' || isNaN(parseFloat(this.cp_hojas_totales)))
            {
                this.$swal('Evaluación Roya','Debe completar las hojas totales bandola ' + this.ibandola,'info');
                this.$refs.hojasTotales.focus();
                return;
            }
            if(this.cp_hojas_totales * 1 < 1)
            {
                this.$swal('Evaluación Roya','Las hojas totales bandola ' + this.ibandola + ' debe ser un número mayor que 0.','info');
                this.$refs.hojasTotales.focus();
                return;
            }
            if(this.cp_hojas_totales * 1 > 100)
            {
                this.$swal('Evaluación Roya','El valor máximo de hojas totales bandola ' + this.ibandola + ' es 100','info');
                this.$refs.hojasTotales.focus();
                return;
            }
        
            if(this.cp_hojas_clase_0==='' || isNaN(parseFloat(this.cp_hojas_clase_0)))
            {
                this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 0.','info');
                this.$refs.hojasClase0.focus();
                return;
            }
            if(this.cp_hojas_clase_0 * 1 < 0)
            {
                this.$swal('Evaluación Roya','El número de hojas en clase 0 no puede ser negativo.','info');
                this.$refs.hojasClase0.focus();
                return;
            }
            if(this.cp_hojas_clase_0 * 1 > 100)
            {
                this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
                this.$refs.hojasClase0.focus();
                return;
            }

            if(this.cp_hojas_clase_1==='' || isNaN(parseFloat(this.cp_hojas_clase_1)))
            {
                this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 1.','info');
                this.$refs.hojasClase1.focus();
                return;
            }
            if(this.cp_hojas_clase_1 * 1 < 0)
            {
                this.$swal('Evaluación Roya','El número de hojas en clase 1 no puede ser negativo.','info');
                this.$refs.hojasClase1.focus();
                return;
            }
            if(this.cp_hojas_clase_1 * 1 > 100)
            {
                this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
                this.$refs.hojasClase1.focus();
                return;
            }
        
            if(this.cp_hojas_clase_2==='' || isNaN(parseFloat(this.cp_hojas_clase_2)))
            {
                this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 2.','info');
                this.$refs.hojasClase2.focus();
                return;
            }
            if(this.cp_hojas_clase_2 * 1 < 0)
            {
                this.$swal('Evaluación Roya','El número de hojas en clase 2 no puede ser negativo.','info');
                this.$refs.hojasClase2.focus();
                return;
            }
            if(this.cp_hojas_clase_2 * 1 > 100)
            {
                this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
                this.$refs.hojasClase0.focus();
                return;
            }

            if(this.cp_hojas_clase_3==='' || isNaN(parseFloat(this.cp_hojas_clase_3)))
            {
                this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 3.','info');
                this.$refs.hojasClase3.focus();
                return;
            }
            if(this.cp_hojas_clase_3 * 1 < 0)
            {
                this.$swal('Evaluación Roya','El número de hojas en clase 3 no puede ser negativo.','info');
                this.$refs.hojasClase3.focus();
                return;
            }
            if(this.cp_hojas_clase_3 * 1 > 100)
            {
                this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
                this.$refs.hojasClase3.focus();
                return;
            }

            if(this.cp_hojas_clase_4==='' || isNaN(parseFloat(this.cp_hojas_clase_4)))
            {
                this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 4.','info');
                this.$refs.hojasClase4.focus();
                return;
            }
            if(this.cp_hojas_clase_4 * 1 < 0)
            {
                this.$swal('Evaluación Roya','El número de hojas en clase 4 no puede ser negativo.','info');
                this.$refs.hojasClase4.focus();
                return;
            }
            if(this.cp_hojas_clase_4 * 1 > 100)
            {
                this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
                this.$refs.hojasClase4.focus();
                return;
            }

            if(this.cp_hojas_clase_5==='' || isNaN(parseFloat(this.cp_hojas_clase_5)))
            {
                this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 5.','info');
                this.$refs.hojasClase0.focus();
                return;
            }
            if(this.cp_hojas_clase_5 * 1 < 0)
            {
                this.$swal('Evaluación Roya','El número de hojas en clase 5 no puede ser negativo.','info');
                this.$refs.hojasClase5.focus();
                return;
            }
            if(this.cp_hojas_clase_5 * 1 > 100)
            {
                this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
                this.$refs.hojasClase5.focus();
                return;
            }

            if(this.cp_hojas_clase_6==='' || isNaN(parseFloat(this.cp_hojas_clase_6)))
            {
                this.$swal('Evaluación Roya','Debe indicar el número de hojas clase 6.','info');
                this.$refs.hojasClase6.focus();
                return;
            }
            if(this.cp_hojas_clase_6 * 1 < 0)
            {
                this.$swal('Evaluación Roya','El número de hojas en clase 6 no puede ser negativo.','info');
                this.$refs.hojasClase0.focus();
                return;
            }
            if(this.cp_hojas_clase_6 * 1 > 100)
            {
                this.$swal('Evaluación Roya','El valor máximo de hojas a registrar es 100','info');
                this.$refs.hojasClase6.focus();
                return;
            }
            
            this.actualizarModelo(this.cnplanta-1,this.ibandola);

            var clear = 0;
            for(i=0;i<this.nplantas;i++)
            {

                if(this.muestreo_2bandolas_avanzado[i].nhojas_b1===null || 
                   this.muestreo_2bandolas_avanzado[i].nhojas_b1==='' ||
                   isNaN(parseFloat(this.muestreo_2bandolas_avanzado[i].nhojas_b1)) ||
                   this.muestreo_2bandolas_avanzado[i].nhojas_b1==0)
                {
                    this.$swal('Evaluación Roya',"Favor revisar hojas totales bandola 1.","warning");
                    this.actualizarActual(i,1);
                    this.ncplanta = i + 1;
                    return;
                }
                if(this.muestreo_2bandolas_avanzado[i].nhojas_b2===null ||
                   this.muestreo_2bandolas_avanzado[i].nhojas_b2==='' ||
                   isNaN(parseFloat(this.muestreo_2bandolas_avanzado[i].nhojas_b2)) ||
                   this.muestreo_2bandolas_avanzado[i].nhojas_b2==0)
                {
                    this.$swal('Evaluación Roya',"Favor revisar hojas totales bandola 2.","warning");
                    this.actualizarActual(i,2);
                    this.ncplanta = i + 1;
                    return;
                }
            }

            if(this.valid_roya==false)
            {
                this.$swal('Evaluación Roya',"Favor revisar la información ingresada.","warning");
                this.btndisabled = false;
            }
            else
            {
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
                                this.$swal('Evaluación Roya',"Favor revisar la información ingresada.","warning");
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
                                        'detalleEvaluacionSeveridadPlanta':null
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
                            
                            if(nhojasTotales==0)
                            {
                                this.$swal('Evaluación Roya',"Favor revisar la información ingresada.","warning");
                                this.btndisabled = false;
                                return;
                            }

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
                                        'detalleEvaluacionSeveridadPlanta':null
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
                                        'detalleEvaluacionSeveridadPlanta':null
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

                            if(nhojasTotales==0)
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
                                        this.muestreo_seleccionado[i].nhojasafectadas_70_b1 * 6) * 100) / (this.muestreo_seleccionado[i].nhojas_b1 * 6);
                            
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
                                            'detalleEvaluacionSeveridadPlanta':severidad
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
                            
                            if(nhojasTotales==0)
                            {
                                this.$swal('Evaluación Roya',"Favor revisar la información ingresada.","warning");
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
                            /* */
                            severidad = (((this.muestreo_seleccionado[i].nhojasafectadas_1_b1 + this.muestreo_seleccionado[i].nhojasafectadas_1_b2) * 1 +
                                        (this.muestreo_seleccionado[i].nhojasafectadas_2_b1 + this.muestreo_seleccionado[i].nhojasafectadas_2_b2) * 2 +
                                        (this.muestreo_seleccionado[i].nhojasafectadas_7_b1 + this.muestreo_seleccionado[i].nhojasafectadas_7_b2) * 3 +
                                        (this.muestreo_seleccionado[i].nhojasafectadas_20_b1 + this.muestreo_seleccionado[i].nhojasafectadas_20_b2) * 4 +
                                        (this.muestreo_seleccionado[i].nhojasafectadas_45_b1 + this.muestreo_seleccionado[i].nhojasafectadas_45_b2) * 5 +
                                        (this.muestreo_seleccionado[i].nhojasafectadas_70_b1 + this.muestreo_seleccionado[i].nhojasafectadas_70_b2) * 6) * 100) / ((this.muestreo_seleccionado[i].nhojas_b1 + this.muestreo_seleccionado[i].nhojas_b2) * 6) ;
                            
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
                                            'detalleEvaluacionSeveridadPlanta':severidad
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
                                            'detalleEvaluacionSeveridadPlanta':severidad
                                            });
                        }
                        var promedioHojas = nhojasTotales / this.nplantas;
                        severidadTotal = (severidadTotal / this.nplantas).toFixed(0);
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
                    .where([['recomendacionTipo','=','Roya'],
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
                    var evaluacionRoya = { 'evaluacionCodigo' : 0,
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
                    nSQL("evaluacionRoya").query("upsert",evaluacionRoya)
                    .exec().then(()=>{
                        nSQL("evaluacionRoya").query("select",["MAX(evaluacionCodigoL) as evaluacionCodigoL"])
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
                            nSQL("detalleEvaluacionRoya").query("upsert",detalle)
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
                                this.$router.push({name:'Lotes',params:{id:this.lote.fincaCodigoL,ilote:this.lote,view:'roya'}});
                            });
                        });
                    });
                })();
            }
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
                nhojas_b1: null,
                nhojasafectadas_0_b1: null,
                nhojasafectadas_1_b1: null,
                nhojasafectadas_2_b1: null,
                nhojasafectadas_7_b1: null,
                nhojasafectadas_20_b1: null,
                nhojasafectadas_45_b1: null,
                nhojasafectadas_70_b1: null
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
                nhojas_b1: null,
                nhojasafectadas_0_b1: null,
                nhojasafectadas_1_b1: null,
                nhojasafectadas_2_b1: null,
                nhojasafectadas_7_b1: null,
                nhojasafectadas_20_b1: null,
                nhojasafectadas_45_b1: null,
                nhojasafectadas_70_b1: null,
                nhojas_b2: null,
                nhojasafectadas_0_b2: null,
                nhojasafectadas_1_b2: null,
                nhojasafectadas_2_b2: null,
                nhojasafectadas_7_b2: null,
                nhojasafectadas_20_b2: null,
                nhojasafectadas_45_b2: null,
                nhojasafectadas_70_b2: null
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
                            context.$router.push({name:'Lotes',params:{id:context.lote.fincaCodigoL,ilote:context.lote,view:'roya'}})
                            return true;
                        } else {
                            return false;
                        }
                });
                return false;
            }
</script>