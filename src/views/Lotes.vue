<template>
  <v-container>
    <v-layout column>
      <v-card
        color="#008869"
        dark style="margin-bottom:3px; padding:4px;">
        <v-card-title class="title" style="padding:4px;"><v-icon style="padding:10px;">fab fa-pagelines</v-icon>&nbsp;<label v-if="finca!=null">{{ finca.fincaNombre }}</label></v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = true">Nuevo lote</v-btn>
        </v-card-actions>
      </v-card>
      <v-alert
          border="right"
          color="blue-grey"
          dark
      >
      <v-select
        style="margin:0px;"
        v-if="lotes.length>0"
        label="Seleccionar lote"
        :items="lotes"
        item-text="loteNombre"
        return-object
        v-model="lote"
      >
      </v-select>
      </v-alert>
      <div v-if="lotes.length>0">
        <!--<v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary"><v-icon left>mdi-pencil</v-icon>Editar Lote</v-btn>
            </v-card-actions>
          </v-card>-->
          <v-card tile>
            <v-card-title class="headline" id="roya">Evaluación roya</v-card-title>
            <v-card-text>
              <canvas v-bind:id="getIDchart(lote.loteCodigoL,1)" :ref="getIDchart(lotes.loteCodigoL,1)"></canvas>
              <label><b>Recomendaciones última evaluación:</b></label>
              {{ lote.ultimaRecomendacionRoya }}
            </v-card-text>
            <v-card-actions>
              
              <!--<v-btn small color="primary" dark>
                <v-icon>list</v-icon>
                Más información
              </v-btn>-->
              <v-btn small style="color:#FFFFFF; background-color: #008869 !important; border-color: #008869 !important;" dark @click="$router.push('/MuestreoRoya/' + lote.loteCodigoL)">
                <v-icon>eco</v-icon>
                Básico
              </v-btn>
              <v-btn small style="color:#FFFFFF; background-color: #008869 !important; border-color: #008869 !important;" dark @click="$router.push('/MuestreoRoyaAvanzado/' + lote.loteCodigoL)">
                <v-icon>eco</v-icon>
                Avanzado
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-card tile>
            <v-card-title class="headline" id="broca">Evaluación broca</v-card-title>
            <v-card-text>
              <canvas v-bind:id="getIDchart(lote.loteCodigoL,2)" :ref="getIDchart(lote.loteCodigoL,2)"></canvas>
              <label><b>Recomendaciones última evaluación:</b></label>
              {{ lote.ultimaRecomendacionBroca }}
            </v-card-text>
            <v-card-actions>
              
              <!--<v-btn small color="primary" dark>
                <v-icon>list</v-icon>
                Más información
              </v-btn>-->
              <v-btn small style="color:#FFFFFF; background-color: #008869 !important; border-color: #008869 !important;" dark @click="$router.push('/MuestreoBroca/' + lote.loteCodigoL)">
                <v-icon>eco</v-icon>
                Básico
              </v-btn>
              <v-btn small style="color:#FFFFFF; background-color: #008869 !important; border-color: #008869 !important;" dark @click="$router.push('/MuestreoBrocaAvanzado/' + lote.loteCodigoL)">
                <v-icon>eco</v-icon>
                Avanzado
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-card tile>
            <v-card-title class="headline" id="ojodegallo">Evaluación ojo de gallo</v-card-title>
            <v-card-text>
              <canvas v-bind:id="getIDchart(lote.loteCodigoL,3)" :ref="getIDchart(lote.loteCodigo,3)"></canvas>
              <label><b>Recomendaciones última evaluación:</b></label>
              {{ lote.ultimaRecomendacionOjoDeGallo }}
            </v-card-text>
            <v-card-actions>
              
              <!--<v-btn small color="primary" dark>
                <v-icon>list</v-icon>
                Más información
              </v-btn>-->
              <v-btn small style="color:#FFFFFF; background-color: #008869 !important; border-color: #008869 !important;" dark @click="$router.push('/MuestreoOjoDeGallo/' + lote.loteCodigoL)">
                <v-icon>eco</v-icon>
                Nuevo
              </v-btn>
            </v-card-actions>
          </v-card>
      </div>
      <div v-else>
        <br />
        <v-card>
          <v-card-text>
            <h3>Para comenzar debe lotes haciendo uso del botón (+)</h3>
          </v-card-text>
        </v-card>
      </div>
    
    </v-layout>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="false"
      style="z-index:1011;"
    >
      <FormLote @closedialog="closeDialog" v-bind:id="id" v-bind:dialog="dialog" />
    </v-dialog>
    <v-dialog
      v-model="dialogRoya"
      fullscreen
      hide-overlay
      transition="false"
      style="z-index:1011;"
    >
      <FormRoya @closedialog="closeDialogRoya"></FormRoya>
    </v-dialog>
    <v-btn bottom color="pink" dark fab fixed right @click="dialog = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>
