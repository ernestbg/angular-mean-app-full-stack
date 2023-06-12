import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
import { SearchComponent } from './search/search.component';
import { AdminGuard } from '../guards/admin.guard';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistsComponent } from './playlists/playlists.component';
import { ArtistsComponent } from './artists/artists.component';
import { ArtistDetailComponent } from './artist-detail/artist-detail.component';
import { AlbumComponent } from './album/album.component';
import { MyAlbumsComponent } from './my-albums/my-albums.component';



const childRoutes: Routes = [
  { path: '' ,component: DashboardComponent, data: { title: 'Dashboard' } },
  { path: 'profile', component: ProfileComponent, data: { title: 'Profile' } },
  { path: 'search/:term', component: SearchComponent, data: { title: 'Search' } },

  // Maintenances
  { path: 'playlists', component: PlaylistsComponent, data: { title: 'Playlists' } },
  { path: 'artists', component: ArtistsComponent, data: { title: 'Artists' } },
  { path: 'artist-detail/:artistId', component: ArtistDetailComponent },
  { path: 'album/:albumId', component: AlbumComponent },
  { path: 'my-albums', component: MyAlbumsComponent },

  // Admin routes
  { path: 'users', canActivate: [AdminGuard], component: UsersComponent, data: { title: 'Users' } }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(childRoutes)],
    exports: [RouterModule]
})
export class ChildRoutesModule { }
