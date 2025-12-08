# Auth Module - Frontend Implementation Guide (Angular v20+)

## Table of Contents
1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Data Models](#data-models)
4. [Business Logic](#business-logic)
5. [Validations](#validations)
6. [Angular Implementation](#angular-implementation)
7. [Error Handling](#error-handling)
8. [Security Considerations](#security-considerations)

---

## Overview

The authentication module provides user authentication and password management functionality. It integrates with Supabase for external authentication while maintaining a local user database for application-specific data.

### Key Features
- User login with email and password
- Password reset request flow
- Password reset confirmation
- JWT-based session management
- Integration with local user database

### Base URL
```
/api/auth
```

---

## API Endpoints

### 1. Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates a user with email and password. Returns access token, refresh token, and user information.

**Request Headers:**
```typescript
Content-Type: application/json
```

**Request Body:**
```typescript
{
  email: string;      // Valid email address
  password: string;   // Non-empty password
}
```

**Response (200 OK):**
```typescript
{
  accessToken: string | null;    // JWT access token
  refreshToken: string | null;   // JWT refresh token
  expiresAt: number | null;      // Unix timestamp (seconds) when token expires
  user: {
    userId: string;
    externalAuthId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    isActive: boolean;
    userMetadata: any | null;
    createdAt: Date;
    lastSyncedAt: Date | null;
  } | null;
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body (validation error)
- `401 Unauthorized`: Invalid credentials or authentication failed
- `500 Internal Server Error`: Server error

**Example Request:**
```typescript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Example Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": 1735689600,
  "user": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "externalAuthId": "supabase-user-id-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "userMetadata": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastSyncedAt": null
  }
}
```

---

### 2. Request Password Reset

**Endpoint:** `POST /api/auth/reset-password/request`

**Description:** Initiates a password reset flow. Sends a password reset email to the user if the email exists in the system. For security, the response is the same whether the email exists or not.

**Request Headers:**
```typescript
Content-Type: application/json
```

**Request Body:**
```typescript
{
  email: string;  // Valid email address
}
```

**Response (200 OK):**
```typescript
{
  message: string;  // "If email exists, a reset link has been sent"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid email format
- `500 Internal Server Error`: Server error

**Business Logic:**
- The endpoint does not reveal whether an email exists in the system
- A password reset token is generated and stored (hashed) in the database
- Token expires after 1 hour
- Reset link is sent via email (handled by Supabase)
- Reset link format: `${APP_URL}/auth/reset-password?token=${token}`

**Example Request:**
```typescript
POST /api/auth/reset-password/request
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Example Response:**
```json
{
  "message": "If email exists, a reset link has been sent"
}
```

---

### 3. Reset Password

**Endpoint:** `POST /api/auth/reset-password`

**Description:** Confirms password reset using a valid token and sets a new password.

**Request Headers:**
```typescript
Content-Type: application/json
```

**Request Body:**
```typescript
{
  token: string;        // Password reset token from email link
  newPassword: string;  // New password (min 8 characters, must meet strength requirements)
}
```

**Response (200 OK):**
```typescript
{
  message: string;  // "Password reset successful"
}
```

**Error Responses:**
- `400 Bad Request`: 
  - Invalid or expired token
  - Password does not meet strength requirements
  - Invalid request body (validation error)
- `500 Internal Server Error`: Server error

**Password Strength Requirements:**
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

**Business Logic:**
- Token is validated (not used, not expired)
- Password strength is validated
- Password is updated in Supabase
- Token is marked as used
- Token can only be used once

**Example Request:**
```typescript
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "abc123def456...",
  "newPassword": "NewSecurePassword123"
}
```

**Example Response:**
```json
{
  "message": "Password reset successful"
}
```

---

## Data Models

### Login Request
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

### Login Response
```typescript
interface LoginResponse {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: User | null;
}

interface User {
  userId: string;
  externalAuthId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  userMetadata: any | null;
  createdAt: Date;
  lastSyncedAt: Date | null;
}
```

### Password Reset Request
```typescript
interface PasswordResetRequest {
  email: string;
}
```

### Password Reset Response
```typescript
interface PasswordResetResponse {
  message: string;
}
```

### Reset Password Request
```typescript
interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
```

### Reset Password Response
```typescript
interface ResetPasswordResponse {
  message: string;
}
```

### Error Response
```typescript
interface ErrorResponse {
  message: string;
  statusCode: number;
  error?: any;
}
```

---

## Business Logic

### Login Flow

1. **User submits credentials**
   - Frontend validates email format and password presence
   - Sends request to `/api/auth/login`

2. **Backend processing**
   - Validates request body (email format, password presence)
   - Authenticates with Supabase using `signInWithPassword`
   - Retrieves local user record using `externalAuthId` from Supabase user
   - Returns tokens and user information

3. **Frontend handling**
   - Stores access token and refresh token securely
   - Stores user information in application state
   - Sets up token refresh mechanism
   - Redirects to appropriate route based on user role/permissions

### Password Reset Flow

#### Step 1: Request Password Reset

1. **User requests reset**
   - User enters email address
   - Frontend validates email format
   - Sends request to `/api/auth/reset-password/request`

2. **Backend processing**
   - Finds user by email (if exists)
   - Generates secure random token (32 bytes, hex encoded)
   - Hashes token using SHA-256
   - Stores hashed token in database with 1-hour expiration
   - Sends password reset email via Supabase (contains reset link)

3. **Frontend handling**
   - Shows success message (same message regardless of email existence)
   - Instructs user to check email

#### Step 2: Reset Password

1. **User clicks reset link**
   - Link format: `/auth/reset-password?token=abc123...`
   - Frontend extracts token from URL query parameter
   - Displays password reset form

2. **User submits new password**
   - Frontend validates password strength
   - Sends request to `/api/auth/reset-password` with token and new password

3. **Backend processing**
   - Validates password strength (8+ chars, uppercase, lowercase, number)
   - Hashes provided token
   - Finds valid token record (not used, not expired)
   - Updates password in Supabase via admin API
   - Marks token as used

4. **Frontend handling**
   - Shows success message
   - Redirects to login page
   - User can now login with new password

### Token Management

- **Access Token**: Used for authenticating API requests
- **Refresh Token**: Used to obtain new access tokens when current one expires
- **Token Storage**: Store tokens securely (consider using httpOnly cookies or secure storage)
- **Token Expiration**: Check `expiresAt` timestamp to determine when to refresh
- **Token Refresh**: Implement automatic token refresh before expiration

---

## Validations

### Frontend Validations

#### Login Form
```typescript
// Email validation
- Required field
- Valid email format (RFC 5322 compliant)
- Example: user@example.com

// Password validation
- Required field
- Minimum 1 character (backend enforces this)
```

#### Password Reset Request Form
```typescript
// Email validation
- Required field
- Valid email format
```

#### Reset Password Form
```typescript
// Token validation
- Required field
- Non-empty string

// New Password validation
- Required field
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- Show real-time validation feedback
```

### Backend Validations (for reference)

#### Login Schema (Zod)
```typescript
{
  email: z.string().email(),
  password: z.string().min(1)
}
```

#### Password Reset Request Schema
```typescript
{
  email: z.string().email()
}
```

#### Reset Password Schema
```typescript
{
  token: z.string().min(1),
  newPassword: z.string().min(8)
}
```

**Additional Backend Password Validation:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

---

## Angular Implementation

### Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── token.service.ts
│   │   │   └── http-interceptor.service.ts
│   │   └── guards/
│   │       ├── auth.guard.ts
│   │       └── guest.guard.ts
│   ├── features/
│   │   └── auth/
│   │       ├── components/
│   │       │   ├── login/
│   │       │   │   ├── login.component.ts
│   │       │   │   ├── login.component.html
│   │       │   │   └── login.component.scss
│   │       │   ├── password-reset-request/
│   │       │   │   ├── password-reset-request.component.ts
│   │       │   │   ├── password-reset-request.component.html
│   │       │   │   └── password-reset-request.component.scss
│   │       │   └── password-reset/
│   │       │       ├── password-reset.component.ts
│   │       │       ├── password-reset.component.html
│   │       │       └── password-reset.component.scss
│   │       ├── models/
│   │       │   └── auth.models.ts
│   │       └── auth.routes.ts
│   └── shared/
│       ├── models/
│       │   └── user.model.ts
│       └── validators/
│           └── password.validator.ts
```

### 1. Models

#### `auth.models.ts`
```typescript
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: User | null;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface User {
  userId: string;
  externalAuthId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  userMetadata: any | null;
  createdAt: Date;
  lastSyncedAt: Date | null;
}
```

#### `user.model.ts`
```typescript
export interface User {
  userId: string;
  externalAuthId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  userMetadata: any | null;
  createdAt: Date;
  lastSyncedAt: Date | null;
}
```

### 2. Services

#### `auth.service.ts`
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  User
} from '../features/auth/models/auth.models';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    // Load user from token on service initialization
    this.loadUserFromToken();
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.accessToken && response.user) {
            this.tokenService.setTokens({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              expiresAt: response.expiresAt
            });
            this.setCurrentUser(response.user);
          }
        })
      );
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.tokenService.clearTokens();
    this.setCurrentUser(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Request password reset
   */
  requestPasswordReset(email: string): Observable<PasswordResetResponse> {
    return this.http.post<PasswordResetResponse>(
      `${this.apiUrl}/reset-password/request`,
      { email }
    );
  }

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(
      `${this.apiUrl}/reset-password`,
      { token, newPassword }
    );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.tokenService.hasValidToken() && this.currentUserSubject.value !== null;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Set current user
   */
  private setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  /**
   * Load user from stored token (if available)
   */
  private loadUserFromToken(): void {
    // If you store user info in token or need to fetch it
    // Implement logic to decode token or fetch user info
    // For now, user will be set on login
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    // Implement token refresh logic
    // This may require a separate endpoint or Supabase SDK usage
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, { refreshToken });
  }
}
```

#### `token.service.ts`
```typescript
import { Injectable } from '@angular/core';

