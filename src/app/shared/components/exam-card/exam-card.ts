import { Component, input, output } from '@angular/core';
import { LucideClipboardList, LucideClock, LucideListChecks } from '@lucide/angular';
import { Exam } from '../../../models';

@Component({
  selector: 'app-exam-card',
  imports: [LucideClipboardList, LucideClock, LucideListChecks],
  templateUrl: './exam-card.html',
  styleUrl: './exam-card.scss',
})
export class ExamCard {
  readonly exam = input.required<Exam>();
  readonly start = output<void>();
}
