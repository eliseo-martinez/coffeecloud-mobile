 <template>

    <div class="page-wrapper">

        <div class="doc-wrapper">
            <div class="container">
                <div id="doc-header" class="doc-header text-center">
                    <img class="logo-left" src="../assets/images/anacafe.svg" alt="Anacafe" >
                    <img class="logo-right" src="../assets/images/logo_cc.png" alt="Coffee Cloud">
                    <br>
                    <h1>Coffee Cloud</h1>
                </div><!--//doc-header-->
                <div class="doc-body row">
                    <div class="doc-content col-md-9 col-12 order-1">
                        <div class="content-inner">
                            <section id="CC" class="doc-section">
                                <h2 class="section-title">Bienvenidos a Coffee Cloud</h2>
                                <div  class="section-block">
                                    <h3 class="block-title">¿Que es Coffee Cloud?</h3>
                                    <p>El Coffee Cloud es una aplicación desarrollada por ANACAFE gracias al apoyo de diferentes organizaciones entre ellas USAID, Rainforest Alliance y el Programa Centroamericano para la Gestión Integrada del Café (PROCAGICA).</p>
                                    
                                </div><!--//section-block-->
                                <div id="#CC_About"  class="section-block">
                                    <h3 class="block-title">Acerca de Coffee Cloud</h3>
                                    <p>Coffee Cloud inició su desarrollo en el 2017, por medio del Programa Regional de Cambio Climático (PRCC), en su primera versión se tomaron en cuenta aspectos de usabilidad y el diseño centrado en el usuario, esto logró que dicha versión fuese ampliamente utilizada en el país.</p>
                                    <p>En el 2020, se lanza una nueva versión del Coffee Cloud, guardando sus características y funcionalidades, pero utilizando tecnologías más compatibles con los sistemas locales de ANACAFE, e incluyendo la interoperabilidad como una funcionalidad que le brindará escalabilidad y mejores usos en el futuro.</p>
                                    <p>La aplicación cuenta con una interfaz de productor y técnicos y un tablero de control que es utilizada por el Centro de Investigaciones del Café.</p>
                                    <p>El presente tutorial busca dar una idea y tener recursos para poder capacitar tanto a productores y técnicos, así como contar con guías de uso de las herramientas.</p>
                                </div><!--//section-block-->
                            </section><!--//doc-section-->
                            <section id="Producer" class="doc-section">
                                <h2 class="section-title">Productor</h2>
                                <div id="System_Requirements"  class="section-block">
                                    <h3 class="block-title">Requerimientos para utilizar la aplicación Coffee Cloud</h3>
                                    <p><strong>Android:</strong> El Coffee Cloud ha sido probado en Android 4.4 Android KitKat es la undécima versión del sistema operativo para teléfonos inteligentes Android desarrollado por Google. Última versión estable: 4.4.4 (KTU84Q); 7 de julio de 2014.</p>
                                    <p><strong>iOS (Apple):</strong> Compatible con versión 5.1.1 de iOS en adelante, es compatible con iPhone.</p>
                                    <p>Para operar la app debe contar con al menos <strong>100MB</strong> de memoria física.</p>
                                    
                                </div><!--//section-block-->
                                <div id="Installation"  class="section-block">
                                    <h3 class="block-title">Instalación y registro (requiere conexión)</h3>
                                    <p>Considere que para bajar la aplicación necesita estar conectado al internet y siga estos pasos:</p>
                                    <ol>
                                        <li>Ingrese a las siguientes direcciones dependiendo del sistema operativo que utilice: Para la instalación del aplicativo debe dirigirse a la siguiente dirección:</li>
                                            <ul>
                                                <li><strong>Android</strong> <a href="https://play.google.com/store/apps/details?id=com.coffeecloudapp.coffeecloud" target="_blank">Descargar Coffe Cloud para Android</a></li>
                                                <img src="../assets/images/training/android.png" alt="Coffee Cloud Android" style="max-width: 50%;">
                                                <br>
                                                <li><strong>iOS</strong> <a href="https://apps.apple.com/gt/app/coffee-cloud/id1517313300" target="_blank">Descargar Coffe Cloud para iOS</a></li>
                                                <img src="../assets/images/training/ios.png" alt="Coffee Cloud iOS" style="max-width: 50%;">
                                            </ul>
                                        <li>Cree una cuenta con su correo electrónico (se recomienda que sea el que utiliza en su teléfono).</li>
                                        <li>Recibirá una notificación en su email sobre la creación de la cuenta.</li>
                                        <li>Validará la cuenta desde el navegador.</li>
                                        <li>Luego de que la valida ya podrá ingresar a la aplicación.</li>
                                    </ol>
                                    <p><strong>NOTA:</strong> A partir de aquí puede utilizar la app de manera offline (Sin estar conectado al internet), sin embargo, para sincronizar los datos deberá contar con conexión.</p>

                                    <!--<iframe width="100%" height="400" src="https://www.youtube.com/embed/HSEMy08cASU" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>-->
                                    <img src="../assets/creacioncuenta.png" alt="creacion" onclick="cordova.InAppBrowser.open('https://www.youtube.com/embed/HSEMy08cASU', '_blank');" style="display:block; margin-left:auto; margin-right:auto;" /><br />
                                    <small>*Creación Cuenta Coffee Cloud.</small>
                                </div><!--//section-block-->

                                <div id="Config"  class="section-block">
                                    <h3 class="block-title">Configuración de finca y lote</h3>
                                    <p>La aplicación dentro le permitirá visualizar la información de sus fincas y lotes. Para configurarlos debe seguir los siguientes pasos:</p>
                                    <ol>
                                        <li>Haga clic en el ícono flotante con el símbolo de <img src="../assets/images/training/btn_add.png" alt=""></li>
                                        <li>A partir de ahí deberá llenar la información solicitada en el formulario.</li>
                                        <li>Las coordenadas y la altura aparecerán de manera automática en el aplicativo. Para ello debe asegurarse tener el GPS activo. </li>
                                        <li>Guarde los datos y prosiga con el lote.</li>
                                        <li>Para crear el lote, indique la información específica del lote a evaluar.  Recuerde que puede tener múltiples fincas y lotes.</li>
                                        <li>La información de los lotes está limitada por la provista en la finca. (Ej. No podrá ingresar especies de café que no estén ingresadas en la finca).</li>
                                        <li>Al completar la información del lote estará habilitado para implementar las pruebas.</li>
                                    </ol>

                                    <!--<iframe width="100%" height="400" src="https://www.youtube.com/embed/kUzkcYmvi90" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>-->
                                    <img src="../assets/navegacion.png" alt="Navegacion" onclick="cordova.InAppBrowser.open('https://www.youtube.com/embed/kUzkcYmvi90', '_blank');" style="display:block; margin-left:auto; margin-right:auto;" /><br />
                                    <small>*Navegación y creación de Unidades Productivas y Lotes.</small>
                                </div><!--//section-block-->

                                <div id="Test_R"  class="section-block">
                                    <h3 class="block-title">Prueba de Roya (Básica y Avanzada)</h3>
                                    <p>Para implementar la prueba de roya deberá realizar los siguientes pasos:</p>
                                    <ol>
                                        <li>Abrir la finca y lote a la cual se le aplicará la prueba.</li>
                                        <li>Seleccionar prueba de roya en modo básico o avanzado  <img src="assets/images/training/btn_basic_advanced.png" alt="">  , el modo básico aplicará la metodología de conteo de hojas a 30 plantas en 2 bandolas, y las dividirá entre hojas totales y hojas afectadas. En el avanzado dividirá las hojas afectadas de acuerdo con el nivel de severidad de la enfermedad, allí podrá ver las ilustraciones para efectos comparativos.</li>
                                        <li>Recuerde que la prueba tiene validaciones, las cuales no le permitirá realizar el cálculo si los frutos brocados son más que los totales, o bien si deja espacios vacíos no lo dejará continuar.</li>
                                        <li>Recuerde que la prueba tiene validaciones, las cuales no le permitirá si agrega mayor cantidad de hojas afectadas que totales, o bien si deja espacios vacíos.</li>
                                        <li>Al final la prueba le pedirá hacer un cálculo el cual se visualizará en gráfico en la sección principal de pruebas.</li>
                                        <li>Conforme hace pruebas en el tiempo podrá visualizar el comportamiento de la enfermedad en un gráfico de manera automática.</li>
                                    </ol>
                                    <!--<iframe width="100%" height="400" src="https://www.youtube.com/embed/0NQqW442TFY" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>-->
                                    <img src="../assets/pruebaroya.png" alt="Roya" onclick="cordova.InAppBrowser.open('https://www.youtube.com/embed/0NQqW442TFY','_blank');" style="display:block; margin-left:auto; margin-right:auto;" /><br />
                                    <small>*Prueba Roya</small>
                                    <br>
                                    <!--<iframe width="100%" height="400" src="https://www.youtube.com/embed/MECn52b3OXY" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>-->
                                    <img src="../assets/pruebaavanzada.png" alt="Roya avanzado" onclick="cordova.InAppBrowser.open('https://www.youtube.com/embed/MECn52b3OXY','_blank');" style="display:block; margin-left:auto; margin-right:auto;" /><br />
                                    <small>*Prueba Avanzada Roya</small>
                                </div><!--//section-block-->

                                <div id="Test_B"  class="section-block">
                                    <h3 class="block-title">Prueba de Broca (Básica y Avanzada)</h3>
                                    <p>Para implementar la prueba de broca deberá realizar los siguientes pasos:</p>
                                    <ol>
                                        <li>Abrir la finca y lote a la cual se le aplicará la prueba de broca.</li>
                                        <li>Al seleccionar la prueba de broca que desea realizar  <img src="assets/images/training/btn_basic_advanced.png" alt=""> recuerde que la diferencia es:</li>
                                        <ul>
                                            <li><strong>Prueba básica:</strong> Se realiza un conteo de los frutos totales y los brocados, a 30 plantas a dos bandolas cada una.</li>
                                            <br>
                                            <li><strong>Prueba avanzada:</strong> Se realiza un conteo de frutos brocados en 5 plantas en 20 sitios a evaluar. </li>
                                        </ul>
                                        <li>Recuerde que la prueba tiene validaciones, las cuales no le permitirá si agrega mayor cantidad de hojas afectadas que totales, o bien si deja espacios vacíos.</li>
                                        <li>Al final la prueba le pedirá hacer un cálculo el cual se visualizará en gráfico en la sección principal de pruebas.</li>
                                        <li>Conforme hace pruebas en el tiempo podrá visualizar el comportamiento de la enfermedad en un gráfico de manera automática.</li>
                                    </ol>
                                    <!--<iframe width="100%" height="400" src="https://www.youtube.com/embed/0Zf9ccgz0Ro" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>-->
                                    <img src="../assets/pruebabroca.png" alt="Broca" onclick="cordova.InAppBrowser.open('https://www.youtube.com/embed/0Zf9ccgz0Ro','_blank');" style="display:block; margin-left:auto; margin-right:auto;" /><br />
                                    <small>*Prueba de Broca.</small>
                                    <br>
                                    <!--<iframe width="100%" height="400" src="https://www.youtube.com/embed/LiBjmUh7PZk" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>-->
                                    <img src="../assets/pruebabrocaavanzada.png" alt="Broca avanzada" onclick="cordova.InAppBrowser.open('https://www.youtube.com/embed/LiBjmUh7PZk','_blank');" style="display:block; margin-left:auto; margin-right:auto;" /><br />
                                    <small>*Prueba de Broca Avanzado.</small>
                                </div><!--//section-block-->

                                <div id="Test_OG"  class="section-block">
                                    <h3 class="block-title">Prueba de Ojo d Gallo</h3>
                                    <p>Para implementar la prueba de ojo de gallo deberá realizar los siguientes pasos:</p>
                                    <ol>
                                        <li>La prueba solo cuenta con módulo básico, deberá seleccionar la finca y lote específico donde aplicará la prueba, deberá seleccionar 30 plantas al azar en un lote a las cuales se le realizará el conteo de hojas totales y afectadas por ojo de gallo.</li>
                                        <li>Podrá visualizar en el módulo avanzado el porcentaje de severidad de la enfermedad conforme avanza en la prueba.</li>
                                        <li>Al final la prueba le pedirá hacer un cálculo el cual se visualizará en gráfico en la sección principal de pruebas.</li>
                                        <li>Conforme hace pruebas en el tiempo podrá visualizar el comportamiento de la enfermedad en un gráfico de manera automática.</li>
                                    </ol>

                                    <!--<iframe width="100%" height="400" src="https://www.youtube.com/embed/v_k7306dAMg" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>-->
                                    <img src="../assets/pruebaojodegallo.png" alt="Ojo de gallo" onclick="cordova.InAppBrowser.open('https://www.youtube.com/embed/v_k7306dAMg','_blank');" style="display:block; margin-left:auto; margin-right:auto;" /><br />
                                    <small>*Prueba Ojo de Gallo</small>
                                </div><!--//section-block-->

                                <div id="Communication"  class="section-block">
                                    <h3 class="block-title">Módulo de comunicaciones, noticias</h3>
                                    <p><strong>Módulo de Noticias:</strong> En este módulo podrá visualizar las noticias más relevantes que emita el Centro de Investigaciones del Café de Guatemala. Recuerde que para sincronizar las noticias deberá tener conexión a internet.</p>
                                    <img src="../assets/images/training/news.png" alt="" style="max-width: 50%; display:block; margin-left:auto; margin-right:auto;">
                                    <br>
                                    <p><strong>Módulo de Comunicaciones:</strong> Es un espacio donde el usuario de la aplicación podrá enviar y recibir mensajes con los técnicos administradores de CEDICAFE.</p>
                                    <img src="../assets/images/training/support.png" alt="" style="max-width: 50%; display:block; margin-left:auto; margin-right:auto;">
                                </div><!--//section-block-->

                                <div id="Data"  class="section-block">
                                    <h3 class="block-title">Módulo de visualización de datos climáticos</h3>
                                    <p></p>
                                </div><!--//section-block-->
                            </section><!--//doc-section-->                         
                        </div><!--//content-inner-->
                    </div><!--//doc-content-->
                    <div class="doc-sidebar col-md-3 col-12 order-0 d-none d-md-flex">
                        <div id="doc-nav" class="doc-nav">
	                            <nav id="doc-menu" class="nav doc-menu flex-column sticky">
	                                <a class="nav-link scrollto" href="#CC">¿Que es CoffeeCloud?</a>
                                    <nav class="doc-sub-menu nav flex-column">
                                        <a class="nav-link scrollto" href="#CC_About">Acerca</a>
                                    </nav><!--//nav-->
	                                <a class="nav-link scrollto" href="#Producer">Productor</a>
                                    <nav class="doc-sub-menu nav flex-column">
                                        <a class="nav-link scrollto" href="#System_Requirements">Requerimientos para utilizar la aplicación Coffee Cloud</a>
                                        <a class="nav-link scrollto" href="#Installation">Instalación y registro</a>
                                        <a class="nav-link scrollto" href="#Config">Configuración de finca y lote</a>
                                        <a class="nav-link scrollto" href="#Test_R">Prueba de Roya (Básica y Avanzada)</a>
                                        <a class="nav-link scrollto" href="#Test_B">Prueba de Broca (Básica y Avanzada)</a>
                                        <a class="nav-link scrollto" href="#Test_OG">Prueba de Ojo d Gallo</a>
                                        <a class="nav-link scrollto" href="#Communication">Módulo de comunicaciones, noticias </a>
                                        <a class="nav-link scrollto" href="#Data">Módulo de visualización de datos climáticos</a>
                                    </nav><!--//nav-->
                                    <a class="nav-link scrollto" href="#Feedback">Contacto</a>
                                    <a class="nav-link scrollto" href="#DownloadPDF">Descargar Manual PDF</a>
	                            </nav><!--//doc-menu-->
	                        
                        </div>
                    </div><!--//doc-sidebar-->
                </div><!--//doc-body-->              
            </div><!--//container-->
        </div><!--//doc-wrapper-->
        <footer id="footer" class="footer text-center">
        <div class="container">
            <!--/* This template is released under the Creative Commons Attribution 3.0 License. Please keep the attribution link below when using for your own project. Thank you for your support. :) If you'd like to use the template without the attribution, you can buy the commercial license via our website: themes.3rdwavemedia.com */-->
            <img src="../assets/images/usaid_white.png" alt="" style="max-width: 20%;">
            <img src="../assets/images/logo_rainforrest.png" alt="" style="max-width: 20%;">
            <img src="../assets/images/procagica.png" alt="" style="max-width: 20%; margin-left: 20px;">
            <br>
            <small class="copyright">© 2020, Coffee Cloud App.</small>
            
            
        </div><!--//container-->
    </footer><!--//footer-->
    </div><!--//page-wrapper-->
    
    
    
     
    <!-- Main Javascript           
    <script type="text/javascript" src="assets/plugins/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="assets/plugins/bootstrap/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="assets/plugins/prism/prism.js"></script>    
    <script type="text/javascript" src="assets/plugins/jquery-scrollTo/jquery.scrollTo.min.js"></script>      
    <script type="text/javascript" src="assets/plugins/stickyfill/dist/stickyfill.min.js"></script>                                                             
    <script type="text/javascript" src="assets/js/main.js"></script> -->
</template>
<script>
import '../assets/css/styles.css?v=2';
import '../assets/plugins/elegant_font/css/style.css';
import { CoffeeCloud } from '../coffeecloud';
var _CoffeeCloud = new CoffeeCloud();
var c = null;
export default {
  name: 'Documentacion',
  components: {
    
  },
  data: () => ({
    noticias: []
  }),
  mounted () {
    c = this;
  }
};
</script>