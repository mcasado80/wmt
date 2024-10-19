import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DestinationsPageRoutingModule } from './destinations-routing.module';

import { DestinationsPage } from './destinations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DestinationsPageRoutingModule
  ],
  declarations: [DestinationsPage]
})
export class DestinationsPageModule {}
