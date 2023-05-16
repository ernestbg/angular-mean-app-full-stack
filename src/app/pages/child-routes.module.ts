import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Graphic1Component } from './graphic1/graphic1.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromisesComponent } from './promises/promises.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './maintenances/users/users.component';
import { PlaylistsComponent } from './maintenances/playlists/playlists.component';
import { SongsComponent } from './maintenances/songs/songs.component';
import { SongComponent } from './maintenances/songs/song.component';
import { SearchComponent } from './search/search.component';
import { AdminGuard } from '../guards/admin.guard';
import { RouterModule, Routes } from '@angular/router';


const childRoutes: Routes = [
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
  { path: 'graphic1', component: Graphic1Component, data: { title: 'Graphics' } },
  { path: 'progress', component: ProgressComponent, data: { title: 'Progress' } },
  { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Themes' } },
  { path: 'promises', component: PromisesComponent, data: { title: 'Promises' } },
  { path: 'rxjs', component: RxjsComponent, data: { title: 'Rxjs' } },
  { path: 'profile', component: ProfileComponent, data: { title: 'Profile' } },
  { path: 'search/:term', component: SearchComponent, data: { title: 'Search' } },

  // Maintenances
  { path: 'playlists', component: PlaylistsComponent, data: { title: 'Playlists' } },
  { path: 'songs', component: SongsComponent, data: { title: 'Songs' } },
  { path: 'song/:id', component: SongComponent, data: { title: 'Songs' } },

  // Admin routes
  { path: 'users', canActivate: [AdminGuard], component: UsersComponent, data: { title: 'Users' } }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(childRoutes)],
    exports: [RouterModule]
})
export class ChildRoutesModule { }
