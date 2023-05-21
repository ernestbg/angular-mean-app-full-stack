import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
import { SongsComponent } from './songs/songs.component';
import { SongComponent } from './songs/song.component';
import { SearchComponent } from './search/search.component';
import { AdminGuard } from '../guards/admin.guard';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistsComponent } from './playlists/playlists.component';
import { ArtistsComponent } from './artists/artists.component';
import { ArtistDetailComponent } from './artist-detail/artist-detail.component';
import { AlbumComponent } from './album/album.component';



const childRoutes: Routes = [
  { path: '' ,component: DashboardComponent, data: { title: 'Dashboard' } },
  { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Themes' } },
  { path: 'profile', component: ProfileComponent, data: { title: 'Profile' } },
  { path: 'search/:term', component: SearchComponent, data: { title: 'Search' } },

  // Maintenances
  { path: 'playlists', component: PlaylistsComponent, data: { title: 'Playlists' } },
  { path: 'songs', component: SongsComponent, data: { title: 'Songs' } },
  { path: 'song/:id', component: SongComponent, data: { title: 'Songs' } },
  { path: 'artists', component: ArtistsComponent, data: { title: 'Artists' } },
  { path: 'artist-detail/:artistId', component: ArtistDetailComponent },
  { path: 'album/:albumId', component: AlbumComponent },

  // Admin routes
  { path: 'users', canActivate: [AdminGuard], component: UsersComponent, data: { title: 'Users' } }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(childRoutes)],
    exports: [RouterModule]
})
export class ChildRoutesModule { }
