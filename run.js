const goip = require("./goip_module")

const main = async () => {

    const inicio = new Date();
    const sms1 = await goip.sendSingleSms("04149513409", "Probando tiempo de ejecucion desde NodeJS", 2);
    console.log(sms1);
    const fin = new Date();
    const result = fin - inicio;
    console.log("El script tarda " + result);

}; main();


//Bienvenido al nuevo servicio de mensajeria de NetPlus C.A. Este es un mensaje enviado automaticamente desde los servidores de Intercom Servicios C.A.