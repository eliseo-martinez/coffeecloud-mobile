import axios from 'axios';
import { nSQL } from "@nano-sql/core";

class CoffeeCloud {

    isAuthenticated()
    {
        var storage = window.localStorage;
        if(storage.getItem('logged')!=null && storage.getItem('logged') == 'true')
        {
            this.$logged=true;
            return true;
        }
        else
        {
            this.$logged=false;
            return false;
        }
    }
    rootURL()
    {
        return 'https://coffeecloud.anacafe.org'
        //return 'https://localhost:5001';
    }
    test()
    {

    }
    initOnlyData() {
        var storage = window.localStorage;
        var token = storage.getItem("token");
        var refreshToken = storage.getItem("refreshtoken");

        nSQL("EstadoBase").query("select").exec().then((rows)=>{
            if(rows.length<1 || rows[0].inicializada!=1){
                // Obtener datos de referencia
                this.makeRequest(token,refreshToken,'/api/replicacion/tablasreferencia','get',{},this.cargarTablasReferencia);
            }
        });

        nSQL("EstadoBase").query("select")
        .where(["userId","=",storage.getItem("userid")])
        .exec().then(async (rows)=>{
            if(rows.length<1){
                this.makeRequest(token,refreshToken,'/api/replicacion/registrosdeusuario','post',{"Token":token},this.cargarTablasDeUsuario);
            }
            else {
                // Buscar registros en bd que no hayan sido ingresados a app
                var i = 0;
                let queryFincas0 = nSQL("fincas").query("select").where(["fincaCodigo","=",0]).exec();
                var codigosFinca0 = await queryFincas0;
                var strCodigosFinca = "";
                if(codigosFinca0.length<1)
                {
                    let queryFincas = nSQL("fincas").query("select",["fincaCodigo"]).exec();
                    var codigosFinca = await queryFincas;
                
                    for(i=0;i<codigosFinca.length;i++)
                    {
                        if(strCodigosFinca=="") strCodigosFinca = "" + codigosFinca[i].fincaCodigo;
                        else strCodigosFinca += "," + codigosFinca[i].fincaCodigo;
                    }
                }
                
                let queryLotes0 = nSQL("lotes").query("select").where(["loteCodigo","=",0]).exec();
                var codigosLotes0 = await queryLotes0;
                var strCodigosLotes = "";
                
                if(codigosLotes0.length<1)
                {
                    let queryLotes = nSQL("lotes").query("select",["loteCodigo"]).exec();
                    var codigosLotes = await queryLotes;
                    
                    for(i=0;i<codigosLotes.length;i++)
                    {
                        if(strCodigosLotes=="") strCodigosLotes = "" + codigosLotes[i].loteCodigo;
                        else strCodigosLotes += "," + codigosLotes[i].loteCodigo;
                    }
                }

                let evaluacionRoya0 = nSQL("evaluacionRoya").query("select").where(["evaluacionCodigo","=",0]).exec();
                var codigosRoya0 = await evaluacionRoya0;
                var strCodigosRoya = "";
                
                if(codigosRoya0.length<1)
                {
                    let evaluacionRoya = nSQL("evaluacionRoya").query("select",["evaluacionCodigo"]).exec();
                    var codigosRoya = await evaluacionRoya;
                    
                    for(i=0;i<codigosRoya.length;i++)
                    {
                        if(strCodigosRoya=="") strCodigosRoya = "" + codigosRoya[i].evaluacionCodigo;
                        else strCodigosRoya += "," + codigosRoya[i].evaluacionCodigo;
                    }
                }
                
                let evaluacionBroca0 = nSQL("evaluacionBroca").query("select").where(["evaluacionCodigo","=",0]).exec();
                var codigosBroca0 = await evaluacionBroca0;
                var strCodigosBroca = "";

                if(codigosBroca0.length<1)
                {
                    let evaluacionBroca = nSQL("evaluacionBroca").query("select",["evaluacionCodigo"]).exec();
                    var codigosBroca = await evaluacionBroca;
                    
                    for(i=0;i<codigosBroca.length;i++)
                    {
                        if(strCodigosBroca=="") strCodigosBroca = "" + codigosBroca[i].evaluacionCodigo;
                        else strCodigosBroca += "," + codigosBroca[i].evaluacionCodigo;
                    }
                }

                let evaluacionOjoDeGallo0 = nSQL("evaluacionOjoDeGallo").query("select").where(["evaluacionCodigo","=",0]).exec();
                var codigosOjoDeGallo0 = await evaluacionOjoDeGallo0;
                var strCodigosOjoDeGallo = "";

                if(codigosOjoDeGallo0.length<1)
                {
                    let evaluacionOjoDeGallo = nSQL("evaluacionOjoDeGallo").query("select",["evaluacionCodigo"]).exec();
                    var codigosOjoDeGallo = await evaluacionOjoDeGallo;
                    
                    for(i=0;i<codigosOjoDeGallo.length;i++)
                    {
                        if(strCodigosOjoDeGallo=="") strCodigosOjoDeGallo = "" + codigosOjoDeGallo[i].evaluacionCodigo;
                        else strCodigosOjoDeGallo += "," + codigosOjoDeGallo[i].evaluacionCodigo;
                    }
                }
                
                if(codigosFinca0.length<1 && 
                   codigosLotes0.length<1 && 
                   codigosRoya0.length<1 &&
                   codigosBroca0.length<1 &&
                   codigosOjoDeGallo0.length<1)
                {
                    this.makeRequest(token,refreshToken,'/api/replicacion/registrosdeusuario2','post',{"Token":token,
                                                                                                   "fincas":strCodigosFinca,
                                                                                                   "lotes":strCodigosLotes,
                                                                                                   "evaluacionesRoya":strCodigosRoya,
                                                                                                   "evaluacionesBroca":strCodigosBroca,
                                                                                                   "evaluacionesOjoDeGallo":strCodigosOjoDeGallo
                                                                                                  },this.cargarTablasDeUsuario2);
                }
                // ::::
                this.loadFincaDataFromLDB();
            }
        });
    }
    init()
    {
        nSQL().createDatabase({
            id: "coffeeclouddb",
            mode: 'PERM',
            tables: [
                    {
                        name: "departamentos",
                        model: {
                           "departamentoCodigo:string": {pk: true},
                           "departamentoNombre:string": {} 
                        }
                    },
                    {
                        name: "municipios",
                        model: {
                            "municipioCodigo:string": {pk: true},
                            "municipioNombre:string": {},
                            "departamentoCodigo:string": {}
                        }
                    },
                    {
                        name: "detalleEvaluacionBroca",
                        model: {
                            "evaluacionPK:string": {pk: true},
                            "evaluacionCodigoL:int": {},
                            "evaluacionCodigo:int": {},
                            "detalleEvaluacionPlanta:int": {},
                            "detalleEvaluacionBandola:int": {},
                            "detalleEvaluacionGranosTotales:int": {},
                            "detalleEvaluacionGranosAfectados:int": {},
                            "detalleEvaluacionNsitio:int:": {}
                        }
                    },
                    {
                        name: "detalleEvaluacionOjoDeGallo",
                        model: {
                            "evaluacionPK:string": {pk: true},
                            "evaluacionCodigoL:int": {},
                            "evaluacionCodigo:int": {},
                            "detalleEvaluacionPlanta:int": {},
                            "detalleEvaluacionHojasTotales:int": {},
                            "detalleEvaluacionHojasAfectadas:int": {},
                            "detalleEvaluacionHojasAfectadas0:int": {},
                            "detalleEvaluacionHojasAfectadas1:int": {},
                            "detalleEvaluacionHojasAfectadas2:int": {},
                            "detalleEvaluacionHojasAfectadas7:int": {},
                            "detalleEvaluacionHojasAfectadas20:int": {},
                            "detalleEvaluacionHojasAfectadas45:int": {},
                            "detalleEvaluacionHojasAfectadas70:int": {},
                            "detalleEvaluacionBandola:int": {},
                            "detalleEvaluacionSeveridadPlanta:number": {}
                        }
                    },
                    {
                        name: "detalleEvaluacionRoya",
                        model: {
                            "evaluacionPK:string": {pk: true},
                            "evaluacionCodigoL:int": {},
                            "evaluacionCodigo:int": {},
                            "detalleEvaluacionPlanta:int": {},
                            "detalleEvaluacionHojasTotales:int": {},
                            "detalleEvaluacionHojasAfectadas:int": {},
                            "detalleEvaluacionHojasAfectadas0:int": {},
                            "detalleEvaluacionHojasAfectadas1:int": {},
                            "detalleEvaluacionHojasAfectadas2:int": {},
                            "detalleEvaluacionHojasAfectadas7:int": {},
                            "detalleEvaluacionHojasAfectadas20:int": {},
                            "detalleEvaluacionHojasAfectadas45:int": {},
                            "detalleEvaluacionHojasAfectadas70:int": {},
                            "detalleEvaluacionBandola:int": {},
                            "detalleEvaluacionSeveridadPlanta:int": {}
                        }
                    },
                    {
                        name: "evaluacionBroca",
                        model: {
                            "evaluacionCodigoL:int": {pk: true, ai: true},
                            "evaluacionCodigo:int": {},
                            "evaluacionTipo:int": {},
                            "evaluacionFecha:date": {},
                            "evaluacionBandolas:int": {},
                            "evaluacionIncidencia:int": {},
                            "recomendacionCodigo:int": {},
                            "loteCodigo:int": {},
                            "loteCodigoL:int": {},
                            "recomendacionDescripcion:string": {},
                            "etapaFenologia:string": {}
                        }
                    },
                    {
                        name: "evaluacionOjoDeGallo",
                        model: {
                            "evaluacionCodigoL:int": {pk: true, ai: true},
                            "evaluacionCodigo:int": {},
                            "evaluacionTipo:int": {},
                            "evaluacionFecha:date": {},
                            "evaluacionBandolas:int": {},
                            "evaluacionIncidencia:int": {},
                            "recomendacionCodigo:int": {},
                            "loteCodigo:int": {},
                            "loteCodigoL:int": {},
                            "recomendacionDescripcion:string": {} ,
                            "etapaFenologia:string": {}
                        }
                    },
                    {
                        name: "evaluacionRoya",
                        model: {
                            "evaluacionCodigoL:int": {pk: true, ai: true},
                            "evaluacionCodigo:int": {},
                            "evaluacionTipo:int": {},
                            "evaluacionFecha:date": {},
                            "evaluacionBandolas:int": {},
                            "evaluacionIncidencia:int": {},
                            "recomendacionCodigo:int": {},
                            "loteCodigo:int": {},
                            "loteCodigoL:int": {},
                            "evaluacionSeveridad:float": {},
                            "recomendacionDescripcion:string": {},
                            "etapaFenologia:string": {}
                        }
                    },
                    {
                        name: "fincas",
                        model: {
                            "fincaCodigoL:int": {pk: true, ai: true},
                            "fincaCodigo:int": {}, 
                            "fincaNombre:string": {},
                            "fincaAltitud:float": {notNull:false},
                            "departamentoCodigo:string": {notNull:false},
                            "municipioCodigo:string": {notNull:false},
                            "fincaLatitud:float": {notNull:false},
                            "fincaLongitud:float": {notNull:false},
                            "fincaAreaTotal:float": {notNull:false},
                            "fincaAreaCafe:float": {notNull:false},
                            "fincaDistPlantaSurco:float": {notNull:false},
                            "fincaDistPlantaPlantas:float": {notNull:false},
                            "fincaSombra:string": {notNull:false},
                            "fincaMuestreoSuelos:string": {notNull:false},
                            "fincaMuestreoSueloMeses:string": {notNull:false},
                            "fincaFertilizaSuelo:string": {notNull:false},
                            "fincaFertilizaSueloMeses:string": {notNull:false},
                            "fincaAplicacionesFoliares:string": {notNull:false},
                            "fincaAplicacionesFoliaresMeses:string": {notNull:false},
                            "fincaEnmiendasSuelo:string": {notNull:false},
                            "fincaEnmiendasSueloMeses": {notNull:false},
                            "fincaManejoTejido:string": {notNull:false},
                            "fincaManejoTejidoMeses:string": {notNull:false},
                            "fincaCalidadAgua:string": {notNull:false},
                            "fincaCalidadAguaTipoVerificacion:string": {notNull:false},
                            "fincaProduccionAnualEstimada:int": {notNull:false},
                            "fincaProduccionAnioAnterior": {notNull:false},
                            "fincaFloracionAnioAnterior:date": {notNull:false},
                            "fincaInicioCosechaAnioAnterior:date": {notNull:false},
                            "fincaFinCosechaAnioAnterior:date": {notNull:false},
                            "fincaFinEpocaLluviosaAnioAnterior:date": {notNull:false},
                            "fincaAplicaFungicidas:string": {notNull:false},
                            "userId:string": {notNull:false},
                            "fincaInicioEpocaLluviosaAnioAnterior:date": {notNull:false}
                        }
                    },
                    {
                        name: 'fungicidas',
                        model: {
                            "fungicidaCodigo:int": {pk:true},
                            "fungicidaNombre:string": {},
                            "tipoFungicidaTipo:int": {}
                        }
                    },
                    {
                        name: "fungicidasFinca",
                        model: {
                            "fungicidasFincaPK:string":{pk:true},
                            "fincaCodigoL:int": {},
                            "fungicidasFungicidaCodigo:int": {},
                            "fincaCodigo:int": {},
                            "fungicidasFincaMeses:string": {}
                        }
                    },
                    {
                        name: "lotes",
                        model: {
                            "loteCodigoL:int": {pk: true, ai:true},
                            "loteCodigo:int": {},
                            "loteNombre:string": {},
                            "loteLatitud:float": {},
                            "loteLongitud:float": {},
                            "loteAltitud:float": {},
                            "loteTamano:int": {},
                            "loteEdad:int": {},
                            "loteDistanciaSurco:int": {},
                            "loteDistanciaPlanta:int": {},
                            "loteProduccionAnoAnterior:int": {},
                            "loteSombra:string": {},
                            "lotePorcentajeSombra:int": {},
                            "loteCoberturaSuelo:string": {},
                            "fincaCodigo:int": {},
                            "fincaCodigoL:int": {}
                        }
                    },
                    {
                        name: "recomendaciones",
                        model: {
                            "recomendacionCodigo:int": {pk:true},
                            "recomendacionText:string": {},
                            "recomendacionTipo:string": {},
                            "recomendacionCriterioMeses:string": {},
                            "recomendacionCriterioIncidencia:string": {},
                            "recomendacionCriterioMes1:int": {},
                            "recomendacionCriterioMes2:int": {},
                            "recomendacionCriterioIncidencia1:float": {},
                            "recomendacionCriterioIncidencia2:float": {}
                        }
                    },
                    {
                        name: "tiposCafe",
                        model: {
                            "tipoCodigo:int": {pk:true},
                            "tipoNombre:string": {}
                        }
                    },
                    {
                        name: "tiposCafeFinca",
                        model: {
                            "tiposCafePK:string":{pk: true},
                            "fincaCodigoL:int": {},
                            "tiposCafeTipoCodigo:int":{},
                            "fincaCodigo:int": {}
                        }
                    },
                    {
                        name: "tiposFungicidas",
                        model: {
                            "tipoFungicidaTipo:int": {pk:true},
                            "tiposFungicidaNombre:string": {}
                        }
                    },
                    {
                        name: "variedadesCafe",
                        model: {
                            "variedadCodigo:int": {pk:true},
                            "variedadNombre:string": {}
                        }
                    },
                    {
                        name: "variedadesCafeFinca",
                        model: {
                            "variedadesCafePK:string": {pk:true},
                            "fincaCodigoL:int": {},
                            "variedadesCafevariedadCodigo:int": {},
                            "fincaCodigo:int": {}
                        }
                    },
                    {
                        name: "variedadesCafeLote",
                        model: {
                            "variedadesCafeCPKEY:string": {pk:true},
                            "variedadesCafevariedadCodigo:int": {},
                            "loteCodigo:int": {},
                            "loteCodigoL:int": {}
                        }
                    },
                    {
                        name: "EstadoBase",
                        model: {
                            "iddb:int":{pk:true, ai:true},
                            "inicializada:int": {},
                            "userId:string": {}
                        }
                    }
                ],
                version: 1.0
            }).then(()=> {
                this.initOnlyData(); 
            }).catch((error) => {
                //console.log(error);
        });

    }

