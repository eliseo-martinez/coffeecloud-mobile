<template>
  <v-container style="margin;20px;">
      <v-layout column>
        <section>
          <h3>
            Edición de Datos de Unidades Productivas
          </h3>
        </section>
        <v-divider style="margin:10px;"></v-divider>
        <v-select
          style="margin:0px;"
          v-if="fincas.length>0"
          label="Seleccionar Unidad Productiva"
          :items="fincas"
          item-text="fincaNombre"
          item-value="fincaCodigoL"
          return-object
          v-model="fincaCodigo"
        >
        </v-select>
        <v-row>
          <v-col xs=6>
            <v-btn x-large color="success" dark style="padding-top:50px; padding-bottom:50px;" v-on:click="dialog=true">
              <v-icon>edit</v-icon>
              Editar
            </v-btn>
          </v-col>
          <v-col xs=6>
            <v-btn x-large color="success" dark style="padding-top:50px; padding-bottom:50px;" v-on:click="deleteFinca">
              <v-icon>delete</v-icon>
              Eliminar
            </v-btn>
          </v-col>
        </v-row>
        <div style="height:50px;"></div>
        <section>
          <h3>
            Edición de Datos de Lotes
          </h3>
        </section>
        <v-divider style="margin:10px;"></v-divider>
        <v-select
          style="margin:0px;"
          v-if="lotes.length>0"
          label="Seleccionar lote"
          :items="lotes"
          item-text="loteNombre"
          item-value="loteCodigoL"
          return-object
          v-model="loteCodigo"
        >
        </v-select>
        <v-row>
          <v-col xs=6>
            <v-btn x-large color="success" dark style="padding-top:50px; padding-bottom:50px;" v-on:click="dialog2=true">
              <v-icon>edit</v-icon>
              Editar
            </v-btn>
          </v-col>
          <v-col xs=6>
            <v-btn x-large color="success" dark style="padding-top:50px; padding-bottom:50px;" v-on:click="deleteLote">
              <v-icon>delete</v-icon>
              Eliminar
            </v-btn>
          </v-col>
        </v-row>
        <v-dialog v-model="dialog" fullscreen hide-overlay style="z-index:1011;" transition="false">
         <FormFinca @closedialog="closeDialog" v-bind:dialog="dialog" v-bind:edicion="fincaCodigo" />
        </v-dialog>
        <v-dialog v-model="dialog2" fullscreen hide-overlay style="z-index:1011;" transition="false">
         <FormLote @closedialog2="closeDialog2" @closedialog="closeDialog2"  v-bind:dialog2="dialog2" v-bind:edicion="loteCodigo" />
        </v-dialog>
      </v-layout>
  </v-container>
</template>
<script>
import FormFinca from "../components/FormFinca";
import FormLote from "../components/FormLote";
import { nSQL } from "@nano-sql/core";
import { CoffeeCloud } from '../coffeecloud';
import '../coffeecloud.css'
import axios from 'axios';
var _CoffeeCloud = new CoffeeCloud;

