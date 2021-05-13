<template>
    <v-container class="grey lighten-3 fill-height">
       <v-layout column>
            <section class="content-header">
                <h1>
                    Informaci&oacute;n climática
                    <small>Pronóstico INSIVUMEH</small>
                </h1>
            </section>
            <v-divider></v-divider>
                <v-tabs
                    class="elevation-2"
                    dark
                >
                <v-tabs-slider></v-tabs-slider>
                <v-tab
                    :key="1"
                    :href="'#tab-1'"
                >
                    Lluvia diaria
                </v-tab>
                <v-tab
                    :key="2"
                    :href="'#tab-2'"
                >
                    Temperatura diaria
                </v-tab>
                <v-tab
                    :key="3"
                    :href="'#tab-3'"
                >
                    Humedad del suelo
                </v-tab>
                <v-tab
                    :key="4"
                    :href="'#tab-4'"
                >
                    Lluvia acumulada
                </v-tab>
                <v-tab
                    :key="5"
                    :href="'#tab-5'"
                >
                    Pronóstico
                </v-tab>
                <v-tab-item
                    :key="1"
                    :value="'tab-1'"
                >
                    <v-card flat tile >
                        <v-card-text>
                            <v-carousel>
                                <v-carousel-item 
                                :key="1"
                                >
                                <v-sheet
                                    height="100%"
                                    tile
                                >
                                    <v-row
                                    class="fill-height"
                                    align="center"
                                    justify="center"
                                    >
                                        <v-img :src="getImageUrl(1,1)"></v-img>
                                    </v-row>
                                </v-sheet>
                                </v-carousel-item>
                                <v-carousel-item 
                                :key="2"
                                >
                                <v-sheet
                                    height="100%"
                                    tile
                                >
                                    <v-row
                                    class="fill-height"
                                    align="center"
                                    justify="center"
                                    >
                                        <v-img :src="getImageUrl(2,1)"></v-img>
                                    </v-row>
                                </v-sheet>
                                </v-carousel-item>
                                <v-carousel-item 
                                :key="3"
                                >
                                <v-sheet
                                    height="100%"
                                    tile
                                >
                                    <v-row
                                    class="fill-height"
                                    align="center"
                                    justify="center"
                                    >
                                        <v-img :src="getImageUrl(3,1)"></v-img>
                                    </v-row>
                                </v-sheet>
                                </v-carousel-item>
                            </v-carousel>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item
                    :key="2"
                    :value="'tab-2'"
                >
                    <v-card flat tile >
                        <v-card-text>
                            <v-carousel>
                                <v-carousel-item 
                                :key="1"
                                >
                                <v-sheet
                                    height="100%"
                                    tile
                                >
                                    <v-row
                                    class="fill-height"
                                    align="center"
                                    justify="center"
                                    >
                                        <v-img :src="getImageUrl(1,2)"></v-img>
                                    </v-row>
                                </v-sheet>
                                </v-carousel-item>
                                <v-carousel-item 
                                :key="2"
                                >
                                <v-sheet
                                    height="100%"
                                    tile
                                >
                                    <v-row
                                    class="fill-height"
                                    align="center"
                                    justify="center"
                                    >
                                        <v-img :src="getImageUrl(2,2)"></v-img>
                                    </v-row>
                                </v-sheet>
                                </v-carousel-item>
                                <v-carousel-item 
                                :key="3"
                                >
                                <v-sheet
                                    height="100%"
                                    tile
                                >
                                    <v-row
                                    class="fill-height"
                                    align="center"
                                    justify="center"
                                    >
                                        <v-img :src="getImageUrl(3,2)"></v-img>
                                    </v-row>
                                </v-sheet>
                                </v-carousel-item>
                            </v-carousel>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item
                    :key="3"
                    :value="'tab-3'"
                >
                    <v-card flat tile >
                        <v-card-text>
                            <v-carousel>
                                <v-carousel-item 
                                :key="1"
                                >
                                <v-sheet
                                    height="100%"
                                    tile
                                >
                                    <v-row
                                    class="fill-height"
                                    align="center"
                                    justify="center"
                                    >
                                        <v-img :src="getImageUrl(1,4)"></v-img>
                                    </v-row>
                                </v-sheet>
                                </v-carousel-item>
                            </v-carousel>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item
                    :key="4"
                    :value="'tab-4'"
                >
                    <v-card flat tile >
                        <v-card-text>
                            <v-carousel>
                                <v-carousel-item 
                                :key="1"
                                >
                                <v-sheet
                                    height="100%"
                                    tile
                                >
                                    <v-row
                                    class="fill-height"
                                    align="center"
                                    justify="center"
                                    >
                                        <v-img :src="getImageUrl(1,5)"></v-img>
                                    </v-row>
                                </v-sheet>
                                </v-carousel-item>
                            </v-carousel>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item
                    :key="5"
                    :value="'tab-5'"
                >
                    <v-card flat tile >
                        <v-card-text>
                            <div v-html="contenido"></div>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs>
       </v-layout>
  </v-container>
