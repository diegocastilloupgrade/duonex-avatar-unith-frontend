import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnithService, UnithSessionResponse } from '../services/unith.service';
import { SafeUrlPipe } from '../safe-url.pipe';

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

  activeTab: 'quiz' | 'kb' = 'quiz';

  // Asistentes de cuestionario
  assistantsQuiz = [
    { key: 'assistant1', label: 'Asistente cuestionario 1' },
    { key: 'assistant2', label: 'Asistente cuestionario 2' },
  ];
  selectedAssistantQuiz = 'assistant1';

  // Asistente de KB (solo uno, p.ej. assistant3)
  kbAssistantKey = 'assistant3';

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

  // Validez sólo para pestaña cuestionario
  get canStartQuiz(): boolean {
    return this.userForm.valid && this.quizForm.valid && !this.isConnecting && !this.unithSession;
  }

  onStartQuiz(): void {
    if (!this.canStartQuiz) return;
    this.isConnecting = true;

    const userContext = this.userForm.value;
    const quiz = {
      questions: this.questions.value.map((q: any) => ({
        text: q.text,
        interpretation: q.interpretation
      }))
    };

    const assistantKey = this.selectedAssistantQuiz;

    this.unithService.createSession(userContext, quiz, assistantKey).subscribe({
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

  onStartKb(): void {
    if (this.isConnecting || this.unithSession) return;
    this.isConnecting = true;

    // Para KB puedes reutilizar userForm (o no usarlo si no hace falta)
    const userContext = this.userForm.value;
    const quiz = { questions: [] }; // no usamos preguntas en KB

    const assistantKey = this.kbAssistantKey;

    this.unithService.createSession(userContext, quiz, assistantKey).subscribe({
      next: (data) => {
        this.unithSession = data;
        this.debugRaw = data;
        this.isConnecting = false;
      },
      error: (err) => {
        console.error('Error creating Unith KB session', err);
        this.isConnecting = false;
      }
    });
  }

  onStop(): void {
    this.unithSession = null;
  }
}