<script>
import FormLote from "../components/FormLote";
import FormRoya from "../components/FormMuestreoRoya";
import { nSQL } from "@nano-sql/core";
import { CoffeeCloud } from "../coffeecloud";
import "../coffeecloud.css";
import axios from "axios";
import moment from "moment";
import Chart from "chart.js";

export default {
  name: "Lotes",
  props: ["id","ilote","view"],
  components: {
    FormLote,
    FormRoya
  },
  data: () => ({
    finca: null,
    overlay: false,
    dialog: false,
    dialogRoya: false,
    tab: null,
    lotes: [],
    lote: null,
    loteCodigoL: 0,
    ctxRoya: [],
    ctxBroca: [],
    ctxOjoDeGallo: [],
    chartRoya: [],
    chartBroca: [],
    chartOjoDeGallo: [],
    ultimaRecomendacionRoya: '',
    ultimaRecomendacionBroca: '',
    ultimaRecomendacionOjoDeGallo: ''
  }),
  methods: {
    setUltimaEvaluacion: function(lote){
      try{
        this.ultimaRecomendacionRoya = lote.ultimaRecomendacionRoya;
        this.ultimaRecomendacionBroca = lote.ultimaRecomendacionBroca;
        this.ultimaRecomendacionOjoDeGallo = lote.ultimaRecomendacionOjoDeGallo;
        this.loteCodigoL = lote.loteCodigoL;
      }
      catch (Ex)
      {
        //
      }
    },
    closeDialog: function(e) {
      //console.log("Close dialog 2");
      this.dialog = false;
      this.getLotes();
    },
    closeDialogRoya: function(e) {
      //console.log("Close dialog 3");
      this.dialogRoya = false;
      this.getLotes();
    },
    graficarLote: function() {
        var lote = this.lote;
        var i = 0;
          try {
            var chartDataRoya = {
              labels: lote.evaluacionRoya.map(function(x) {
                return new Date(x.evaluacionFecha).toLocaleDateString("es-SV");
              }),
              datasets: [
                {
                  type: "line",
                  label: "Incidencia",
                  borderColor: "blue",
                  borderWidth: 2,
                  fill: false,
                  data: lote.evaluacionRoya.map(function(x) {
                    return x.evaluacionIncidencia;
                  })
                },
                {
                  type: "bar",
                  label: "Severidad",
                  backgroundColor: "#ff0049",
                  data: lote.evaluacionRoya.map(function(x) {
                    return x.evaluacionSeveridad;
                  }),
                  borderColor: "white",
                  borderWidth: 2
                }
              ]
            };
            var chartDataBroca = {
              labels: lote.fechasEvaluacionBroca.map(function(x) {
                return new Date(x.evaluacionFecha).toLocaleDateString("es-SV");
              }),
              datasets: [
                {
                  type: "line",
                  label: "Incidencia",
                  borderColor: "blue",
                  borderWidth: 2,
                  fill: false,
                  data: lote.evaluacionBroca.map(function(x) {
                    return x.evaluacionIncidencia;
                  })
                },
                {
                  type: "bar",
                  label: "Infestación",
                  backgroundColor: "#ff0049",
                  data: lote.evaluacionBrocaAvanzada.map(function(x) {
                    return x.evaluacionIncidencia;
                  }),
                  borderColor: "white",
                  borderWidth: 2
                }
              ]
            };
            var chartDataOjoDeGallo = {
              labels: lote.evaluacionOjoDeGallo.map(function(x) {
                return new Date(x.evaluacionFecha).toLocaleDateString("es-SV");
              }),
              datasets: [
                {
                  type: "line",
                  label: "Incidencia",
                  borderColor: "blue",
                  borderWidth: 2,
                  fill: false,
                  data: lote.evaluacionOjoDeGallo.map(function(x) {
                    return x.evaluacionIncidencia;
                  })
                }
              ]
            };
            
            if(this.chartRoya[i]!=null)
            {
              this.chartRoya[i].destroy();
              this.chartRoya[i] = null;
            }

            if (this.chartRoya[i] == null) {
              this.ctxRoya[i] = document.getElementById("chart_lote_1_" + lote.loteCodigoL).getContext("2d");
              
              
                  this.chartRoya[i] = new Chart(this.ctxRoya[i], {
                  type: "bar",
                  data: chartDataRoya,
                  options: {
                    responsive: true,
                    title: {
                      display: true,
                      text: "Evaluacion Roya"
                    },
                    tooltips: {
                      mode: "index",
                      intersect: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                suggestedMin: 0,
                                suggestedMax: 100
                            }
                        }]
                    }
                  }
                });
                console.log("chartRoya " + i + " null");
            } 

            if(this.chartBroca[i]!=null)
            {
              this.chartBroca[i].destroy();
              this.chartBroca[i] = null;
            }

            if (this.chartBroca[i] == null) {
              this.ctxBroca[i] = document
                  .getElementById("chart_lote_2_" + lote.loteCodigoL)
                  .getContext("2d");

              
              this.chartBroca[i] = new Chart(this.ctxBroca[i], {
                  type: "bar",
                  data: chartDataBroca,
                  options: {
                    responsive: true,
                    title: {
                      display: true,
                      text: "Evaluacion Broca"
                    },
                    tooltips: {
                      mode: "index",
                      intersect: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                suggestedMin: 0,
                                suggestedMax: 100
                            }
                        }]
                    }
                  }
                });
            }

            if(this.chartOjoDeGallo[i]!=null)
            {
              this.chartOjoDeGallo[i].destroy();
              this.chartOjoDeGallo[i] = null;
            }

            if (this.chartOjoDeGallo[i] == null) {
              this.ctxOjoDeGallo[i] = document.getElementById("chart_lote_3_" + lote.loteCodigoL).getContext("2d");

                this.chartOjoDeGallo[i] = new Chart(this.ctxOjoDeGallo[i], {
                  type: "bar",
                  data: chartDataOjoDeGallo,
                  options: {
                    responsive: true,
                    title: {
                      display: true,
                      text: "Evaluacion Ojo de Gallo"
                    },
                    tooltips: {
                      mode: "index",
                      intersect: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                suggestedMin: 0,
                                suggestedMax: 100
                            }
                        }]
                    }
                  }
                });
            } else {
              this.chartOjoDeGallo[i].data.datasets.forEach(dataset => {
                dataset.data.pop();
              });
              this.chartOjoDeGallo[i].data.datasets =
                chartDataOjoDeGallo.datasets;
              this.chartOjoDeGallo[i].update();
            }
          } catch (ex) {
            console.log(ex);
          }

        if(this.view!=null) {
            if(this.view=='roya')
            {
              var elmnt = document.getElementById("roya");
              elmnt.scrollIntoView();
            }
            if(this.view=='broca')
            {
              var elmnt = document.getElementById("broca");
              elmnt.scrollIntoView();
            }
            if(this.view=='ojodegallo')
            {
              var elmnt = document.getElementById("ojodegallo");
              elmnt.scrollIntoView();
            }
        }
        this.overlay = false;
    },
    makeGraficarLote: function(lote) {
      //console.log(lote);
      this.overlay = true;
      this.setUltimaEvaluacion(lote);
      setTimeout(this.graficarLote,1 * 1000);
    },
    getLotes: async function() {
      let queryFincas = nSQL("fincas").query("select")
      .where(["fincaCodigoL","=",this.id * 1])
      .exec();
      var fincas = await queryFincas;
      this.finca = fincas[0];
      
      
      let queryLotes = nSQL("lotes").query("select").where(["fincaCodigoL", "=", this.id * 1]).exec();
      var lotes = await queryLotes;
      
      this.lotes = lotes;
          
      if(this.lotes.length>0)
      {
        this.lote = this.lotes[0];
      } 
      else
        this.lote = null;
          
      var i = 0;
          
      for (i = 0; i < lotes.length; i++) {
            
        if(this.ilote!=null)
        { 
          if(this.ilote.loteCodigoL==lotes[i].loteCodigoL)
          {
            this.lote = this.lotes[i];
          } 
        }
              
        this.lotes[i].evaluacionRoya = [];
        this.lotes[i].ultimaRecomendacionRoya = '';
        this.lotes[i].ultimaRecomendacionBroca = '';
        this.lotes[i].ultimaRecomendacionOjoDeGallo = '';
        (async (loteCodigoL, i) => {
            let query = nSQL("evaluacionRoya")
            .query("select")
            .where(
                  [["loteCodigoL", "=", loteCodigoL],
                  'AND',
                  ["evaluacionFecha", ">", moment().subtract(6, "months")]]
                )
            .orderBy(["evaluacionFecha ASC"])
            .exec();
            var evaluacionRoya = await query;
            this.lotes[i].evaluacionRoya = evaluacionRoya;
            try 
            {
                this.lotes[i].ultimaRecomendacionRoya = evaluacionRoya[evaluacionRoya.length-1].recomendacionDescripcion;
            }
            catch(Ex)
            {

            }
        })(lotes[i].loteCodigoL, i);

        this.lotes[i].fechasEvaluacionBroca = [];
        this.lotes[i].evaluacionBroca = [];
        this.lotes[i].evaluacionBrocaAvanzada = [];
        (async (loteCodigoL, i) => {
          let query = nSQL("evaluacionBroca")
            .query("select")
            .where(
              [["loteCodigoL", "=", loteCodigoL],
              'AND',
              ["evaluacionFecha", ">", moment().subtract(6, "months")],
              'AND',
              ["evaluacionTipo","=",0]]
            )
            .orderBy(["evaluacionFecha ASC"])
            .exec();
            var evaluacionBroca = await query;
            this.lotes[i].evaluacionBroca = evaluacionBroca;
            try {
              this.lotes[i].ultimaRecomendacionBroca = evaluacionBroca[evaluacionBroca.length-1].recomendacionDescripcion;
            }
            catch(Ex)
            {

            }
        })(lotes[i].loteCodigoL, i);

        (async (loteCodigoL, i) => {
          let query = nSQL("evaluacionBroca")
            .query("select")
            .where(
              [["loteCodigoL", "=", loteCodigoL],
              'AND',
              ["evaluacionFecha", ">", moment().subtract(6, "months")],
              'AND',
              ["evaluacionTipo","=",1]]
            )
            .orderBy(["evaluacionFecha ASC"])
            .exec();
            var evaluacionBrocaAvanzada = await query;
            this.lotes[i].evaluacionBrocaAvanzada = evaluacionBrocaAvanzada;
        })(lotes[i].loteCodigoL, i);

        (async (loteCodigoL, i) => {
          let query = nSQL("evaluacionBroca")
            .query("select")
            .where(
              [["loteCodigoL", "=", loteCodigoL],
              'AND',
              ["evaluacionFecha", ">", moment().subtract(6, "months")],
              'AND',
              ["evaluacionTipo","=",1]]
            )
            .orderBy(["evaluacionFecha ASC"])
            .exec();
            var evaluacionBrocaAvanzada = await query;
            this.lotes[i].evaluacionBrocaAvanzada = evaluacionBrocaAvanzada;
        })(lotes[i].loteCodigoL, i);

        (async (loteCodigoL, i) => {
          let query = nSQL("evaluacionBroca")
            .query("select")
            .where(
              [["loteCodigoL", "=", loteCodigoL],
              'AND',
              ["evaluacionFecha", ">", moment().subtract(6, "months")]]
            ).distinct(["evaluacionFecha"])
            .orderBy(["evaluacionFecha ASC"])
            .exec();
            var evaluacionBrocaFechas = await query;
            this.lotes[i].fechasEvaluacionBroca = evaluacionBrocaFechas;
        })(lotes[i].loteCodigoL, i);

        this.lotes[i].evaluacionOjoDeGallo = [];
        (async (loteCodigoL, i) => {
          let query = nSQL("evaluacionOjoDeGallo")
            .query("select")
            .where(
              [["loteCodigoL", "=", loteCodigoL],
              'AND',
              ["evaluacionFecha", ">", moment().subtract(6, "months")]]
            )
            .orderBy(["evaluacionFecha ASC"])
            .exec();
            var evaluacionOjoDeGallo = await query;
            this.lotes[i].evaluacionOjoDeGallo = evaluacionOjoDeGallo;
            try
            {
              this.lotes[i].ultimaRecomendacionOjoDeGallo = evaluacionOjoDeGallo[evaluacionOjoDeGallo.length-1].recomendacionDescripcion;
            }
              catch(Ex)
            {

            }
        })(lotes[i].loteCodigoL, i);

        this.setUltimaEvaluacion(this.lote);
      }
          
      this.$nextTick(function(){
        this.makeGraficarLote(this.lote);
      });
    },
    getIDchart: function(loteid, muestreo) {
      return "chart_lote_" + muestreo + "_" + loteid;
    }
  },
  mounted() {
    this.getLotes();
  },
  updated() {
    
  },
  watch: {
    lote: function(val) {
      this.makeGraficarLote(val);
    }
  }
};
</script>