    round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    async loadFincaDataFromLDB() {
        //console.log("loadDataFromLDB");
        var storage = window.localStorage;

        this.container.status = 'Cargando';
        try {
            let qf = nSQL("fincas").query("select")
            .where(["userId","=",storage.getItem("userid")])
            .exec();

            var fincas = await qf;
            
            //.then((fincas)=>{
                var i = 0;
                for(i=0;i<fincas.length;i++)
                {
                    fincas[i].nlotes = 0;
                    fincas[i].lotes = new Array();
                    fincas[i].incidenciaPromedio = 0;
                    fincas[i].nivelIncidencia = 0;
                }
                this.container.fincas = fincas;
                for(i=0;i<fincas.length;i++)
                {
                    var finca = fincas[i];
                    //(async (finca,i)=>{
                        //console.log(finca.fincaCodigoL);
                        let query = nSQL("lotes").query("select")
                        .where(["fincaCodigoL","=",finca.fincaCodigoL])
                        .exec();
                        var lotes = await query;
                        this.container.fincas[i].lotes = lotes;
                        this.container.fincas[i].nlotes = ((lotes!=undefined)? lotes.length : 0);
                        
                        var j = 0;
                        var incidencia = 0;
                        var counter = 0;
                        
                        for(j=0;j<lotes.length;j++) {
                            var evaluacion = null;
                            if(this.container.view=="roya")
                            {
                                query = nSQL("evaluacionRoya").query("select")
                                .where(["loteCodigoL","=",lotes[j].loteCodigoL])
                                .orderBy(["evaluacionFecha ASC"])
                                .exec();
                                evaluacion = await query;
                                this.container.fincas[i].lotes[j].evaluacionRoya = evaluacion;
                            }
                            if(this.container.view=="broca")
                            {
                                query = nSQL("evaluacionBroca").query("select")
                                .where(["loteCodigoL","=",lotes[j].loteCodigoL])
                                .orderBy(["evaluacionFecha ASC"])
                                .exec();
                                evaluacion = await query;
                                this.container.fincas[i].lotes[j].evaluacionRoya = evaluacion;
                            }
                            if(this.container.view=="ojo de gallo")
                            {
                                query = nSQL("evaluacionOjoDeGallo").query("select")
                                .where(["loteCodigoL","=",lotes[j].loteCodigoL])
                                .orderBy(["evaluacionFecha ASC"])
                                .exec();
                                evaluacion = await query;
                                this.container.fincas[i].lotes[j].evaluacionRoya = evaluacion;
                            }

                            if(evaluacion!=undefined && evaluacion.length > 0) {
                                incidencia += evaluacion[evaluacion.length-1].evaluacionIncidencia;
                                counter++;
                            }
                        }

                        if(counter>0){
                            this.container.fincas[i].incidenciaPromedio = this.round(incidencia / counter, 1);

                            if (this.container.fincas[i].incidenciaPromedio <= 3)
                            {
                                this.container.fincas[i].nivelIncidencia = 0;
                            }
                            else if(this.container.fincas[i].incidenciaPromedio <= 5)
                            {
                                this.container.fincas[i].nivelIncidencia = 1;
                            }
                            else if(this.container.fincas[i].incidenciaPromedio <= 10)
                            {
                                this.container.fincas[i].nivelIncidencia = 2;
                            } 
                            else if(this.container.fincas[i].incidenciaPromedio <= 20)
                            {
                                this.container.fincas[i].nivelIncidencia = 3;
                            }
                            else
                            {
                                this.container.fincas[i].nivelIncidencia = 4;
                            }
                        } else {
                            this.container.fincas[i].incidenciaPromedio = 0;
                            this.container.fincas[i].nivelIncidencia = 0;
                        }
                        
                        var blueIcon = L.icon({
                            iconUrl: this.container.coffeeBlue,
                            iconSize: [16,16]
                        });

                        var greenIcon = L.icon({
                            iconUrl: this.container.coffeeGreen,
                            iconSize: [16,16]
                        });
                      
                        var yellowIcon = L.icon({
                            iconUrl: this.container.coffeeYellow,
                            iconSize: [16,16]
                        });

                        var orangeIcon = L.icon({
                            iconUrl: this.container.coffeeOrange,
                            iconSize: [16,16]
                        });
                      
                        var redIcon = L.icon({
                            iconUrl: this.container.coffeeRed,
                            iconSize: [16,16]
                        });
                      
                        var icons = [blueIcon, greenIcon, yellowIcon, orangeIcon, redIcon];
                        
                        if(this.container.fincas.length > 0) this.container.map.panTo(new L.LatLng(this.container.fincas[0].fincaLatitud,this.container.fincas[0].fincaLongitud));
                        
                        if(this.container.markerGroup!=null)
                        {
                            this.container.markerGroup.remove();
                        }

                        var k = 0;
                        var markers = new Array();
                        for(k = 0; k < this.container.fincas.length; k++)
                        {
                            //console.log("Icono: " + this.container.fincas[k].nivelIncidencia);
                            markers.push(L.marker([this.container.fincas[k].fincaLatitud,this.container.fincas[k].fincaLongitud],{icon: icons[this.container.fincas[k].nivelIncidencia]}));
                        }
                        this.container.markerGroup = L.layerGroup(markers);
                        this.container.markerGroup.addTo(this.container.map);
                    //})(fincas[i],i);
                }
                this.container.overlay = false;
                try
                {
                    this.enviarDatosAlServidor();
                    // check for raw request
                    this.checkRawRequest();
                    this.checkRawUpdate();
                }
                catch(Ex)
                {
                    //console.log(Ex);
                }
            //});
        } catch (ex) {
            //console.log(ex);
        }
    }
    makeRequest(token,refreshToken,url,method,data,action)
    {
        //console.log(action);
        var c = this;
        axios({
            url: this.rootURL() + url,
            crossDomain: true,
            method: method,
            data: data,
            headers: {
                "Authorization":"Bearer " + token,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(response.status==200) {
                action(response.data,c);
            }
        })
        .catch(error => {
            if(!error.response)
            {
                // Si no hay internet pogramar un nuevo intento en un tiempo posterior
                // Cuando se trate de guardar datos a la bd principal
                if(url.includes('saveFincasFromApp') ||
                   url.includes('saveLotesFromApp') ||
                   url.includes('saveEvaluacionesFromApp')) 
                {
                    setTimeOut(this.enviarDatosAlServidor,1000 * 60 * 5);
                }
            }
            else
            {
                if(error.response.status==401){
                    axios({
                        url: this.rootURL() + "/api/authentication/refresh",
                        crossDomain: true,
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            OldToken: token,
                            RefreshToken: refreshToken
                        }
                    })
                    .then(response => {
                        if(response.status==200)
                        {
                            if(response.data!=null)
                            {
                                var storage = window.localStorage;
                                storage.setItem('token',response.data);
                                token = response.data;
                                axios({
                                    url: this.rootURL() + url,
                                    crossDomain: true,
                                    method: method,
                                    data: data,
                                    headers: {"Authorization":"Bearer " + token}
                                })
                                .then(response => {
                                    if(response.status==200) {
                                        action(response.data,c);
                                    }
                                })
                                .catch(error => {
            
                                });
                            }
                        }
                    })
                    .catch(error => {
    
                    });
                }
            }
        });
    }

