import React, { useState } from "react";
import Input from "../../Components/Input/Input";
import Button from "../../Components/Button/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function OtpCode() {
  const [otpCode, setOtpCode] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.set("auth_code", otpCode); // Updated key to match Laravel
    formData.set("email", email);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/verify-code",
        formData
      );

      if (response.status === 200 && response.data.token) {
        toast.success("Email vérifié avec succès !");
        navigate("/Group"); // Redirect after success
      } else {
        toast.error(response.data.message || "Vérification échouée.");
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        toast.error("Validation échouée. Veuillez vérifier vos informations.");
      } else {
        toast.error("Erreur lors de la vérification du code.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="container" className="registration-container">
      <ToastContainer />
      <div className="registration-box">
        <p>
          Un code vous a été envoyé dans votre boîte mail (
          {localStorage.getItem("email") || email}). Vérifiez-le et veuillez le saisir
        </p>
        <form action="" onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            value={email}
            placeholder="Saisir votre email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="text"
            label="OTP Code"
            value={otpCode}
            placeholder="Saisir le code ici"
            onChange={(e) => setOtpCode(e.target.value)}
            required
          />

          <Button
            disabled={isLoading}
            text={isLoading ? "Chargement ..." : "Soumettre"}
            type="submit"
          />
        </form>
      </div>
    </div>
  );
}
