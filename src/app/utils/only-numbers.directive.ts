import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]',
  standalone: true,
})
export class OnlyNumbersDirective {
  @Input() noLeadingZeros = false;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    let initalValue = this.el.nativeElement.value;

    if (this.noLeadingZeros) initalValue = initalValue.replace(/^0+(?!$)/g, '');

    const decimalPoint = this.el.nativeElement.step
      ? this.el.nativeElement.step.split('.')[1].length
      : 0;

    if (decimalPoint) {
      const val = initalValue.replace(/[^0-9.]*/g, '');
      const index = val.indexOf('.');

      this.el.nativeElement.value =
        val.substring(0, index + 1) +
        val
          .substring(index + 1)
          .split('.')
          .join('')
          .substring(0, decimalPoint);
    } else {
      this.el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    }

    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
