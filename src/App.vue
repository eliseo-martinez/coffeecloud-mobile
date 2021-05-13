<template>
    <v-app id="app">
      <v-navigation-drawer
        v-model="drawer"
        :clipped="$vuetify.breakpoint.lgAndUp"
        app
        dark
        style="z-index:1005;"
        v-if="logged==true"
    >
      <v-img :src="logo_white" height="50" style="margin:10px;"></v-img>
      <div style="color:#FFFFFF;padding-left:10px;padding-right:10px;padding-top:20px;text-align:center;">
        <b>Coffee</b>Cloud
      </div>
      <v-list dense>
        <template v-for="item in items">
          <v-row
            v-if="item.heading"
            :key="item.heading"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }} ss
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-center"
            >
              <a
                href="#!"
                class="body-2 black--text"
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title> 
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              :to="child.url"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            @click="item.action"
            :to="item.url"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-list-item
          @click="logOut"
        >
          <v-list-item-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Salir</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      dark
      style="z-index:101; background-color: #83003e !important; border-color: #83003e !important;"
    >
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span ><b>Coffee</b>Cloud</span>
      </v-toolbar-title>
      <div class="flex-grow-1"></div>
      <!--<v-btn icon v-if="logged==true">
        <v-icon>mdi-email</v-icon>
      </v-btn>
      <v-btn icon v-if="logged==true">
        <v-icon>mdi-bell</v-icon>
      </v-btn>-->
    </v-app-bar>

    <v-content transition="slide-x-transition">
      <router-view @updateLoggedin="updateLoggedin"></router-view>
    </v-content>
    
  </v-app>
</template>
<script>
import { CoffeeCloud } from './coffeecloud';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './coffeecloud.css'
import axios from 'axios';
import logo_blanco from '@/assets/logo_white.svg';
var _CoffeeCloud = new CoffeeCloud;
  export default {
    name: 'App',
    components: {
        
    },
    data: () => ({
      dialog: false,
      logo_white: logo_blanco,
      drawer: null,
      logged: _CoffeeCloud.isAuthenticated(),
      items: [
        { icon: 'home', text: 'Inicio', url:'/', action:'' },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Información climática',
          model: false,
          children: [
            { text: 'Tiempo actual', url:'/Tiempo' },
            { text: 'Estaciones Anacafé', url:'/Estaciones' },
            { text: 'Pronóstico INSIVUMEH', url:'/Pronostico' }/*,
            { text: 'Perspectiva del clima', url:'/Perspectiva' },*/
          ],
        },
        { icon: 'mdi-spray', text: 'Dosificacion', url:'/Dosificacion', action:''},
        { icon: 'edit', text: 'Editar Datos', url:'/Edicion', action:'' },
        { icon: 'menu_book', text: 'Noticias', url:'/Noticias', action:'' },
        { icon: 'chat_bubble', text: 'Comunicaciones', url:'/Comunicaciones', action:''},
        { icon: 'mdi-book-open-outline', text: 'Documentacion', url:'/Documentacion', action:''},
        { icon: 'mdi-information', text: 'Acerca de', url:'/Acerca', action:''}
      ],
    }),
    methods: {
      updateLoggedin(e) {
        if(e=='in'){
          this.logged = _CoffeeCloud.isAuthenticated();
          if(this.drawer==true) this.drawer=false;
        }
        else this.$router.push('/login')
      },
      logOut()
      {
        var storage = window.localStorage;
        storage.setItem('logged','false');
        storage.setItem('token','');
        storage.setItem('refreshtoken','');
        storage.setItem('userid','');
        this.logged = false;
        this.$router.push('/login');
      }
    }
};
</script>