    getMensajes()
    {
        var storage = window.localStorage;
        var token = storage.getItem("token");
        var refreshToken = storage.getItem("refreshtoken");
        this.makeRequest(token,refreshToken,'/api/mensajeria/GetMensajesUsuario','post',{'Token':token},this.loadMensajes);
    }

    loadMensajes(mensajes,c)
    {
        if(mensajes.length<1)
        {
            console.log("sin mensajes")
            c.container.messageList = [{ type: 'text', author: 'support', data: { text: 'Hola, cómo podemos ayudarle?', meta: c.container.ahora } }];
            console.log(c.container.messageList);
            console.log("?");
        }
        else
        {
            c.container.messageList = mensajes;
            c.container.overlay=false;
        }
    }

    sendMessage(mensaje,fecha)
    {
        var storage = window.localStorage;
        var token = storage.getItem("token");
        var refreshToken = storage.getItem("refreshtoken");
        this.makeRequest(token,refreshToken,'/api/mensajeria/enviarMensaje','post',{'Token':token,'destinatario':'anacafe','mensaje':mensaje,'fecha':fecha},this.loadMensajes);
    }

    cargarTablasReferencia(tablas,c)
    {
        //console.log("Inicio de carga de datos");
        c.container.status = 'Cargando tablas de referencia';
        nSQL().useDatabase("coffeeclouddb");
        nSQL("departamentos")
        .query("upsert",tablas.departamentos)
        .exec()
        .then(()=>{
            //console.log("Departamentos");
        });

        nSQL("municipios")
        .query("upsert",tablas.municipios)
        .exec()
        .then(()=>{
            //console.log("Municipios");
        });

        nSQL("recomendaciones")
        .query("upsert",tablas.recomendaciones)
        .exec()
        .then(()=>{
            //console.log("Recomendaciones");
        });

        nSQL("tiposCafe")
        .query("upsert",tablas.tiposCafe)
        .exec()
        .then(()=>{
            //console.log("TiposCafe");
        });

        nSQL("tiposFungicidas")
        .query("upsert",tablas.tiposFungicidas)
        .exec()
        .then(()=>{
            //console.log("TiposFungicidas");
        });

        nSQL("fungicidas")
        .query("upsert",tablas.fungicidas)
        .exec()
        .then(()=>{
            //console.log("Fungicidas");
        });

        nSQL("variedadesCafe")
        .query("upsert",tablas.variedadesCafe)
        .exec()
        .then(()=>{
            //console.log("variedadesCafe");
        });

        /*(async (finca,i)=>{
            let query = nSQL("EstadoBase").query("upsert",{"inicializada":1})
            .exec();
            var res = await query;
        })();*/
    }

