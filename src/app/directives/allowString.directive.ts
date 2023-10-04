import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAllowString]',
  standalone: true,
})
export class AllowStringDirective {
  constructor(private el: ElementRef) {}
  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initalValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initalValue.replace(/[^a-zA-Z\s]*/g, '');
    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