</template>
<script>
import { CoffeeCloud } from '../coffeecloud';
import '../coffeecloud.css'
import axios from 'axios';
var _CoffeeCloud = new CoffeeCloud;

export default {
  name: 'Pronostico',
  components: {
    
  },
  data: () => ({
    contenido:''
  }),
  methods: {
      getImageUrl: function(id,tipo)
      {
        if(tipo==1)
            return "https://insivumeh.gob.gt/meteorologia/prod_wrf/ppd_" + id+ ".png?x=" + Date.now();
        if(tipo==2)
            return "https://insivumeh.gob.gt/meteorologia/prod_wrf/Tmedd_" + id+ ".png?x=" + Date.now();
        if(tipo==3)
            return "https://insivumeh.gob.gt/meteorologia/prod_wrf/Tmedd_" + id+ ".png?x=" + Date.now();
        if(tipo==4)
            return "https://insivumeh.gob.gt/hidrologia/humedad.jpg?x=" + Date.now();
        if(tipo==5)
            return "https://insivumeh.gob.gt/meteorologia/lluvia_acumulada.jpg?x=" + Date.now();
      }
  },
  mounted () {
    axios
      .get(_CoffeeCloud.rootURL() + '/scrapping/insivumeh/pronostico.json')
      .then(response => {
          //console.log(response.data[0])
          var pronostico = response.data[0].content.rendered.replace("<img class=\"alignnone wp-image-6637 aligncenter\" src=\"http://www.insivumeh.gob.gt/wp-content/uploads/2019/02/logo-insivumeh2019-300x300.jpg\" alt=\"\" width=\"99\" height=\"99\" srcset=\"http://www.insivumeh.gob.gt/wp-content/uploads/2019/02/logo-insivumeh2019-300x300.jpg 300w, http://www.insivumeh.gob.gt/wp-content/uploads/2019/02/logo-insivumeh2019-150x150.jpg 150w, http://www.insivumeh.gob.gt/wp-content/uploads/2019/02/logo-insivumeh2019-768x768.jpg 768w, http://www.insivumeh.gob.gt/wp-content/uploads/2019/02/logo-insivumeh2019-1024x1024.jpg 1024w, http://www.insivumeh.gob.gt/wp-content/uploads/2019/02/logo-insivumeh2019-1080x1080.jpg 1080w, http://www.insivumeh.gob.gt/wp-content/uploads/2019/02/logo-insivumeh2019.jpg 1181w\" sizes=\"(max-width: 99px) 100vw, 99px\" />", "");
          pronostico = pronostico.replace("<img class=\" wp-image-6638 aligncenter\" src=\"http://www.insivumeh.gob.gt/wp-content/uploads/2019/02/logo-gobierno2019-300x172.png\" alt=\"\" width=\"138\" height=\"79\" srcset=\"http://www.insivumeh.gob.gt/wp-content/uploads/2019/02/logo-gobierno2019-300x172.png 300w, http://www.insivumeh.gob.gt/wp-content/uploads/2019/02/logo-gobierno2019.png 414w\" sizes=\"(max-width: 138px) 100vw, 138px\" />", "");
          this.contenido = pronostico;
      })
      .catch(error => {
        if (!error.response) {
            // network error
            this.sinConexion=true;
        } else {
            this.errorStatus = error.response.data.message;
        }
      })
  }
};
</script>
<style scoped>

</style>