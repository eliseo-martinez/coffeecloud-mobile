<template>
  <v-container style="z-index:1200;">
    <v-layout column>
      <v-card>
        <v-toolbar dark style="background-color: #008869 !important; border-color: #008869 !important;">
          <v-btn icon dark v-on:click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Unidad Productiva</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="saveFinca" v-bind:disabled="btndisabled">Guardar</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-form v-model="valid_finca" style="padding:20px; z-index:1200;">
          <div v-if="geolocalizando==true">
            Obteniendo información de GPS
            <!--<v-progress-linear
                    indeterminate
                    color="cyan"
            ></v-progress-linear>-->
          </div>
          <v-text-field
            v-model="finca.fincaNombre"
            v-lazy-input:debounce="1000"
            :rules="reglasValidacion.fincaNombreRules"
            label="Nombre"
            required
          ></v-text-field>
          <v-select
            id="select_deptos"
            v-model="finca.departamentoCodigo"
            v-lazy-input:debounce="1000"
            :items="departamentos"
            label="Departamento"
            item-text="departamentoNombre"
            item-value="departamentoCodigo"
            v-on:change="updateMunicipios"
            ref="vSelDeptos"
          >
          </v-select>
          <v-select
            id="select_municipios"
            v-model="finca.municipioCodigo"
            v-lazy-input:debounce="1000"
            label="Municipios"
            :items="municipios"
            item-text="municipioNombre"
            item-value="municipioCodigo"
          ></v-select>
          <v-row>
            <v-col sm=4>
              <v-text-field
                v-model="finca.fincaLatitud"
                v-lazy-input:debounce="1000"
                :rules="reglasValidacion.latitudRules"
                label="Latitud"
                type="number"
                required
              ></v-text-field>
            </v-col>
            <v-col sm=4>
              <v-text-field
                v-model="finca.fincaLongitud"
                v-lazy-input:debounce="1000"
                :rules="reglasValidacion.longitudRules"
                label="Longitud"
                required
                type="number"
              ></v-text-field>
            </v-col>
            <v-col sm=4>
              <v-text-field
                v-model="finca.fincaAltitud"
                v-lazy-input:debounce="1000"
                :rules="reglasValidacion.altitudRules"
                label="Altitud"
                type="number"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <div id="selectorPunto"></div>
          <v-text-field
            v-model="finca.fincaAreaTotal"
            v-lazy-input:debounce="1000"
            :rules="reglasValidacion.fincaAreaTotal"
            label="Área total (Manzanas)"
            type="number"
          ></v-text-field>
          <v-text-field
            v-model="finca.fincaAreaCafe"
            v-lazy-input:debounce="1000"
            :rules="[v => !!v || 'Información requerida', v=> v > 0 || 'Es requerido un valor positivo.', areasRule() ]"
            label="Area con café (Manzanas)"
            type="number"
          ></v-text-field>
          <!--<label>Seleccione las variedades establecidas en la unidad productiva</label>
          <v-row no-gutters style="overflow:auto; height:150px; overflow-y:scroll;">
            <v-col v-for="variedad in variedadesCafe" v-bind:key="variedad.variedadCodigo" style="font-size: 10pt !important;">
              <v-checkbox
                class="variedad"
                v-model="finca.variedadesCafe"
                v-lazy-input:debounce="1000"
                :value="variedad.variedadCodigo"
                :id="'chkV'+variedad.variedadCodigo"
                :label="variedad.variedadNombre"
                style="width:130px;"
              ></v-checkbox>
            </v-col>
          </v-row>-->
          <v-select
            :items="variedadesCafe"
            v-model="finca.variedadesCafe"
            v-lazy-input:debounce="1000"
            item-text="variedadNombre"
            item-value="variedadCodigo"
            label="Seleccione las variedades establecidas en la unidad productiva"
            multiple
            ref="VariedadesCafe"
          >
          <template v-slot:prepend-item>
            <v-list-item
              ripple
              @click="closeVariedadesCafe"
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
              @click="closeVariedadesCafe"
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
          <v-select
            :items="tiposCafe"
            v-model="finca.tiposCafe"
            item-text="tipoNombre"
            item-value="tipoCodigo"
            label="Tipos de café que produce"
            multiple
            ref="tiposCafe"
          >
          <template v-slot:prepend-item>
            <v-list-item
              ripple
              @click="closeTiposCafe"
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
              @click="closeTiposCafe"
            >
              <v-list-item-action>
                <v-icon>close</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Cerrar</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          </v-select>Distanciamiento entre plantas de café
          <v-text-field
            label="Distancia surco (Metros)"
            v-model="finca.fincaDistPlantaSurco"
            v-lazy-input:debounce="1000"
            :rules="reglasValidacion.fincaDistPlantaSurco"
            type="number"
          ></v-text-field>x
          <v-text-field
            label="Distancia planta (Metros)"
            v-model="finca.fincaDistPlantaPlantas"
            v-lazy-input:debounce="1000"
            :rules="reglasValidacion.fincaDistPlantaPlantas"
            type="number"
          ></v-text-field>
          <v-switch v-model="fincaSombraSel" v-lazy-input:debounce="1000" label="¿Tiene sombra?"></v-switch>
          <v-switch
            v-model="fincaMuestreoSuelosSel"
            v-lazy-input:debounce="1000"
            label="¿Realiza muestreo de suelos?"
          ></v-switch>
          <v-select
            v-if="fincaMuestreoSuelosSel==true"
            v-model="fincaMuestreoSueloMesesArr"
            v-lazy-input:debounce="1000"
            :items="meses"
            item-text="mesNombre"
            item-value="mesCodigo"
            label="¿En qué mes lo realiza?"
            ref="MuestreoSuelos"
            multiple
          >
            <template v-slot:prepend-item>
            <v-list-item
              ripple
              @click="closeMuestreoSuelos"
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
              @click="closeMuestreoSuelos"
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
          <v-switch
            v-model="fincaFertilizaSueloSel"
            v-lazy-input:debounce="1000"
            label="¿Fertiliza el suelo?"
          ></v-switch>
          <v-select
            v-if="fincaFertilizaSueloSel==true"
            :items="meses"
            v-model="fincaFertilizaSueloMesesArr"
            v-lazy-input:debounce="1000"
            item-text="mesNombre"
            item-value="mesCodigo"
            label="¿En qué mes realiza la fertilización?"
            multiple
            ref="FertilizaSuelo"
          >
            <template v-slot:prepend-item>
            <v-list-item
              ripple
              @click="closeFertilizaSuelo"
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
              @click="closeFertilizaSuelo"
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
          <v-switch
            v-model="fincaAplicacionesFoliaresSel"
            v-lazy-input:debounce="1000"
            label="¿Realiza aplicaciones foliares?"
          ></v-switch>
          <v-select
            v-if="fincaAplicacionesFoliaresSel==true"
            v-model="fincaAplicacionesFoliaresMesesArr"
            v-lazy-input:debounce="1000"
            :items="meses"
            item-text="mesNombre"
            item-value="mesCodigo"
            label="¿En qué mes realiza las aplicaciones foliares?"
            ref="AplicacionesFoliares"
            multiple
          >
          <template v-slot:prepend-item>
            <v-list-item
              ripple
              @click="closeAplicacionesFoliares"
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
              @click="closeAplicacionesFoliares"
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
          <v-switch
            v-model="fincaEnmiendasSueloSel"
            v-lazy-input:debounce="1000"
            label="¿Realiza enmiendas de suelo?"
          ></v-switch>
          <v-select
            v-if="fincaEnmiendasSueloSel==true"
            v-model="fincaEnmiendasSueloMesesArr"
            v-lazy-input:debounce="1000"
            :items="meses"
            item-text="mesNombre"
            item-value="mesCodigo"
            label="¿En qué mes realiza enmiendas de suelo?"
            multiple
            ref="EnmiendasSueloMeses"
          >
          <template v-slot:prepend-item>
            <v-list-item
              ripple
              @click="closeEnmiendasSueloMeses"
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
              @click="closeEnmiendasSueloMeses"
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
          <v-switch
            v-model="fincaManejoTejidoSel"
            v-lazy-input:debounce="1000"
            label="¿Realiza manejo de tejido?"
          ></v-switch>
          <v-select
            v-if="fincaManejoTejidoSel==true"
            v-model="fincaManejoTejidoMesesArr"
            v-lazy-input:debounce="1000"
            :items="meses"
            item-text="mesNombre"
            item-value="mesCodigo"
            label="¿En qué mes realiza manejo de tejido?"
            ref="ManejoTejidoMeses"
            multiple
          >
          <template v-slot:prepend-item>
            <v-list-item
              ripple
              @click="closeManejoTejidoMeses"
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
              @click="closeManejoTejidoMeses"
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
          <v-switch
            v-model="fincaCalidadAguaSel"
            v-lazy-input:debounce="1000"
            label="¿Verifica la calidad del Agua?"
          ></v-switch>
          <div v-if="fincaCalidadAguaSel==true">
            ¿Qué tipo de verificación realiza?
            <v-checkbox v-model="fincaCalidadPh" v-lazy-input:debounce="1000" label="pH"></v-checkbox>
            <v-checkbox v-model="fincaCalidadDureza" v-lazy-input:debounce="1000" label="Dureza"></v-checkbox>
          </div>
          <v-text-field
            v-model="finca.fincaProduccionAnualEstimada"
            v-lazy-input:debounce="1000"
            label="Producción estimada del año actual (Quintales maduro por manzana)"
          ></v-text-field>
          <v-text-field
            v-model="finca.fincaProduccionAnioAnterior"
            v-lazy-input:debounce="1000"
            label="Producción del año anterior (Quintales maduro por manzana)"
          ></v-text-field>
          <v-menu
            v-model="finca.menuFloracionPrincipal"
            v-lazy-input:debounce="1000"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="fincaFloracionAnioAnteriorDP"
                v-lazy-input:debounce="1000"
                label="Floración principal del año anterior"
                prepend-icon="event"
                readonly
                v-on="on"
                :rules="reglasValidacion.fincaFloracionAnioAnterior"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="fincaFloracionAnioAnteriorDP"
              v-lazy-input:debounce="1000"
              @input="menuFloracionPrincipal = false"
              locale="es-419"
            ></v-date-picker>
          </v-menu>
          <v-menu
            v-model="menuInicioCosechaAAnterior"
            v-lazy-input:debounce="1000"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="fincaInicioCosechaAnioAnteriorDP"
                v-lazy-input:debounce="1000"
                label="Inicio de la cosecha año anterior"
                prepend-icon="event"
                readonly
                v-on="on"
                :rules="reglasValidacion.fincaInicioCosechaAnioAnterior"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="fincaInicioCosechaAnioAnteriorDP"
              v-lazy-input:debounce="1000"
              @input="menuInicioCosechaAAnterior = false"
              locale="es-419"
            ></v-date-picker>
          </v-menu>
          <v-menu
            v-model="menuFinalCosechaAAnterior"
            v-lazy-input:debounce="1000"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="fincaFinCosechaAnioAnteriorDP"
                v-lazy-input:debounce="1000"
                label="Final de la cosecha año anterior"
                prepend-icon="event"
                readonly
                :rules="reglasValidacion.fincaFinCosechaAnioAnterior"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="fincaFinCosechaAnioAnteriorDP"
              v-lazy-input:debounce="1000"
              @input="menuFinalCosechaAAnterior = false"
              locale="es-419"
            ></v-date-picker>
          </v-menu>
          <v-menu
            v-model="menuInicioEpocaLluviosaAAnterior"
            v-lazy-input:debounce="1000"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="fincaInicioEpocaLluviosaAnioAnteriorDP"
                v-lazy-input:debounce="1000"
                label="Inicio de la Epoca Lluviosa año anterior"
                prepend-icon="event"
                readonly
                v-on="on"
                :rules="reglasValidacion.fincaInicioEpocaLluviosaAnioAnterior"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="fincaInicioEpocaLluviosaAnioAnteriorDP"
              v-lazy-input:debounce="1000"
              @input="menuInicioEpocaLluviosaAAnterior = false"
              locale="es-419"
            ></v-date-picker>
          </v-menu>
          <v-menu
            v-model="menuFinEpocaLluviosaAAnterior"
            v-lazy-input:debounce="1000"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="fincaFinEpocaLluviosaAnioAnteriorDP"
                v-lazy-input:debounce="1000"
                label="Fin de la Epoca Lluviosa año anterior"
                prepend-icon="event"
                readonly
                :rules="reglasValidacion.fincaFinEpocaLluviosaAnioAnterior"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="fincaFinEpocaLluviosaAnioAnteriorDP"
              v-lazy-input:debounce="1000"
              @input="menuFinEpocaLluviosaAAnterior = false"
              locale="es-419"
            ></v-date-picker>
          </v-menu>
          <v-switch
            v-model="fincaAplicaFungicidasSel"
            v-lazy-input:debounce="1000"
            label="¿Aplica fungicidas?"
          ></v-switch>
          <div v-if="fincaAplicaFungicidasSel==true">
            <div
              v-for="tipo in tiposFungicidas"
              v-bind:key="'tipoFungicida_' + tipo.tipoFungicidaTipo"
            >
              <!--<i>{{ tipo.tiposFungicidaNombre }}</i>
              <v-row no-gutters>
                <v-col
                  v-for="fungicida in getFungicidas(tipo.tipoFungicidaTipo)"
                  v-bind:key="fungicida.fungicidaCodigo"
                >
                  <v-checkbox
                    class="pa-2"
                    style="width:150px;"
                    v-model="finca.fincaFungicidas"
                    v-lazy-input:debounce="1000"
                    :value="fungicida.fungicidaCodigo"
                    :id="'chkFungicida'+fungicida.fungicidaCodigo"
                    :label="fungicida.fungicidaNombre"
                  ></v-checkbox>
                </v-col>
              </v-row>-->
              <v-select
                v-model="finca.fincaFungicidas"
                v-lazy-input:debounce="1000"
                :items="getFungicidas(tipo.tipoFungicidaTipo)"
                item-text="fungicidaNombre"
                item-value="fungicidaCodigo"
                :label="tipo.tiposFungicidaNombre"
                :ref="'fungicidas'+tipo.tipoFungicidaTipo"
                multiple
              >
              <template v-slot:prepend-item>
                <v-list-item
                  ripple
                  @click="closeSelectFungicida(tipo.tipoFungicidaTipo)"
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
                  @click="closeSelectFungicida(tipo.tipoFungicidaTipo)"
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
            </div>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="saveFinca"
              v-bind:disabled="btndisabled"
            >Guardar</v-btn>
          </v-card-actions>
        </v-form>
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
var moment = require('moment');
var context = null;
var _CoffeeCloud = new CoffeeCloud();

