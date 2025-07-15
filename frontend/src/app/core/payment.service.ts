import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpClient) {}

  createOrder(amount: number) {
    return this.http.post(`${environment.apiUrl}/payment/create-order`, {
      amount,
      receipt: `receipt_${Date.now()}`
    });
  }
}
