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
    // async validation?
  }

  onFocus = () => {
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
  submitTimeStamp: number = 0;
  submitMinDuration: number = 2000;
  submitButton: HTMLButtonElement;

  constructor(private _formElement: HTMLFormElement) {
    this.init();
    this.submitButton = _formElement.querySelector('button') as HTMLButtonElement;
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
    // make sure loading animation gets shown for at least submitMinDuration milliseconds
    // retry in next frame if not enough time has passed
    if ((Date.now() - this.submitTimeStamp) < this.submitMinDuration) {
      return window.requestAnimationFrame(this.onSubmitSuccess.bind(this, response));
    }
    this._formElement.classList.remove('is-submitting');
    this._formElement.classList.add('is-successful');
    this.submitButton.innerHTML = '✔ Sent';
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
      this.disableInputs();
      this.resetButtonState()
      .then(() => {
        this._formElement.classList.add('is-submitting');
        this.submitTimeStamp = Date.now();
        this.submitButton.innerHTML = 'Sending ...';

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
      });
    }
  }

  // this needs to get at least one tick of cpu-time to act on the
  // classlist of the button correctly, hence the timeout and promise
  resetButtonState() {
    return new Promise(resolve => {
      this.submitButton.classList.add('reset');
      window.setTimeout(() => {
        this.submitButton.classList.remove('reset');
        resolve();
      }, 1);
    });
  }
}