<template>
    <v-container class="grey lighten-3 fill-height">
       <v-layout column>
            <div id="map"></div>
       </v-layout>
  </v-container>
</template>
<script>
import { CoffeeCloud } from '../coffeecloud';
import '../coffeecloud.css'
import '../map.css'
import axios from 'axios';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as Lesri from 'esri-leaflet';
import $ from 'jquery';

var _CoffeeCloud = new CoffeeCloud;

export default {
  name: 'Estaciones',
  components: {
    
  },
  data: () => ({
    map: null
  }),
  methods: {
        round: function (value, precision) {
                var multiplier = Math.pow(10, precision || 0);
                return Math.round(value * multiplier) / multiplier;
        },
        dir_viento: function (p_dir,p_vel) {
            if (this.round(p_vel,0)==0) return "🔵";
            if (p_dir>=  0 && p_dir< 13) return "⬇️";
            if (p_dir>= 13 && p_dir< 58) return "↙️";
            if (p_dir>= 58 && p_dir<103) return "⬅️";
            if (p_dir>=103 && p_dir<148) return "↖️";
            if (p_dir>=148 && p_dir<193) return "⬆️";
            if (p_dir>=193 && p_dir<238) return "↗️"; 
            if (p_dir>=238 && p_dir<283) return "➡️";
            if (p_dir>=283 && p_dir<328) return "↘️";
            if (p_dir>=328)              return "⬇️";
        },
        class_color: function (p_variable,p_valor) {
            var clase;
    
            if (p_variable=='temp'){
                switch (true){
                    case p_valor < 10:
                        clase='azul';
                        break;
                    case p_valor <= 15:
                        clase='verdeo';
                        break;    
                    case  p_valor <= 20:
                        clase = 'verde';
                        break;
                    case p_valor <= 25:
                        clase='amarillo';
                        break;
                    case p_valor <= 30:
                        clase='naranja';
                        break;
                    case p_valor <= 35:
                        clase='rojo';
                        break;
                    case p_valor <= 40:
                        clase='corinto';
                        break;
                    case p_valor <= 45:
                        clase='ladrillo';
                        break;
                    default:
                        clase='';
                } //endSwitch
            } //temp
   
            return p_variable+' '+clase;
        },
        popup: function (){
            var resp=   "'<div style=|width:150px;|><table width=|99%| bgcolor=|#f0f0f0| style=|text-align:center|><caption><b>";
            resp = resp+"<big><a href=|https://anacafe-met.firebaseapp.com/estacion.html?id='+feature.properties.IdEstacion+'&n='+feature.properties.Nombre+'&lat='+feature.properties.Latitud+'&lon='+feature.properties.Longitud+'| target=|_top|>'+feature.properties.IdEstacion+' '+feature.properties.Nombre+'</a></big></b><br><small>'+feature.properties.obs.Fecha.replace('T','  ') + '</small></caption><thead><tr><th>Variable</th><th>Valor</th></tr></thead><tbody><tr><td>🌡️ °C</td><td>'+feature.properties.obs.TMP+'</td></tr><tr><td>💧 °C</td><td>'+feature.properties.obs.DEW+'</td></tr><tr><td>💧 %</td><td>'+feature.properties.obs.HMD+'</td></tr><tr><td>🚩 kph</td><td>'+feature.properties.obs.WND+' @ '+feature.properties.obs.WNG+'</td></tr><tr><td>☀️ W/m2</td><td>'+feature.properties.obs.SRD+'</td></tr><tr><td>🌧️ mm</td><td>'+feature.properties.obs.RNF+'</td></tr></tbody></table></div>'";
            return resp; 
        },
        loadData: function (){
            var ts = Math.floor(Date.now()/1000-(3600));
            var api_url = 'https://dev.coffeecloudapp.com/servicios/api.php?op=data&ts='+Math.random();
			var request = new XMLHttpRequest();
			request.open('GET',api_url , true);
            var c = this;
			request.onload = function() {
				if (request.status >= 200 && request.status < 400) {
					// Success!
					var loadedData = JSON.parse(request.responseText);         
                    var data = {
                        type: "FeatureCollection",
                        features: [],
                    };
                    var i = 0;
                    for (i = 0; i < loadedData.length; i++) {
                        data.features.push({
                            "type": "Feature",
                            "geometry": {
                            "type": "Point",
                            "coordinates": [loadedData[i].Longitud*1, loadedData[i].Latitud*1]
                            },
                            "properties": 
                            loadedData[i]
                        });
                    }
         
                    var gjdata=data;
				    c.populateMap(data);
          
				} else {
					// We reached our target server, but it returned an error
				}
			};

			request.onerror = function() {
				// There was a connection error of some sort
			};
			request.send();
        },
        populateMap: function (data) {
            var c = this;
            var v_min,v_max,map,updated,lat,lon,z,ele;
            var grid_var,titulo,region,banned,Grid,count,gtpoints;
            var gjdata, variable;
            z=7;
            lat=15.79;
            lon=-90.5;
            variable='temp';
			this.map = L.map('map',{ minZoom: 5, maxZoom: 17 }).setView([lat,lon], z);
			console.log('populateMap->data', data);
			var esriImages = new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{	maxZoom: 18});
			var esriLabels = new L.TileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}');
			var Esri_WorldShadedRelief = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}');
			var OpenMapSurfer_Grayscale = L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
				maxZoom: 19,
				attribution: 'Imagery from <a href="https://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			});
			var gris = L.tileLayer('https://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png');
            var Esri_WorldTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
	            attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
	            maxZoom: 13
            });
            var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                subdomains: 'abcd',
                minZoom: 0,
                maxZoom: 20,
                ext: 'png'
            });
            var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Esri, iPC, USGS'
            });
            var esriImages = new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
            var esriLabels = new L.TileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}');
      
			var esri = L.layerGroup([esriImages, esriLabels]);
            this.map.addLayer(esriImages);

            var ts = Math.floor(Date.now()/1000-(3600));

            var goes = new L.TileLayer('https://realearth.ssec.wisc.edu/proxy/image.php?products=G16-ABI-FD-BAND13-GRAD&x={x}&y={y}&z={z}&debug=false'+'&rnd='+ts,
                {opacity: 0.5}
            );
            var goesV = new L.TileLayer('https://realearth.ssec.wisc.edu/proxy/image.php?products=G16-ABI-FD-BAND02&x={x}&y={y}&z={z}&debug=false'+'&rnd='+ts,
                {opacity: 0.5}
            );
            var GLM = new L.TileLayer('https://realearth.ssec.wisc.edu/proxy/image.php?products=glmgroupdensity&x={x}&y={y}&z={z}&debug=false'+'&rnd='+ts,
                {opacity: 0.6}
            );
            var hydroEstimator = new L.TileLayer('https://realearth.ssec.wisc.edu/proxy/image.php?products=NESDIS-GHE-HourlyRainfall&x={x}&y={y}&z={z}&debug=false'+'&rnd='+ts,
                {opacity: 0.5}
            );
    
            var regiones =  Lesri.dynamicMapLayer({
                url: 'https://dev.coffeecloudapp.com/arcgis/rest/services/wmRegionesAdministrativas/MapServer',opacity: 0.25
            });

            var areas =  Lesri.dynamicMapLayer({
                url: 'https://dev.coffeecloudapp.com/arcgis/rest/services/wmAreaConCafe/MapServer',opacity: 0.5
            });

            var roya =  Lesri.dynamicMapLayer({
                url: 'https://dev.coffeecloudapp.com/arcgis/rest/services/IncidenciaDeRoya/MapServer',opacity: 0.5
            });

			var sampledPoints = data;

			var marker_estacion = {
				radius: 8,
				fillColor: "maroon",
				color: "#fff",
				weight:1,
				opacity: 1,
				fillOpacity: 0.8
            };

            var marker_tiempo_real = {
                radius: 8,
                fillColor: "#0f0",
                color: "#fff",
                weight: .5,
                opacity: 1,
                fillOpacity: 0.8
            };
      
            var marker_valor = {
				radius: 15,
				fillColor: "#00f",
				color: "#fff",
				weight: 0,
				opacity: 1,
				fillOpacity: 0
			};
         
	        var estaciones= L.geoJson(data.features, {
        		pointToLayer: function(feature, latlng) {
					return L.circleMarker(latlng, marker_estacion);
				},
				onEachFeature: function(feature, layer) {
                    var label =  feature.properties.IdEstacion+' '+feature.properties.Nombre ;
					layer.bindPopup(feature.properties.Nombre).
                    bindTooltip( label , {permanent: false, direction: "right" })
				}
			});
    
            var tiempo_real= L.geoJson(data.features, {
                filter: function(feature, layer) {
                    return feature.properties.m<=60; 
                }, 
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, marker_tiempo_real);
                },
                onEachFeature: function(feature, layer) {
                    var label =  feature.properties.IdEstacion+' '+feature.properties.Nombre ;
                    layer.bindPopup(eval(c.popup().split('|').join('"'))).bindTooltip( label , {permanent: false, direction: "right"})
                }
            });

            var temp = L.geoJson(data.features, {
                filter: function(feature, layer) {
                    return feature.properties.m<=60; 
                }, 
				pointToLayer: function(feature, latlng) {
					return L.circleMarker(latlng, marker_valor);
				},
				onEachFeature: function(feature, layer) {
                var label =  c.round(feature.properties.obs.TMP*1,1)+'';
					layer.bindPopup(eval(c.popup().split('|').join('"'))).bindTooltip( label , {permanent: true, direction: "center", className: c.class_color('temp',feature.properties.obs.TMP*1)})
				}
			});
      
            var humedad= L.geoJson(data.features, {
                filter: function(feature, layer) {
                    return feature.properties.m<=60; 
                }, 
				pointToLayer: function(feature, latlng) {
					return L.circleMarker(latlng, marker_valor);
				},
				onEachFeature: function(feature, layer) {
                    var label =  c.round(feature.properties.obs.HMD*1,0)+'';
					layer.bindPopup(eval(c.popup().split('|').join('"'))).
                    bindTooltip( label , {permanent: true, direction: "center",className: "my-labels" })
				}
			});
      
            var dirviento= L.geoJson(data.features, {
                filter: function(feature, layer) {
                    return feature.properties.m<=60; 
                }, 
				pointToLayer: function(feature, latlng) {
					return L.circleMarker(latlng, marker_valor);
				},
				onEachFeature: function(feature, layer) {
                    var label =  c.dir_viento(c.round(feature.properties.obs.WND*1,0),feature.properties.obs.WNG*1)+' '+c.round(feature.properties.obs.WNG*1,0); 
					layer.bindPopup(
                    eval(c.popup().split('|').join('"'))
                    ).bindTooltip( label , {permanent: true, direction: "center",className: "my-labelss" })
				}
			});
      
            var precip= L.geoJson(data.features, {
                filter: function(feature, layer) {
                    return feature.properties.m<=60; 
                }, 
				pointToLayer: function(feature, latlng) {
					return L.circleMarker(latlng, marker_valor);
				},
				onEachFeature: function(feature, layer) {
                    var label =  c.round(feature.properties.obs.RNF*1,1)+'';
					layer.bindPopup(eval(c.popup().split('|').join('"'))).
                    bindTooltip( label , {permanent: true, direction: "center",className: "my-labelss" })
				}
			});

            var radiacion= L.geoJson(data.features, {
                filter: function(feature, layer) {
                    return feature.properties.m<=60; 
                }, 
				pointToLayer: function(feature, latlng) {
					return L.circleMarker(latlng, marker_valor);
				},
				onEachFeature: function(feature, layer) {
                    var label =  c.round(feature.properties.obs.SRD*1,0)+'';
					layer.bindPopup(eval(c.popup().split('|').join('"'))).
                    bindTooltip( label , {permanent: true, direction: "center",className: "my-labelss" })
				}
			});
      
            var overlays = {
                "<big>🛰️ Satélite VIS</big>": goesV,
                "<big>🛰️ Satélite IR</big>": goes,
                "<big>🛰️ Lluvia -1H</big>": hydroEstimator
            }; 

            var capas_estacion = { 
                "<big>&nbsp;&nbsp;&nbsp;📍 puntos</big>": estaciones,
                "<big>&nbsp;&nbsp;&nbsp;📡 en línea</big>" : tiempo_real,
                "<big>&nbsp;&nbsp;&nbsp;🌡️ °C&nbsp;</big>" : temp,
                "<big>&nbsp;&nbsp;&nbsp;💧 %&nbsp;</big>" : humedad,
                "<big>&nbsp;&nbsp;&nbsp;🚩 kph&nbsp;</big>" : dirviento,
                "<big>&nbsp;&nbsp;&nbsp;🌧️ mm&nbsp;</big>" : precip   ,
                "<big>&nbsp;&nbsp;&nbsp;☀️ W/m2&nbsp;</big>" : radiacion  
            };

            var capas_anacafe = { 
                "<big><center>Regiones Administrativas<br><img src='https://anacafe-met.firebaseapp.com/assets/img/leyenda_regiones.png' width='50'/></center></big>": regiones,
                "<big><img src='https://anacafe-met.firebaseapp.com/assets/img/coffee-bean.png' height='16'/> Áreas con café</big>": areas
            };

            var datos_estacion =  L.control.layers(null,capas_estacion,{collapsed:true,position:'topright'}).addTo(this.map);

            var imagenes_sat   = L.control.layers(null,overlays,{collapsed:true,position:'topright'}).addTo(this.map);

            var mapas_anacafe   = L.control.layers(null,capas_anacafe,{collapsed:true,position:'topright'}).addTo(this.map);

            goes.addTo(this.map);
            temp.addTo(this.map);

            this.map.addLayer(esriLabels);

        }
  },
  mounted ()  {
    this.loadData();   
  }  
};
</script>
<style>
    #map {
        height: 100%;
    }
</style>