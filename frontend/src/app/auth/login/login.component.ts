import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form: FormGroup;
  isDarkMode = false;
  successMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: [''],
      password: ['']
    });
  }
toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }
  onSubmit() {
    if (this.form.valid) {
      this.successMessage = 'Login successful!';
    this.auth.login(this.form.value).subscribe((res: any) => {
      this.auth.storeToken(res.token);
      this.router.navigate(['/dashboard']); 
    });}else {
      this.successMessage = '';
    }
  }
}
