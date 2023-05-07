import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { ModalImgService } from 'src/app/services/modal-img.service';
import { SearchesService } from 'src/app/services/searches.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [
  ]
})

export class UsersComponent implements OnInit, OnDestroy {

  public totalUsers: number = 0;
  public users: User[] = [];
  public usersTemp: User[] = [];
  public from: number = 0;
  public loading: boolean;
  public imgSubs: Subscription;

  constructor(private userService: UserService,
    private searchesService: SearchesService,
    private modalImgService: ModalImgService) { }


  ngOnInit(): void {
    this.loadUsers();
    this.imgSubs = this.modalImgService.imgUploaded.subscribe(img => this.loadUsers());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  loadUsers() {
    this.loading = true;
    this.userService.loadUsers(this.from).
      subscribe(({ total, users }) => {
        this.totalUsers = total;
        this.users = users;
        this.usersTemp = users;
        this.loading = false;
      });
  }

  changePage(value: number) {
    this.from += value;
    if (this.from < 0) {
      this.from = 0;
    } else if (this.from >= this.totalUsers) {
      this.from -= value;
    }
    this.loadUsers();
  }

  search(term: string) {
    if (term.length === 0) {
      return this.users = this.usersTemp;
    }
    this.searchesService.search('users', term)
      .subscribe(resp => this.users = resp)
  }

  deleteUser(user: User) {
    if (user.uid === this.userService.uid) {
      return Swal.fire('Error', 'Cannot delete this user')
    }
    Swal.fire({
      title: 'Are you sure?',
      text: `delete user ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.userService.deleteUser(user)
          .subscribe(() => {
            this.loadUsers();
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          }
          );
      }
    });
  }

  changeRole(user: User) {
    this.userService.saveUser(user)
      .subscribe(resp => {
        console.log(resp)
      });
  }

  openModal(user: User) {
    this.modalImgService.openModal('users', user.uid, user.img);
  }
}
