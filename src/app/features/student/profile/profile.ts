import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { StudentsService } from '../../../services/students.service';
import { ProgressBar } from '../../../shared/components/progress-bar/progress-bar';
import { StageLabelPipe } from '../../../shared/pipes/stage-label.pipe';

@Component({
  selector: 'app-student-profile',
  imports: [ProgressBar, StageLabelPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class StudentProfile {
  private readonly auth = inject(AuthService);
  private readonly studentsService = inject(StudentsService);

  readonly currentUser = this.auth.currentUser;
  readonly student = computed(() => this.studentsService.getById(this.currentUser()?.id ?? ''));
}