    cargarTablasDeReferencia2()
    {
        nSQL("tiposCafe")
        .query("upsert",tablas.tiposCafe)
        .exec()
        .then(()=>{
            //console.log("TiposCafe");
        });

        nSQL("fungicidas")
        .query("upsert",tablas.fungicidas)
        .exec()
        .then(()=>{
            //console.log("Fungicidas");
        });

        nSQL("variedadesCafe")
        .query("upsert",tablas.variedadesCafe)
        .exec()
        .then(()=>{
            //console.log("variedadesCafe");
        });
    }

    async cargarTablasDeUsuario(tablas,c)
    {
        //console.log("Cargar tablas de usuario");
        c.container.status = 'Cargando Datos de Usuario';
        //console.log(tablas);
        //console.log(tablas.fincas.length);
        nSQL().useDatabase("coffeeclouddb"); 
        var i = 0;
        for(i=0;i<tablas.fincas.length;i++)
        {
            var finca = tablas.fincas[i];
            finca.fincaCodigoL = null;
            //console.log("Finca inserted " + i);
            //console.log(finca);
            await (async (finca,i) => {
                await nSQL("fincas")
                .query("upsert",finca)
                .exec()
                .then(async ()=>{
                    await nSQL("fincas").query("select",["fincaCodigoL"]).where(["fincaCodigo","=",finca.fincaCodigo]).exec().then(async (rows)=>{
                        var fincaCodigoL = rows[0].fincaCodigoL;
                        var j = 0;
                        for(j=0;j<finca.lotes.length;j++)
                        {
                            var lote = finca.lotes[j];
                            lote.fincaCodigoL = fincaCodigoL;
                            lote.loteCodigoL = null;
                            await (async (lote,j) => {
                                await nSQL("lotes")
                                .query("upsert",lote)
                                .exec().then(async ()=>{
                                    await nSQL("lotes").query("select",["loteCodigoL"]).where(["loteCodigo","=",lote.loteCodigo]).exec().then(async (rows)=>{
                                        var loteCodigoL = rows[0].loteCodigoL;
                                        var evaluacionesRoya = lote.evaluacionRoya;
                                        var evaluacionesBroca = lote.evaluacionBroca;
                                        var evaluacionesOjoDeGallo = lote.evaluacionOjoDeGallo;
                                        var k = 0;
                                        for(k=0;k<evaluacionesRoya.length;k++)
                                        {
                                            var evaluacion = evaluacionesRoya[k];
                                            evaluacion.loteCodigoL = loteCodigoL;
                                            evaluacion.evaluacionCodigoL = null;
                                            await (async (evaluacion)=>{
                                                await nSQL("evaluacionRoya")
                                                .query("upsert",evaluacion)
                                                .exec().then(async ()=>{
                                                    await nSQL("evaluacionRoya")
                                                    .query("select",["evaluacionCodigoL"]).where(["evaluacionCodigo","=",evaluacion.evaluacionCodigo])
                                                    .exec()
                                                    .then(async (rows)=>{
                                                        var evaluacionCodigoL = rows[0].evaluacionCodigoL;
                                                        await nSQL(tablas.detalleEvaluacionRoya)
                                                        .query("select")
                                                        .where(["evaluacionCodigo","=",evaluacion.evaluacionCodigo])
                                                        .exec().then(async (detalles)=>{
                                                            var l = 0;
                                                            for(l=0;l<detalles.length;l++)
                                                            {
                                                                var detalle = detalles[l];
                                                                detalle.evaluacionCodigoL = evaluacionCodigoL;
                                                                detalle.evaluacionPK = evaluacionCodigoL + "," + detalle.detalleEvaluacionPlanta + "," + detalle.detalleEvaluacionBandola;
                                                                await nSQL("detalleEvaluacionRoya")
                                                                .query("upsert",detalle)
                                                                .exec().then(()=>{});
                                                            }
                                                        });
                                                    });
                                                });
                                            })(evaluacion);
                                        }
                                        for(k=0;k<evaluacionesBroca.length;k++){
                                            var evaluacion = evaluacionesBroca[k];
                                            evaluacion.loteCodigoL = loteCodigoL;
                                            evaluacion.evaluacionCodigoL = null;
                                            await (async (evaluacion)=>{
                                                await nSQL("evaluacionBroca")
                                                .query("upsert",evaluacion)
                                                .exec().then(async ()=>{
                                                    await nSQL("evaluacionBroca")
                                                    .query("select",["evaluacionCodigoL"]).where(["evaluacionCodigo","=",evaluacion.evaluacionCodigo])
                                                    .exec()
                                                    .then(async (rows)=>{
                                                        var evaluacionCodigoL = rows[0].evaluacionCodigoL;
                                                        await nSQL(tablas.detalleEvaluacionBroca)
                                                        .query("select")
                                                        .where(["evaluacionCodigo","=",evaluacion.evaluacionCodigo])
                                                        .exec().then(async (detalles)=>{
                                                            var l = 0;
                                                            var ev
                                                            for(l=0;l<detalles.length;l++)
                                                            {
                                                                var detalle = detalles[l];
                                                                detalle.evaluacionCodigoL = evaluacionCodigoL;
                                                                detalle.evaluacionPK = evaluacionCodigoL + "," + detalle.detalleEvaluacionPlanta + "," + detalle.detalleEvaluacionBandola;
                                                                await nSQL("detalleEvaluacionBroca")
                                                                .query("upsert",detalle)
                                                                .exec().then(()=>{});
                                                            }
                                                        });
                                                    });
                                                });
                                            })(evaluacion);
                                        }
                                        for(k=0;k<evaluacionesOjoDeGallo.length;k++){
                                            var evaluacion = evaluacionesOjoDeGallo[k];
                                            evaluacion.loteCodigoL = loteCodigoL;
                                            evaluacion.evaluacionCodigoL = null;
                                            await ( async (evaluacion)=>{
                                                await nSQL("evaluacionOjoDeGallo")
                                                .query("upsert",evaluacion)
                                                .exec().then(async ()=>{
                                                    await nSQL("evaluacionOjoDeGallo")
                                                    .query("select",["evaluacionCodigoL"]).where(["evaluacionCodigo","=",evaluacion.evaluacionCodigo])
                                                    .exec()
                                                    .then(async (rows)=>{
                                                        var evaluacionCodigoL = rows[0].evaluacionCodigoL;
                                                        await nSQL(tablas.detalleEvaluacionOjoDeGallo)
                                                        .query("select")
                                                        .where(["evaluacionCodigo","=",evaluacion.evaluacionCodigo])
                                                        .exec().then(async (detalles)=>{
                                                            var l = 0;
                                                            var ev
                                                            for(l=0;l<detalles.length;l++)
                                                            {
                                                                var detalle = detalles[l];
                                                                detalle.evaluacionCodigoL = evaluacionCodigoL;
                                                                detalle.evaluacionPK = evaluacionCodigoL + "," + detalle.detalleEvaluacionPlanta + "," + detalle.detalleEvaluacionBandola;
                                                                await nSQL("detalleEvaluacionOjoDeGallo")
                                                                .query("upsert",detalle)
                                                                .exec().then(()=>{});
                                                            }
                                                        });
                                                    });
                                                });
                                            })(evaluacion);
                                        }
                                        await nSQL(tablas.lotes)
                                        .query("select")
                                        .where(["loteCodigo","=",lote.loteCodigo])
                                        .exec().then(async (_lote)=>{
                                            for(k=0;k<_lote[0].variedadesCafeLote.length;k++)
                                            {
                                                var variedadCafeLote = _lote[0].variedadesCafeLote[k];
                                                variedadCafeLote.loteCodigoL = loteCodigoL;
                                                variedadCafeLote.variedadesCafeCPKEY = variedadCafeLote.variedadesCafevariedadCodigo + "," + loteCodigoL;
                                                await nSQL("variedadesCafeLote")
                                                .query("upsert",variedadCafeLote)
                                                .exec().then(()=>{});
                                            }
                                        });
                                    });
                                });
                            })(lote,j);
                        } 
                        //FungicidasFinca
                        for(j=0;j<finca.fungicidasFinca.length;j++)
                        {
                            var fungicidaFinca = finca.fungicidasFinca[j];
                            fungicidaFinca.fincaCodigoL = fincaCodigoL;
                            fungicidaFinca.fungicidasFincaPK = fincaCodigoL + "," + fungicidaFinca.fungicidasfungicidaCodigo;
                            await nSQL("fungicidasFinca")
                            .query("upsert",fungicidaFinca)
                            .exec().then(()=>{});
                        }

                        //TiposCafeFinca
                        for(j=0;j<finca.tiposCafeFinca.length;j++)
                        {
                            var tipoCafeFinca = finca.tiposCafeFinca[j];    
                            tipoCafeFinca.fincaCodigoL = fincaCodigoL;
                            tipoCafeFinca.tiposCafePK = fincaCodigoL + "," + tipoCafeFinca.tiposCafetipoCodigo;
                            await nSQL("tiposCafeFinca")
                            .query("upsert",tipoCafeFinca)
                            .exec().then(()=>{});
                        }

                        //VariedadesCafeFinca
                        for(j=0;j<finca.variedadesCafeFinca.length;j++)
                        {
                            var variedadCafeFinca = finca.variedadesCafeFinca[j];
                            variedadCafeFinca.fincaCodigoL = fincaCodigoL;
                            variedadCafeFinca.variedadesCafePK = fincaCodigoL + "," + variedadCafeFinca.variedadesCafevariedadCodigo;
                            await nSQL("variedadesCafeFinca")
                            .query("upsert",variedadCafeFinca)
                            .exec().then(()=>{});
                        }
                    });
                });   
            })(finca,i);
            //console.log("For");
        }
        
        
        (async ()=>{
            var storage = window.localStorage;
            let query = nSQL("EstadoBase").query("upsert",{"inicializada":1,"userId":storage.getItem("userid")})
            .exec();
            var res = await query;
        })();
        
        //console.log("Proceso ejecutado");
        c.loadFincaDataFromLDB();
    }

