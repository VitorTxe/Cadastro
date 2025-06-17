import { useRef } from "react";
import "./UseForm.css";

function UserForm({ createUsers }) {
  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  const handleSubmit = (e) => {
    createUsers(e, {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value,
    });

    // Limpa os campos após o cadastro
    inputName.current.value = "";
    inputAge.current.value = "";
    inputEmail.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Cadastro de Usuários</h1>
      <input
        placeholder="Insira seu nome"
        name="Nome"
        type="text"
        ref={inputName}
      />
      <input
        placeholder="Insira sua idade"
        name="Idade"
        type="number"
        ref={inputAge}
      />
      <input
        placeholder="Insira seu e-mail"
        name="Email"
        type="email"
        ref={inputEmail}
      />
      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default UserForm;
