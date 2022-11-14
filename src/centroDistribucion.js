const Paquete = require("./Paquete");

function CentroDistribucion(limiteColaDeEspera) {
    this.paquetes=[];
    this.cola=[];
    this.colaSalida=[];
    this.nombre="CD";
    if (limiteColaDeEspera<10){
        limiteColaDeEspera=10;
    } else if (limiteColaDeEspera>30) {
        limiteColaDeEspera=30;
    }
    this.limiteCola= limiteColaDeEspera;
    this.procesarPaquetes = function() {
        var i=0;
        var paqueteTemporal;
        this.cola.forEach(elemento => elemento.aumentarTiempo());
        this.unirPaquetes();
        this.cola.sort(function (a, b) {
            if (a.urgencia > b.urgencia) {
              return 1;
            }
            if (a.urgencia < b.urgencia) {
              return -1;
            }
            return 0;
          });

        while (i<(this.cola.length)) {
            if (this.paquetes.length<10) {
                paqueteTemporal= this.cola[i];
                (this.paquetes).push(paqueteTemporal);
                this.cola.splice(i,1);
                i--;
            }
            i++;
        }
    }
    
    this.terminarProceso = function() {
        this.paquetes.forEach(paquete=>{
            this.colaSalida.push(paquete);
        });
        this.paquetes = [];
        var entrega=[]
        this.colaSalida.forEach(paquete=>{
            entrega.push(paquete);
        });
        this.colaSalida=[];
        return entrega;
    }

    this.agregarACola = function (paquetesAgregar) {
        var i=0;
        while ((this.cola.length)<(this.limiteCola)  &&  i<paquetesAgregar.length) {  
            this.cola.push(paquetesAgregar[i]);
            i++;
        }
    }
    
    this.unirPaquetes = function(){
        var colaAux=[];
        var destinoAnterior=[];
        this.cola.forEach(paquete1 => {
            if(!destinoAnterior.includes(paquete1.destino)){
                var listaAux=[];
                this.cola.forEach(paquete2 => {
                    if(paquete1.destino==paquete2.destino){
                        listaAux.push(paquete2);
                    }
                });
                if(listaAux.length>1){
                    listaAux.sort(function (a, b) {
                        if (a.urgencia > b.urgencia) {
                          return 1;
                        }
                        if (a.urgencia < b.urgencia) {
                          return -1;
                        }
                        return 0;
                      });
                    var paqueteUnion= new Paquete(paquete1.destino,listaAux);
                    paqueteUnion.tiempo=paquete1.tiempo;
                    paqueteUnion.urgencia=paqueteUnion.productos[0].urgencia;
                    colaAux.push(paqueteUnion);
                }
                else{
                    colaAux.push(paquete1);
                }
                destinoAnterior.push(paquete1.destino);
            }
        });
        this.cola=colaAux;
    }


    this.puedeEntrarACola= function() {
        return (this.limiteCola-this.cola.length);
    }

  

}

module.exports=CentroDistribucion;