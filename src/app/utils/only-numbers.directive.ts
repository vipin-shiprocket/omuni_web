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

    this.el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');

    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
