const ColaSalida=require('../src/colaSalida')


//commit 80 primer refactor




function Local() {
    
    this.colaDeSalida= new ColaSalida();

    this.paquetesColaDeSalida= function() {
        return this.colaDeSalida.paquetes.length;
    }

     
    this.agregarPaquete= function(paquete) {
        this.colaDeSalida.procesarPaquete(paquete);
    }

    this.paquetesCentroDeFacturacion= function(){
        return 0;
    }

    this.avanzarTiempo = function() {
        var paquetes2= this.centroDeFacturacion.terminarProceso();
        var paquetes1= this.colaDeSalida.terminarProceso();
        this.centroDeFacturacion.agregarPaquete(paquetes1);
    }

}


module.exports= Local;