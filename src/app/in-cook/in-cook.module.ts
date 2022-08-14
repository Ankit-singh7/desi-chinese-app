import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InCookPageRoutingModule } from './in-cook-routing.module';

import { InCookPage } from './in-cook.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InCookPageRoutingModule
  ],
  declarations: [InCookPage]
})
export class InCookPageModule {}
