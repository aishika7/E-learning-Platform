import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

async function prepareApp() {
  if (environment.useMocks) {
    const { worker } = await import('./mocks/browser');
    return worker.start({ onUnhandledRequest: 'bypass' });
  }
  return Promise.resolve();
}

prepareApp().then(() => {
  platformBrowserDynamic().bootstrapModule(AppModule, {
    ngZoneEventCoalescing: true
  }).catch(err => console.error(err));
});
