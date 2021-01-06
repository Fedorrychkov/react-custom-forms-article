import React from 'react';
import { useForm, IValues } from './hooks/useForm';

const formInputs = {
  firstName: {
    required: true,
    validators: [
      (s: string) => !s.length && 'Поле обязательно для заполнения',
      (s: string) => s.length < 2 && 'Минимальная длина строки 2',
      (s: string) => s.length <= 2 && 'А теперь 3',
      (s: string) => parseInt(s) < 2 && 'Должна быть цифра, больше 1',
    ],
    label: 'First Name',
  },
  datetime: {
    type: 'date',
    label: 'Birth Date',
    validators: [
      (s: string) => new Date(s).getUTCFullYear() > new Date().getUTCFullYear() && 'Год рождения не может быть больше текущего',
    ],
  },
  lastName: {
    label: 'Last Name',
  },
}

const App = () => {
  const { fields, isValid, handleSubmit } = useForm(formInputs);
  const { firstName, datetime, lastName } = fields;

  const onSubmit = ({ values }: { values: IValues }) => {
    console.log(values, 'submit');
  }

  const formFields = [firstName, lastName, datetime];

  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        {formFields.map((field, index) => (
          <div key={index}>
            <input
              type={field.type}
              placeholder={field.label}
              value={field.value}
              onChange={field.setState}
            />
            <span>{field.touched && field.error}</span>
          </div>
        ))}
        <div>
          <button disabled={!isValid}>Send form</button>
        </div>
      </form>
    </div>
  );
}

export default App;
