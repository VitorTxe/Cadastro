import { useEffect, useState, useRef } from "react"; // Removido 'use' que não é um hook válido
import { BeatLoader } from "react-spinners";
import FeedbackMessage from "../../components/FeedbackMessage";
import UserForm from "../../components/UseForm";
import UseCard from "../../components/UseCard";

// import "./Home.css";
import api from "../../services/api";

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const clearFeedback = () => {
    setTimeout(() => {
      setFeedbackMessage(null);
      setIsSuccess(false);
    }, 3000);
  };

  async function getUsers() {
    setIsLoading(true);
    try {
      const usersFromApi = await api.get("/usuarios");
      setUsers(usersFromApi.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  async function createUsers(e, userData) {
    e.preventDefault();
    if (!userData.name || !userData.age || !userData.email) {
      setFeedbackMessage("Por favor, preencha todos os campos!");
      setIsSuccess(false);
      clearFeedback();
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/usuarios", userData);
      setFeedbackMessage("Usuário cadastrado com sucesso!");
      setIsSuccess(true);
      clearFeedback();
      await getUsers(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao cadastrar usuário. Tente novamente.";
      setFeedbackMessage(errorMessage);
      setIsSuccess(false);
      clearFeedback();
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteUsers(id) {
    setIsLoading(true);
    try {
      await api.delete(`/usuarios/${id}`);
      setFeedbackMessage("Usuário deletado com sucesso!");
      setIsSuccess(true);
      clearFeedback();
      await getUsers(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container">
      <FeedbackMessage message={feedbackMessage} isSuccess={isSuccess} />
      <UserForm createUsers={createUsers} />

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
          <UseCard key={user.id} user={user} deleteUsers={deleteUsers} />
        ))
      ) : (
        <p>Nenhum usuário cadastrado ainda.</p>
      )}
    </div>
  );
}

export default Home;
