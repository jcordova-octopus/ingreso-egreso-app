import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy{

  cargando: boolean;
  subscription: Subscription;

  constructor(public authService: AuthService, public store: Store<AppState>) { }

  ngOnInit() {
    // inicializamos el store selecionamos el estado de la UI
    // con el operador firts lo que hace es me subscribo una sola vez.
    this.subscription = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading );

  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(data: any) {
    // cuando ejecutamos esta accion accionamos el metodo redux
    this.authService.crearUsuario(data.nombre, data.email, data.password);
  }

}
