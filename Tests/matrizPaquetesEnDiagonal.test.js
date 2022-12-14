const MatrizLocales=require('../src/matrizLocales');
const Paquete= require('../src/paquete')
const Local= require('../src/local')

var matriz;
var reseter2;
var paqueteMuyRapido;
var paqueteRapido;
var paqueteRapido2;
var paqueteNormal;
var lista;

beforeEach(()=> {
    reseter2= new Local(["CF","CC","CD"],[6,2,14]);
    reseter2.resetearID();
    matriz= new MatrizLocales(["CF","CC","CD"],[[6,3,23],[5,4,10],[6,2,14]]);
    lista=[];
    paqueteMuyRapido=new Paquete(1,"muy rapido",4);
    paqueteMuyRapido.resetearID();
    paqueteRapido=new Paquete(2,"rapido",4);
    paqueteNormal=new Paquete(3,"normal",4);
    paqueteRapido2=new Paquete(3,"rapido",4);
    
    lista.push(paqueteMuyRapido);
    lista.push(paqueteRapido);
    lista.push(paqueteNormal);
    lista.push(paqueteRapido2);
    matriz.agregarPaquetes(lista,"A");
});



test("Proceso paquetes en un unico local", () =>{
    matriz.agregarPaquetes(lista,"B");
    expect(matriz.locales[0].centros[0].paquetes.length).toBe(4);
    expect(matriz.locales[1].centros[0].paquetes.length).toBe(4);
})

test("Proceso paquetes en A y B y avanzo para verificar momentaneamente que se muevan hacia A", () =>{
     matriz.agregarPaquetes(lista,"B");
     matriz.avanzarTiempo(1);
     expect(matriz.locales[0].centros[1].paquetes.length).toBe(3);
     expect(matriz.locales[0].centros[1].cola.length).toBe(3);
     expect(matriz.locales[1].centros[1].paquetes.length).toBe(2);
     expect(matriz.locales[1].centros[1].cola.length).toBe(0);
})


test("Proceso paquetes en A, B y C y avanzo para verificar momentaneamente que se muevan hacia A y B respectivamente", () =>{
    matriz.agregarPaquetes(lista,"B");
    matriz.agregarPaquetes(lista,"C");
    matriz.avanzarTiempo(1);
    expect(matriz.locales[0].centros[1].paquetes.length).toBe(3);
    expect(matriz.locales[0].centros[1].cola.length).toBe(3); //A le saco 2 a B
    expect(matriz.locales[1].centros[1].paquetes.length).toBe(3); //B se quedo con 2 procesando de los suyos y 1 de C
    expect(matriz.locales[1].centros[1].cola.length).toBe(2); //B se queda con 2 de C en cola
    expect(matriz.locales[2].centros[1].paquetes.length).toBe(1);
    expect(matriz.locales[2].centros[1].cola.length).toBe(0);
})

test("Verificando que el paquete llegue a su destino", () =>{
    matriz.agregarPaquetes(lista,"B");
    matriz.avanzarTiempo(1);
    expect(matriz.locales[0].centros[1].paquetes.length).toBe(3);
    expect(matriz.locales[0].centros[1].cola.length).toBe(3);
    expect(matriz.locales[1].centros[1].paquetes.length).toBe(2);
    expect(matriz.locales[1].centros[1].cola.length).toBe(0);
})




test("Proceso paquetes en A y B y avanzo para verificar los destinos", () =>{
    matriz.avanzarTiempo(1);
    matriz.avanzarTiempo(1);
    matriz.avanzarTiempo(1);
    matriz.avanzarTiempo(1);
    expect(matriz.locales[0].informarPaquetesEnDestino()).toBe("P1: Destino 1, Urgencia 4, llego a tiempo\n");
})


test("Proceso paquetes en A y B y avanzo para verificar los destinos de los paquetes rapido y muy rapido", () =>{
    matriz.avanzarTiempo(1);
    matriz.avanzarTiempo(1);
    matriz.avanzarTiempo(1);
    matriz.avanzarTiempo(1);
    //expect(matriz.locales[0].informarPaquetesEnDestino()).toBe("P1: Destino 1, Urgencia 4, llego a tiempo\n");
    matriz.avanzarTiempo(1);
    expect(matriz.locales[1].informarPaquetesEnDestino()).toBe("P2: Destino 2, Urgencia 6, llego a tiempo\n");
})


test("Procesamos y verificamos donde estan los paquetes con destino 3", () =>{
    matriz.avanzarTiempo(1);
    matriz.avanzarTiempo(1);
    expect(matriz.locales[1].centros[2].paquetes.length).toBe(1);
})



