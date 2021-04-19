import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthServiceService } from "./services/auth-service.service";
import { User } from "./interfaces/user.interface";

@Injectable()
export class AuthGuard implements CanActivate {
    user!:User|null
    constructor( private authService:AuthServiceService, private router:Router){}
    canActivate(route:ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean>{
       return this.authService.loggedInUser.pipe(map(user=>{
            if(user) {
                return true
            } else {
                this.router.navigate(['/offer'])
                return false
            }
        }), take(1)) 
     }
}