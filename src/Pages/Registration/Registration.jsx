import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../Components/Button/Button";
import Input from "../../Components/Input/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./Registration.css"; // Import the CSS for the box styling


export default function Registration() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    if (email.trim().length < 4 || email.trim().length > 32) {
      setError(true);
      const errorMessage = "L'email doit être compris entre 4 et 32 caractères";
      toast.error(errorMessage);
      return;
    }

    if (password.trim().length < 6 || password.trim().length > 32) {
      setError(true);
      const errorMessage = "Le mot de passe doit être compris entre 6 et 32 caractères";
      toast.error(errorMessage);
      return;
    }

    if (passwordConfirm.trim() !== password.trim()) {
      setError(true);
      const errorMessage = "Les deux mots de passe sont différents";
      toast.error(errorMessage);
      return;
    }

    localStorage.setItem("email", email);

    setIsLoading(true);
    const formData = new FormData();

    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("password_confirmation", passwordConfirm);

    const response = await axios.post(
      "http://127.0.0.1:8000/api/register",
      formData
    );

    if (response.data.user) {
      toast.success(response.data.message);
      setIsLoading(false);
      setTimeout(function () {
        navigate("/otp-code/");
      }, 3000);
    } else {
      console.log(response.data);
      if (response.data.data.name !== undefined) {
        toast.error(response.data.data.name[0]);
      } else if (response.data.data.email !== undefined) {
        toast.error(response.data.data.email[0]);
      } else if (response.data.data.password !== undefined) {
        toast.error(response.data.data.password[0]);
      } else if (response.data.data.passwordConfirm !== undefined) {
        toast.error(response.data.data.passwordConfirm[0]);
      }

      setIsLoading(false);
    }
  };

  return (
    <div id="container" className="registration-container">
      <ToastContainer stacked />

      <div className="registration-box">
   
        <h1>Inscription</h1>
        <form action="" onSubmit={handleSubmit}>
          <p>Renseignez vos informations pour vous inscrire</p>
          <Input
            label={"name"}
            reference={"name"}
            type={"text"}
            value={name}
            placeholder={"Saisir le nom ici"}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <Input
            label={"email"}
            reference={"email"}
            type={"text"}
            value={email}
            placeholder={"Saisir l'adresse e-mail ici"}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <Input
            label={"Mot de passe"}
            reference={"password"}
            type={"password"}
            value={password}
            placeholder={"Saisir le mot de passe ici"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <Input
            label={"Confirmation"}
            reference={"passwordConfirm"}
            type={"password"}
            value={passwordConfirm}
            placeholder={"Confirmer le mot de passe ici"}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <br />
          <div>
            <Button
              disabled={isLoading}
              type={"submit"}
              text={isLoading ? "Chargement ..." : "Soumettre"}
            />
            <br />
          </div>
          <div>
            <Link to={"/"}>Connexion</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
