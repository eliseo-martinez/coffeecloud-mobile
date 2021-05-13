<template>
  <v-container class="grey lighten-3 fill-height">
        <v-layout column>
            <section class="content-header">
                <h1>
                   Acerca de <b>Coffee</b>Cloud
                </h1>
            </section>
            <v-divider></v-divider>
            <v-card>
              <v-card-text>
                <div style="padding:8px;text-align:justify;">
                <p>Coffee Cloud inició su desarrollo en el 2016, como una iniciativa de ANACAFE y del Programa Regional de Cambio Climático (PRCC) de USAID. En su primera versión se tomaron en cuenta aspectos de usabilidad y el diseño centrado en el usuario, esto logró que dicha versión fuese ampliamente utilizada en el país.</p>
                <p>En el 2020, se lanza una nueva versión del Coffee Cloud como parte de la creación de un sistema de alerta temprana de plagas y enfermedades que beneficie a los productores de café de Guatemala. Esta versión guarda sus características y funcionalidades, pero utiliza tecnologías más compatibles con los sistemas locales de ANACAFE, e incluye la interoperabilidad como una funcionalidad que le brindará escalabilidad y mejores usos en el futuro.</p>
                <p>La actualización ha sido posible gracias al apoyo de Rainforest Alliance como parte del proyecto “Early Warning System (EWS) innovating towards a precision coffee culture for the prevention of pests and diseases that affect the sustainability of the coffee sector in Guatemala” y del proyecto PROCAGICA.</p>
                <p>La aplicación cuenta con una interfaz de productor y técnicos y un tablero de control que es utilizada por el Centro de Investigaciones del Café</p>
              </div>
            <v-row>
              <v-col cols=4 md=4>
                <v-img :src="logo_usaid" contain=true style="margin:10px;"></v-img>
              </v-col>
              <v-col cols=4 md=4>
                <v-img :src="logo_raf" contain=true style="margin:10px;"></v-img>
              </v-col>
              <v-col cols=4 md=4>
                <v-img :src="logo_procagica" contain=true style="margin:10px;"></v-img>
              </v-col>
            </v-row>
              </v-card-text>
            </v-card>
            </v-layout>
  </v-container>
</template>
<script>
import logo_usaid from '@/assets/usaid.png';
import logo_raf from '@/assets/rainforrest.png';
import logo_procagica from '@/assets/procagica.png';
export default {
  name: 'About',
  components: {
    
  },
  data: () => ({
    logo_usaid: logo_usaid,
    logo_raf: logo_raf,
    logo_procagica: logo_procagica
  }),
  mounted () {
  }
};
</script>
