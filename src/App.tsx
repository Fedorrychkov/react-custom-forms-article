import React from 'react';
import './App.css';
import { useForm } from './Hooks/useForm';

const formInputs = {
  firstName: {
    isValid: true,
  },
  lastName: '',
}

function App() {
  const { inputs, handleSubmit } = useForm(formInputs);

  const { firstName }: any = inputs;

  const onSubmit = ({ values, isValid, fields }: any) => {
    console.log(values, isValid, fields, 'submit');
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" value={firstName.value} onChange={firstName.setState}/>
      </form>
    </div>
  );
}

export default App;
