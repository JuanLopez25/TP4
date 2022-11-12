const CentroFacturacion=require('../src/centroFacturacion')
const CentroCalidad=require('../src/centroCalidad')
const CentroDistribucion=require('../src/centroDistribucion')
const Paquete=require('../src/paquete')

var paquete;
var lista;

beforeEach(()=> {
    paquete = new Paquete("1");
    lista=[];
    var i=0;
    while (i<50) {
        lista.push(paquete) 
        i++;
    }
});


test("Crear centro de facturacion y verificamos su cola de espera la cual deberia ser 6", () =>{
    var facturacion= new CentroFacturacion();
    facturacion.procesarPaquete(lista);
    expect(facturacion.cola.length).toBe(6);
})



test("Crear centro de calidad y verificamos su cola de espera la cual deberia ser 5", () =>{
    var calidad= new CentroCalidad();
    calidad.procesarPaquete(lista);
    expect(calidad.cola.length).toBe(5);
})

test("Crear centro de distribucion y verificamos su cola de espera la cual deberia ser 30", () =>{
    var distribucion= new CentroDistribucion();
    distribucion.procesarPaquete(lista);
    expect(distribucion.cola.length).toBe(30);
})



