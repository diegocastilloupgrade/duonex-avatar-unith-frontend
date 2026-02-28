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
