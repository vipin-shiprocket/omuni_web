import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { sleep } from 'src/app/utils/utils';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss'],
})
export class OtpInputComponent {
  // private sink = new Subscription();
  otp1 = '';
  otp2 = '';
  otp3 = '';
  otp4 = '';
  otp5 = '';
  otp6 = '';
  // inputForm: FormGroup = this.formBuilder.group({
  //   loginOtp1: ['', [Validators.required]],
  //   loginOtp2: ['', [Validators.required]],
  //   loginOtp3: ['', [Validators.required]],
  //   loginOtp4: ['', [Validators.required]],
  //   loginOtp5: ['', [Validators.required]],
  //   loginOtp6: ['', [Validators.required]],
  // });
  @Output() isvalid = new EventEmitter<boolean>(false);
  @Output() values = new EventEmitter<number>();
  @Input() panelClass = '';

  constructor(private formBuilder: FormBuilder) {}

  // ngOnInit(): void {
  //   // this.initInputs();
  //   this.sink.add(
  //     this.inputForm.valueChanges.subscribe((val) => {
  //       const value = Object.values(val).join('');
  //       this.values.emit(+value);
  //       this.isvalid.emit(this.inputForm.valid);
  //     }),
  //   );
  // }

  // initInputs(): void {
  //   document
  //     .querySelectorAll('.digit-group input')
  //     // .find('input')
  //     .forEach(function (self) {
  //       /**
  //        * Don't allow paste on this ke
  //        */
  //       self.addEventListener('paste', function (e: Event) {
  //         const Event = e as KeyboardEvent;
  //         Event.preventDefault();
  //       });

  //       self.addEventListener('keyup', function (e: Event) {
  //         /**
  //          * add Event listener on Key up because Arrow key event is handled via Key Up
  //          ** Not Via keypress
  //          */
  //         const Event = e as KeyboardEvent;
  //         const Target = Event.target as HTMLInputElement;
  //         const parent = Target.parentElement as HTMLFormElement;
  //         if (Event.which === 37) {
  //           const prev = parent?.querySelectorAll(
  //             'input#' + Target?.dataset['previous'],
  //           );

  //           if (prev && prev.length) {
  //             const prevElement = prev[0] as HTMLInputElement;
  //             setTimeout(() => {
  //               prevElement.focus();
  //               prevElement.select();
  //             }, 0);
  //           }
  //         } else if (Event.which === 39) {
  //           const next = parent?.querySelectorAll(
  //             'input#' + Target?.dataset['next'],
  //           );
  //           if (next && next.length) {
  //             // $(next).select();
  //             const nextElement = next[0] as HTMLInputElement;
  //             setTimeout(() => {
  //               nextElement.focus();
  //               nextElement.select();
  //             }, 0);
  //           }
  //         } else if (Event.which == 9) {
  //           /**
  //            * On Press enter key This code will run
  //            * on this we have to do nothing just Prevent Default
  //            */
  //           Event.preventDefault();
  //         }
  //       });
  //       self.addEventListener('keypress', function (e: Event) {
  //         const Event = e as KeyboardEvent;
  //         const Target = Event.target as HTMLInputElement;
  //         const parent = Target.parentElement as HTMLFormElement;

  //         const eventArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  //         if (Event.which === 8) {
  //           const prev = parent?.querySelectorAll(
  //             'input#' + Target?.dataset['previous'],
  //           );

  //           if (prev && prev.length) {
  //             const prevElement = prev[0] as HTMLInputElement;
  //             setTimeout(() => {
  //               prevElement.focus();
  //               prevElement.select();
  //             }, 0);
  //           }
  //         } else if (eventArray.includes(Event.key) && Event.which !== 9) {
  //           // var next = parent.find('input#' + $(this).data('next'));
  //           const next = parent?.querySelectorAll(
  //             'input#' + Target?.dataset['next'],
  //           );
  //           if (next && next.length) {
  //             // $(next).select();
  //             const nextElement = next[0] as HTMLInputElement;
  //             setTimeout(() => {
  //               nextElement.focus();
  //               nextElement.select();
  //             }, 0);
  //           } else {
  //             if (parent?.dataset['autosubmit'] == 'true') {
  //               parent.submit();
  //             }
  //           }
  //         } else if (Event.which !== 9) {
  //           Event.preventDefault();
  //           Target.value = '';
  //         }
  //       });
  //     });
  // }

  async onInputChange(event: KeyboardEvent) {
    await sleep(0);
    if (event.keyCode !== 8 && isNaN(+event.key)) {
      return;
    }

    // If the user enters more than one digit in a field,
    // clear the remaining fields.
    if (this.otp1.length > 1) {
      this.otp1 = this.otp1.slice(0, 1);
    }
    if (this.otp2.length > 1) {
      this.otp2 = this.otp2.slice(0, 1);
    }
    if (this.otp3.length > 1) {
      this.otp3 = this.otp3.slice(0, 1);
    }
    if (this.otp4.length > 1) {
      this.otp4 = this.otp4.slice(0, 1);
    }
    if (this.otp5.length > 1) {
      this.otp5 = this.otp5.slice(0, 1);
    }
    if (this.otp6.length > 1) {
      this.otp6 = this.otp6.slice(0, 1);
      return;
    }

    if (event.keyCode === 8) {
      // Focus on the previous field if the user presses the delete button.
      if (this.otp1.length === 0) {
        return;
      }

      const previousInputFieldElement = (event.target as HTMLInputElement)
        .previousElementSibling;

      (previousInputFieldElement as HTMLInputElement)?.focus();
    } else {
      const nextInputFieldElement = (event.target as HTMLInputElement)
        .nextElementSibling;

      (nextInputFieldElement as HTMLInputElement)?.focus();
    }

    const value =
      this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6;
    this.values.emit(+value);
    this.isvalid.emit(value.length === 6);
  }

  // ngOnDestroy(): void {
  //   this.sink.unsubscribe();
  // }
}
