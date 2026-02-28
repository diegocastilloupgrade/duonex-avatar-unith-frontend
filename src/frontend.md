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
app\services\liveavatar.service.ts
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
      [disabled]="!canStart || !!room"
      (click)="onStart()">
      {{ isConnecting ? 'Conectando...' : 'Comenzar' }}
    </button>

    <button
      type="button"
      [disabled]="!room"
      (click)="onStop()">
      Desconectar
    </button>

    <div class="video-wrapper" *ngIf="sessionData">
      <video #videoEl autoplay playsinline></video>
    </div>
  </div>


  <div class="card" *ngIf="debugRaw">
    <h2>Debug sesión (mock)</h2>
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
import { LiveavatarService, LiveAvatarSessionResponse } from '../services/liveavatar.service';
import { Room } from 'livekit-client';

@Component({
  selector: 'app-avatar-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './avatar-page.component.html',
  styleUrls: ['./avatar-page.component.scss']
})
export class AvatarPageComponent implements AfterViewInit {
  @ViewChild('videoEl') videoRef!: ElementRef<HTMLVideoElement>;

  userForm: FormGroup;
  quizForm: FormGroup;

  resultadoSimulado: string | null = null;

  sessionData: LiveAvatarSessionResponse | null = null;
  isConnecting = false;
  room: Room | null = null;

  debugRaw: any = null;

  videoElement?: HTMLVideoElement;

  constructor(
    private fb: FormBuilder,
    private liveavatarService: LiveavatarService
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
    return this.userForm.valid && this.quizForm.valid && !this.isConnecting && !this.room;
  }

  async onStart(): Promise<void> {
    if (!this.canStart) return;
    this.isConnecting = true;

    const userContext = this.userForm.value;
    const quiz = {
      questions: this.questions.value.map((q: any) => ({
        text: q.text,
        interpretation: q.interpretation
      }))
    };

    this.liveavatarService.createSession(userContext, quiz).subscribe({
      next: async (data) => {
        this.sessionData = data;
        await this.connectToRoom();
        this.isConnecting = false;
      },
      error: (err) => {
        console.error('Error creating session', err);
        this.isConnecting = false;
      }
    });
  }

  async connectToRoom(): Promise<void> {
    if (!this.sessionData) return;

    const { livekitUrl, livekitToken } = this.sessionData;

    const room = new Room();
    this.room = room;

    room.on('trackSubscribed', (track: any) => {
      if (track.kind === 'video' && this.videoElement) {
        track.attach(this.videoElement);
      }
    });

    await room.connect(livekitUrl, livekitToken);
    console.log('Conectado a la sala LiveKit');
  }

  async onStop(): Promise<void> {
    // 1) Parar sesión en LiveAvatar (si tenemos sessionId)
    if (this.sessionData?.sessionId) {
      this.liveavatarService.stopSession(this.sessionData.sessionId).subscribe({
        next: () => console.log('Sesión LiveAvatar parada'),
        error: (err) => console.error('Error parando sesión LiveAvatar', err)
      });
    }

    // 2) Desconectar de la room LiveKit
    if (this.room) {
      try {
        await this.room.disconnect();
      } catch (e) {
        console.error('Error desconectando de LiveKit', e);
      }
      this.room = null;
    }

    // 3) Limpiar vídeo
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  onVideoElementInit(video: HTMLVideoElement) {
    this.videoElement = video;
  }

  ngAfterViewInit(): void {
    if (this.videoRef) {
      this.onVideoElementInit(this.videoRef.nativeElement);
    }
  }
}


----
app\models\quiz.ts
--
export interface QuizQuestion {
  text: string;
  interpretacion: string;
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
app\services\liveavatar.service.ts
--
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserContext } from '../models/user-context';
import { Quiz } from '../models/quiz';

export interface LiveAvatarSessionResponse {
  sessionId: string;
  livekitUrl: string;
  livekitToken: string;
}


@Injectable({
  providedIn: 'root'
})
export class LiveavatarService {

  private apiBase = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  createSession(userContext: UserContext, quiz: Quiz): Observable<LiveAvatarSessionResponse> {
    return this.http.post<LiveAvatarSessionResponse>(`${this.apiBase}/liveavatar/session`, {
      userContext,
      quiz
    });
  }

  stopSession(sessionId: string): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(`${this.apiBase}/liveavatar/session/stop`, {
      sessionId
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


