import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule,NgIf],
  templateUrl: './scanner.component.html',
})
export class ScannerComponent {
  scannedResult: string = '';

  onCodeResult(result: string) {
    this.scannedResult = result;
    console.log('Scanned code:', result);
  }
}
