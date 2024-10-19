import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'map', loadChildren: () => import('./pages/map/map.module').then(m => m.MapPageModule) },
  { path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule) },
  { path: 'destinations', loadChildren: () => import('./pages/destinations/destinations.module').then(m => m.DestinationsPageModule) },
  { path: '', redirectTo: '/map', pathMatch: 'full' },
  {
    path: 'map',
    loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'destinations',
    loadChildren: () => import('./pages/destinations/destinations.module').then( m => m.DestinationsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
