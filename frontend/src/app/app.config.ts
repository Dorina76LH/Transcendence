import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(withInterceptors([authInterceptor])),
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes),
    provideZoneChangeDetection(),
	]
};
