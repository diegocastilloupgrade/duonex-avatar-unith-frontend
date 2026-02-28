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
