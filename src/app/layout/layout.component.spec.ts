import { signal } from '@angular/core';

describe('LayoutComponent', () => {
  let routerMock: any;
  let authMock: any;

  const getInitials = (name: string): string =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const createComponent = (router: any, auth: any) => {
    const drawerOpen = signal(false);
    const collapsed = signal(false);
    const isMobile = signal(false);

    return {
      collapsed,
      drawerOpen,
      isMobile,
      user: auth.currentUser,
      getInitials,
      navigateTo(path: string) {
        router.navigate([path]);
        drawerOpen.set(false);
      },
      logout() {
        drawerOpen.set(false);
        auth.logout();
      },
    };
  };

  let component: ReturnType<typeof createComponent>;

  beforeEach(() => {
    routerMock = { navigate: jest.fn() };
    authMock = {
      currentUser: () => ({ displayName: 'Test User' }),
      logout: jest.fn(),
    };
    component = createComponent(routerMock, authMock);
  });

  it('navigateTo() should navigate and close drawer', () => {
    component.drawerOpen.set(true);
    component.navigateTo('/app/dashboard');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/dashboard']);
    expect(component.drawerOpen()).toBe(false);
  });

  it('logout() should close drawer and call auth.logout', () => {
    component.drawerOpen.set(true);
    component.logout();
    expect(component.drawerOpen()).toBe(false);
    expect(authMock.logout).toHaveBeenCalled();
  });

  it('getInitials() should return first letters', () => {
    expect(component.getInitials('John Doe')).toBe('JD');
    expect(component.getInitials('Alice Bob Charlie')).toBe('AB');
    expect(component.getInitials('Z')).toBe('Z');
  });

  it('collapsed signal should toggle', () => {
    expect(component.collapsed()).toBe(false);
    component.collapsed.set(true);
    expect(component.collapsed()).toBe(true);
  });
});