export interface TokenData {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly EXPIRES_AT_KEY = 'expires_at';

  /**
   * Store tokens securely
   * Consider using secure storage or httpOnly cookies in production
   */
  setTokens(tokens: TokenData): void {
    if (tokens.accessToken) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    }
    if (tokens.refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
    if (tokens.expiresAt) {
      localStorage.setItem(this.EXPIRES_AT_KEY, tokens.expiresAt.toString());
    }
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get token expiration timestamp
   */
  getExpiresAt(): number | null {
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);
    return expiresAt ? parseInt(expiresAt, 10) : null;
  }

  /**
   * Check if token is valid (not expired)
   */
  hasValidToken(): boolean {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) {
      return false;
    }
    // Check if token expires in more than 5 minutes (buffer time)
    const bufferTime = 5 * 60; // 5 minutes in seconds
    return expiresAt > (Date.now() / 1000) + bufferTime;
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.EXPIRES_AT_KEY);
  }
}
```

#### `http-interceptor.service.ts`
```typescript
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Add access token to request headers
    const accessToken = this.tokenService.getAccessToken();
    if (accessToken) {
      request = this.addTokenHeader(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized - token expired
        if (error.status === 401 && !request.url.includes('/login')) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.tokenService.getRefreshToken();
      if (refreshToken) {
        return this.authService.refreshToken().pipe(
          switchMap((response: any) => {
            this.isRefreshing = false;
            if (response.accessToken) {
              this.tokenService.setTokens({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                expiresAt: response.expiresAt
              });
              this.refreshTokenSubject.next(response.accessToken);
              return next.handle(this.addTokenHeader(request, response.accessToken));
            }
            return throwError(() => new Error('Token refresh failed'));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.authService.logout();
            return throwError(() => err);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }
}
```

### 3. Guards

#### `auth.guard.ts`
```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Redirect to login with return URL
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}
```

#### `guest.guard.ts`
```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      return true;
    }

    // Redirect authenticated users away from login/register pages
    this.router.navigate(['/']);
    return false;
  }
}
```

### 4. Validators

#### `password.validator.ts`
```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values (use 'required' for that)
    }

    const value = control.value as string;
    const errors: ValidationErrors = {};

    if (value.length < 8) {
      errors['minLength'] = { requiredLength: 8, actualLength: value.length };
    }

    if (!/[A-Z]/.test(value)) {
      errors['uppercase'] = true;
    }

    if (!/[a-z]/.test(value)) {
      errors['lowercase'] = true;
    }

    if (!/[0-9]/.test(value)) {
      errors['number'] = true;
    }

    return Object.keys(errors).length > 0 ? { passwordStrength: errors } : null;
  };
}
```

### 5. Components

#### `login.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
```

#### `login.component.html`
```html
<div class="login-container">
  <div class="login-card">
    <h2>Login</h2>
    
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <!-- Email Field -->
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          formControlName="email"
          [class.error]="email?.invalid && email?.touched"
          placeholder="Enter your email"
        />
        <div class="error-message" *ngIf="email?.invalid && email?.touched">
          <span *ngIf="email?.errors?.['required']">Email is required</span>
          <span *ngIf="email?.errors?.['email']">Please enter a valid email</span>
        </div>
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          formControlName="password"
          [class.error]="password?.invalid && password?.touched"
          placeholder="Enter your password"
        />
        <div class="error-message" *ngIf="password?.invalid && password?.touched">
          <span *ngIf="password?.errors?.['required']">Password is required</span>
        </div>
      </div>

      <!-- Error Message -->
      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        [disabled]="loginForm.invalid || isLoading"
        class="submit-button"
      >
        <span *ngIf="!isLoading">Login</span>
        <span *ngIf="isLoading">Logging in...</span>
      </button>
    </form>

    <!-- Forgot Password Link -->
    <div class="forgot-password">
      <a routerLink="/auth/forgot-password">Forgot your password?</a>
    </div>
  </div>
