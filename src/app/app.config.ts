import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import 'hammerjs';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

// Custom Hammer config for swipe gestures
export class MyHammerConfig extends HammerGestureConfig {
  override overrides = {
    swipe: { direction: Hammer.DIRECTION_HORIZONTAL },
    pan: { direction: Hammer.DIRECTION_HORIZONTAL, threshold: 5 }
  } as any;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    importProvidersFrom(HammerModule),
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ]
};
