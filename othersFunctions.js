const getRandom = (min=100000, max=999999) => {
    return parseInt(Math.random() * (max - min) + min);
}
const randomString = (length=8) => {
    return Math.random().toString(20).substr(2, length);
}
const getByHttp = (parameters) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            if(request.status == 200){
                //console.log(request);
            }
            else{
                console.log("Error loading page\n");
                console.log(request);
            }
            //return request;
        }
    };
    request.open('GET', `${dosend}?${parameters}`, false)
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(null)
    return request.responseText;
}

const generateParametersPost = (num, msg, provider=1) => {
    const tlf = num.replace(/ /g, "");
    const smsContent = msg.replace(/ /g, "+");
    const parameters = `method=2&smsnum=${tlf}&smsprovider=${provider}&smsgoip=0&submit1=Send&datehm=&qmsg=&Memo=${smsContent}`;
    return parameters;
}

const postByHttp = (parameters) => {
    const request = new XMLHttpRequest();
    if(request){
        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                if(request.status == 200) {
                    console.log(request);
                }
                else {
                    console.log("Error loading page\n");
                    console.log(request);
                };
            };
        };
        request.open("POST", dosend, false);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(parameters);
    };
    return request;
}

const postLogin = async (parameters) => {
    const request = new XMLHttpRequest();
    if(request){
        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                if(request.status == 200) {
                    console.log(request);
                }
                else {
                    console.log("Error loading page\n");
                    console.log(request);
                };
            };
        };
        await request.open("POST", dologin, true);
        request.send(parameters);
    };
    return request;
}