import {EnumAPIEndpoint} from "../models/enums/EnumAPIEndpoint";

export class APIService {

    static readonly SERVER_URL = process.env.REACT_APP_API_URL;

    static APICall(endpoint: EnumAPIEndpoint, parameters: { [key: string]: any }, method: string = 'post'): Promise<Response> {
        let finalUrl: string;
        let credentials: RequestCredentials = 'include';

        finalUrl = endpoint;

        //Crea un FormData y le anade los parametros recibidos

        //Hace una llamada POST a la url
        let resultFetch: Promise<Response>;
        if (method.toUpperCase() == 'POST') {
            let params = new FormData();
            for (let key in parameters) {
                params.append(key, parameters[key]);
            }
            resultFetch = fetch(finalUrl, {
                method: method,
                credentials: credentials,
                headers: {},
                body: params
            });
        } else { //asumamos GET de momento
            const paramString = new URLSearchParams(parameters).toString();
            if (paramString) {
                finalUrl += "?" + paramString;
            }
            resultFetch = fetch(finalUrl, {
                method: method,
                credentials: credentials,
                headers: {}
            });
        }

        resultFetch.then((r) => {
            if (r.status == 401) {
                window.location.reload();
            }
        })
        resultFetch.catch((error) => {
            this.errorFetch(error, endpoint);
        });
        return resultFetch;
    }

    static errorFetch(error: { message: string }, url: string) {
        console.error("Error: ", error.message, "con ", url);
    }
}