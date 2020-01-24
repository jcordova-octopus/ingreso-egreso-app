import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

// para importar toda las interface de firebase
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';

import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private afAuth: AngularFireAuth, private router: Router, private afDb: AngularFirestore) { }

  // regresamos el estado del auth
  initAuthListener() {
    // declaramos que fbUser es de tipo interface Firebase
    // que nos prermite ir directo los datos del usuario
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      console.log(fbUser);
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {

    // esto devuelve una promesa .then y un .catch para los errores
    // este meto auntentica al usuario una vez registrado
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(resp => {
      // console.log(resp);


      const user: User = {
        uid: resp.user.uid,
        nombre: nombre,
        email: resp.user.email
      }

      // con esto creamos un documento en la la siguiente ruta en la
      // base de datos de firebase
      this.afDb.doc(`${user.uid}/usuario`)
      .set(user)
      .then(() => {
        this.router.navigate(['/']);
      });



    }).catch(error => {
      // console.error(error);
      Swal.fire('Error en el Registro', error.message, 'error');

    });

  }

  login(email: string, password: string) {

      this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(resp => {
        // console.log(resp);
        this.router.navigate(['/']);
      }).catch(error => {
          // console.error(error);
          // Swal.fire('Error en el Login', error.message, 'error');
          Swal.fire('Error en el Login', 'El Correo o Contraseña no son validos', 'error');
      });
  }


  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  // para saver si el usuario esta autenticado
  isAuth() {
    return this.afAuth.authState.pipe(
      map(fbUser => {

        // si no hacemos esta validacion lo que pasaria es
        // no nos redirige al login solo nos mostraria
        // la pantalla en blanco
        if (fbUser == null) {
            this.router.navigate(['/login']);
        }

        return fbUser != null;

      })
    );
  }


}


