const encode = (data) => {
  return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
}

class FormField {
  private _input;
  constructor(private _element: HTMLElement) {
    this._input = this._element.querySelector('input, textarea') as HTMLInputElement;
    this._input.addEventListener('focus', this.onFocus);
    this._input.addEventListener('blur', this.onBlur);
    // disable browser-side validation thats only needed for non-javascript users
    this._input.removeAttribute('required');
  }

  onBlur = () => {
    this._element.classList.remove('is-focused');
  }

  onFocus = () => {
    this._element.classList.add('is-focused');
    this.clearError();
  }

  validate() {
    const valid = this.empty() === false;

    if(valid === false) {
      this.showError();
    }

    return valid;
  }

  clearError() {
    this._element.classList.remove('has-error');
    this._input.classList.remove('has-error');
  }

  showError() {
    this._element.classList.add('has-error');
    this._input.classList.add('has-error');
  }

  enable() {
    this._input.removeAttribute('disabled');
  }

  disable() {
    this._input.setAttribute('disabled', 'true');
  }

  empty() {
    return this.value.length === 0;
  }

  clear() {
    this._input.value = '';
  }

  get value() {
    return this._input.value;
  }

  get name() {
    return this._input.name;
  }
}

export class ContactForm {
  formfields: FormField[] = [];

  constructor(private _formElement: HTMLFormElement) {
    this.init();
  }

  init() {
    this._formElement.addEventListener('submit', this.onSubmit)
    const elements = Array.from(this._formElement.querySelectorAll('.sy-formfield')) as HTMLElement[];

    this.formfields = elements.map((element) => new FormField(element))
    console.log(this.formfields)
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.submit();
  }

  onSubmitSuccess = response => {
    this._formElement.classList.remove('is-submitting');
    this._formElement.classList.add('is-successful');
    this.formfields.forEach(field => field.clear());
    this.enableInputs();
  }

  onSubmitError = error => {
    this._formElement.classList.remove('is-submitting');
    this.enableInputs();
    alert(error);
  }

  getData() {
    return this.formfields.reduce((acc, current: FormField) => {
      acc[current.name] = current.value
      return acc;
    }, {})
  }

  disableInputs() {
    this.formfields.forEach(field => field.disable());
    this._formElement.querySelector('button')!.setAttribute('disabled', 'true');
  }

  enableInputs() {
    this.formfields.forEach(field => field.enable());
    this._formElement.querySelector('button')!.removeAttribute('disabled');
  }

  validate() {
    let result = true;
    this.formfields.forEach(field => result = field.validate() && result);

    return result;
  }

  submit() {
    if(this.validate()){
      // update UI
      this.disableInputs();
      this._formElement.classList.add('is-submitting');
      this._formElement.classList.remove('is-successful');

      const data = this.getData();

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "sy-contact-form",
          ...data
        })
      })
      .then(this.onSubmitSuccess)
      .catch(this.onSubmitError);
    }
  }
}