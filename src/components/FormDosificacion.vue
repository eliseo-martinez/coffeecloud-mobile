<template>
    <v-container>
       <v-layout column>
           <v-card>
                <v-toolbar dark style="background-color: #008869 !important; border-color: #008869 !important;">
                    <v-btn icon dark v-on:click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Cálculo de la dosificación</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                    </v-toolbar-items>
                </v-toolbar>
                <v-form>
                    <div style="padding:20px;">
                        <v-select
                            :items="enfermedades"
                            v-model="enfermedad"
                            label="Enfermedad"
                        >
                        </v-select>
                        <v-select
                            :items="productos"
                            v-model="producto1"
                            item-text="nombreProducto1"
                            item-value="id"
                            label="Productos (Insecticida o Fungicida)"
                        >
                        </v-select>
                        {{ producto2 }}
                        <v-row>
                            <v-col>
                                <v-text-field
                                v-model="plantas"
                                label="Plantas atomizadas"
                                type="number"
                                required
                                ></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field
                                v-model="litrosGastados"
                                label="Litros Gastados"
                                type="number"
                                required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field
                                v-model="distanciamientoSurco"
                                label="Distancia entre surco"
                                type="number"
                                required
                                ></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field
                                v-model="distanciamientoPlanta"
                                label="Distancia entre planta"
                                type="number"
                                required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                       <div style="text-align:center;">
                            <v-btn
                                tile
                                color="success"
                                style="margin-top:20px; padding:25px;"
                                @click="calcular">
                                <v-icon left>
                                    mdi-spray
                                </v-icon>
                                Calcular
                            </v-btn>
                       </div>
                                
                        <v-card style="background-color:#82003d;color:#fff;padding:20px; margin-top:20px; text-align:center; font-size:14pt;">
                            <div v-html="linea1"></div>
                            <div v-html="linea2"></div>
                        </v-card>
                    </div>
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
var context = null;
var _CoffeeCloud = new CoffeeCloud();
export default {
    name: 'FormDosificacion',
    props: ['dialogDosificacion'],
    components: {
        
    },
    data : () => ({
        enfermedades: ['Broca','Roya','Ojo de Gallo','Derrite','Mal de hilachas'],
        productos: [],
        enfermedad: null,
        producto1: null,
        producto2: null,
        quimicos: [],
        plantas: '',
        litrosGastados: '',
        distanciamientoSurco: '',
        distanciamientoPlanta: '',
        linea1: '',
        linea2: ''
    }),
    async mounted(){
        _CoffeeCloud.container = this;
        context = this;
        _CoffeeCloud.getQuimicosDosificacion();
    },
    methods: {
        closeDialog: function() {
            this.$emit('closedialog','close');
        },
        calcular: async function() {
            if(this.plantas==null || this.plantas=="" ||
               this.litrosGastados==null || this.litrosGastados=="" ||
               this.distanciamientoSurco==null || this.distanciamientoSurco=="" ||
               this.distanciamientoPlanta==null || this.distanciamientoPlanta==null)
            {
                this.$swal("Favor complete la información para realizar el cálculo");
            }
            else if(this.plantas<=0 || 
                    this.litrosGastados<=0 || 
                    this.distanciamientoSurco<=0 ||
                    this.distanciamientoPlanta<=0)
            {
                this.$swal("Los valores ingresados deben ser mayores que 0.");
            }
            else
            {
                let query = nSQL(this.productos).query("select").where(["id","=",this.producto1]).exec();
                var producto = await query;
                producto = producto[0];
                var dosisProducto1 = producto.dosisProducto1 * 1000;
                var dosisProducto2 = producto.dosisProducto2 * 1000;
                var litrosMz = (this.litrosGastados/this.plantas)*(7000/this.distanciamientoSurco*this.distanciamientoPlanta);
                var tonelMz = litrosMz / 200;
                var ccProducto1Tonel = (dosisProducto1 / litrosMz) * 200;
                var ccProducto2Tonel = (dosisProducto2 / litrosMz) * 200;
                var ccProducto1 = dosisProducto1 / litrosMz;
                var ccProducto2 = dosisProducto2 / litrosMz;

                if(producto.nombreProducto2!=null)
                {
                    this.linea1 = producto.nombreProducto1 + " <b>" + ccProducto1.toFixed(1) + "</b> cc/litro";
                    this.linea2 = " + " + producto.nombreProducto2 + " <b>" + ccProducto2.toFixed(1) + "</b> cc/litro";
                }
                else
                {
                    this.linea1 = producto.nombreProducto1 + " <b>" + ccProducto1.toFixed(1) + "</b> cc / litro";
                    this.linea2 = "";
                }
            }
        }
    },
    watch:{
        dialogDosificacion: function(val){
            if(val==true) {
                _CoffeeCloud.getQuimicosDosificacion();
            }
        },
        enfermedad: async function (val) {
            let query = nSQL(this.quimicos).query("select").where(["plaga","=",val]).exec();
            this.productos = await query;
        },
        producto1: async function (val) {
            let query = nSQL(this.productos).query("select").where(["id","=",val]).exec();
            var producto = await query;
            console.log(producto);
            if(producto[0].nombreProducto2!=null)
            {
                this.producto2 = "+ " + producto[0].nombreProducto2;
            }
        }
    }
};
</script>