</div>
```

#### `password-reset-request.component.ts`
```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-password-reset-request',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.scss']
})
export class PasswordResetRequestComponent {
  resetForm: FormGroup;
  isLoading = false;
  isSubmitted = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.markFormGroupTouched(this.resetForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const email = this.resetForm.value.email;

    this.authService.requestPasswordReset(email).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSubmitted = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to send reset email. Please try again.';
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get email() {
    return this.resetForm.get('email');
  }
}
```

#### `password-reset-request.component.html`
```html
<div class="reset-request-container">
  <div class="reset-card">
    <h2>Reset Password</h2>
    
    <div *ngIf="!isSubmitted">
      <p>Enter your email address and we'll send you a link to reset your password.</p>
      
      <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            [class.error]="email?.invalid && email?.touched"
            placeholder="Enter your email"
          />
          <div class="error-message" *ngIf="email?.invalid && email?.touched">
            <span *ngIf="email?.errors?.['required']">Email is required</span>
            <span *ngIf="email?.errors?.['email']">Please enter a valid email</span>
          </div>
        </div>

        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          [disabled]="resetForm.invalid || isLoading"
          class="submit-button"
        >
          <span *ngIf="!isLoading">Send Reset Link</span>
          <span *ngIf="isLoading">Sending...</span>
        </button>
      </form>
    </div>

