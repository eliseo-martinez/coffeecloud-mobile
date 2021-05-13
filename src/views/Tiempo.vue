<template>
  <v-container class="grey lighten-3 fill-height">
       <v-layout column>
            <section class="content-header">
                <h1>
                    Informaci&oacute;n climática
                    <small>Tiempo actual</small>
                </h1>
            </section>
            <v-divider></v-divider>
            <v-card tile>
                <v-card-title>Tiempo actual</v-card-title>
                <v-card-text>
                  <div class="box-body">
                        <h3>{{ ubicacion }}</h3>
                        {{ getFecha(hora) }}
                        <br />
                        <h4>{{ condicion }}</h4>
                        <br />
                        Humedad <b>{{ humedad }}</b>
                        <br />
                        Viento <b>{{ viento }}</b>
                        <br />
                        Presi&oacute;n barom&eacute;trica <b>{{ presion }}</b>
                        <br />
                        UV <b>{{ uv }}</b>
                    </div>
                </v-card-text>
            </v-card>
            <v-card tile>
                
                <v-card-text>
                  <p v-html="resumen"></p>
                </v-card-text>
            </v-card>
            <v-card tile>
                <v-card-title>Temperaturas</v-card-title>
                <v-card-text>
                  <canvas id="chartTemperatura"></canvas>
                </v-card-text>
            </v-card>
            <v-card tile>
                <v-card-title>Probabilidad de lluvia</v-card-title>
                <v-card-text>
                  <canvas id="chartLluvia"></canvas>
                </v-card-text>
            </v-card>
       </v-layout>
  </v-container>
</template>
<script>
import format from 'date.format';
import $ from 'jquery';
import Chart from "chart.js";

var main = null;
export default {
  name: 'TiempoActual',
  components: {
    
  },
  data: () => ({
    ubicacion: '',
    hora: 0,
    fecha: new Date(),
    condicion: '',
    humedad: '',
    viento: '',
    presion: '',
    uv: '',
    resumen: ''
  }),
  mounted () {
    main = this;
    this.hora = this.fecha.getTime();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getPronostico,this.showError,{timeout:10000, enableHighAccuracy: true });
    }
    else {
      //console.log("Geolocation not available");
    }
  },
  methods: {
    getFecha: function () {
      return this.fecha.toLocaleString().substring(0,10);
    },
    showError: function(error) {
      //console.log(error);
      this.getPronostico({coords:{latitude:13.5,longitude:-89.8}});
    },
    getPronostico: function(position) {
      $.ajax({
            url: 'https://climaya.com/fp-weather/api/_dsapi.php',
            method: 'GET',
            data: {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            },
            dataType: 'json'
        }).done(function (data) {
            main.ubicacion = data.cy_city;
            main.hora = data.currently.time;
            main.condicion = data.currently.summary;
            main.humedad = (data.currently.humidity * 100) + "%";
            main.viento = data.currently.windSpeed + " Km/h" + " del " + data.currently.cy_bearing;
            main.presion = data.currently.pressure + " mb";
            main.uv = data.currently.uvIndex;
            main.resumen = "<b>Resumen semanal</b> " + data.daily.summary;
            var temperaturasH = new Array();
            var temperaturasL = new Array();
            var temperaturasLabels = new Array();
            var precipitacion = new Array();
            var i = 0;
            for (i = 0; i < data.daily.data.length; i++) {
                temperaturasH.push(data.daily.data[i].temperatureHigh);
                temperaturasL.push(data.daily.data[i].temperatureLow);
                precipitacion.push(data.daily.data[i].precipProbability);
                temperaturasLabels.push(new Date(data.daily.data[i].time * 1000).toLocaleDateString());
                /*data.daily.data[i].precipProbability = data.daily.data[i].precipProbability * 100;
                console.log(data.daily.data[i].cy_icon);*/
            }

            var ctxTemp = document.getElementById('chartTemperatura').getContext('2d');
            var ctxLluvia = document.getElementById('chartLluvia').getContext('2d');
            window.chartColors = {
              red: 'rgb(255, 99, 132)',
              orange: 'rgb(255, 159, 64)',
              yellow: 'rgb(255, 205, 86)',
              green: 'rgb(75, 192, 192)',
              blue: 'rgb(54, 162, 235)',
              purple: 'rgb(153, 102, 255)',
              grey: 'rgb(201, 203, 207)'
            };
            var color = Chart.helpers.color;
            var myChartTemperatura = new Chart(ctxTemp, {
              type: 'bar',
              data: {
                labels: temperaturasLabels,
                datasets: [
                  {
                    label: 'Temperatura Máxima',
                    data: temperaturasH,
                    backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString()
                  },
                  {
                    label: 'Temperatura Mínima',
                    data: temperaturasL,
                    backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString()
                  }
                ] 
              }
            });

            var myChartPrecipitacion = new Chart(ctxLluvia, {
              type: 'bar',
              data: {
                labels: temperaturasLabels,
                datasets: [
                  {
                    label: 'Probabilidad de Precipitación',
                    data: precipitacion,
                    backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString()
                  }
                ] 
              }
            });
            
        });
    }
  },
};
</script>