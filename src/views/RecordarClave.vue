<template>
  <v-container class="grey lighten-3 fill-height">
    <v-layout column>
      <div style="padding:20px;text-align:center;">
        <span><b>Coffee</b>Cloud</span>
        </div>
        <v-divider></v-divider>
        <v-card style="padding:15px">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
          Ingrese el correo electrónico utilizado para registrarse:
            <v-text-field
              v-model="email"
              label="Email:"
              autocapitalize="none"
              :rules="emailRules"
            ></v-text-field>
            <v-btn
              class="mr-4"
              @click="enviarSolicitud"
              style="color:#FFFFFF; background-color: #008869 !important; border-color: #008869 !important;"
            >
              Enviar
            </v-btn>
            </v-form>
        </v-card>
    </v-layout>
  </v-container>
</template>
<script>
import { CoffeeCloud } from '../coffeecloud';
import '../coffeecloud.css'
import axios from 'axios';
var _CoffeeCloud = new CoffeeCloud;

export default {
  name: 'RecordarClave',
  components: {
    
  },
  data: () => ({
    snackbar:false,
    timeout:2000,
    valid:true,
    email: '',
    emailRules: [
        v => !!v || 'El correo es requerido',
        v => /.+@.+/.test(v) || 'El correo debe ser válido',
    ]
  }),
  methods: {
    enviarSolicitud: function() 
    {
      if(this.valid) {
        axios
        .post(_CoffeeCloud.rootURL() + '/api/authentication/forgotpassword',{ 
          Email: this.email.trim() 
        },{
            headers: { 'Content-Type': 'application/json', } ,       
        })
        .then(response => {
          if(response.data.envio != null && response.data.envio=='Ok') {
              this.$swal("Solicitud recibida","Se ha enviado un correo continuar el proceso de cambio de clave.","success");
              this.$router.push('/login');
          }
        })
        .catch(error => {
          if (!error.response) {
              // network error
              this.sinConexion=true;
          } else {
            this.$swal("Validación","Favor complete la información solicitada.","warning");
          }
        });
      } else {
        this.$swal("Validación","Favor complete la información solicitada.","warning");
      }
    }
  }
};
</script>