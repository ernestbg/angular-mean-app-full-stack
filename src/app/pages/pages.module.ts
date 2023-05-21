import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from "../shared/shared.module";
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { SongsComponent } from './songs/songs.component';
import { PipesModule } from '../pipes/pipes.module';
import { SongComponent } from './songs/song.component';
import { SearchComponent } from './search/search.component';
import { ArtistsComponent } from './artists/artists.component';
import { Router, RouterModule } from '@angular/router';
import { ArtistDetailComponent } from './artist-detail/artist-detail.component';
import { AlbumComponent } from './album/album.component';





@NgModule({
    declarations: [
        DashboardComponent,
        PagesComponent,
        AccountSettingsComponent,
        ProfileComponent,
        UsersComponent,
        PlaylistsComponent,
        SongsComponent,
        SongComponent,
        SearchComponent,
        ArtistsComponent,
        ArtistDetailComponent,
        AlbumComponent
    ],
    exports: [
        DashboardComponent,
        PagesComponent,
        AccountSettingsComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        AppRoutingModule,
        FormsModule,
        ComponentsModule,
        ReactiveFormsModule,
        PipesModule,
        RouterModule
    ],
    
})
export class PagesModule { }