    <div *ngIf="isSubmitted" class="success-message">
      <p>If an account with that email exists, we've sent a password reset link.</p>
      <p>Please check your email and follow the instructions.</p>
    </div>
  </div>
</div>
```

#### `password-reset.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { passwordStrengthValidator } from '../../../shared/validators/password.validator';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, passwordStrengthValidator()]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Get token from query parameters
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.errorMessage = 'Invalid reset link. Please request a new password reset.';
    }
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token) {
      this.markFormGroupTouched(this.resetForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const newPassword = this.resetForm.value.newPassword;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.router.navigate(['/auth/login'], {
          queryParams: { passwordReset: 'success' }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to reset password. The link may have expired.';
      }
    });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get newPassword() {
    return this.resetForm.get('newPassword');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }

  getPasswordStrengthErrors(): string[] {
    const errors: string[] = [];
    const passwordErrors = this.newPassword?.errors?.['passwordStrength'];
    
    if (passwordErrors) {
      if (passwordErrors['minLength']) {
        errors.push(`Password must be at least ${passwordErrors['minLength'].requiredLength} characters`);
      }
      if (passwordErrors['uppercase']) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (passwordErrors['lowercase']) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (passwordErrors['number']) {
        errors.push('Password must contain at least one number');
      }
    }
    
    return errors;
  }
}
```

#### `password-reset.component.html`
```html
<div class="reset-container">
  <div class="reset-card">
    <h2>Set New Password</h2>
    
    <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
      <!-- New Password Field -->
      <div class="form-group">
        <label for="newPassword">New Password</label>
        <input
          type="password"
          id="newPassword"
          formControlName="newPassword"
          [class.error]="newPassword?.invalid && newPassword?.touched"
          placeholder="Enter new password"
        />
        <div class="error-message" *ngIf="newPassword?.invalid && newPassword?.touched">
          <span *ngIf="newPassword?.errors?.['required']">Password is required</span>
          <div *ngIf="newPassword?.errors?.['passwordStrength']" class="password-errors">
            <div *ngFor="let error of getPasswordStrengthErrors()">
              {{ error }}
            </div>
          </div>
        </div>
      </div>

      <!-- Confirm Password Field -->
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          formControlName="confirmPassword"
          [class.error]="confirmPassword?.invalid && confirmPassword?.touched"
          placeholder="Confirm new password"
        />
        <div class="error-message" *ngIf="confirmPassword?.invalid && confirmPassword?.touched">
          <span *ngIf="confirmPassword?.errors?.['required']">Please confirm your password</span>
        </div>
        <div class="error-message" *ngIf="resetForm.errors?.['passwordMismatch'] && confirmPassword?.touched">
          Passwords do not match
        </div>
      </div>

      <!-- Error Message -->
      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        [disabled]="resetForm.invalid || isLoading || !token"
        class="submit-button"
      >
        <span *ngIf="!isLoading">Reset Password</span>
        <span *ngIf="isLoading">Resetting...</span>
      </button>
    </form>
  </div>
