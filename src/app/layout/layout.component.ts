import { Component, ChangeDetectionStrategy, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    NzLayoutModule, NzMenuModule, NzIconModule,
    NzButtonModule, NzAvatarModule, NzDrawerModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);
  private breakpoint = inject(BreakpointObserver);
  private sub?: Subscription;

  collapsed = signal(false);
  drawerOpen = signal(false);
  isMobile = signal(false);
  user = this.auth.currentUser;

  ngOnInit() {
    this.sub = this.breakpoint
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => this.isMobile.set(result.matches));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.drawerOpen.set(false);
  }

  logout() {
    this.drawerOpen.set(false);
    this.auth.logout();
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
