const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirmation = document.getElementById("password-confirmation");


form.addEventListener("submit", (e) => {
  e.preventDefault();

  checkInputs();
});



function checkInputs() {
  const usernameValue = username.value;
  const emailValue = email.value;
  const passwordValue = password.value;
  const passwordConfirmationValue = passwordConfirmation.value;

  if (usernameValue === "") {
    setErrorFor(username, "O nome de usuário é obrigatório.");
  } else {
    setSuccessFor(username);
  }

  if (emailValue === "") {
    setErrorFor(email, "O email é obrigatório.");
  } else if (!checkEmail(emailValue)) {
    setErrorFor(email, "Por favor, insira um email válido.");
  } else {
    setSuccessFor(email);
  }

  if (passwordValue === "") {
    setErrorFor(password, "A senha é obrigatória.");
  } else if (passwordValue.length < 6) {
    setErrorFor(password, "A senha precisa ter no mínimo 6 caracteres.");
    
  } else {
    setSuccessFor(password);
  }

  if (passwordConfirmationValue === "") {
    setErrorFor(passwordConfirmation, "A confirmação de senha é obrigatória.");
  } else if (passwordConfirmationValue !== passwordValue) {
    setErrorFor(passwordConfirmation, "As senhas não conferem.");
    alert(getErrorMessage(error));
  } else {
    setSuccessFor(passwordConfirmation);
  }

  const formControls = form.querySelectorAll(".form-control");

  const formIsValid = [...formControls].every((formControl) => {
    return formControl.className === "form-control success";
  });

  if (formIsValid) {
    console.log("O formulário está 100% válido!");
  }
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");

  // Adiciona a mensagem de erro
  small.innerText = message;

  // Adiciona a classe de erro
  formControl.className = "form-control error";
}

function setSuccessFor(input) {
  const formControl = input.parentElement;

  // Adicionar a classe de sucesso
  formControl.className = "form-control success";
}

function checkEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}
function enviar() {
  const usernameValue = username.value;
  const emailValue = email.value;
  const passwordValue = password.value;
  const passwordConfirmationValue = passwordConfirmation.value;
  if (usernameValue === "" || emailValue === "" || passwordValue === "" || passwordConfirmationValue === "") {
    alert("Por favor, preencha todos os campos.");
    return;
  }
  firebase.auth().createUserWithEmailAndPassword(
    emailValue, passwordValue, passwordConfirmationValue
    
  ).then((userCredential) => {
    const user = userCredential.user;
    const userId = user.uid; // novo ID gerado pelo Firebase Authentication
    const usersRef = db.collection("users");
    usersRef.doc(userId).set({
      username: usernameValue,
      email: emailValue,
      saldo: 200
    }).then(() => {
      console.log("Novo usuário adicionado com ID:", userId);
      window.location.href = "../../login.html";
    }).catch((error) => {
      console.error("Erro ao adicionar novo usuário:", error);
    });
  }).catch((error) => {
    alert(getErrorMessage(error));
  });
}


function getErrorMessage(error) {
  if (error.code == "auth/email-already-in-use") {
      return "Email já está em uso.";
  }
  if (error.code == "auth/weak-password") {
    return "A senha precisa ter no mínimo 6 caracteres.";
}
  return error.message;

  //auth/weak-password
}

function limparCadastro () {
  document.getElementById("form").reset();
}

function cancelar() {
  document.getElementById("username").value=""
  document.getElementById("email").value=""
  document.getElementById("password").value=""
  document.getElementById("password-confirmation").value=""
  window.location.href = "../../login.html";
}