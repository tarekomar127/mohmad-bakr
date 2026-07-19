import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { StudentsService } from '../../../services/students.service';

@Component({
  selector: 'app-student-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class StudentProfile {
  private readonly auth = inject(AuthService);
  private readonly studentsService = inject(StudentsService);

  readonly currentUser = this.auth.currentUser;
  readonly student = toSignal(this.studentsService.getById(this.currentUser()?.id ?? ''), { initialValue: null });
}
