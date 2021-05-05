//Modulo desarrollado por: Kevin Arangu

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const dosend = 'http://172.16.127.17/goip/en/dosend.php';
const resend = 'http://172.16.127.17/goip/en/resend.php';
const username = 'integracion';
const password = 'intercomgoip*';

//GENERATING PARAMETERS FOR SEND BY HTTPREQUEST
const parametersDosend = (num, msg, provider=2) => {

    try {
        const tlf = clearSpaces(num);
        const smsContent = msgFormat(msg);
        const parameters = `USERNAME=${username}&PASSWORD=${password}&smsprovider=${provider}&smsnum=${tlf}&method=2&Memo=${smsContent}`;
        return parameters;
    } catch (error) {
        console.log(error)
        return "error in parametersDosend function";
    }
    
};
const parametersResend = (id) => {
    try {
        const parameters = `messageid=${id}&USERNAME=${username}&PASSWORD=${password}`;
        return parameters;
    } catch (error) {
        console.log(error)
        return "error in parametersResend function";
    }
};

//GET FUNCTIONS
const getDosend = (parameters) => {
    try {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                // if(request.status == 200){
                //     //console.log(request);
                // }
                // else{
                //     console.log("Error in Dosend");
                //     console.log(request);
                // }
            }
        };
        request.open('GET', `${dosend}?${parameters}`, false)
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(null)
        const status = {code: request.status, text: request.responseText.toString()};
        return status;
    } catch (error) {
        console.log(error)
        return "error in getDosend function";
    }
    
};
const getResend = (parameters, num) => {
    try {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                // const statusReq = (request.status == 200) ? "send" : `error in Resend, error ${request.readyState}`;
                // console.log(status)
                // return status;
            }
        };
        request.open('GET', `${resend}?${parameters}`, false)
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(null)
        //REVISO SI EL OUTPUT CONTIENE OK
        const text = request.responseText.toString();
        const result = (text.includes("ok"))? {status:"send", state:request.status} : {status:"not send", state:request.status, responseText: text};
        return result;
    } catch (error) {
        console.log(error)
        return "error in getResend function";
    }
};

//OTHERS NECESARY FUNCTIONS
const findMsgId = (string) => {

    try {
        const start = string.indexOf("messageid");
        const end = string.indexOf("&USERNAME");
        const result = string.slice(start+10, end);
        return result.toString();
    } catch (error) {
        console.log(error)
        return "error in findMsgId function";
    }

    
};
const clearSpaces = (string) => {
    const result = string.replace(/ /g, "").toString();
    return result;
}
const msgFormat = (msg) => {
    const result =  msg.replace(/ /g, "+").toString();
    return result;
}

//SEND SMS FUNCTION
const sendSingleSms = async (num, msg, provider = 3) => {

    try {
        const dosend = parametersDosend(num, msg, provider);
        const statusDoSend = (dosend != "error in parametersDosend function") ? "ok" : dosend;

        const smsDosend = await getDosend(dosend);
        const statusSmsDosend = (smsDosend != "error in getDosend function") ? "ok" : smsDosend;

        const findId = findMsgId(smsDosend.text);
        const statusFindId = (findId != "error in findMsgId function") ? "ok" : findId;

        const resend = parametersResend(findId);
        const statusResend = (resend != "error in parametersResend function") ? "ok" : resend;

        const smsResend = await getResend(resend, num);
        const statusSmsResend = (smsResend != "error in getResend function") ? "ok" : smsResend;

        const status = {status: smsResend.status, tel: num, text: msg, statusDoSend, statusSmsDosend, statusFindId, statusResend, statusSmsResend, smsResendDetail: smsResend, smsDosendDetail: smsDosend};
        return status;

    } catch (error) {
        console.log(error)
        return { tel: num, status: "error in code ejecution", error: error}
    }
};

const sendToAllClients = async (numArray=[], msg, provider = 3) => {

    const clients = await Promise.all( numArray.map( (client) => {
        const status = sendSingleSms(client, msg, provider);
        return status;
    }));
    return clients;

}

module.exports = {
    sendSingleSms, sendToAllClients
};
