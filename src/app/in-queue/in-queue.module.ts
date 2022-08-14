import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InQueuePageRoutingModule } from './in-queue-routing.module';

import { InQueuePage } from './in-queue.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InQueuePageRoutingModule
  ],
  declarations: [InQueuePage]
})
export class InQueuePageModule {}
