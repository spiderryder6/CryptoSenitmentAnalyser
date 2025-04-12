import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { provideHttpClient } from "@angular/common/http";
import { provideAuth0 } from "@auth0/auth0-angular";

bootstrapApplication(AppComponent, {
  providers: [
    provideAuth0({
      domain: "dev-hwfi3shtak3rffs4.us.auth0.com",
      clientId: "DT8C8ys55nHyUIrVUvobiBhClFjMe2G8",
      authorizationParams: {
        redirect_uri: window.location.origin,
        post_logout_redirect_uri: window.location.origin,
      },
    }),
    provideHttpClient(),
    appConfig.providers,
  ],
}).catch((err) => console.error(err));
