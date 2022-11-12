const ColaSalida=require('./colaSalida');
const CentroFacturacion = require('./centroFacturacion');
const CentroCalidad = require('./centroCalidad');
const CentroDistribucion = require('./centroDistribucion');
const Destino=require('../src/destino');

//commit 80 primer refactor
//commit 154 refactor de "avanzar tiempo"
//commit 168 ya no sirven los condicionales y deshechar los paquetes, hay que guardarlos temporalmente los restantes en una "cola" del centro (nos damos cuenta gracias al fail del test "Verificar cantidad de paquetes en Destino agregando 2 paquete y procesandolos de mas para que se queden en el Destino" en el localSinLimite.test.js)
//commit 170 lo logramos solucionar
//terminamos de meter los limites de procesamiento para el commit 173
//commmit 189 eliminamos los test de paquete ya que quedaron obsoletos
//Rediseñamos la clase paquete para que tenga el nivel de urgencia


//TDD
//array.sort
//arrat.splice
//protocolos
//refactors
//module pattern


var Local = (function(centros){
    var contadorOrigen="A";
    var contadorDestino=1;
    newLocal= function(){
        this.nombre=contadorOrigen;
        this.colaDeSalida= new ColaSalida();
        this.centrosIntermedios= this.crearCentros(centros);
        this.cantidadRecibidos=0;



        contadorDestino+=1;
        var letra=contadorOrigen.charCodeAt();
        letra++;
        contadorOrigen=String.fromCharCode(letra);
        

        //---------------------------------------------------------------------
        //---------------------------------------------------------------------
        
        this.agregarPaquetes= function(paquete) {
            this.colaDeSalida.procesarPaquetes(paquete);
        }

        this.paquetesColaDeSalida= function() {
            return this.colaDeSalida.paquetes.length;
        }

        this.paquetesCentroDeFacturacion= function(){
            return this.centroDeFacturacion.paquetes.length;
        }

        this.paquetesCentroDeCalidad= function(){
            return this.centroDeCalidad.paquetes.length;
        }

        this.paquetesCentroDeDistribucion= function(){
            return this.centroDeDistribucion.paquetes.length;
        }

        this.paquetesDestino= function(){
            return this.cantidadRecibidos;
        }

        //---------------------------------------------------------------------
        
        //---------------------------------------------------------------------

        this.proceso = function () {
            var paquetes4= this.centroDeDistribucion.terminarProceso();
            var paquetes3= this.centroDeCalidad.terminarProceso();
            var paquetes2= this.centroDeFacturacion.terminarProceso();
            var paquetes1= this.colaDeSalida.terminarProceso();

            this.cantidadRecibidos+=paquetes4.length;

            (this.centroDeFacturacion).procesarPaquetes(paquetes1);
            (this.centroDeCalidad).procesarPaquetes(paquetes2);
            (this.centroDeDistribucion).procesarPaquetes(paquetes3);
            (this.destino).procesarPaquetes(paquetes4);

        }

        this.avanzarTiempo = function(cantidad) {
            var i=0;
            while (i<cantidad) {
                this.proceso();
                i++;
            }
        }
        
        this.informarPaquetesEnDestino=function() {
            return this.destino.informarLlegadas();
        }

        this.crearCentros= function(centros) {
            var centrosCreados=[];
            centros.forEach(element =>
                {switch(element){
                    case "CF":
                        centrosCreados.push(new CentroFacturacion());
                    case "CC":
                        centrosCreados.push(new CentroCalidad());
                    case "CD":
                        centrosCreados.push(new CentroDistribucion());
                }}
            );
            return centrosCreados;
        }

    }
    return newLocal;


})();

module.exports= Local;