    async cargarTablasDeUsuario2(tablas,c)
    {
        var i = 0;
        var j = 0;
        var finca;
        var lote;
        var evaluacionRoya;
        var evaluacionBroca;
        var evaluacionOjoDeGallo;
        for(i=0;i<tablas.fincas.length;i++)
        {
            finca = tablas.fincas[i];
            finca.fincaCodigoL = null;
            let queryIFinca = nSQL("fincas").query("upsert",finca).exec();
            await queryIFinca;
        }
        for(i=0;i<tablas.lotes.length;i++)
        {
            lote = tablas.lotes[i];
            let queryCodFinca = nSQL("fincas").query("select",["fincaCodigoL"]).where(["fincaCodigo","=",lote.fincaCodigo]).exec();
            var resCodFinca = await queryCodFinca;
            lote.fincaCodigoL = resCodFinca[0].fincaCodigoL;
            let queryILote = nSQL("lotes").query("upsert",lote).exec();
            await queryILote;
        }
        for(i=0;i<tablas.evaluacionRoya.length;i++)
        {
            evaluacionRoya = tablas.evaluacionRoya[i];
            let queryCodLote = nSQL("lotes").query("select",["loteCodigoL"]).where(["loteCodigo","=",evaluacionRoya.loteCodigo]).exec();
            var resCodLote = await queryCodLote;
            evaluacionRoya.loteCodigoL = resCodLote[0].loteCodigoL;
            let queryIEvalRoya = nSQL("evaluacionRoya").query("upsert",evaluacionRoya).exec();
            await queryIEvalRoya;
            let queryCodEvaluacion = nSQL("evaluacionRoya").query("select",["MAX(evaluacionCodigoL) as evaluacionCodigoL"]).exec();
            var resCodEvaluacion = await queryCodEvaluacion;
            var evaluacionCodigoL = resCodEvaluacion[0];
            for(j=0;j<evaluacionRoya.detalleEvaluacionRoya.length;j++)
            {
                var pk = evaluacionCodigoL + "," + evaluacionRoya.detalleEvaluacionRoya[j].detalleEvaluacionPlanta + "," + evaluacionRoya.detalleEvaluacionRoya[j].detalleEvaluacionBandola;
                evaluacionRoya.detalleEvaluacionRoya[j].evaluacionPK = pk;
                evaluacionRoya.detalleEvaluacionRoya[j].evaluacionCodigoL = evaluacionCodigoL;
            }
            let queryIDetRoya = nSQL("detalleEvaluacionRoya").query("upsert",evaluacionRoya.detalleEvaluacionRoya).exec();
            await queryIDetRoya;
        }
        for(i=0;i<tablas.evaluacionBroca.length;i++)
        {
            evaluacionBroca = tablas.evaluacionBroca[i];
            let queryCodLote = nSQL("lotes").query("select",["loteCodigoL"]).where(["loteCodigo","=",evaluacionBroca.loteCodigo]).exec();
            var resCodLote = await queryCodLote;
            evaluacionBroca.loteCodigoL = resCodLote[0].loteCodigoL;
            let queryIEvalBroca = nSQL("evaluacionBroca").query("upsert",evaluacionBroca).exec();
            await queryIEvalBroca;
            let queryCodEvaluacion = nSQL("evaluacionBroca").query("select",["MAX(evaluacionCodigoL) as evaluacionCodigoL"]).exec();
            var resCodEvaluacion = await queryCodEvaluacion;
            var evaluacionCodigoL = resCodEvaluacion[0];
            for(j=0;j<evaluacionBroca.detalleEvaluacionBroca.length;j++)
            {
                var pk = evaluacionCodigoL + "," + evaluacionBroca.detalleEvaluacionBroca[j].detalleEvaluacionPlanta + "," + evaluacionBroca.detalleEvaluacionBroca[j].detalleEvaluacionBandola;
                evaluacionBroca.detalleEvaluacionBroca[j].evaluacionPK = pk;
                evaluacionBroca.detalleEvaluacionBroca[j].evaluacionCodigoL = evaluacionCodigoL;
            }
            let queryIDetBroca = nSQL("detalleEvaluacionBroca").query("upsert",evaluacionBroca.detalleEvaluacionBroca).exec();
            await queryIDetBroca;
        }
        for(i=0;i<tablas.evaluacionOjoDeGallo.length;i++)
        {
            evaluacionOjoDeGallo = tablas.evaluacionOjoDeGallo[i];
            let queryCodLote = nSQL("lotes").query("select",["loteCodigoL"]).where(["loteCodigo","=",evaluacionOjoDeGallo.loteCodigo]).exec();
            var resCodLote = await queryCodLote;
            evaluacionOjoDeGallo.loteCodigoL = resCodLote[0].loteCodigoL;
            let queryIEvalOjoDeGallo = nSQL("evaluacionOjoDeGallo").query("upsert",evaluacionOjoDeGallo).exec();
            await queryIEvalOjoDeGallo;
            let queryCodEvaluacion = nSQL("evaluacionOjoDeGallo").query("select",["MAX(evaluacionCodigoL) as evaluacionCodigoL"]).exec();
            var resCodEvaluacion = await queryCodEvaluacion;
            var evaluacionCodigoL = resCodEvaluacion[0];
            for(j=0;j<evaluacionOjoDeGallo.detalleEvaluacionOjoDeGallo.length;j++)
            {
                var pk = evaluacionCodigoL + "," + evaluacionOjoDeGallo.detalleEvaluacionOjoDeGallo[j].detalleEvaluacionPlanta + "," + evaluacionOjoDeGallo.detalleEvaluacionOjoDeGallo[j].detalleEvaluacionBandola;
                evaluacionOjoDeGallo.detalleEvaluacionOjoDeGallo[j].evaluacionPK = pk;
                evaluacionOjoDeGallo.detalleEvaluacionOjoDeGallo[j].evaluacionCodigoL = evaluacionCodigoL;
            }
            let queryIDetOjoDeGallo = nSQL("detalleEvaluacionOjoDeGallo").query("upsert",evaluacionOjoDeGallo.detalleEvaluacionOjoDeGallo).exec();
            await queryIDetOjoDeGallo;
        }
        if(tablas.fincas.length>0 ||
           tablas.lotes.length>0 ||
           tablas.evaluacionRoya.length>0 ||
           tablas.evaluacionBroca.length>0 ||
           tablas.evaluacionOjoDeGallo>0)
        {
           c.loadFincaDataFromLDB(); 
        }
    }

