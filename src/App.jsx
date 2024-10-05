// import React, { useState } from "react";
// import "./App.jsx";
// import "./App.css";
// import Input from "./Components/Input/Input.jsx";
// import Button from "./Components/Button/Button";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast, ToastContainer} from "react-toastify";

// export default function App() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const formData = new FormData();

//     formData.set("email", email);
//     formData.set("password", password);

//     const response = await axios.post(
//       "http://127.0.0.1:8000/api/login",
     
//       formData
//     );

//     if (response.data.user) {
//       toast.success(response.data.message);
//       setIsLoading(false);
//       setTimeout(function () {
//         navigate("/Group");
//       }, 3000);
//     } else {
//       console.log(response.data);
//       toast.error("email ou mot de passe incorrect");
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div id="container" className="registration-container">
//       <ToastContainer />
//       <div className="registration-box">
//       <h1>Connexion</h1>
//       <form onSubmit={handleSubmit}>
//         <p>Renseignez vos information de connexion pour vous connectez</p>
//         <Input
//           label={"Email"}
//           reference={"email"}
//           type={"email"}
//           value={email}
//           placeholder={"Saisir l'adresse e-mail ici"}
//           onChange={(e) => {
//             setEmail(e.target.value);
//           }}
//         /><br />
     

//         <Input
//           label={"Mot de passe"}
//           reference={"password"}
//           type={"password"}
//           value={password}
//           placeholder={"Saisir le mod de passe ici"}
//           onChange={(e) => {
//             setPassword(e.target.value);
//           }}
//         />
//       <br />

//         <div>
//           <Button
//             disabled={isLoading}
//             type={"submit"}
//             text={isLoading ? "Chargement ..." : "Soumettre"}
//           /><br />
//           {/* <Button type={"reset"} text={"Anuler"} /> */}
//         </div>
//         <div>
//           <Link to={"/registration"}>Inscription</Link>
//         </div>
//       </form>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import "./App.css";
import Input from "./Components/Input/Input.jsx";
import Button from "./Components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    formData.set("email", email);
    formData.set("password", password);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        formData
      );

      if (response.data.token) {
        toast.success(response.data.message);

        // Stocker le token dans le localStorage
        localStorage.setItem("token", response.data.token);

        setIsLoading(false);
        setTimeout(() => {
          navigate("/Group");
        }, 3000);
      } else {
        toast.error("Email ou mot de passe incorrect");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      toast.error("Erreur lors de la connexion");
      setIsLoading(false);
    }
  };

  return (
    <div id="container" className="registration-container">
      <ToastContainer />
      <div className="registration-box">
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit}>
          <p>Renseignez vos informations de connexion pour vous connecter</p>
          <Input
            label={"Email"}
            reference={"email"}
            type={"email"}
            value={email}
            placeholder={"Saisir l'adresse e-mail ici"}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <br />

          <Input
            label={"Mot de passe"}
            reference={"password"}
            type={"password"}
            value={password}
            placeholder={"Saisir le mot de passe ici"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
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
            <Link to={"/registration"}>Inscription</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