</div>
```

### 6. Routes

#### `auth.routes.ts`
```typescript
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PasswordResetRequestComponent } from './components/password-reset-request/password-reset-request.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { GuestGuard } from '../../core/guards/guest.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'forgot-password',
    component: PasswordResetRequestComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'reset-password',
    component: PasswordResetComponent,
    canActivate: [GuestGuard]
  }
];
```

### 7. Module Configuration

#### `app.config.ts` (Angular v20+ standalone approach)
```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { AuthInterceptor } from './core/services/http-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};
```

---

## Error Handling

### Error Response Format

The backend returns errors in the following format:
```typescript
{
  message: string;
  statusCode: number;
  error?: any;
}
```

### Common Error Scenarios

1. **401 Unauthorized (Login)**
   - Invalid email or password
   - User account is inactive
   - Handle: Show error message, allow retry

2. **400 Bad Request (Validation)**
   - Invalid email format
   - Missing required fields
   - Password doesn't meet requirements
   - Handle: Show field-specific validation errors

3. **400 Bad Request (Password Reset)**
   - Invalid or expired token
   - Token already used
   - Handle: Show error, provide link to request new reset

4. **500 Internal Server Error**
   - Server-side error
   - Handle: Show generic error message, log error, allow retry

### Error Handling Service (Optional)

```typescript
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  getErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.message) {
      return error.error.message;
    }
    
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication failed. Please check your credentials.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'A server error occurred. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}
```

---

## Security Considerations

### 1. Token Storage
- **Current Implementation**: Uses `localStorage` (convenient but less secure)
- **Production Recommendation**: 
  - Use httpOnly cookies for tokens (most secure)
  - Or use secure, encrypted storage
  - Consider using Angular's `TransferState` for SSR scenarios

### 2. Token Transmission
- Always send tokens in `Authorization: Bearer <token>` header
- Use HTTPS in production
- Implement token refresh mechanism

### 3. Password Handling
- Never store passwords in plain text
- Never log passwords
- Use strong password validation
- Implement rate limiting on login attempts (backend)

### 4. XSS Protection
- Sanitize user inputs
- Use Angular's built-in sanitization
- Avoid `innerHTML` with user content

### 5. CSRF Protection
- Implement CSRF tokens for state-changing operations
- Use SameSite cookies
- Validate origin headers

### 6. Password Reset Security
- Tokens expire after 1 hour
- Tokens can only be used once
- Tokens are hashed in database
- Don't reveal if email exists in system

### 7. Route Protection
- Use `AuthGuard` to protect authenticated routes
- Use `GuestGuard` to prevent authenticated users from accessing login/register pages
- Implement role-based route protection if needed

---

## Environment Configuration

### `environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### `environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api'
};
```

---

## Testing Considerations

### Unit Tests
- Test form validations
- Test service methods
- Test guards
- Test interceptors

### Integration Tests
- Test complete login flow
- Test password reset flow
- Test error handling
- Test token refresh

### E2E Tests
- Test user login
- Test password reset request
- Test password reset confirmation
- Test logout
- Test protected routes

---

## Additional Notes

1. **Token Refresh**: The current backend doesn't expose a refresh token endpoint. You may need to:
   - Use Supabase SDK directly for token refresh
   - Or implement a backend endpoint for token refresh

2. **User Invitation**: User invitation is handled through the IAM module, not the auth module.

3. **Session Management**: Consider implementing:
   - Automatic token refresh before expiration
   - Session timeout handling
   - Multiple device/tab session management

4. **Accessibility**: Ensure all forms and components meet WCAG guidelines:
   - Proper labels
   - ARIA attributes
   - Keyboard navigation
   - Screen reader support

5. **Internationalization**: Consider adding i18n support for error messages and UI text.

---

## Summary

This implementation guide provides:
- Complete API documentation
- Angular service and component implementations
- Form validation and error handling
- Security best practices
- Token management
- Route protection

Follow this guide to implement a robust authentication system in your Angular v20+ application.

