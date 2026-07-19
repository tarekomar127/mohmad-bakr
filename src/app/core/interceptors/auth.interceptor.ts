import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

const AUTH_FREE_PATHS = ['/Auth/login', '/Auth/register', '/Auth/refresh-token'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const isAuthFree = AUTH_FREE_PATHS.some((path) => req.url.includes(path));
  const token = auth.getAccessToken();

  const authorizedReq = isApiRequest && token && !isAuthFree
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authorizedReq).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        isApiRequest &&
        !isAuthFree
      ) {
        return auth.refreshAccessToken().pipe(
          switchMap((user) => {
            if (!user) {
              router.navigateByUrl('/login');
              return throwError(() => error);
            }
            const retryToken = auth.getAccessToken();
            const retryReq = retryToken
              ? req.clone({ setHeaders: { Authorization: `Bearer ${retryToken}` } })
              : req;
            return next(retryReq);
          }),
          catchError((refreshError: unknown) => {
            auth.logout();
            router.navigateByUrl('/login');
            return throwError(() => refreshError);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