test("Procesamos y verificamos donde estan los paquetes con destino 3", () =>{
    reseter2= new Local(["CF","CC","CD"],[6,2,14]);
    reseter2.resetearID();
    var matriz2= new MatrizLocales(["CF","CC","CD"],[[6,3,23],[5,4,10],[6,2,14],[6,3,20]]);
    lista.push(new Paquete(4,"rapido",4));
    matriz2.agregarPaquetes(lista,"A");
    matriz2.avanzarTiempo(1);
    matriz2.avanzarTiempo(1);
    matriz2.avanzarTiempo(1);
    expect(matriz2.locales[0].centros[2].paquetes[0].destino).toBe(2);
    expect(matriz2.locales[0].centros[3].paquetes[0].destino).toBe(1);
    expect(matriz2.locales[1].centros[2].paquetes[0].destino).toBe(3);
    expect(matriz2.locales[2].centros[3].paquetes[0].destino).toBe(3);
    expect(matriz2.locales[2].centros[3].paquetes[0].destino).toBe(3);
    expect(matriz2.locales[3].centros[3].paquetes[0].destino).toBe(4);
})

test("Procesamos y verificamos donde estan los paquetes con destino 3", () =>{
    reseter2= new Local(["CF","CC","CD"],[6,2,14]);
    reseter2.resetearID();
    var matriz2= new MatrizLocales(["CF","CC","CD"],[[6,3,23],[5,4,10],[6,2,14],[6,3,20]]);
    lista.push(new Paquete(4,"rapido",4));
    matriz2.agregarPaquetes(lista,"A");
    matriz2.avanzarTiempo(1);
    matriz2.avanzarTiempo(1);
    matriz2.avanzarTiempo(1);
    matriz2.avanzarTiempo(1);
    matriz2.avanzarTiempo(1);
    expect(matriz2.locales[1].informarPaquetesEnDestino()).toBe("P2: Destino 2, Urgencia 6, llego a tiempo\n");
})



test("Procesamos y verificamos donde estan los paquetes con destino 3", () =>{
    reseter2= new Local(["CF","CC","CD"],[6,2,14]);
    reseter2.resetearID();
    var matriz2= new MatrizLocales(["CF","CC","CD"],[[6,3,23],[5,4,10],[6,2,14],[6,3,20]]);
    lista.push(new Paquete(4,"rapido",4));
    matriz2.agregarPaquetes(lista,"A");
    matriz2.avanzarTiempo(1);
    matriz2.avanzarTiempo(1);
    matriz2.avanzarTiempo(1);
    matriz2.avanzarTiempo(1);
    expect(matriz2.locales[2].informarPaquetesEnDestino()).toBe("P4: Destino 3, Urgencia 6, llego a tiempo\n");
})


test("Procesamos y verificamos donde estan los paquetes con destino 3", () =>{
    reseter2= new Local(["CF","CC","CD"],[6,2,14]);
    reseter2.resetearID();
    var matriz2= new MatrizLocales(["CF","CC","CD"],[[6,3,23],[5,4,10],[6,2,14],[6,3,20]]);
    lista.push(new Paquete(4,"rapido",4));
    matriz2.agregarPaquetes(lista,"A");
    matriz2.avanzarTiempo(1);
    matriz2.avanzarTiempo(1);
    matriz2.avanzarTiempo(1);
    matriz2.avanzarTiempo(1);
    expect(matriz2.locales[3].informarPaquetesEnDestino()).toBe("P5: Destino 4, Urgencia 6, llego a tiempo\n");
})


test("Procesamos y verificamos donde estan los paquetes con destino 3", () =>{
    reseter2= new Local(["CF","CC","CD"],[6,2,14]);
    reseter2.resetearID();
    var matriz2= new MatrizLocales(["CF","CC","CD"],[[6,3,23],[5,4,10],[6,2,14],[6,3,20]]);
    var paqueteMuyRapido2=new Paquete(1,"muy rapido",4);
    paqueteMuyRapido2.resetearID();
    var paqueteRapido2=new Paquete(2,"rapido",4);
    var paqueteNormal2=new Paquete(3,"normal",4);
    var paqueteRapido3=new Paquete(3,"rapido",4);
    var lista2=[];
    lista2.push(paqueteMuyRapido2);
    lista2.push(paqueteRapido2);
    lista2.push(paqueteNormal2);
    lista2.push(paqueteRapido3);
    lista2.push(new Paquete(4,"rapido",4));
    matriz2.agregarPaquetes(lista2,"A");
    matriz2.avanzarTiempo(1);
    expect(matriz2.locales[1].centros[1].paquetes.length).toBe(1);
    matriz2.avanzarTiempo(1);
    matriz2.avanzarTiempo(1);
    matriz2.avanzarTiempo(1);
    expect(matriz2.locales[0].informarPaquetesEnDestino()).toBe("P1: Destino 1, Urgencia 4, llego a tiempo\n");
})