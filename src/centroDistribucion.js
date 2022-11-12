
function CentroDistribucion() {
    this.paquetes=[];
    this.cola=[];
    this.nombre="CD";

    this.procesarPaquetes = function(paquetesAgregar) {
        var i=0;
        var paqueteTemporal;

        this.agregarACola(paquetesAgregar);

        this.cola.forEach(elemento => elemento.aumentarTiempo());

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
        var entrega= this.paquetes;
        this.paquetes = [];
        return entrega;
    }

    this.agregarACola = function (paquetesAgregar) {
        var i=0;
        while ((this.cola.length)<40  &&  i<paquetesAgregar.length) {  //es menor que 40 por que 10 pueden ser procesados, y 30 a la cola de espera
            this.cola.push(paquetesAgregar[i]);
            i++;
        }
    }

}

module.exports=CentroDistribucion;