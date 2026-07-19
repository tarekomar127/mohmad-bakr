import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-input',
  imports: [],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
})
export class FormInput {
  readonly label = input<string>('');
  readonly required = input(false);
  readonly error = input<string | null>(null);
  readonly hint = input<string>('');
}
