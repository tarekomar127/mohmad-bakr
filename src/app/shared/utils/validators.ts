import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const EGYPT_PHONE_PATTERN = /^01[0125][0-9]{8}$/;

export function egyptianPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    return EGYPT_PHONE_PATTERN.test(control.value) ? null : { invalidPhone: true };
  };
}

export function passwordsMatchValidator(
  passwordKey: string,
  confirmKey: string,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirm = group.get(confirmKey)?.value;
    if (!password || !confirm) {
      return null;
    }
    return password === confirm ? null : { passwordsMismatch: true };
  };
}
