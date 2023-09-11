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

/**
 * Directive for inputs requiring delayed notification.
 * * Trims the input for checking if the new value is distinct or changed.
 * @input `debounceTime` - Interval after which the event must be emitted.
 * Defaults to 0 (i.e. instant notification)
 * @input `minimumCharacters` - Minimum characters required to start emitting events.
 * Defaults to 1 character.
 * @output `appDebounceInput` - The event that is emitted on passing all conditions for debounced input.
 * Contains the value of the input field.
 * @output `resetEvent` - An optional event to listen to that is emitted on all valid keystrokes
 * (except for whitespaces as they are not considered as distinct changes in the input)
 */
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
