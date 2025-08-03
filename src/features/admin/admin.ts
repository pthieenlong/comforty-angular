import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './ui/components/sidebar/sidebar';
import { Header } from './ui/components/header/header';
import { LayoutService } from 'shared/services/layout.service';
import { SidebarService } from './service/sidebar.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './ui/admin.html',
  styleUrl: './ui/admin.css',
})
export class Admin implements OnInit, OnDestroy {
  constructor(
    private layoutService: LayoutService,
    public sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.layoutService.hideClientLayout();
  }

  ngOnDestroy() {
    this.layoutService.showClientLayout();
  }

  get sidebarToggle() {
    return this.sidebarService.sidebarToggle;
  }
}
