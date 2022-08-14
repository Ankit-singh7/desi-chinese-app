import { Component, OnInit } from '@angular/core';
import { InQueuePage } from '../in-queue/in-queue.page';
import { InCookPage } from '../in-cook/in-cook.page';
import { InDispatchPage } from '../in-dispatch/in-dispatch.page';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  queue = InQueuePage;
  cook = InCookPage;
  dispatch = InDispatchPage

  constructor() { }

  ngOnInit() {
  }

}
