import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'my-sessions',
    loadComponent: () => import('./features/my-sessions/my-sessions.component').then(m => m.MySessionsComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./features/create-session/create-session.component').then(m => m.CreateSessionComponent)
  },
  {
    path: 'join',
    loadComponent: () => import('./features/join-session/join-session.component').then(m => m.JoinSessionComponent)
  },
  {
    path: 'game/:sessionId',
    loadComponent: () => import('./features/game/game.component').then(m => m.GameComponent)
  },
  {
    path: 'results/:sessionId',
    loadComponent: () => import('./features/results/results.component').then(m => m.ResultsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
