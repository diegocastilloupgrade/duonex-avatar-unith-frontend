------
Índice
---
app\app.component.html
app\app.component.scss
app\app.component.spec.ts
app\app.component.ts
app\app.config.ts
app\app.module.ts
app\app.routes.ts
app\avatar-page\avatar-page.component.html
app\avatar-page\avatar-page.component.scss
app\avatar-page\avatar-page.component.spec.ts
app\avatar-page\avatar-page.component.ts
app\models\quiz.ts
app\models\user-context.ts
app\safe-url.pipe.ts
app\services\unith.service.ts
index.html
main.ts
styles.scss
------

----
app\app.component.html
--
<app-avatar-page></app-avatar-page>


----
app\app.component.scss
--


----
app\app.component.spec.ts
--
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, frontend');
  });
});


----
app\app.component.ts
--
import { Component } from '@angular/core';
import { AvatarPageComponent } from './avatar-page/avatar-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AvatarPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}


----
app\app.config.ts
--
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient()
  ]
};


----
app\app.module.ts
--
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AvatarPageComponent } from './avatar-page/avatar-page.component';

@NgModule({
  declarations: [
    AppComponent,
    AvatarPageComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}


----
app\app.routes.ts
--
import { Routes } from '@angular/router';

export const routes: Routes = [];


----
app\avatar-page\avatar-page.component.html
--
<div class="container">
  <h1>Cuestionario con Avatar</h1>

  <div class="forms">
    <form [formGroup]="userForm" class="card">
      <h2>Datos de usuario</h2>

      <label>
        Nombre
        <input formControlName="nombre" type="text" />
      </label>

      <label>
        Edad
        <input formControlName="edad" type="number" />
      </label>

      <label>
        Sexo
        <select formControlName="sexo">
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">Otro</option>
        </select>
      </label>
    </form>

    <form [formGroup]="quizForm" class="card">
      <h2>Cuestionario</h2>

      <div formArrayName="questions">
        <div *ngFor="let qGroup of questions.controls; let i = index" [formGroupName]="i">
          <label>
            Pregunta {{ i + 1 }}
            <input formControlName="text" type="text" />
          </label>

          <label>
            Interpretación de esta pregunta
            <input formControlName="interpretation" type="text" />
          </label>

          <button type="button" (click)="removeQuestion(i)" *ngIf="questions.length > 1">
            Eliminar
          </button>
        </div>
      </div>

      <button type="button" (click)="addQuestion()">Añadir pregunta</button>

    </form>
  </div>

  <div class="avatar-section card">
    <h2>Avatar</h2>

    <button
      [disabled]="!canStart || !!unithSession"
      (click)="onStart()">
      {{ isConnecting ? 'Conectando...' : 'Comenzar' }}
    </button>

    <button
      type="button"
      [disabled]="!unithSession"
      (click)="onStop()">
      Desconectar
    </button>

    <!-- En lugar del video LiveKit, usamos un iframe con el publicUrl de Unith -->
    <div class="video-wrapper" *ngIf="unithSession">
      <iframe
        [src]="unithSession.publicUrl | safeUrl"
        width="100%"
        height="480"
        frameborder="0"
        allow="camera; microphone; autoplay; fullscreen">
      </iframe>
    </div>
  </div>

  <div class="card" *ngIf="debugRaw">
    <h2>Debug sesión</h2>
    <pre>{{ debugRaw | json }}</pre>
  </div>

  <div class="card" *ngIf="resultadoSimulado">
    <h2>Resultados del cuestionario (simulado)</h2>
    <pre>{{ resultadoSimulado }}</pre>
  </div>
</div>

----
app\avatar-page\avatar-page.component.scss
--
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.forms {
  display: flex;
  gap: 1rem;
}

.card {
  border: 1px solid #ddd;
  padding: 1rem;
  flex: 1;
}

.avatar-section {
  margin-top: 1rem;
}

.video-wrapper {
  margin-top: 1rem;
}

video {
  width: 100%;
  max-width: 640px;
  background: #000;
}


----
app\avatar-page\avatar-page.component.spec.ts
--
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarPageComponent } from './avatar-page.component';

describe('AvatarPageComponent', () => {
  let component: AvatarPageComponent;
  let fixture: ComponentFixture<AvatarPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


----
app\avatar-page\avatar-page.component.ts
--
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnithService, UnithSessionResponse } from '../services/unith.service';
import { SafeUrlPipe } from '../safe-url.pipe';
import { Room } from 'livekit-client';

@Component({
  selector: 'app-avatar-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SafeUrlPipe],
  templateUrl: './avatar-page.component.html',
  styleUrls: ['./avatar-page.component.scss']
})
export class AvatarPageComponent {

  userForm: FormGroup;
  quizForm: FormGroup;

  unithSession: UnithSessionResponse | null = null;
  isConnecting = false;
  
  debugRaw: any = null;
  resultadoSimulado: string | null = null;

  constructor(
    private fb: FormBuilder,
    private unithService: UnithService
  ) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      edad: [null, [Validators.required, Validators.min(0)]],
      sexo: ['M', Validators.required]
    });

    this.quizForm = this.fb.group({
      questions: this.fb.array([
        this.fb.group({
          text: ['', Validators.required],
          interpretation: ['', Validators.required]
        })
      ])
    });
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  addQuestion(): void {
    this.questions.push(
      this.fb.group({
        text: ['', Validators.required],
        interpretation: ['', Validators.required]
      })
    );
  }

  removeQuestion(index: number): void {
    if (this.questions.length > 1) {
      this.questions.removeAt(index);
    }
  }

  get canStart(): boolean {
    return this.userForm.valid && this.quizForm.valid && !this.isConnecting && !this.unithSession;
  }

  onStart(): void {
    if (!this.canStart) return;
    this.isConnecting = true;

    const userContext = this.userForm.value;
    const quiz = {
      questions: this.questions.value.map((q: any) => ({
        text: q.text,
        interpretation: q.interpretation
      }))
    };

    this.unithService.createSession(userContext, quiz).subscribe({
      next: (data) => {
        this.unithSession = data;
        this.debugRaw = data;
        this.isConnecting = false;
      },
      error: (err) => {
        console.error('Error creating Unith session', err);
        this.isConnecting = false;
      }
    });
  }

  onStop(): void {
    this.unithSession = null;
  }
}


----
app\models\quiz.ts
--
export interface QuizQuestion {
  text: string;
  interpretation: string;
}

export interface Quiz {
  questions: QuizQuestion[];

}


----
app\models\user-context.ts
--
export interface UserContext {
  nombre: string;
  edad: number;
  sexo: 'M' | 'F' | 'O';
}


----
app\safe-url.pipe.ts
--
// app/pipes/safe-url.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string | null): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url || '');
  }
}


----
app\services\unith.service.ts
--
// app/services/unith.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserContext } from '../models/user-context';
import { Quiz } from '../models/quiz';

export interface UnithSessionResponse {
  headId: string;
  orgId: string;
  publicUrl: string;
  apiKey: string | null;
}

@Injectable({ providedIn: 'root' })
export class UnithService {

  private apiBase = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  createSession(userContext: UserContext, quiz: Quiz): Observable<UnithSessionResponse> {
    return this.http.post<UnithSessionResponse>(`${this.apiBase}/unith/session`, {
      userContext,
      quiz
    });
  }
}


----
index.html
--
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Frontend</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>


----
main.ts
--
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


----
styles.scss
--
/* You can add global styles to this file, and also import other style files */


