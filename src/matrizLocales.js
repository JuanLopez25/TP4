const Local= require('./local');
const Paquete=require('./paquete')
const math = require('mathjs');


function MatrizLocales(localesAgregar,centros,limitesColasDeEspera){
    var contador=0;
    this.locales=[]
    while(contador<localesAgregar){  
        this.locales.push(new Local(centros,limitesColasDeEspera[contador]));
        contador+=1;
    }

    this.cantidadCentros=this.locales[0].centrosCreados.length-1;
    
    if (this.cantidadCentros<localesAgregar) {
        throw new Error("no se puede crear la matriz porque los centros son menos que la cantidad de locales");
    }




    this.avanzarTiempo= function(){
        var paquetesDeLocales;
        paquetesDeLocales=this.generarMatrizPaquetes();
        paquetesDeLocales=this.procesarPaquetesDelDestino(paquetesDeLocales);
        paquetesDeLocales=this.analizarMovimientos(paquetesDeLocales);
        paquetesDeLocales=this.encolarYProcesar(paquetesDeLocales);
        this.encolarNoProcesados(paquetesDeLocales); 
    }


    this.agregarPaquetes= function(paquetesAgregar,localNombre){
        var local=(this.locales).find(elemento => elemento.nombre==localNombre);
        local.agregarPaquetes(paquetesAgregar);
    }





    this.generarMatrizPaquetes= function() {
        var numeroLocal=0;
        var paquetesAux;
        var paquetesDeLocales= new Array(this.locales.length);
        this.locales.forEach(local => {
            paquetesAux=local.proceso();
            paquetesDeLocales[numeroLocal]=paquetesAux;   
            numeroLocal++;
        });
        return paquetesDeLocales;
    }

    this.procesarPaquetesDelDestino= function(paquetesDeLocales) {
        var columna=this.cantidadCentros;
        var fila=0;
        var paquetesDelDestino=[];
        var paquetesAProcesar;
        this.locales.forEach(local => {
            paquetesDelDestino=[];
            paquetesAProcesar=paquetesDeLocales[fila][columna-1];
            if (paquetesAProcesar!=0){
                paquetesAProcesar.forEach(elemento => {   
                    if(elemento.destino==(fila+1)) {
                        paquetesDelDestino.push(elemento);
                    }
                });
                paquetesAProcesar=[];
                paquetesDeLocales[fila][columna-1]=[];
                local.centrosCreados[columna].procesarPaquetes(paquetesDelDestino);
            } else {
                local.centrosCreados[columna].procesarPaquetes([])
            }
            fila++;
        });
        return paquetesDeLocales;
    }


    this.analizarMovimientos= function(paquetesDeLocales) {
        var columna=this.cantidadCentros;
        var filasAMoverse;
        var arribaOAbajo;
        var fila=1;
        paquetesDeLocales.forEach(filaPaquetes=> {
            columna=this.cantidadCentros;
            filaPaquetes.forEach(paquetes=>{
                if (paquetes!=0) {
                    paquetes.forEach(paquete=> {
                        filasAMoverse=(paquete.destino-(fila));
                       
                        if (filasAMoverse<0) {
                            arribaOAbajo=1;
                        } else if (filasAMoverse>0) {
                            arribaOAbajo=-1;
                        } else {
                            arribaOAbajo=0;
                        }
                        filasAMoverse=math.abs(filasAMoverse);
                        this.aCualMoverme(paquete,filasAMoverse,fila,columna,arribaOAbajo);
                        
                    });
                }
                columna--;
            })
            fila++;
        })
        return paquetesDeLocales;
    }

    this.aCualMoverme = function(paquete,filasAMoverse,fila,columna,arribaOAbajo) {
        if(filasAMoverse<(columna-1)) {
            if(filasAMoverse==columna-2) {
               if(paquete.destino-(fila) == 0) {
                    paquete.sePuedeMover=0;
               }else if (paquete.destino-(fila)>0) {
                    paquete.sePuedeMover=-2;
               } else {
                    paquete.sePuedeMover=2;
               }

            } else {
                paquete.sePuedeMover=4; //hay que analizar el caso limite aun
            }
        } else {
            
            if (arribaOAbajo==1) {
                paquete.sePuedeMover=1;
            } else if (arribaOAbajo==-1) {
                
                paquete.sePuedeMover=-1;
            } else {
                paquete.sePuedeMover=0;
            }
        }
    }

    this.encolarYProcesar= function(paquetesDeLocales) {
        var paquetesAProcesarMismoLocal;
        var paquetesLocalSuperior;
        var paquetesLocalPosterior;
        var noProcesados;
        var l=0;
        var cantidadQuePuedoProcesar=0;
        var paquetesQueDePuedenProcesar=[];
        var columna=this.cantidadCentros-1; 
        while (columna>0) {
            fila=0;
            this.locales.forEach(local => { 
                paquetesAProcesarMismoLocal=paquetesDeLocales[fila][columna-1];
                if ((fila-1)>=0){   
                    paquetesLocalSuperior=paquetesDeLocales[fila-1][columna-1];
                } else {
                    paquetesLocalSuperior=0;
                }
                if ((fila+1)<this.locales.length) {
                    paquetesLocalPosterior=paquetesDeLocales[fila+1][columna-1];
                } else {
                    paquetesLocalPosterior=0;
                }

                


                if (paquetesAProcesarMismoLocal!=0 && local.centrosCreados[columna].puedeEntrarACola()>0) {
                   
                    paquetesQueDePuedenProcesar=[];
                    noProcesados=[];
                    l=0;
                    cantidadQuePuedoProcesar=local.centrosCreados[columna].puedeEntrarACola();

                    paquetesAProcesarMismoLocal.forEach(paquete=> {
                        if (paquete.sePuedeMover==2 || paquete.sePuedeMover==0  || paquete.sePuedeMover==-2 || paquete.sePuedeMover==4) {
                            paquetesQueDePuedenProcesar.push(paquete);
                        } else {
                            noProcesados.push(paquete);
                        }
                    })
                   
                    local.centrosCreados[columna].agregarACola(paquetesQueDePuedenProcesar);
                    if (cantidadQuePuedoProcesar<=paquetesQueDePuedenProcesar.length){
                        while (l<paquetesQueDePuedenProcesar.length) {
                            if (l>(cantidadQuePuedoProcesar-1)) {
                                noProcesados.push(paquetesQueDePuedenProcesar[l]);
                            }
                            l++;
                        }
                    }
                    
                    if (noProcesados.length==0) {
                        noProcesados=0;
                    }

                    paquetesDeLocales[fila][columna-1]=noProcesados;
                }

                if(paquetesLocalSuperior!=0 && local.centrosCreados[columna].puedeEntrarACola()>0) {
                    
                    paquetesQueDePuedenProcesar=[];
                    noProcesados=[];
                    l=0;
                    cantidadQuePuedoProcesar=local.centrosCreados[columna].puedeEntrarACola();


                    paquetesLocalSuperior.forEach(paquete=> {
                        if (paquete.sePuedeMover==4 || paquete.sePuedeMover==-1 || paquete.sePuedeMover==-2) {
                            paquetesQueDePuedenProcesar.push(paquete);
                        }else {
                            noProcesados.push(paquete);
                        }
                    })


                    local.centrosCreados[columna].agregarACola(paquetesQueDePuedenProcesar);

                    if (cantidadQuePuedoProcesar<=paquetesQueDePuedenProcesar.length){
                        while (l<paquetesQueDePuedenProcesar.length) {
                            if (l>(cantidadQuePuedoProcesar-1)) {
                                noProcesados.push(paquetesQueDePuedenProcesar[l]);
                            }
                            l++;
                        }
                    }
                    if (noProcesados.length==0) {
                        noProcesados=0;
                    }
                    paquetesDeLocales[fila-1][columna-1]=noProcesados;
                }



                if(paquetesLocalPosterior!=0 && local.centrosCreados[columna].puedeEntrarACola()>0) {
                    paquetesQueDePuedenProcesar=[];
                    noProcesados=[];
                    l=0;
                    cantidadQuePuedoProcesar=local.centrosCreados[columna].puedeEntrarACola();


                    paquetesLocalPosterior.forEach(paquete=> {
                        if (paquete.sePuedeMover==4 || paquete.sePuedeMover==1 || paquete.sePuedeMover==2) {
                            paquetesQueDePuedenProcesar.push(paquete);
                        }else {
                            noProcesados.push(paquete);
                        }
                    })



                    local.centrosCreados[columna].agregarACola(paquetesQueDePuedenProcesar);
                    if (cantidadQuePuedoProcesar<=paquetesQueDePuedenProcesar.length){
                        while (l<paquetesQueDePuedenProcesar.length) {
                            if (l>(cantidadQuePuedoProcesar-1)) {
                                noProcesados.push(paquetesQueDePuedenProcesar[l]);
                            }
                            l++;
                        }
                    }
                    if (noProcesados.length==0) {
                        noProcesados=0;
                    }
                    paquetesDeLocales[fila+1][columna-1]=noProcesados;

                }
                
                local.centrosCreados[columna].procesarPaquetes();
                
                fila++;
            });
            columna--;
        }
        return paquetesDeLocales;
    }

    this.encolarNoProcesados= function(paquetesDeLocales) {
        var fila=0;
        var columna;
        paquetesDeLocales.forEach(filaPaquetes=> {
            columna=0;
            filaPaquetes.forEach(paquetes=>{
                if (paquetes!=0) {
                    paquetes.forEach(paquete=> {
                        this.locales[fila].centrosCreados[columna].colaSalida.push(paquete);
                    });
                }
                columna++;
            })
            fila++;
        })
    }
}

module.exports= MatrizLocales;

