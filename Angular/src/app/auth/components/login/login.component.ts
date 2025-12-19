import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  isSpinning: boolean = false;
  loginform!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginform = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  login() {
    console.log(this.loginform.value);
    this.isSpinning = true;

    this.authService.login(this.loginform.value).subscribe(
      (res) => {
        this.isSpinning = false;
        if (res.userId != null) {
          const user = {
            id: res.userId,
            role: res.userRole
          };
          StorageService.saveToken(res.jwt);
          StorageService.saveUser(user);
          console.log(res.userRole);
          if (res.userRole == "ADMIN") {
            this.router.navigateByUrl("/admin/dashboard");
          } else {
            this.router.navigateByUrl("/customer/dashboard");
          }
        } else {
          this.showMessage("Bad credentials", "error");
        }
      },
      (error) => {
        this.isSpinning = false;
        this.showMessage("Login failed. Please try again.", "error");
      }
    );
  }

  showMessage(message: string, type: 'success' | 'error') {
    alert(message);
  }
}
