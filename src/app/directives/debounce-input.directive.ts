import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  fromEvent,
  debounce,
  timer,
  map,
  filter,
  distinctUntilChanged,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[appDebounceInput]',
  standalone: true,
})
export class DebounceInputDirective {
  @Input({ required: true })
  debounceTime = 0;
  @Input() minimumCharacters = 1;
  @Output() resetEvent = new EventEmitter();

  constructor(private element: ElementRef<HTMLInputElement>) {}

  @Output()
  readonly appDebounceInput = fromEvent(
    this.element.nativeElement,
    'input',
  ).pipe(
    map((evt) => (evt.target as HTMLInputElement).value),
    distinctUntilChanged((prev, curr) => prev.trim() === curr.trim()),
    map(() => this.resetEvent.emit()),
    debounce(() => timer(this.debounceTime)),
    map(() => this.element.nativeElement.value),
    filter((val: string) => val.length >= this.minimumCharacters),
    takeUntilDestroyed(), //ensure this is at the last
  );
}