export default {
    name: 'FormFinca',
    props: ["dialog","edicion"],
    components: {
        
    },
    data : () => ({
        map: null,
        marker: null,
        valid_finca: true,
        geolocalizando: false,
        btndisabled: false,
        coffeeGreen: Green,
        finca: {
            fincaCodigo: 0,
            fincaNombre: '',
            fincaAltitud: '',
            departamentoCodigo: '',
            municipioCodigo: '',
            fincaLatitud: 14.7,
            fincaLongitud: -90.5,
            fincaAreaTotal: null,
            fincaAreaCafe: null,
            variedadesCafe: [],
            tiposCafe: [],
            fincaDistPlantaSurco: null,
            fincaDistPlantaPlantas: null,
            fincaSombra : 'N',
            fincaMuestreoSuelos: 'N',
            fincaMuestreoSueloMeses : '',
            fincaFertilizaSuelo: 'N',
            fincaFertilizaSueloMeses: '',
            fincaAplicacionesFoliares: 'N',
            fincaAplicacionesFoliaresMeses: '',
            fincaEnmiendasSuelo: 'N',
            fincaEnmiendasSueloMeses: '',
            fincaManejoTejido: 'N',           
            fincaManejoTejidoMeses: '',
            fincaCalidadAgua: 'N',
            fincaCalidadAguaTipoVerificacion:'',
            fincaProduccionAnualEstimada: null,
            fincaProduccionAnioAnterior: null,
            fincaFloracionAnioAnterior: moment().format().substring(0,10),
            fincaInicioCosechaAnioAnterior: moment().format().substring(0,10),
            fincaFinCosechaAnioAnterior: moment().format().substring(0,10),
            fincaInicioEpocaLluviosaAnioAnterior: moment().format().substring(0,10),
            fincaFinEpocaLluviosaAnioAnterior: moment().format().substring(0,10),
            fincaAplicaFungicidas:'N',
            fincaFungicidas: [],
            userId: ''
        },
        fincaFloracionAnioAnteriorDP: moment().format().substring(0,10),
        fincaInicioCosechaAnioAnteriorDP: moment().format().substring(0,10),
        fincaFinCosechaAnioAnteriorDP: moment().format().substring(0,10),
        fincaInicioEpocaLluviosaAnioAnteriorDP: moment().format().substring(0,10),
        fincaFinEpocaLluviosaAnioAnteriorDP: moment().format().substring(0,10),
        fincaSombraSel : false,
        fincaMuestreoSuelosSel: false,
        fincaMuestreoSueloMesesArr : [],
        fincaFertilizaSueloSel: false,
        fincaFertilizaSueloMesesArr: [],
        fincaAplicacionesFoliaresSel: false,
        fincaAplicacionesFoliaresMesesArr: [],
        fincaEnmiendasSueloSel: false,
        fincaEnmiendasSueloMesesArr: [],
        fincaManejoTejidoSel: false,
        fincaManejoTejidoMesesArr: [],
        fincaCalidadAguaSel: false,
        fincaCalidadPh: false,
        fincaCalidadDureza: false,
        fincaAplicaFungiciasSel: false,

        reglasValidacion: {
            fincaNombreRules: [v=> !!v || 'El nombre de la finca es requerido'],
            altitudRules: [v => !!v || 'Información requerida'],
            latitudRules: [v => !!v || 'Información requerida'],
            longitudRules: [v => !!v || 'Información requerida'],
            fincaAreaTotal: [v => !!v || 'Información requerida', v=> v > 0 || 'Es requerido un valor positivo.'],
            fincaAreaCafe: [v => !!v || 'Información requerida', v=> v > 0 || 'Es requerido un valor positivo.' ],
            fincaDistPlantaSurco: [v=> !!v || 'Información requerida', v=> v > 0 || 'Es requerido un valor positivo.'],
            fincaDistPlantaPlantas: [v=> !!v || 'Información requerida', v=> v > 0 || 'Es requerido un valor positivo.'],
            fincaFloracionAnioAnterior: [v=> !!v || 'Información requerida'],
            fincaInicioCosechaAnioAnterior: [v=> !!v || 'Información requerida'],
            fincaFinCosechaAnioAnterior: [v=> !!v || 'Información requerida'],
            fincaInicioEpocaLluviosaAnioAnterior: [v=> !!v || 'Información requerida'],
            fincaFinEpocaLluviosaAnioAnterior: [v=> !!v || 'Información requerida']
        },
        tiposFungicidas: [],
        departamentos: [],
        municipios: [],
        variedadesCafe: [],
        tiposCafe: [],
        fungicidas: [],
        modal:false,
        menuFloracionPrincipal: false,
        menuInicioCosechaAAnterior: false,
        menuFinalCosechaAAnterior: false,
        menuInicioEpocaLluviosaAAnterior: false,
        menuFinEpocaLluviosaAAnterior: false,
        fincaAplicaFungicidasSel: false,
        meses: [
            { mesCodigo:'01', mesNombre:'Enero' },
            { mesCodigo:'02', mesNombre:'Febrero' },
            { mesCodigo:'03', mesNombre:'Marzo' },
            { mesCodigo:'04', mesNombre:'Abril' },
            { mesCodigo:'05', mesNombre:'Mayo' },
            { mesCodigo:'06', mesNombre:'Junio' },
            { mesCodigo:'07', mesNombre:'Julio' },
            { mesCodigo:'08', mesNombre:'Agosto' },
            { mesCodigo:'09', mesNombre:'Septiembre' },
            { mesCodigo:'10', mesNombre:'Octubre' },
            { mesCodigo:'11', mesNombre:'Noviembre' },
            { mesCodigo:'12', mesNombre:'Diciembre' },
        ],
        tiposFungicidas: []
    }),
    watch: {
        dialog: function(val){
            var c = this;
            if(window.navigator.onLine==false) $('#selectorPunto').hide();
            else $('#selectorPunto').show();

            setTimeout(function(){ c.map.invalidateSize(); },300);
            if(val==false) {
                try
                {
                    document.removeEventListener("backbutton",handleBackButton);
                    
                }
                catch(ex)
                {
                    //console.log(ex);
                }
                
            } else {
                try{
                    document.addEventListener("backbutton",handleBackButton, false);
                    if(this.edicion==null) this.clearData();
                    if(this.edicion!=null)
                    {
                      console.log("Editar");
                      (async () => {
                        let queryFinca = nSQL("fincas").query("select")
                        .where(["fincaCodigoL","=",this.edicion.fincaCodigoL]).exec();
                        var res  = await queryFinca;
                        console.log(res);
                        if(res.length>0)
                        {
                          res[0].fincaFungicidas = [];
                          this.finca = res[0];
                          let queryMunicipios = nSQL("municipios").query("select")
                          .where(["departamentoCodigo","=",this.finca.departamentoCodigo]).exec();
                          var resm = await queryMunicipios;
                          this.municipios = resm;
                          
                          let queryVariedadesCafe = nSQL("variedadesCafeFinca").query("select")
                          .where(["fincaCodigoL","=",this.edicion.fincaCodigoL]).exec();

                          var resvcf = await queryVariedadesCafe;

                          var a = 0;
                          this.finca.variedadesCafe = new Array();
                          for(a=0;a<resvcf.length;a++)
                          {
                            this.finca.variedadesCafe.push(resvcf[a].variedadesCafevariedadCodigo);
                          }

                          let queryTiposCafe = nSQL("tiposCafeFinca").query("select")
                          .where(["fincaCodigoL","=",this.edicion.fincaCodigoL]).exec();

                          var restcf = await queryTiposCafe;

                          this.finca.tiposCafe = new Array();

                          for(a=0;a<restcf.length;a++)
                          {
                            if(restcf[a].tiposCafeTipoCodigo!=null)
                            {
                              this.finca.tiposCafe.push(restcf[a].tiposCafeTipoCodigo);
                            }
                            else
                            {
                              var elements = restcf[a].tiposCafePK.split(",");
                              this.finca.tiposCafe.push(elements[1]*1);
                            }
                          }
                          if(this.finca.fincaSombra=="S")
                          {
                            this.finca.fincaSombraSel = true;
                          }
                          else
                          {
                            this.finca.fincaSombraSel = false;
                          }
                          if(this.finca.fincaMuestreoSuelos=="S")
                          {
                            this.fincaMuestreoSuelosSel = true;
                            var meses = this.finca.fincaMuestreoSueloMeses.split(",");
                            for(a=0;a<meses.length;a++)
                            {
                              this.fincaMuestreoSueloMesesArr.push(meses[a]);
                            }
                          }
                          else
                          {
                            this.finca.fincaMuestreoSuelosSel = false;
                          }
                          if(this.finca.fincaFertilizaSuelo == "S")
                          {
                            this.fincaFertilizaSueloSel = true;
                            var meses = this.finca.fincaFertilizaSueloMeses.split(",");
                            for(a=0;a<meses.length;a++)
                            {
                              this.fincaFertilizaSueloMesesArr.push(meses[a]);
                            }
                          }
                          else
                          {
                            this.fincaFertilizaSueloSel = false;
                          }
                          if(this.finca.fincaAplicacionesFoliares == "S")
                          {
                            this.fincaAplicacionesFoliaresSel = true;
                            var meses = this.finca.fincaAplicacionesFoliaresMeses.split(",");
                            for(a=0;a<meses.length;a++)
                            {
                              this.fincaAplicacionesFoliaresMesesArr.push(meses[a]);
                            }
                          }
                          else
                          {
                            this.fincaAplicacionesFoliaresSel = false;
                          }
                          if(this.finca.fincaEnmiendasSuelo == "S")
                          {
                            this.fincaEnmiendasSueloSel = true;
                            var meses = this.finca.fincaEnmiendasSueloMeses.split(",");
                            for(a=0;a<meses.length;a++)
                            {
                              this.fincaEnmiendasSueloMesesArr.push(meses[a]);
                            }
                          }
                          else
                          {
                            this.fincaEnmiendasSueloSel = false;
                          }
                          if(this.finca.fincaManejoTejido=="S")
                          {
                            this.fincaManejoTejidoSel = true;
                            var meses = this.finca.fincaManejoTejidoMeses.split(",");
                            for(a=0;a<meses.length;a++)
                            {
                              this.fincaManejoTejidoMesesArr.push[meses[a]];
                            }
                          }
                          else
                          {
                            this.fincaManejoTejidoSel = false;
                          }
                          if(this.finca.fincaCalidadAgua=="S")
                          {
                            this.fincaCalidadAguaSel = "S";
                            if(this.finca.fincaCalidadAguaTipoVerificacion=="Ph") {
                              this.fincaCalidadPh = true;
                            }
                            if(this.finca.fincaCalidadAguaTipoVerificacion=="Dureza") {
                              this.fincaCalidadDureza = true;
                            }
                            if(this.finca.fincaCalidadAguaTipoVerificacion=="Ph,Dureza") {
                              this.fincaCalidadPh = true;
                              this.fincaCalidadDureza = true;
                            }
                          }
                          else
                          {
                            this.fincaCalidadAguaSel = false;
                          }
                          if(this.finca.fincaFinCosechaAnioAnterior!=null && this.finca.fincaFinCosechaAnioAnterior!="")
                          {
                            this.fincaFinCosechaAnioAnteriorDP = this.finca.fincaFinCosechaAnioAnterior.split("T")[0];
                          }
                          if(this.finca.fincaFloracionAnioAnterior!=null && this.finca.fincaFloracionAnioAnterior!="")
                          {
                            this.fincaFloracionAnioAnteriorDP = this.finca.fincaFloracionAnioAnterior.split("T")[0];
                          }
                          if(this.finca.fincaInicioCosechaAnioAnterior!=null && this.finca.fincaInicioCosechaAnioAnterior!="")
                          {
                            this.fincaInicioCosechaAnioAnteriorDP = this.finca.fincaInicioCosechaAnioAnterior.split("T")[0];
                          }
                          if(this.finca.fincaFinCosechaAnioAnterior!=null && this.finca.fincaFinCosechaAnioAnterior!="")
                          {
                            this.fincaFinCosechaAnioAnteriorDP = this.finca.fincaFinCosechaAnioAnterior.split("T")[0];
                          }
                          if(this.finca.fincaInicioEpocaLluviosaAnioAnterior != null && this.finca.fincaInicioEpocaLluviosaAnioAnterior != "")
                          {
                            this.fincaInicioEpocaLluviosaAnioAnteriorDP = this.finca.fincaInicioEpocaLluviosaAnioAnterior.split("T")[0];
                          }
                          if(this.finca.fincaFinEpocaLluviosaAnioAnterior != null && this.finca.fincaFinEpocaLluviosaAnioAnterior != "")
                          {
                            this.fincaFinEpocaLluviosaAnioAnteriorDP = this.finca.fincaFinEpocaLluviosaAnioAnterior.split("T")[0];
                          }
                          if(this.finca.fincaAplicaFungicidas=="S")
                          {
                            this.fincaAplicaFungicidasSel = true;
                            let query = nSQL("fungicidasFinca").query("select").where(["fincaCodigoL","=",this.edicion.fincaCodigoL]).exec();
                            var fgcds = await query;
                            console.log(fgcds);
                            if(this.finca.fincaFungicidas==null)
                            {
                              this.finca.fincaFungicidas = new Array();
                            }
                            for(a=0;a<fgcds.length;a++)
                            {
                              if(fgcds[a].fungicidasFungicidaCodigo != null)
                              {
                                this.finca.fincaFungicidas.push(fgcds[a].fungicidasFungicidaCodigo);
                              }
                              else
                              {
                                this.finca.fincaFungicidas.push(fgcds[a].fungicidasFincaPK.split(",")[1] * 1);
                              }
                            }
                          }
                          else
                          {
                            this.fincaAplicaFungicidasSel = false;
                          }
                        }
                      })();
                    }
                }
                catch(ex)
                {
                    //console.log(ex);
                }  
            } 
        },
        fincaFloracionAnioAnteriorDP: function (val) {
            this.finca.fincaFloracionAnioAnterior = moment(val).format();
        },
        fincaInicioCosechaAnioAnteriorDP: function(val) {
            this.finca.fincaInicioCosechaAnioAnterior = moment(val).format();
        },
        fincaFinCosechaAnioAnteriorDP: function(val) {
            this.finca.fincaFinCosechaAnioAnterior = moment(val).format();
        },
        fincaInicioEpocaLluviosaAnioAnteriorDP: function(val) {
            this.finca.fincaInicioEpocaLluviosaAnioAnterior = moment(val).format();
        },
        fincaFinEpocaLluviosaAnioAnteriorDP: function(val) {
            this.finca.fincaFinEpocaLluviosaAnioAnterior = moment(val).format();
        },
        fincaSombraSel: function(val) {
                if(val==true) this.finca.fincaSombra = 'S';
                else this.finca.fincaSombra = 'N';
        },
        fincaMuestreoSuelosSel: function(val) {
            if(val==true) this.finca.fincaMuestreoSuelos = 'S';
            else this.finca.fincaMuestreoSuelos = 'N';
        },
        fincaMuestreoSueloMesesArr: function(val) {
            //console.log(val);
            var i = 0;
            this.finca.fincaMuestreoSueloMeses = '';
            for(i=0;i<val.length;i++)
            {
                if(this.finca.fincaMuestreoSueloMeses=='') this.finca.fincaMuestreoSueloMeses = val[i];
                else this.finca.fincaMuestreoSueloMeses += "," + val[i];
            }
        },
        fincaFertilizaSueloSel: function(val) {
            if(val==true) this.finca.fincaFertilizaSuelo = 'S';
            else this.finca.fincaFertilizaSuelo = 'N';
        },
        fincaFertilizaSueloMesesArr: function(val) {
            var i = 0;
            this.finca.fincaFertilizaSueloMeses = '';
            for(i=0;i<val.length;i++){
                if(this.finca.fincaFertilizaSueloMeses=='') this.finca.fincaFertilizaSueloMeses = val[i];
                else this.finca.fincaFertilizaSueloMeses += ',' + val[i];
            }
        },
        fincaAplicacionesFoliaresSel: function(val) {
            if(val==true) this.finca.fincaAplicacionesFoliares = 'S';
            else this.finca.fincaAplicacionesFoliares = 'N';
        },
        fincaAplicacionesFoliaresMesesArr: function(val) {
            //console.log(val);
            var i = 0;
            this.finca.fincaAplicacionesFoliaresMeses = '';
            for(i=0;i<val.length;i++) {
                if(this.finca.fincaAplicacionesFoliaresMeses=='') this.finca.fincaAplicacionesFoliaresMeses = val[i];
                else this.finca.fincaAplicacionesFoliaresMeses += ',' + val[i];
            }
        },
        fincaEnmiendasSueloSel: function(val) {
            if(val==true) this.finca.fincaEnmiendasSuelo = 'S';
            else this.finca.fincaEnmiendasSuelo = 'N';
        },
        fincaEnmiendasSueloMesesArr: function(val) {
            var i=0;
            this.finca.fincaEnmiendasSueloMeses = '';
            for(i=0;i<val.length;i++){
                if(this.finca.fincaEnmiendasSueloMeses=='') this.finca.fincaEnmiendasSueloMeses = val[i];
                else this.finca.fincaEnmiendasSueloMeses += ',' + val[i];
            }
        },
        fincaManejoTejidoSel: function(val) {
            if(val==true) this.finca.fincaManejoTejidoSuelo = 'S';
            else this.finca.fincaManejoTejidoSuelo = 'N';
        },
        fincaManejoTejidoMesesArr: function(val) {
            var i = 0;
            this.finca.fincaManejoTejidoMeses = '';
            for(i=0;i<val.length;i++) {
                if(this.finca.fincaManejoTejidoMeses=='') this.finca.fincaManejoTejidoMeses = val[i];
                else this.finca.fincaManejoTejidoMeses += ',' + val[i];
            }
        },
        fincaCalidadAguaSel: function(val) {
            if(val==true) this.finca.fincaCalidadAgua = 'S';
            else this.finca.fincaCalidadAgua = 'N';
        },
        fincaCalidadPh: function(val) {
            if(val==true) {
                if(this.fincaCalidadDureza==true) this.finca.fincaCalidadAguaTipoVerificacion = 'Ph,Dureza';
                else this.finca.fincaCalidadAguaTipoVerificacion = 'Ph';
            } else {
                if(this.finca.fincaCalidadDureza==true) this.finca.fincaCalidadAguaTipoVerificacion = 'Dureza';
                else this.finca.fincaCalidadAguaTipoVerificacion = ''; 
            }
        },
        fincaCalidadDureza: function(val) {
            if(val==true) {
                if(this.fincaCalidadPh==true) this.finca.fincaCalidadAguaTipoVerificacion = 'Ph,Dureza';
                else this.finca.fincaCalidadAguaTipoVerificacion = 'Dureza';
            } else {
                if(this.finca.fincaCalidadPh==true) this.finca.fincaCalidadAguaTipoVerificacion = 'Ph';
                else this.finca.fincaCalidadAguaTipoVerificacion = ''; 
            }
        },
        fincaAplicaFungicidasSel: function(val) {
            if(val==true) {
                this.finca.fincaAplicaFungicidas = 'S';
            } else {
                this.finca.fincaAplicaFungicidas = 'N';
            }
        }
    },
    computed:{
      areasRule() {
        return () => this.finca.fincaAreaTotal * 1 >= this.finca.fincaAreaCafe * 1 || 'El área con café no puede ser mayor que el área total.';
      },
    },
    methods: {
        closeTiposCafe: function () {
          this.$refs.tiposCafe.isMenuActive = false;
        },
        closeMuestreoSuelos: function () {
          this.$refs.MuestreoSuelos.isMenuActive = false;
        },
        closeFertilizaSuelo: function () {
          this.$refs.FertilizaSuelo.isMenuActive = false;
        },
        closeAplicacionesFoliares: function () {
          this.$refs.AplicacionesFoliares.isMenuActive = false;
        },
        closeEnmiendasSueloMeses: function () {
          this.$refs.EnmiendasSueloMeses.isMenuActive = false;
        },
        closeManejoTejidoMeses: function () {
          this.$refs.ManejoTejidoMeses.isMenuActive = false;
        },
        closeSelectFungicida: function (tipoFungicidaTipo) {
          this.$refs['fungicidas'+tipoFungicidaTipo][0].isMenuActive = false;
        },
        closeVariedadesCafe: function () {
          this.$refs.VariedadesCafe.isMenuActive = false;
        },
        clearData: function () {
          this.btndisabled = false;
          this.finca.fincaCodigo = 0;
          this.finca.fincaNombre = '';
          //this.finca.fincaAltitud = '';
          this.finca.departamentoCodigo = '';
          this.finca.municipioCodigo = '';
          //this.finca.fincaLatitud = '';
          //this.finca.fincaLongitud = '';
          this.finca.fincaAreaTotal= null;
          this.finca.fincaAreaCafe = null;
          this.finca.variedadesCafe = [];
          this.finca.tiposCafe = [];
          this.finca.fincaDistPlantaSurco = null;
          this.finca.fincaDistPlantaPlantas = null;
          this.finca.fincaSombra = 'N';
          this.finca.fincaMuestreoSuelos = 'N';
          this.finca.fincaMuestreoSueloMeses = '';
          this.finca.fincaFertilizaSuelo = 'N';
          this.finca.fincaFertilizaSueloMeses = '';
          this.finca.fincaAplicacionesFoliares = 'N';
          this.finca.fincaAplicacionesFoliaresMeses = '';
          this.finca.fincaEnmiendasSuelo = 'N';
          this.finca.fincaEnmiendasSueloMeses = '';
          this.finca.fincaManejoTejido = 'N';           
          this.finca.fincaManejoTejidoMeses = '';
          this.finca.fincaCalidadAgua = 'N';
          this.finca.fincaCalidadAguaTipoVerificacion = '';
          this.finca.fincaProduccionAnualEstimada = null;
          this.finca.fincaProduccionAnioAnterior = null;
          this.finca.fincaFloracionAnioAnterior = moment().format().substring(0,10);
          this.finca.fincaInicioCosechaAnioAnterior = moment().format().substring(0,10);
          this.finca.fincaFinCosechaAnioAnterior = moment().format().substring(0,10);
          this.finca.fincaInicioEpocaLluviosaAnioAnterior = moment().format().substring(0,10);
          this.finca.fincaFinEpocaLluviosaAnioAnterior = moment().format().substring(0,10);
          this.finca.fincaAplicaFungicidas = 'N';
          this.finca.fincaFungicidas = [];

          this.fincaFloracionAnioAnteriorDP = moment().format().substring(0,10);
          this.fincaInicioCosechaAnioAnteriorDP = moment().format().substring(0,10);
          this.fincaFinCosechaAnioAnteriorDP = moment().format().substring(0,10);
          this.fincaInicioEpocaLluviosaAnioAnteriorDP = moment().format().substring(0,10);
          this.fincaFinEpocaLluviosaAnioAnteriorDP = moment().format().substring(0,10);
          this.fincaSombraSel = false;
          this.fincaMuestreoSuelosSel = false;
          this.fincaMuestreoSueloMesesArr = [];
          this.fincaFertilizaSueloSel = false;
          this.fincaFertilizaSueloMesesArr = [];
          this.fincaAplicacionesFoliaresSel = false;
          this.fincaAplicacionesFoliaresMesesArr = [];
          this.fincaEnmiendasSueloSel = false;
          this.fincaEnmiendasSueloMesesArr = [];
          this.fincaManejoTejidoSel = false;
          this.fincaManejoTejidoMesesArr = [];
          this.fincaCalidadAguaSel = false;
          this.fincaCalidadPh = false;
          this.fincaCalidadDureza = false;
          this.fincaAplicaFungiciasSel = false; 
          this.menuFloracionPrincipal = false;
          this.menuInicioCosechaAAnterior = false;
          this.menuFinalCosechaAAnterior = false;
          this.menuInicioEpocaLluviosaAAnterior = false;
          this.menuFinEpocaLluviosaAAnterior = false;
          this.fincaAplicaFungicidasSel = false;
        },
        updateMunicipios: function(item) {
            //console.log(item);
            nSQL("municipios").query("select")
            .where(["departamentoCodigo","=",item])
            .exec().then((municipios)=>{
                this.municipios = municipios;
                //console.log(municipios);
            });
        },
        getFungicidas: function (tipo){
            var i = 0;
            var filteredFungicidas = new Array();
            for(i=0;i<this.fungicidas.length;i++)
            {
                if(this.fungicidas[i].tipoFungicidaTipo==tipo)
                {
                    filteredFungicidas.push(this.fungicidas[i]);
                }
            }
            return filteredFungicidas;    
        },
        closeDialog: function(){
            var mensaje = "";
            if(this.edicion==null)
            {
                mensaje = "Esta acción borrará los datos del formulario.";
            }
            else
            {
                mensaje = "No se guardarán cambios a la información de la unidad productiva.";
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
          this.$emit('closedialog','close');
        },
        saveFinca: async function () {
            if(this.finca.departamentoCodigo=="")
            {
              this.$swal('Validación','Debe seleccionar un departamento de la lista','warning');
              return;
            }
            if(this.finca.municipioCodigo=="")
            {
              this.$swal('Validación','Debe seleccionar un departamento de la lista','warning');
              return;
            }
            if(this.finca.departamentoCodigo=="")
            {
              this.$swal('Validación','Debe seleccionar un departamento de la lista','warning');
              return;
            }
            if(this.valid_finca==true) {
                this.btndisabled = true;
                if(this.edicion!=null)
                { // Edicion de finca
                  let updatefinca = nSQL("fincas").query("upsert",this.finca).exec();
                  var rsUpdateFinca = await updatefinca;
                  let deleteVariedades = nSQL("variedadesCafeFinca").query("delete").where(["fincaCodigoL","=",this.finca.fincaCodigoL]).exec();
                  var i = 0;
                  for(i=0;i<this.finca.variedadesCafe.length;i++) {
                    let insertVariedadCafe = nSQL("variedadesCafeFinca")
                                      .query("upsert",{'variedadesCafePK':this.finca.fincaCodigoL + "," + this.finca.variedadesCafe[i],
                                                      'fincaCodigoL':this.finca.fincaCodigoL,
                                                      'variedadesCafevariedadCodigo': this.finca.variedadesCafe[i] * 1,
                                                      'fincaCodigo':this.finca.fincaCodigo
                                                      }).exec();
                    var rsInsertVariedadCafe = await insertVariedadCafe;
                  }
                  let queryDeleteTipos = nSQL("tiposCafeFinca").query("delete").where(["fincaCodigoL","=",this.finca.fincaCodigoL]).exec();
                  for(i=0;i<this.finca.tiposCafe.length;i++)
                  {
                      let insertTipoCafe = await nSQL("tiposCafeFinca")
                          .query("upsert",{'tiposCafePK': this.finca.fincaCodigoL + "," + this.finca.tiposCafe[i],
                                           'fincaCodigoL': this.finca.fincaCodigoL,
                                           'tiposCafeTipoCodigo': this.finca.tiposCafe[i],
                                           'fincaCodigo':this.finca.fincaCodigo
                          }).exec();
                      var rsInsertTipoCafe = await insertTipoCafe;
                  }
                  let queryDeleteFungicidas = nSQL("fungicidasFinca").query("delete").where(["fincaCodigoL","=",this.finca.fincaCodigoL]).exec()
                  for(i=0;i<this.finca.fincaFungicidas.length;i++)
                  {
                    let insertFungicidas = await nSQL("fungicidasFinca")
                                      .query("upsert",{
                                          'fungicidasFincaPK': this.finca.fincaCodigoL + "," + this.finca.fincaFungicidas[i],
                                          'fincaCodigoL': this.finca.fincaCodigoL,
                                          'fungicidasFungicidaCodigo': this.finca.fincaFungicidas[i],
                                          'fincaCodigo':this.finca.fincaCodigo,
                                          'fungicidasFincaMeses':''
                                      }).exec();
                    var rsInsertFungicidas = await insertFungicidas; 
                  }
                  // enviar cambios al servidor.
                  let queryVariedadesCafeFinca = nSQL("variedadesCafeFinca").query("select")
                  .where(["fincaCodigoL","=",this.finca.fincaCodigoL]).exec();
                  var variedadesCafeFinca = await queryVariedadesCafeFinca;

                  let queryTiposCafeFinca = nSQL("tiposCafeFinca").query("select")
                  .where(["fincaCodigoL","=",this.finca.fincaCodigoL]).exec();
                  var tiposCafeFinca = await queryTiposCafeFinca;

                  let queryFungicidasFinca = nSQL("fungicidasFinca").query("select")
                  .where(["fincaCodigoL","=",this.finca.fincaCodigoL]).exec();
                  var fungicidasFinca = await queryFungicidasFinca;

                  this.finca.variedadesCafeFinca = variedadesCafeFinca;
                  this.finca.tiposCafeFinca = tiposCafeFinca;
                  this.finca.fungicidasFinca = fungicidasFinca;
                  _CoffeeCloud.actualizarFinca(this.finca);
                  this.btndisabled = false;
                } 
                else 
                { // Nueva finca
                  try {
                      await nSQL("fincas").query("upsert",this.finca)
                      .exec()
                      .then(async ()=>{
                          await nSQL("fincas").query("select",["MAX(fincaCodigoL) as fincaCodigoL"])
                          .exec()
                          .then((rows)=>{
                              var fincaCodigoL = rows[0].fincaCodigoL;
                              //console.log(fincaCodigoL);
                              var i = 0;
                              for(i=0;i<this.finca.variedadesCafe.length;i++) {
                                  (async (fincaCodigoL,i)=> {
                                      await nSQL("variedadesCafeFinca")
                                      .query("upsert",{'variedadesCafePK':fincaCodigoL + "," + this.finca.variedadesCafe[i],
                                                      'fincaCodigoL':fincaCodigoL,
                                                      'variedadesCafevariedadCodigo': this.finca.variedadesCafe[i] * 1,
                                                      'fincaCodigo':0
                                                      })
                                      .exec()
                                      .then(()=>{
                                          //console.log("Variedad insertada")
                                      });
                                  })(fincaCodigoL,i);
                              }
                              for(i=0;i<this.finca.tiposCafe.length;i++)
                              {
                                  (async (fincaCodigoL,i)=>{
                                      await nSQL("tiposCafeFinca")
                                      .query("upsert",{'tiposCafePK': fincaCodigoL + "," + this.finca.tiposCafe[i],
                                                      'fincaCodigoL': fincaCodigoL,
                                                      'tiposCafeTipoCodigo': this.finca.tiposCafe[i],
                                                      'fincaCodigo':0
                                      }).exec().then(()=>{
                                          //console.log("tipoCafe")
                                      });
                                  })(fincaCodigoL,i);
                              }
                              for(i=0;i<this.finca.fincaFungicidas.length;i++)
                              {
                                  (async (fincaCodigoL,i)=>{
                                      await nSQL("fungicidasFinca")
                                      .query("upsert",{
                                          'fungicidasFincaPK': fincaCodigoL + "," + this.finca.fincaFungicidas[i],
                                          'fincaCodigoL': fincaCodigoL,
                                          'fungicidasFungicidaCodigo': this.finca.fincaFungicidas[i],
                                          'fincaCodigo':0,
                                          'fungicidasFincaMeses':''
                                      })
                                      .exec().then(()=>{
                                          //console.log("Fungicidas");
                                      });
                                  })(fincaCodigoL,i);
                              }
                          });
                          this.$swal('Nueva finca almacenada');
                          this.closeDialogAfterSave();
                          this.btndisabled = false;
                      });
                  } catch(ex) {
                      this.$swal(ex);
                  }
                }
                
            }
            else
            {
                this.$swal('Validación','Debe completar la información requerida','warning');
            }
        }
    },
    mounted () {
        context = this;
        
        if(window.navigator.onLine==false) $('#selectorPunto').hide();
        else $('#selectorPunto').show();

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
        _CoffeeCloud.container = this;
        var storage = window.localStorage;
        this.finca.userId = storage.getItem("userid");

        nSQL().useDatabase("coffeeclouddb");
        nSQL("departamentos").query("select").exec().then((departamentos)=>{
            this.departamentos = departamentos;
        });
        nSQL("variedadesCafe").query("select")
        .exec().then((variedades)=>{
            this.variedadesCafe = variedades;
        });
        nSQL("fungicidas").query("select")
        .exec().then((fungicidas)=>{
            this.fungicidas = fungicidas;
             nSQL("tiposFungicidas").query("select")
            .exec().then((tipos)=>{
                this.tiposFungicidas = tipos;
                //console.log(tipos);
            });
        });
        nSQL("tiposCafe").query("select")
        .exec().then((tipos)=>{
            this.tiposCafe = tipos;
        });

        var cAccuracy = null;
        if(this.edicion==null) {
          if(typeof device != 'undefined')
          { 
            if(device.platform === 'Android' && AdvancedGeolocation!=null) {
              context.geolocalizando = true;
              try {
              AdvancedGeolocation.start(function(success){
              try{
                  var jsonObject = JSON.parse(success);
                          switch(jsonObject.provider){
                              case "gps":
                                  if(jsonObject.latitude != "0.0"){
                                      
                                      if(cAccuracy===null) cAccuracy = jsonObject.accuracy;
                                      if(cAccuracy > jsonObject.accuracy) {
                                          cAccuracy = jsonObject.accuracy;
      
                                          context.finca.fincaLatitud = jsonObject.bufferedLatitude;
                                          context.finca.fincaLongitud = jsonObject.bufferedLongitude;
                                          context.finca.fincaAltitud = jsonObject.altitude;
                                          context.geolocalizando = false;
                                          if(context.marker!=null) {
                                            context.marker.setLatLng(L.latLng(context.finca.fincaLatitud,context.finca.fincaLongitud));
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
                                      
                                          context.finca.fincaLatitud = jsonObject.bufferedLatitude;
                                          context.finca.fincaLongitud = jsonObject.bufferedLongitude;
                                          context.finca.fincaAltitud = jsonObject.altitude;
                                          context.geolocalizando = false;
                                          if(context.marker!=null) {
                                            context.marker.setLatLng(L.latLng(context.finca.fincaLatitud,context.finca.fincaLongitud));
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
                                      
                                          context.finca.fincaLatitud = jsonObject.bufferedLatitude;
                                          context.finca.fincaLongitud = jsonObject.bufferedLongitude;
                                          context.finca.fincaAltitud = jsonObject.altitude;
                                          context.geolocalizando = false;
                                          if(context.marker!=null) {
                                            context.marker.setLatLng(L.latLng(context.finca.fincaLatitud,context.finca.fincaLongitud));
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
                                      
                                          context.finca.fincaLatitud = jsonObject.bufferedLatitude;
                                          context.finca.fincaLongitud = jsonObject.bufferedLongitude;
                                          context.finca.fincaAltitud = jsonObject.altitude;
                                          context.geolocalizando = false;
                                          if(context.marker!=null) {
                                            context.marker.setLatLng(L.latLng(context.finca.fincaLatitud,context.finca.fincaLongitud));
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
                                      
                                          context.finca.fincaLatitud = jsonObject.bufferedLatitude;
                                          context.finca.fincaLongitud = jsonObject.bufferedLongitude;
                                          context.finca.fincaAltitud = jsonObject.altitude;
                                          context.geolocalizando = false;
                                          if(context.marker!=null) {
                                            context.marker.setLatLng(L.latLng(context.finca.fincaLatitud,context.finca.fincaLongitud));
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
                          console.log("Invalid JSON: " + exc);
                      }   
                  },
                  function(error){
                      console.log("ERROR! " + JSON.stringify(error));
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
                catch(ex) {
                  console.log(ex);
                }
              }
              else if (navigator.geolocation) {
                  //console.log("Navigator geolocation");
                  try
                  {
                    navigator.geolocation.getCurrentPosition(function (position) {
                            
                        context.finca.fincaLatitud = position.coords.latitude;
                        context.finca.fincaLongitud = position.coords.longitude;
                        context.finca.fincaAltitud = position.coords.altitude;
                            
                    },function () {
                        console.log(ex);
                    },
                    {maximumAge: 3000, maxtimeout:10000, enableHighAccuracy: true });
                  }
                  catch(ex)
                  {
                    console.log(ex);
                  }
              }  
          }
        }
        else if (navigator.geolocation) {
          try{
            //console.log("Navigator geolocation");
            navigator.geolocation.getCurrentPosition(function (position) {
                    
                context.finca.fincaLatitud = position.coords.latitude;
                context.finca.fincaLongitud = position.coords.longitude;
                context.finca.fincaAltitud = position.coords.altitude;
                    
            },function (ex) {
                console.log(ex);
            },
            {maximumAge: 3000, timeout:10000, enableHighAccuracy: true });
          }
          catch(ex)
          {
            console.log(ex);
          }
            
        }

        L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
        this.map = L.map('selectorPunto',{gestureHandling: false}).setView([15.5, -90.5], 5);
        this.map.touchZoom.disable();
        this.map.scrollWheelZoom.disable();

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
          context.finca.fincaLatitud = position.lat;
          context.finca.fincaLongitud = position.lng;
          
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

        if(this.edicion!=null)
        {
            console.log("Editar");
            (async () => {
              let queryFinca = nSQL("fincas").query("select")
              .where(["fincaCodigoL","=",this.edicion.fincaCodigoL]).exec();
              var res  = await queryFinca;
              console.log(res);
              if(res.length>0)
              {
                res[0].fincaFungicidas = [];
                this.finca = res[0];
                let queryMunicipios = nSQL("municipios").query("select")
                .where(["departamentoCodigo","=",this.finca.departamentoCodigo]).exec();
                var resm = await queryMunicipios;
                this.municipios = resm;
                
                let queryVariedadesCafe = nSQL("variedadesCafeFinca").query("select")
                .where(["fincaCodigoL","=",this.edicion.fincaCodigoL]).exec();

                var resvcf = await queryVariedadesCafe;

                var a = 0;
                this.finca.variedadesCafe = new Array();
                for(a=0;a<resvcf.length;a++)
                {
                  this.finca.variedadesCafe.push(resvcf[a].variedadesCafevariedadCodigo);
                }

                let queryTiposCafe = nSQL("tiposCafeFinca").query("select")
                .where(["fincaCodigoL","=",this.edicion.fincaCodigoL]).exec();

                var restcf = await queryTiposCafe;

                this.finca.tiposCafe = new Array();

                for(a=0;a<restcf.length;a++)
                {
                  if(restcf[a].tiposCafeTipoCodigo!=null)
                  {
                    this.finca.tiposCafe.push(restcf[a].tiposCafeTipoCodigo);
                  }
                  else
                  {
                    var elements = restcf[a].tiposCafePK.split(",");
                    this.finca.tiposCafe.push(elements[1]*1);
                  }
                }
                if(this.finca.fincaSombra=="S")
                {
                  this.finca.fincaSombraSel = true;
                }
                else
                {
                  this.finca.fincaSombraSel = false;
                }
                if(this.finca.fincaMuestreoSuelos=="S")
                {
                  this.fincaMuestreoSuelosSel = true;
                  var meses = this.finca.fincaMuestreoSueloMeses.split(",");
                  for(a=0;a<meses.length;a++)
                  {
                    this.fincaMuestreoSueloMesesArr.push(meses[a]);
                  }
                }
                else
                {
                  this.finca.fincaMuestreoSuelosSel = false;
                }
                if(this.finca.fincaFertilizaSuelo == "S")
                {
                  this.fincaFertilizaSueloSel = true;
                  var meses = this.finca.fincaFertilizaSueloMeses.split(",");
                  for(a=0;a<meses.length;a++)
                  {
                    this.fincaFertilizaSueloMesesArr.push(meses[a]);
                  }
                }
                else
                {
                  this.fincaFertilizaSueloSel = false;
                }
                if(this.finca.fincaAplicacionesFoliares == "S")
                {
                  this.fincaAplicacionesFoliaresSel = true;
                  var meses = this.finca.fincaAplicacionesFoliaresMeses.split(",");
                  for(a=0;a<meses.length;a++)
                  {
                    this.fincaAplicacionesFoliaresMesesArr.push(meses[a]);
                  }
                }
                else
                {
                  this.fincaAplicacionesFoliaresSel = false;
                }
                if(this.finca.fincaEnmiendasSuelo == "S")
                {
                  this.fincaEnmiendasSueloSel = true;
                  var meses = this.finca.fincaEnmiendasSueloMeses.split(",");
                  for(a=0;a<meses.length;a++)
                  {
                    this.fincaEnmiendasSueloMesesArr.push(meses[a]);
                  }
                }
                else
                {
                  this.fincaEnmiendasSueloSel = false;
                }
                if(this.finca.fincaManejoTejido=="S")
                {
                  this.fincaManejoTejidoSel = true;
                  var meses = this.finca.fincaManejoTejidoMeses.split(",");
                  for(a=0;a<meses.length;a++)
                  {
                    this.fincaManejoTejidoMesesArr.push[meses[a]];
                  }
                }
                else
                {
                  this.fincaManejoTejidoSel = false;
                }
                if(this.finca.fincaCalidadAgua=="S")
                {
                  this.fincaCalidadAguaSel = "S";
                  if(this.finca.fincaCalidadAguaTipoVerificacion=="Ph") {
                    this.fincaCalidadPh = true;
                  }
                  if(this.finca.fincaCalidadAguaTipoVerificacion=="Dureza") {
                    this.fincaCalidadDureza = true;
                  }
                  if(this.finca.fincaCalidadAguaTipoVerificacion=="Ph,Dureza") {
                    this.fincaCalidadPh = true;
                    this.fincaCalidadDureza = true;
                  }
                }
                else
                {
                  this.fincaCalidadAguaSel = false;
                }
                if(this.finca.fincaFinCosechaAnioAnterior!=null && this.finca.fincaFinCosechaAnioAnterior!="")
                {
                  this.fincaFinCosechaAnioAnteriorDP = this.finca.fincaFinCosechaAnioAnterior.split("T")[0];
                }
                if(this.finca.fincaFloracionAnioAnterior!=null && this.finca.fincaFloracionAnioAnterior!="")
                {
                  this.fincaFloracionAnioAnteriorDP = this.finca.fincaFloracionAnioAnterior.split("T")[0];
                }
                if(this.finca.fincaInicioCosechaAnioAnterior!=null && this.finca.fincaInicioCosechaAnioAnterior!="")
                {
                  this.fincaInicioCosechaAnioAnteriorDP = this.finca.fincaInicioCosechaAnioAnterior.split("T")[0];
                }
                if(this.finca.fincaFinCosechaAnioAnterior!=null && this.finca.fincaFinCosechaAnioAnterior!="")
                {
                  this.fincaFinCosechaAnioAnteriorDP = this.finca.fincaFinCosechaAnioAnterior.split("T")[0];
                }
                if(this.finca.fincaInicioEpocaLluviosaAnioAnterior != null && this.finca.fincaInicioEpocaLluviosaAnioAnterior != "")
                {
                  this.fincaInicioEpocaLluviosaAnioAnteriorDP = this.finca.fincaInicioEpocaLluviosaAnioAnterior.split("T")[0];
                }
                if(this.finca.fincaFinEpocaLluviosaAnioAnterior != null && this.finca.fincaFinEpocaLluviosaAnioAnterior != "")
                {
                  this.fincaFinEpocaLluviosaAnioAnteriorDP = this.finca.fincaFinEpocaLluviosaAnioAnterior.split("T")[0];
                }
                if(this.finca.fincaAplicaFungicidas=="S")
                {
                  this.fincaAplicaFungicidasSel = true;
                  let query = nSQL("fungicidasFinca").query("select").where(["fincaCodigoL","=",this.edicion.fincaCodigoL]).exec();
                  var fgcds = await query;
                  console.log(fgcds);
                  if(this.finca.fincaFungicidas==null)
                  {
                    this.finca.fincaFungicidas = new Array();
                  }
                  for(a=0;a<fgcds.length;a++)
                  {
                    if(fgcds[a].fungicidasFungicidaCodigo != null)
                    {
                      this.finca.fincaFungicidas.push(fgcds[a].fungicidasFungicidaCodigo);
                    }
                    else
                    {
                      this.finca.fincaFungicidas.push(fgcds[a].fungicidasFincaPK.split(",")[1] * 1);
                    }
                  }
                }
                else
                {
                  this.fincaAplicaFungicidasSel = false;
                }
              }
            })();  
        }
    }  
};
        function handleBackButton() {
            //console.log(context.dialog);
            var mensaje = "";
            if(this.edicion==null)
            {
                mensaje = "Esta acción borrará los datos del formulario.";
            }
            else
            {
                mensaje = "No se guardarán cambios a la información de la unidad productiva.";
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