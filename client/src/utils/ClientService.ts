import { User } from "../models/interfaces/User";

export class ClientService{

    private static currentUser: User = ClientService.emptyUser();

    private static emptyUser(): User{
        return {
            id: null,
            name: null,
            email: null
        }
    }

    public static setUser(user: User): void{
        ClientService.currentUser = user;
    }

    public static logoutUser(): void{
        ClientService.currentUser = ClientService.emptyUser();
    }

    public static getUser(): User{
        return ClientService.currentUser;
    }

    public static isLogged(): boolean{
        return ClientService.currentUser.id!==null;
    }

}