    async actualizarFinca(finca){
        var storage = window.localStorage;
        var token = storage.getItem("token");
        var refreshToken = storage.getItem("refreshtoken");
        this.makeRequest(token,refreshToken,'/api/replicacion/saveEdicionFinca','post',{'fincas':[finca], 'token':token},this.saveFincaEdits);
    }

    async saveFincaEdits(result, c) {
        c.container.$swal('Datos almacenados.');
        c.container.closeDialogAfterSave();
    }

    async getQuimicosDosificacion(finca){
        var storage = window.localStorage;
        var token = storage.getItem("token");
        var refreshToken = storage.getItem("refreshtoken");
        this.makeRequest(token,refreshToken,'/api/replicacion/getquimicosdosificacion','post',{},this.getQuimicosDosificacionRes);
    }

    async getQuimicosDosificacionRes(result, c) {
        c.container.quimicos = result;
    }

    async actualizarLote(lote){
        var storage = window.localStorage;
        var token = storage.getItem("token");
        var refreshToken = storage.getItem("refreshtoken");
        this.makeRequest(token,refreshToken,'/api/replicacion/saveEdicionLote','post',{'lotes':[lote], 'token':token},this.saveLoteEdits);
    }

    async saveLoteEdits(result, c) {
        c.container.$swal('Datos almacenados.');
        c.container.btndisabled=false;
        c.container.closeDialogAfterSave();
    }

