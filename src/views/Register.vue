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
            <v-text-field
              v-model="nombreReal"
              label="Nombre:"
              autocapitalize="none"
              :rules="[value => value.length < 100 || 'Máximo de 100 caracteres.']"
            ></v-text-field>
            <v-text-field
              v-model="nombreInicioSesion"
              label="Nombre de inicio de sesión:"
              :rules="[rules.required,value => value.length < 50 || 'Máximo de 50 caracteres.']"
              autocapitalize="none"
            ></v-text-field>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="Correo electrónico"
              autocapitalize="none"
              required
            ></v-text-field>
            <v-text-field
             v-model="password"
             :append-icon="show1 ? 'visibility' : 'visibility_off'"
             :rules="[rules.required, rules.min]"
             :type="show1 ? 'text' : 'password'"
             name="clave1"
             label="Clave"
             hint="Requerido al menos 4 caracteres"
             required
            counter
            @click:append="show1 = !show1"
          ></v-text-field>
          <v-text-field
             v-model="password2"
             :append-icon="show1 ? 'visibility' : 'visibility_off'"
             :rules="[rules2.required, rules2.min, passwordConfirmationRule() ]"
             :type="show1 ? 'text' : 'password'"
             name="clave2"
             label="Confirmar clave"
             hint="Requerido al menos 4 caracteres"
             required
            counter
            @click:append="show1 = !show1"
          ></v-text-field>
          <v-text-field
              v-model="telefono"
              label="Teléfono"
            ></v-text-field>
            <v-btn
              class="mr-4"
              @click="enviarRegistro"
              style="color:#FFFFFF; background-color: #008869 !important; border-color: #008869 !important;"
            >
              Enviar información
            </v-btn>
          </v-form>
        </v-card>
        <v-divider style="padding-top:20px;padding-bottom:20px;"></v-divider>
        <v-btn text small to="/login">Regresar a inicio</v-btn>
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

export default {
  name: 'Registro',
  components: {
    
  },
  data: () => ({
    snackbar:false,
    timeout:2000,
    text:'Verifique su correo electrónico para iniciar sesión',
    show1: false,
    valid: false,
    email: '',
    password: '',
    password2: '',
    telefono:'',
    sinConexion: false,
    errorStatus: '',
    nombreReal: '',
    nombreInicioSesion: '',
    emailRules: [
        v => !!v || 'El correo es requerido',
        v => /.+@.+/.test(v) || 'El correo debe ser válido',
      ],
    rules: {
      required: value => !!value || 'Requerido.',
      min: v => v.length >= 4 || 'Mínimo 4 caracteres',
      upp: v => v.match(/[A-Z]/g) !== null || 'Debe utilizar al menos una letra mayuscula [A-Z]',
      dig: v => v.match(/[0-9]/g) !== null || 'La clave debe contener al menos un digito [0-9]'
    },
    rules2: {
      required: value => !!value || 'Requerido.',
      min: v => v.length >= 4 || 'Mínimo 4 caracteres',
    }
    
  }),
  computed: {
    passwordConfirmationRule() {
      return () => this.password === this.password2 || 'Las claves no coinciden'
    },
  },
  methods: {
    enviarRegistro: function() 
    {
      if(this.valid) {
        axios
        .post(_CoffeeCloud.rootURL() + '/api/authentication/register',{ 
          nombreReal: this.nombreReal, nombreInicioSesion: this.nombreInicioSesion, Email: this.email.trim(), Password: this.password.trim(), ConfirmPassword: this.password2.trim(), Telefono: this.telefono.trim() 
        },{
            headers: { 'Content-Type': 'application/json', } ,       
        })
        .then(response => {
          if(response.data.register != null && response.data.register=='Ok') {
              this.$swal("Registro Exitoso","Se ha enviado un correo para la verificación de su cuenta.","success");
              this.$router.push('/login');
          }
          else
          {
              if(response.data[""].errors != null) {
                
                if(response.data[""].errors[0].errorMessage.includes("already taken"))
                {
                  this.$swal("Se produjo un error: El correo electrónico proporcionado ya se encuentra registrado.");
                }
                else
                {
                  this.$swal("Se produjo un error: " + response.data[""].errors[0].errorMessage);
                }
              }
              
              if(response.data.errors != null) {
                //console.log(response.data.errors[0].errorMessage.include("already taken"));
                if(response.data.errors[0].errorMessage.include("already taken"))
                {
                  this.$swal("Se produjo un error: El correo electrónico proporcionado ya se encuentra registrado.");
                }
                else
                {
                  this.$swal("Se produjo un error: " + response.data.errors[0].errorMessage);
                }
              }
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