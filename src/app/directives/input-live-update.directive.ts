import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputLiveUpdateDirective]'
})
export class InputLiveUpdateDirective {
  @Output() inputLiveUpdate = new EventEmitter<string>();

  constructor(private elementRef: ElementRef) { }

  @HostListener('input')
  onInput() {
    const inputElement = this.elementRef.nativeElement as HTMLInputElement;
    const value = inputElement.value;
    this.inputLiveUpdate.emit(value);
  }
}
