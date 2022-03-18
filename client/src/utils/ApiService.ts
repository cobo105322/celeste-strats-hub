import { EnumAPIEndpoint } from "../models/enums/EnumAPIEndpoint";
import { Strat } from "../models/interfaces/Strat";

export enum EnumEnviroments {
    LOCAL = 'local',
    DESARROLLO = 'dev',
    PRODUCCION = 'pro'
}


export class APIService {

    static readonly ENVIROMENT: EnumEnviroments = EnumEnviroments.LOCAL

    private static getMockupStrats(room_id: string) {
        let stratsObject = require("../data/mockup-strats.json");
        let strats: Strat[] = stratsObject.strats;
        return strats.filter(strat => strat.room_id === room_id);
    }

    static readonly SERVER_URL = (APIService.ENVIROMENT == EnumEnviroments.LOCAL) ? 'http://localhost:8081/' : window.location.origin + '/';

    static APICall(endpoint: EnumAPIEndpoint, parameters: { [key: string]: any }, method: string = 'post'): Promise<Response> {
        let finalUrl: string;
        let credentials: RequestCredentials = 'include';

        finalUrl = this.SERVER_URL + endpoint;

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
            let first = true;
            for (let key in parameters) {
                finalUrl += first ? '?' + key + '=' : '&' + key + '=';
                first = false;
                finalUrl += parameters[key];
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

    static GET_URL(url: EnumAPIEndpoint, parametros: { [key: string]: any }) {
        let finalUrl = this.SERVER_URL + url;
        let first = true;
        for (let key in parametros) {
            finalUrl += first ? `?${key}=${parametros[key]}` : `&${key}=${parametros[key]}`;
            first = false;
        }
        return finalUrl;
    }

    static errorFetch(error: { message: string }, url: string) {
        console.error("Error: ", error.message, "con ", url);
    }
}