    async deleteLote(loteCodigo){
        var storage = window.localStorage;
        var token = storage.getItem("token");
        var refreshToken = storage.getItem("refreshtoken");
        this.makeRequest(token,refreshToken,'/api/replicacion/deleteLote','post',{'loteCodigo':loteCodigo},this.afterDeleteLote);
    }

    async afterDeleteLote(result, c) {
        c.container.$swal('Lote eliminado.');
        c.container.getLotesFinca();
    }

    async deleteFinca(fincaCodigo){
        var storage = window.localStorage;
        var token = storage.getItem("token");
        var refreshToken = storage.getItem("refreshtoken");
        this.makeRequest(token,refreshToken,'/api/replicacion/deleteFinca','post',{'fincaCodigo':fincaCodigo},this.afterDeleteFinca);
    }

    async afterDeleteFinca(result, c) {
        c.container.$swal('Unidad productiva eliminada.');
        c.container.getFincas();
    }

    async checkRawRequest()
    {
        var storage = window.localStorage;
        var token = storage.getItem("token");
        var refreshToken = storage.getItem("refreshtoken");
        var id = storage.getItem("userid");
        this.makeRequest(token,refreshToken,'/api/replicacion/checkrawrequest','post',{'id':id},this.afterRawCheck);
    }

    async afterRawCheck(result,c)
    {
        console.log("Result of raw request");
        
        if(result!="")
        {
            let query = nSQL(result).query("select").exec();
            var data = await query;
            var strdata = JSON.stringify(data);
            var storage = window.localStorage;
            var token = storage.getItem("token");
            var id = storage.getItem("userid");
            var refreshToken = storage.getItem("refreshtoken");
            c.makeRequest(token,refreshToken,'/api/replicacion/sendrawrequestdata','post',{'id':id,'rawjson':strdata},c.afterRawSend);
        }
    }

    afterRawSend(result,c)
    {
        console.log("Raw sent");
    }

    async checkRawUpdate()
    {
        var storage = window.localStorage;
        var token = storage.getItem("token");
        var refreshToken = storage.getItem("refreshtoken");
        var id = storage.getItem("userid");
        this.makeRequest(token,refreshToken,'/api/replicacion/checkrawupdate','post',{'id':id},this.afterRawUpdateCheck);
    }

    async afterRawUpdateCheck(result,c)
    {
        console.log("Result of raw update check");
        try
        {
            var data = JSON.parse(result.rawjson);
            let update = nSQL(result.tabla).query("upsert",data).exec();
            await update;
            var storage = window.localStorage;
            var token = storage.getItem("token");
            var refreshToken = storage.getItem("refreshtoken");
            var id = storage.getItem("userid");
            c.makeRequest(token,refreshToken,'/api/replicacion/confirmrawupdate','post',{'id':id},c.afterRawUpdateConfirm);
        } catch (err) {
            console.log(err);
        }
    }

    afterRawUpdateConfirm(result,c)
    {
        console.log("Raw update confirmed");
    }

    async enviarDatosAlServidor(){
        // Enviar fincas nuevas si hay
        let queryFincas = nSQL("fincas").query("select")
        .where(["fincaCodigo","=",0])
        .exec();

        var storage = window.localStorage;
        var token = storage.getItem("token");
        var refreshToken = storage.getItem("refreshtoken");

        var fincas = await queryFincas;
        if(fincas.length>0) {
            var i = 0;
            for(i=0;i<fincas.length;i++){
                let queryVariedadesCafeFinca = nSQL("variedadesCafeFinca").query("select")
                .where(["fincaCodigoL","=",fincas[i].fincaCodigoL]).exec();
                var variedadesCafeFinca = await queryVariedadesCafeFinca;

                let queryTiposCafeFinca = nSQL("tiposCafeFinca").query("select")
                .where(["fincaCodigoL","=",fincas[i].fincaCodigoL]).exec();
                var tiposCafeFinca = await queryTiposCafeFinca;

                let queryFungicidasFinca = nSQL("fungicidasFinca").query("select")
                .where(["fincaCodigoL","=",fincas[i].fincaCodigoL]).exec();
                var fungicidasFinca = await queryFungicidasFinca;

                fincas[i].variedadesCafeFinca = variedadesCafeFinca;
                fincas[i].tiposCafeFinca = tiposCafeFinca;
                fincas[i].fungicidasFinca = fungicidasFinca;
            }
            //console.log("Enviar Fincas");
            this.makeRequest(token,refreshToken,'/api/replicacion/saveFincasFromApp','post',{'fincas':fincas,'token':token},this.saveFincasResult);
        }
        else {
            // Enviar lotes nuevos si hay
            let queryLotes = nSQL("lotes").query("select")
            .where(["loteCodigo","=",0])
            .exec();

            var lotes = await queryLotes;
            if(lotes.length>0)
            {
                var i = 0;
                for(i=0;i<lotes.length;i++)
                {
                    //console.log(lotes[i].loteCodigoL);
                    let queryVariedadesCafeLote = nSQL("variedadesCafeLote").query("select")
                    .where(["loteCodigoL","=",lotes[i].loteCodigoL]).exec();
                    
                    var variedadesCafeLote = await queryVariedadesCafeLote;
                    lotes[i].variedadesCafeLote = variedadesCafeLote;
                    //console.log(variedadesCafeLote);
                }
                //console.log("Enviar lotes");
                this.makeRequest(token,refreshToken,'/api/replicacion/saveLotesFromApp','post',lotes,this.saveLotesResult);
            }
            else
            {
                // Enviar muestreos nuevos si hay
                let queryEvaluacionesRoya = nSQL("evaluacionRoya").query("select")
                .where(["evaluacionCodigo","=",0]).exec();

                var evaluacionesRoya = await queryEvaluacionesRoya;

                var i = 0;
                for(i=0;i<evaluacionesRoya.length;i++)
                {
                    //evaluacionesRoya[i].evaluacionFecha = moment(evaluacionesRoya[i].evaluacionFecha).tz("America/Guatemala").format();

                    let queryDetalleEvaluacionRoya = nSQL("detalleEvaluacionRoya").query("select")
                    .where(["evaluacionCodigoL","=",evaluacionesRoya[i].evaluacionCodigoL]).exec();

                    var detalleEvaluacionRoya = await queryDetalleEvaluacionRoya;
                    evaluacionesRoya[i].detalleEvaluacionRoya = detalleEvaluacionRoya;
                }

                let queryEvaluacionesBroca = nSQL("evaluacionBroca").query("select")
                .where(["evaluacionCodigo","=",0]).exec();

                var evaluacionesBroca = await queryEvaluacionesBroca;

                for(i=0;i<evaluacionesBroca.length;i++)
                {
                    //evaluacionesBroca[i].evaluacionFecha = moment(evaluacionesBroca[i].evaluacionFecha).tz("America/Guatemala").format();

                    let queryDetalleEvaluacionBroca = nSQL("detalleEvaluacionBroca").query("select")
                    .where(["evaluacionCodigoL","=",evaluacionesBroca[i].evaluacionCodigoL]).exec();

                    var detalleEvaluacionBroca = await queryDetalleEvaluacionBroca;
                    evaluacionesBroca[i].detalleEvaluacionBroca = detalleEvaluacionBroca;
                }

                let queryEvaluacionesOjoDeGallo = nSQL("evaluacionOjoDeGallo").query("select")
                .where(["evaluacionCodigo","=",0]).exec();

                var evaluacionesOjoDeGallo = await queryEvaluacionesOjoDeGallo;

                for(i=0;i<evaluacionesOjoDeGallo.length;i++)
                {
                    let queryDetalleEvaluacionOjoDeGallo = nSQL("detalleEvaluacionOjoDeGallo").query("select")
                    .where(["evaluacionCodigoL","=",evaluacionesOjoDeGallo[i].evaluacionCodigoL]).exec();

                    var detalleEvaluacionOjoDeGallo = await queryDetalleEvaluacionOjoDeGallo;
                    evaluacionesOjoDeGallo[i].detalleEvaluacionOjoDeGallo = detalleEvaluacionOjoDeGallo;
                }

                var evaluaciones = {'evaluacionesRoya':evaluacionesRoya,
                                    'evaluacionesBroca':evaluacionesBroca,
                                    'evaluacionesOjoDeGallo':evaluacionesOjoDeGallo};

                //console.log("Enviar evaluaciones");
                this.makeRequest(token,refreshToken,'/api/replicacion/saveEvaluacionesFromApp','post',evaluaciones,this.saveEvaluacionesResult);
            }
        }
    }

