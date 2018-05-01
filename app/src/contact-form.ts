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

  empty() {
    return this.value.length === 0;
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

  getData() {
    return this.formfields.reduce((acc, current: FormField) => {
      acc[current.name] = current.value
      return acc;
    }, {})
  }


  validate() {
    let result = true;
    this.formfields.forEach(field => result = field.validate() && result);

    return result;
  }

  submit() {
    if(this.validate()){
      const data = this.getData();

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "sy-contact-form",
          ...data
        })
      })
      .then(() => alert("Success!"))
      .catch(error => alert(error));

    } else {
      // console.log('has errpr')
    }


  }
}