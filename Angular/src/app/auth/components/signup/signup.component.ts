import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  isSpinning: boolean = false;
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/)]],
      confirmPassword: [null, [Validators.required, this.confirmationValidate.bind(this)]],
    });
  }

  confirmationValidate(control: FormControl): { [s: string]: boolean } | null {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.signupForm.controls['password'].value) {
      return { confirm: true };
    }
    return null;
  }

  signup() {
    console.log(this.signupForm.value);
    this.isSpinning = true;
    this.authService.register(this.signupForm.value).subscribe((res) => {
      console.log(res);
      this.isSpinning = false;
    });
  }
}
