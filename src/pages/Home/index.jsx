import "./style.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { FaTrash, FaEdit } from "react-icons/fa";

function Home() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    email: "",
  });
  const [editUser, setEditUser] = useState(null);

  //get
  async function getUsuarios() {
    try {
      const { data } = await api.get("/cadastro");
      setUsuarios(data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  }

  //delete
  async function deleteUsuario(id) {
    if (!window.confirm("Deseja realmente deletar este usuário?")) return;

    try {
      await api.delete(`/cadastro/${id}`);
      getUsuarios();
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
    }
  }

  //modal
  function openEditModal(usuario) {
    setEditUser({
      ...usuario,
      idade: usuario.idade.toString(), // pro input funcionar
    });
  }

  function closeEditModal() {
    setEditUser(null);
  }

  function isEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  //post
  async function createUsuario() {
    if (!formData.nome || !formData.idade || !formData.email) {
      alert("Preencha todos os campos!");
      return;
    }

    if (!isEmailValid(formData.email)) {
      alert("Email inválido!");
      return;
    }

    if (Number(formData.idade) < 0 || !Number.isInteger(Number(formData.idade))) {
      alert("Idade inválida! Use apenas números inteiros positivos");
      return;
    }

    try {
      await api.post("/cadastro", {
        ...formData,
        idade: Number(formData.idade),
      });
      setFormData({ nome: "", idade: "", email: "" });
      getUsuarios();
    } catch (err) {
      console.error("Erro ao cadastrar usuário:", err);
    }
  }

  //put
  async function handleUpdate() {
    if (!editUser.nome || !editUser.idade || !editUser.email) {
      alert("Preencha todos os campos!");
      return;
    }

    if (!isEmailValid(editUser.email)) {
      alert("Email inválido!");
      return;
    }

    if (Number(editUser.idade) < 0 || !Number.isInteger(Number(editUser.idade))) {
      alert("Idade inválida! Use apenas números inteiros positivos");
      return;
    }

    try {
      await api.put(`/cadastro/${editUser.id}`, {
        nome: editUser.nome,
        email: editUser.email,
        idade: Number(editUser.idade),
      });
      setEditUser(null);
      getUsuarios();
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
    }
  }

  useEffect(() => {
    getUsuarios();
  }, []);

  return (
    <div className="container">
      <form onSubmit={(e) => e.preventDefault()}>
        <h1>Cadastro de Usuários</h1>

        <input
          placeholder="Digite seu nome:"
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        />
        <input
          placeholder="Digite sua idade:"
          type="number"
          value={formData.idade}
          onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
          min="0"
          step="1"
        />
        <input
          placeholder="Digite seu email:"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <button type="button" onClick={createUsuario}>
          Cadastrar
        </button>
      </form>

      <div className="usuarios-list">
        {usuarios.length === 0 && <p>Nenhum usuário cadastrado</p>}

        {usuarios.map((usuario) => (
          <div key={usuario.id} className="card">
            <div className="info">
              <p>Nome: {usuario.nome}</p>
              <p>Idade: {usuario.idade}</p>
              <p>Email: {usuario.email}</p>
            </div>

            <div className="actions">
              <button 
                className="btn-deletar"
                onClick={() => deleteUsuario(usuario.id)}
              >
                <FaTrash />
              </button>
              <button
                className="btn-atualizar"
                onClick={() => openEditModal(usuario)}
              >
                <FaEdit />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* modal */}
      {editUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Usuário</h2>
            <input
              type="text"
              value={editUser.nome}
              onChange={(e) =>
                setEditUser({ ...editUser, nome: e.target.value })
              }
            />
            <input
              type="number"
              value={editUser.idade}
              onChange={(e) =>
                setEditUser({ ...editUser, idade: e.target.value })
              }
              min="0"
              step="1"
            />
            <input
              type="email"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />
            <div className="modal-buttons">
              <button onClick={handleUpdate}>Salvar</button>
              <button onClick={closeEditModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
