import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InDispatchPageRoutingModule } from './in-dispatch-routing.module';

import { InDispatchPage } from './in-dispatch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InDispatchPageRoutingModule
  ],
  declarations: [InDispatchPage]
})
export class InDispatchPageModule {}
