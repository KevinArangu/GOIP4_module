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
        return "error in parametersDosend funtion";
    }
    
};
const parametersResend = (id) => {
    const parameters = `messageid=${id}&USERNAME=${username}&PASSWORD=${password}`;
    return parameters;
};

//GET FUNCTIONS
const getDosend = (parameters) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            if(request.status == 200){
                //console.log(request);
            }
            else{
                console.log("Error in Dosend");
                console.log(request);
            }
        }
    };
    request.open('GET', `${dosend}?${parameters}`, false)
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(null)
    return request.responseText;
};
const getResend = (parameters, num) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            (request.status == 200) ? sendStatus(request.responseText, num) : console.log("Error in Resend:\n"+request);
        }
    };
    request.open('GET', `${resend}?${parameters}`, false)
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(null)
    return request.responseText;
};

//OTHERS NECESARY FUNCTIONS
const findMsgId = (string) => {
    const start = string.indexOf("messageid");
    const end = string.indexOf("&USERNAME");
    const result = string.slice(start+10, end);
    return result.toString();
};
const clearSpaces = (string) => {
    const result = string.replace(/ /g, "").toString();
    return result;
}
const msgFormat = (msg) => {
    const result =  msg.replace(/ /g, "+").toString();
    return result;
}
const sendStatus = (string, tel) => {
    const text = string.toString();
    const result = (text.includes("ok"))? { tel: tel, status: "send" } : { tel: tel, status: "not send" };
    return result;
}

//SEND SMS FUNCTIONS 
const sendSingleSms = async (num, msg, provider = 3) => {

    try {
        const dosend = parametersDosend(num, msg, provider);
        const statusDoSend = (dosend != "error in parametersDosend funtion")? "pasa parametersDosend" : dosend;
        console.log(statusDoSend);
        const smsDosend = await getDosend(dosend);
        const findId = findMsgId(smsDosend);
        const resend = parametersResend(findId);
        const smsResend = await getResend(resend, num);
        const status = sendStatus(smsResend, num);
        return status;
    } catch (error) {
        console.log(error)
        return { tel: num, status: "error", error: error}
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