export default {
  name: 'SeleccionEdicion',
  components: {
    FormFinca,
    FormLote
  },
  data: () => ({
    dialog: false,
    dialog2: false,
    fincas: [],
    lotes: [],
    loteCodigo: null,
    fincaCodigo: null
  }),
  methods: {
    getLotesFinca: async function() {
      let queryLotes = nSQL("lotes").query("select")
      .where(["fincaCodigoL","=",this.fincaCodigo.fincaCodigoL]).exec();
      this.lotes = await queryLotes;
    },
    getFincas: async function()
    {
      let queryFincas = nSQL("fincas").query("select")
      .where(["userId","=",window.localStorage.getItem("userid")]).exec();
      this.fincas = await queryFincas;
    },
    closeDialog: async function() {
      this.getFincas();
      this.dialog=false;
    },
    closeDialog2: function() {
      console.log("closeDialog2");
      this.getLotesFinca();
      this.dialog2=false;
    },
    deleteFinca: async function() {
      console.log(this.fincaCodigo.fincaCodigoL);
      if(this.fincaCodigo!=null)
      {
        if(confirm("Realmente desea eliminar la finca seleccionada?")) {
          let lotesFinca = nSQL("lotes").query("select",["loteCodigoL"]).where(["fincaCodigoL","=",this.fincaCodigo.fincaCodigoL]).exec();
          var lotes = await lotesFinca;

          let evaluacionesRoya = nSQL("evaluacionRoya").query("select",["evaluacionCodigoL"]).where(["loteCodigoL","IN",lotes]).exec();
          var rsEvaluacionRoya = await evaluacionesRoya;
          
          let qdeletedetevalroya = nSQL("detalleEvaluacionRoya").query("delete").where(["evaluacionCodigoL","IN",rsEvaluacionRoya]).exec();
          await qdeletedetevalroya;
          
          let qdeleteevalroya = nSQL("evaluacionRoya").query("delete").where(["loteCodigoL","IN",lotes]).exec();
          await qdeleteevalroya;

          let evaluacionesBroca = nSQL("evaluacionBroca").query("select",["evaluacionCodigoL"]).where(["loteCodigoL","IN",lotes]).exec();
          var rsEvaluacionBroca = await evaluacionesBroca;
          
          let qdeletedetevalbroca = nSQL("detalleEvaluacionBroca").query("delete").where(["evaluacionCodigoL","IN",rsEvaluacionBroca]).exec();
          await qdeletedetevalbroca;
          
          let qdeleteevalbroca = nSQL("evaluacionBroca").query("delete").where(["loteCodigoL","IN",lotes]).exec();
          await qdeleteevalbroca;

          let evaluacionesOjoDeGallo = nSQL("evaluacionOjoDeGallo").query("select",["evaluacionCodigoL"]).where(["loteCodigoL","IN",lotes]).exec();
          var rsEvaluacionOjoDeGallo = await evaluacionesOjoDeGallo;
          
          let qdeletedetevalOjoDeGallo = nSQL("detalleEvaluacionOjoDeGallo").query("delete").where(["evaluacionCodigoL","IN",rsEvaluacionOjoDeGallo]).exec();
          await qdeletedetevalOjoDeGallo;
          
          let qdeleteevalOjoDeGallo = nSQL("evaluacionOjoDeGallo").query("delete").where(["loteCodigoL","IN",lotes]).exec();
          await qdeleteevalOjoDeGallo;

          let deleteVarCafeLote = nSQL("variedadesCafeLote").query("delete").where(["loteCodigoL","IN",lotes]).exec();
          await deleteVarCafeLote;

          let deleteLote = nSQL("lotes").query("delete").where(["loteCodigoL","IN",lotes]).exec();
          await deleteLote;

          let deleteFinca = nSQL("fincas").query("delete").where(["fincaCodigoL","=",this.fincaCodigo.fincaCodigoL]).exec();

          _CoffeeCloud.deleteFinca(this.fincaCodigo.fincaCodigo);
        }
      }
    },
    deleteLote: async function() {
      console.log(this.loteCodigo.loteCodigoL);
      if(this.loteCodigo!=null)
      {
        if(confirm("Realmente desea eliminar el lote seleccionado?")){
          let evaluacionesRoya = nSQL("evaluacionRoya").query("select",["evaluacionCodigoL"]).where(["loteCodigoL","=",this.loteCodigo.loteCodigoL]).exec();
          var rsEvaluacionRoya = await evaluacionesRoya;
          
          let qdeletedetevalroya = nSQL("detalleEvaluacionRoya").query("delete").where(["evaluacionCodigoL","IN",rsEvaluacionRoya]).exec();
          await qdeletedetevalroya;
          
          let qdeleteevalroya = nSQL("evaluacionRoya").query("delete").where(["loteCodigoL","=",this.loteCodigo.loteCodigoL]).exec();
          await qdeleteevalroya;

          let evaluacionesBroca = nSQL("evaluacionBroca").query("select",["evaluacionCodigoL"]).where(["loteCodigoL","=",this.loteCodigo.loteCodigoL]).exec();
          var rsEvaluacionBroca = await evaluacionesBroca;
          
          let qdeletedetevalbroca = nSQL("detalleEvaluacionBroca").query("delete").where(["evaluacionCodigoL","IN",rsEvaluacionBroca]).exec();
          await qdeletedetevalbroca;
          
          let qdeleteevalbroca = nSQL("evaluacionBroca").query("delete").where(["loteCodigoL","=",this.loteCodigo.loteCodigoL]).exec();
          await qdeleteevalbroca;

          let evaluacionesOjoDeGallo = nSQL("evaluacionOjoDeGallo").query("select",["evaluacionCodigoL"]).where(["loteCodigoL","=",this.loteCodigo.loteCodigoL]).exec();
          var rsEvaluacionOjoDeGallo = await evaluacionesOjoDeGallo;
          
          let qdeletedetevalOjoDeGallo = nSQL("detalleEvaluacionOjoDeGallo").query("delete").where(["evaluacionCodigoL","IN",rsEvaluacionOjoDeGallo]).exec();
          await qdeletedetevalOjoDeGallo;
          
          let qdeleteevalOjoDeGallo = nSQL("evaluacionOjoDeGallo").query("delete").where(["loteCodigoL","=",this.loteCodigo.loteCodigoL]).exec();
          await qdeleteevalOjoDeGallo;

          let deleteVarCafeLote = nSQL("variedadesCafeLote").query("delete").where(["loteCodigoL","=",this.loteCodigo.loteCodigoL]).exec();
          await deleteVarCafeLote;

          let deleteLote = nSQL("lotes").query("delete").where(["loteCodigoL","=",this.loteCodigo.loteCodigoL]).exec();
          await deleteLote;

          // enviar delete al servidor
          var loteCodigo = this.loteCodigo.loteCodigo;
          _CoffeeCloud.deleteLote(loteCodigo);
        }
      }
    }
  },
  watch: {
    fincaCodigo: function() {
      this.getLotesFinca();
    }
  },
  async mounted () {
      _CoffeeCloud.container = this;
      this.getFincas();
  }  
};
</script>
