import Vue from 'vue'
import Router from 'vue-router'
import Inicio from './views/Inicio.vue'

import { CoffeeCloud } from './coffeecloud';
var _CoffeeCloud = new CoffeeCloud;
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Inicio',
      component: Inicio,
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
      beforeEnter: (to, from, next) => {
        if(_CoffeeCloud.isAuthenticated()) {
            return next({name: 'Inicio'});
        }
        return next();
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Register.vue')
    },
    {
      path: '/cambiarClave',
      name: 'RecordarClave',
      component: () => import('./views/RecordarClave.vue')
    },
    {
      path: '/Tiempo',
      name: 'Tiempo',
      component: () => import('./views/Tiempo.vue'),
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    },
    {
      path: '/Estaciones',
      name: 'Estaciones',
      component: () => import('./views/Estaciones.vue'),
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    },
    {
      path: '/Pronostico',
      name: 'Pronostico',
      component: () => import('./views/Pronostico'),
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    },
    {
      path: '/Perspectiva',
      name: 'Perspectiva',
      component: () => import('./views/Perspectiva')
    },
    {
      path: '/Noticias',
      name: 'Noticias',
      component: () => import('./views/Noticias'),
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    },
    {
      path: '/Lotes/:id',
      name: 'Lotes',
      component: () => import('./views/Lotes'),
      props: true,
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    },
    {
      path: '/MuestreoRoya/:id',
      name: 'MuestreoRoya',
      component: () => import('./views/MuestreoRoya'),
      props: true,
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    },
    {
      path: '/MuestreoRoyaAvanzado/:id',
      name: 'MuestreoRoyaAvanzado',
      component: () => import('./views/MuestreoRoyaAvanzado'),
      props: true,
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    },
    {
      path: '/MuestreoBroca/:id',
      name: 'MuestreoBroca',
      component: () => import('./views/MuestreoBroca'),
      props: true,
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    },
    {
      path: '/MuestreoBrocaAvanzado/:id',
      name: 'MuestreoBrocaAvanzado',
      component: () => import('./views/MuestreoBrocaAvanzado'),
      props: true,
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    },
    {
      path: '/MuestreoOjoDeGallo/:id',
      name: 'MuestreoOjoDeGallo',
      component: () => import('./views/MuestreoOjoDeGallo'),
      props: true,
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    },
    {
      path: '/Comunicaciones/',
      name: 'Comunicaciones',
      component: () => import('./views/Comunicaciones'),
      props: false,
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    },
    {
      path: '/Edicion/',
      name: 'Edicion',
      component: () => import('./views/SelectorEdicion'),
      props: false,
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    },
    {
      path: '/Acerca/',
      name: 'Acerca',
      component: () => import('./views/About'),
      props: false,
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    },
    {
      path: '/Dosificacion/',
      name: 'Dosificacion',
      component: () => import('./views/Dosificacion'),
      props: false,
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    },
    {
      path: '/Documentacion/',
      name: 'Documentacion',
      component: () => import('./views/Documentacion'),
      props: false,
      beforeEnter: (to, from, next) => {
        if(!_CoffeeCloud.isAuthenticated()) {
            return next({name: 'login'});
        }
        return next();
      }
    }

  ]
})
