import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: [''],
      email: [''],
      password: ['']
    });
  }

  onSubmit() {
    this.auth.register(this.form.value).subscribe((res: any) => {
      this.auth.storeToken(res.token);
      this.router.navigate(['/dashboard']); // We'll create this later
    });
  }
}
