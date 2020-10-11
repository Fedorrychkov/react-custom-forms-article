import { ChangeEvent, FormEvent, useCallback, useState } from 'react';

type IValidatorFN = (s: string) => {};

export interface IField {
  value: any;
  error: string;
  isValid: boolean;
  required: boolean;
  touched: boolean;
  setState: (event: ChangeEvent<HTMLInputElement>) => {};
  validators: IValidatorFN[];
}

export type ICustomField<T = {}> = IField & T;

export const useForm = (fields = {}) => {
  const form = Object.entries(fields).reduce((inputs, [name, value]: any[]) => {
    const isString = typeof value === 'string';

    const field = {
      [name]: {
        value: (isString && value) || ((!isString && value.value) || ''),
        error: (!isString && value.error) || null,
        validators: (!isString && value.validators) || null,
        isValid: (!isString && value.isValid) || true,
        required: (!isString && value.required) || false,
        touched: false,
        setState: (value: ChangeEvent<HTMLInputElement>) => handleInput(value, name),
        ...(!isString && value),
      },
    };

    return {...inputs, ...field};
  }, {});

  const [inputs, setState]: any = useState(form);
  const [isValid, setFormValid]: any = useState(true);

  const getFormValidationState = useCallback(
    (inputs) => Object.entries(inputs).reduce((isValid: any, [_, value]: any) => Boolean(isValid * value.isValid), true),
    [],
  );

  const fieldValidation = (field: IField, options: any = {}) => {
    const { value, required, validators } = field;

    let isValid = true, error;

    if (required) {
      isValid = !!value;
      error = isValid ? '' : 'field is required';
    }

    if (validators && Array.isArray(validators)) {
      const results = validators.map(validateFn => {
        if (typeof validateFn === 'string') return validateFn;
    
        const validationResult = validateFn(value);
    
        return typeof validationResult === 'string' ? validationResult : '';
      }).filter(message => message !== '');
      
      if (results.length) {
        isValid = false;
        error = results[0];
      }
    }

    return { ...field, isValid, error, ...options };
  };

  const handleInput = useCallback(
    (element: ChangeEvent<HTMLInputElement>, name: string) => {
      const input = inputs[name];
      const value = element.target.value;

      const field = {
        ...input,
        value,
        touched: true,
        isValid: true,
      };

      const validatedField = fieldValidation(field);

      setState((prevState: any) => {
        const items = {...prevState, ...{[name]: validatedField}};

        setFormValid(getFormValidationState(items));
        return items;
      });
    }, [inputs, setState, setFormValid, getFormValidationState]);

  const handleSubmit = (onSubmit: Function) => (e: FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const fieldsArray = Object.entries(inputs);
    const values = fieldsArray.reduce(((fields: any, [name, {value}]: any) => ({ ...fields, [name]: value })), {});
    const validatedInputs = fieldsArray.reduce((fields: any, [name, value]: any) => ({ ...fields, [name]: fieldValidation(value, { touched: true }) }), {});

    setFormValid(getFormValidationState(validatedInputs));
    setState(validatedInputs);

    onSubmit({ values });
  }

  return {
    handleSubmit,
    inputs,
    isValid,
  }
}