    async saveFincasResult(result, c) {
        // Actualizar fincas local con codigo remoto
        var i = 0;
        for(i=0;i<result.length;i++)
        {
            let updateFincas = nSQL("fincas").query("upsert",{fincaCodigo:result[i].fincaCodigo})
            .where(["fincaCodigoL","=",result[i].fincaCodigoL]).exec();
            var res = await updateFincas;

            let updateLotes = nSQL("lotes").query("upsert",{fincaCodigo:result[i].fincaCodigo})
            .where(["fincaCodigoL","=",result[i].fincaCodigoL]).exec();
            res = await updateLotes;
        }
        c.enviarDatosAlServidor();
    }

    async saveLotesResult(result, c) {
        // Actualizar lotes local con codigo remoto
        var i = 0;
        for(i=0;i<result.length;i++)
        {
            let updateLotes = nSQL("lotes").query("upsert",{loteCodigo:result[i].loteCodigo})
            .where(["loteCodigoL","=",result[i].loteCodigoL]).exec();
            var res = await updateLotes;

            let updateEvaluacionesRoya = nSQL("evaluacionRoya").query("upsert",{loteCodigo:result[i].loteCodigo})
            .where(["loteCodigoL","=",result[i].loteCodigoL]).exec();
            res = await updateEvaluacionesRoya;

            let updateEvaluacionesBroca = nSQL("evaluacionBroca").query("upsert",{loteCodigo:result[i].loteCodigo})
            .where(["loteCodigoL","=",result[i].loteCodigoL]).exec();
            res = await updateEvaluacionesBroca;

            let updateEvaluacionesOjoDeGallo = nSQL("evaluacionOjoDeGallo").query("upsert",{loteCodigo:result[i].loteCodigo})
            .where(["loteCodigoL","=",result[i].loteCodigoL]).exec();
            res = await updateEvaluacionesOjoDeGallo;
        }
        c.enviarDatosAlServidor();
    }

    async saveEvaluacionesResult(result, c) {
        var i = 0;
        var evaluacionesRoya = result.evaluacionesRoya;
        var evaluacionesBroca = result.evaluacionesBroca;
        var evaluacionesOjoDeGallo = result.evaluacionesOjoDeGallo;
        var res = null;
        for(i=0;i<evaluacionesRoya.length;i++)
        {
            let updateEvaluacionesRoya = nSQL("evaluacionRoya").query("upsert",{evaluacionCodigo:evaluacionesRoya[i].evaluacionCodigo})
            .where(["evaluacionCodigoL","=",evaluacionesRoya[i].evaluacionCodigoL]).exec();
            res = await updateEvaluacionesRoya;

            let updateDetalleEvaluacionesRoya = nSQL("detalleEvaluacionRoya").query("upsert",{evaluacionCodigo:evaluacionesRoya[i].evaluacionCodigo})
            .where(["evaluacionCodigoL","=",evaluacionesRoya[i].evaluacionCodigoL]).exec();
            res = await updateDetalleEvaluacionesRoya;
        }

        for(i=0;i<evaluacionesBroca.length;i++)
        {
            let updateEvaluacionesBroca = nSQL("evaluacionBroca").query("upsert",{evaluacionCodigo:evaluacionesBroca[i].evaluacionCodigo})
            .where(["evaluacionCodigoL","=",evaluacionesBroca[i].evaluacionCodigoL]).exec();
            res = await updateEvaluacionesBroca;

            let updateDetalleEvaluacionesBroca = nSQL("detalleEvaluacionBroca").query("upsert",{evaluacionCodigo:evaluacionesBroca[i].evaluacionCodigo})
            .where(["evaluacionCodigoL","=",evaluacionesBroca[i].evaluacionCodigoL]).exec();
            res = await updateDetalleEvaluacionesBroca;
        }

        for(i=0;i<evaluacionesOjoDeGallo.length;i++)
        {
            let updateEvaluacionesOjoDeGallo = nSQL("evaluacionOjoDeGallo").query("upsert",{evaluacionCodigo:evaluacionesOjoDeGallo[i].evaluacionCodigo})
            .where(["evaluacionCodigoL","=",evaluacionesOjoDeGallo[i].evaluacionCodigoL]).exec();
            res = await updateEvaluacionesOjoDeGallo;

            let updateDetalleEvaluacionesOjoDeGallo = nSQL("detalleEvaluacionOjoDeGallo").query("upsert",{evaluacionCodigo:evaluacionesOjoDeGallo[i].evaluacionCodigo})
            .where(["evaluacionCodigoL","=",evaluacionesOjoDeGallo[i].evaluacionCodigoL]).exec();
            res = await updateDetalleEvaluacionesOjoDeGallo;
        }
    }
}

export { CoffeeCloud }

