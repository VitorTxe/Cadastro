import "./UseCard.css";
import Lixo from "../assets/lixo.png";

function UseCard({ user, deleteUsers }) {
  return (
    <div className="card">
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
  );
}

export default UseCard;
