import { useEffect, useState, useRef } from "react"; // Removido 'use' que não é um hook válido
import { BeatLoader } from "react-spinners";

import "./feedback.css";
import "./style.css";

import Lixo from "../../assets/lixo.png";
import api from "../../services/api";

function Home() {
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o loader

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  const [users, setUsers] = useState([]);

  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const clearFeedback = () => {
    setTimeout(() => {
      setFeedbackMessage(null);
      setIsSuccess(false);
    }, 3000);
  };

  // Função para buscar usuários e controlar o loader
  async function getUsers() {
    setIsLoading(true); // <--- Ativa o loader antes da requisição
    try {
      const usersFromApi = await api.get("/usuarios");
      setUsers(usersFromApi.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setIsLoading(false); // <--- Desativa o loader após a requisição (sucesso ou falha)
    }
  }

  useEffect(() => {
    getUsers(); // Carrega os usuários ao montar o componente
  }, []);

  // Função para criar usuários e controlar o loader
  async function createUsers(e) {
    e.preventDefault();

    if (
      !inputAge.current.value ||
      !inputEmail.current.value ||
      !inputName.current.value
    ) {
      setFeedbackMessage("Por favor, preencha todos os campos!");
      setIsSuccess(false);
      clearFeedback();
      return;
    }

    setIsLoading(true); // <--- Ativa o loader antes da requisição de criação
    try {
      await api.post("/usuarios", {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value,
      });

      // Feedback de sucesso
      setFeedbackMessage("Usuário cadastrado com sucesso!");
      setIsSuccess(true);
      clearFeedback();

      inputName.current.value = ""; // Limpa o campo nome
      inputAge.current.value = ""; // Limpa o campo idade
      inputEmail.current.value = ""; // Limpa o campo email

      // Após criar o usuário, recarrega a lista para mostrar o novo usuário
      await getUsers();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao cadastrar usuário. Tente novamente.";
      setFeedbackMessage(errorMessage);
      setIsSuccess(false);
      clearFeedback();
    } finally {
      setIsLoading(false); // <--- Garante que o loader seja desativado após a criação e o refresh
    }
  }

  // Função para deletar usuários e controlar o loader
  async function deleteUsers(id) {
    setIsLoading(true); // <--- Ativa o loader antes da requisição de deleção
    try {
      await api.delete(`/usuarios/${id}`);

      setFeedbackMessage("Usuário deletado com sucesso!");
      setIsSuccess(true);
      clearFeedback();

      await getUsers(); // Recarrega a lista após deletar
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    } finally {
      setIsLoading(false); // <--- Garante que o loader seja desativado
    }
  }

  return (
    <div className="container">
      {/*---- Area de Feedback (mensagem) ----*/}
      {feedbackMessage && (
        <div className={`feedback-message ${isSuccess ? "success" : "error"}`}>
          {feedbackMessage}
        </div>
      )}
      {/*----Fim Area de Feedback----*/}
      <form onSubmit={createUsers}>
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

      {/* Renderização condicional do loader */}
      {isLoading ? (
        <BeatLoader
          size={15}
          margin={15}
          color={"#A744FF"}
          loading={isLoading}
          speedMultiplier={2}
        />
      ) : users.length > 0 ? (
        users.map((user) => (
          <div key={user.id} className="card">
            <div>
              <p>
                Nome: <span>{user.name}</span>
              </p>
              <p>
                Idade: <span>{user.age}</span>
              </p>
              <p>
                Email: <span>{user.email}</span>
              </p>
            </div>
            <button onClick={() => deleteUsers(user.id)}>
              <img src={Lixo} alt="Deletar" />
            </button>
          </div>
        ))
      ) : (
        // Mensagem se não houver usuários após o carregamento
        <p>Nenhum usuário cadastrado ainda.</p>
      )}
    </div>
  );
}

export default Home;
