import { EnumAPIEndpoint } from "../models/enums/EnumAPIEndpoint";
import { Strat } from "../models/interfaces/Strat";

export class APIService{

    private static getMockupStrats(room_id: string){
        let stratsObject = require("../data/mockup-strats.json");
        let strats: Strat[] = stratsObject.strats;
        return strats.filter(strat=>strat.room_id === room_id);
    }

    static APICall(endpoint: EnumAPIEndpoint, parameters: { [key: string]: any}): Promise<any>{
        //TODO - actually call the backend and recover the data. For now we are recovering and return the mockup strats        
        if(endpoint === EnumAPIEndpoint.GET_STRATS && parameters["room_id"]){            
            return Promise.resolve(this.getMockupStrats(parameters["room_id"]));
        }
    }
}