const MatrizLocales=require('../src/matrizLocales');
const Paquete= require('../src/paquete')
const Local= require('../src/local')

var matriz;
var reseter;
var paqueteMuyRapido;
var paqueteRapido;
var paqueteRapido2;
var paqueteNormal;
var lista;

beforeEach(()=> {
    reseter= new Local(["CF","CC","CD"],[6,2,14]);
    reseter.resetearID();
    matriz= new MatrizLocales(3,["CF","CC","CD"],[[6,3,23],[5,4,10],[6,2,14]]);
    lista=[];
    paqueteMuyRapido=new Paquete(1,[],"muy rapido",4);
    paqueteRapido=new Paquete(2,[],"rapido",4);
    paqueteNormal=new Paquete(3,[],"normal",4);
    paqueteRapido2=new Paquete(4,[],"rapido",4);
    lista.push(paqueteMuyRapido);
    lista.push(paqueteRapido);
    lista.push(paqueteNormal);
    lista.push(paqueteRapido2);
    matriz.agregarPaquetes(lista,"A");
});



test("Proceso paquetes en un unico local", () =>{
    matriz.agregarPaquetes(lista,"B");
    expect(matriz.locales[0].centrosCreados[0].paquetes.length).toBe(4);
    expect(matriz.locales[1].centrosCreados[0].paquetes.length).toBe(4);
})

test("Proceso paquetes en A y B y avanzo para verificar momentaneamente que se muevan hacia A", () =>{
     matriz.agregarPaquetes(lista,"B");
     matriz.avanzarTiempo(1);
     expect(matriz.locales[0].centrosCreados[1].paquetes.length).toBe(3);
     expect(matriz.locales[0].centrosCreados[1].cola.length).toBe(3);
     expect(matriz.locales[1].centrosCreados[1].paquetes.length).toBe(2);
     expect(matriz.locales[1].centrosCreados[1].cola.length).toBe(0);
})


// test("Proceso paquetes en A, B y C y avanzo para verificar momentaneamente que se muevan hacia A y B respectivamente", () =>{
//     matriz.agregarPaquetes(lista,"B");
//     matriz.agregarPaquetes(lista,"C");
//     matriz.avanzarTiempo(1);
//     expect(matriz.locales[0].centrosCreados[1].paquetes.length).toBe(3);
//     expect(matriz.locales[0].centrosCreados[1].cola.length).toBe(4);
//     expect(matriz.locales[1].centrosCreados[1].paquetes.length).toBe(3);
//     expect(matriz.locales[0].centrosCreados[1].cola.length).toBe(4);
// })