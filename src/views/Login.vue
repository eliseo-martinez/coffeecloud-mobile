<template>
  <v-container class="grey lighten-3 fill-height">
      <v-layout column>
        <div style="padding:20px;text-align:center;">
        <v-img :src="logo_color" height="50" contain=true style="margin:10px;"></v-img>
        </div>
        <v-divider></v-divider>
        <v-card style="padding:15px">
          <v-card-text>
            <span>Ingrese sus credenciales de acceso:</span>
            <v-text-field
            v-model="email"
            :rules="[v => !!v || 'Correo o nombre de inicio de sesión requeridos.']"
            label="Nombre de usuario"
            autocorrect="off"
            autocapitalize="none"
            required
            type="email"
          ></v-text-field>
          <v-text-field
             v-model="password"
             :append-icon="show1 ? 'visibility' : 'visibility_off'"
             :rules="passwordRules"
             :type="show1 ? 'text' : 'password'"
             name="clave1"
             label="Clave"
             hint="Requerido al menos 4 caracteres"
             required
            counter
            @click:append="show1 = !show1"
          ></v-text-field>
          <v-btn
          :disabled="!valid"
          class="mr-4"
          @click="attempLogin"
          style="margin-top:20px; color:#FFFFFF; background-color: #008869 !important; border-color: #008869 !important;"
        >
          Iniciar sesi&oacute;n
        </v-btn>
          </v-card-text>
        </v-card>
        <v-divider style="padding-top:20px;padding-bottom:20px;"></v-divider>
        <v-btn text small to="/register">Registrarse</v-btn>
        <v-btn text small to="/cambiarClave">Cambiar Clave</v-btn>
        <v-snackbar
          v-model="snackbar"
          :timeout="timeout"
        >
          {{ text }}
          <v-btn
            color="blue"
            text
            @click="snackbar = false"
          >
            Cerrar
          </v-btn>
        </v-snackbar>
      </v-layout>
  </v-container>
</template>
<script>
import { CoffeeCloud } from '../coffeecloud';
import '../coffeecloud.css'
import axios from 'axios';
var _CoffeeCloud = new CoffeeCloud;
import logo_color from '@/assets/logo_colored.svg';
export default {
  name: 'Login',
  components: {
    
  },
  data: () => ({
    logo_color: logo_color,
    show1:false,
    snackbar:false,
    timeout:2000,
    valid:true,
    email: '',
    password: '',
    text: '',
    emailRules: [
        v => !!v || 'E-mail es requerido',
        v => /.+@.+/.test(v) || 'E-mail debe ser valido',
      ],
    passwordRules: [
      v => !!v || 'Clave requerida',
    ]
  }),
  methods: {
    attempLogin: function() {
      axios
      .post(_CoffeeCloud.rootURL() + '/api/authentication/request',{ 
        UserName: this.email.trim(), Password: this.password.trim() 
      },{
           headers: { 'Content-Type': 'application/json', } ,       
      })
      .then(response => {
        //console.log(response);
         if(response.status == 200)
         {
            if(response.data.token != null)
            {
              var storage = window.localStorage;
              storage.setItem('logged','true');
              storage.setItem('token',response.data.token);
              storage.setItem('refreshtoken',response.data.refreshtoken);
              storage.setItem('userid',response.data.userid);
              this.$emit("updateLoggedin",'in');
              this.$router.push('/');
            }
         } else {
           this.text = "Las credenciales no son válidas";
           this.snackbar = true;
         }
      })
      .catch(error => {
        //console.log(error.response.data);
        if (!error.response) {
            // network error
            this.sinConexion=true;
        } else {
            this.text = error.response.data;
            this.snackbar = true;
        }
      });
    }
  }
};
</script>