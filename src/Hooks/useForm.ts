import { FormEvent, useState } from 'react';

export const useForm = (fields: any = {}) => {
  const form = Object.entries(fields).reduce((acc, item: any) => {
    const [name, value] = item;

    const valueIsString = typeof value === 'string';

    const field = {
      [name]: {
        value: (valueIsString && value) || ((!valueIsString && value.value) || ''),
        error: (!valueIsString && value.error) || null,
        validators: (!valueIsString && value.validators) || null,
        isValid: (!valueIsString && value.isValid) || true,
        setState: (value: any) => handleInput(value, name),
        ...(!valueIsString && value),
      }
    }

    return {...acc, ...field};
  }, {});

  const [inputs, setState]: any = useState(form);

  const handleInput = (value: any, name: string) => {
    const isString = typeof value === 'string';
    const field = { ...inputs[name], ...({ value: isString ? value : value.target.value }) };

    setState({...inputs, ...{[name]: field}});
  };

  const handleSubmit = (onSubmit: Function) => (e: FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const values = Object.entries(inputs).reduce(((fields: any, [name, {value}]: any) => ({ ...fields, [name]: value })), {});
    const isValid: boolean = Object.entries(inputs).reduce((isValid: any, [_, value]: any) => Boolean(isValid * value.isValid), true);

    onSubmit({ values, isValid, fields: inputs });
  }

  return {
    handleSubmit,
    inputs
  }
}
