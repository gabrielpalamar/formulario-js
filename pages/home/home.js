const homeform = document.getElementById("homeform");
const username = document.getElementById("username");
const saldo = document.getElementById("saldo");
const email = document.getElementById("email");
const valor = document.getElementById("valor");


firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const userId = user.uid;
    const userRef = db.collection("users").doc(userId);

    userRef.get().then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        const username = userData.username;
        const saldo = userData.saldo;
        console.log("Nome do usuário:", username);

        //document.getElementById("username").value = username; esse seria para recuperar caso fosse input
        
        document.getElementById("username").innerHTML = username;
        document.getElementById("saldo").innerHTML = saldo;
      } else {
        console.log("Nenhum usuário encontrado com esse ID");
      }
    }).catch((error) => {
      console.log("Erro ao recuperar usuário:", error);
    });
  }
});



homeform.addEventListener("submit", (e) => {
  e.preventDefault();

  checkInputs();
});

function checkInputs() {
  const emailValue = email.value;
  const valorValue = valor.value;


  if (emailValue === "") {
    setErrorFor(email, "O email é obrigatório.");
  } else if (!checkEmail(emailValue)) {
    setErrorFor(email, "Por favor, insira um email válido.");
  } else {
    setSuccessFor(email);
  }

  if (valorValue === "") {
    setErrorFor(valor, "Um valor é obrigatório.");
  } else {
    setSuccessFor(valor);
  }

  const formControls = body.querySelectorAll(".form-control");

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
  const emailValue = email.value;
  const valorValue = valor.value;
  const currentUserUid = firebase.auth().currentUser.uid;

  if (Number(valorValue) <= 0) {
    console.log("Valor inválido para transferência.");
    alert("Valor inválido para transferência.");
    return;
  }

  if (emailValue === firebase.auth().currentUser.email) {
    console.log("Você não pode transferir para sua própria conta.");
    alert("Você não pode transferir para sua própria conta.");
    return;
  }

  const userRef = db.collection("users").where("email", "==", emailValue);
  userRef.get().then((querySnapshot) => {
    if (querySnapshot.size === 1) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const userId = userDoc.id;
      const userSaldo = userData.saldo;

      if (Number(valorValue) <= userSaldo){
        console.log("Saldo insuficiente para transferência.");
        alert("Saldo insuficiente para transferência.");
        return;
      }

      const newSaldo = userSaldo + Number(valorValue);
      const currentUserNewSaldo = Number(saldo.innerHTML) - Number(valorValue);

      db.collection("users").doc(userId).update({ saldo: newSaldo })
        .then(() => {
          console.log("Transferência concluída com sucesso!");
          db.collection("users").doc(currentUserUid).update({ saldo: currentUserNewSaldo })
            .then(() => {
              console.log("Novo saldo atualizado com sucesso!");
              // atualiza o valor do saldo na página
              saldo.innerHTML = currentUserNewSaldo;
            })
            .catch((error) => {
              console.log("Erro ao atualizar o saldo do usuário atual: ", error);
              alert("Erro ao atualizar o saldo do usuário atual.");
            });
        })
        .catch((error) => {
          console.log("Erro ao atualizar o saldo do destinatário: ", error);
          alert("Erro ao atualizar o saldo do destinatário.");
        });
    } else {
      console.log("Nenhum usuário encontrado com esse e-mail.");
      alert("Nenhum usuário encontrado com esse e-mail.");
    }
  }).catch((error) => {
    console.log("Erro ao buscar usuário: ", error);
    alert("Erro ao buscar usuário.");
  });
}






function logout() {
  firebase.auth().signOut().then(() => {
      window.location.href = "../../login.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}

function delet() {
  const user = firebase.auth().currentUser;
  const userRef = db.collection("users").doc(user.uid);

  userRef.delete().then(() => {
    console.log("Usuário excluído!");
    user.delete().then(() => {
      console.log("Conta de autenticação do Firebase excluída!");
      window.location.href = "../../login.html";
    }).catch((error) => {
      console.error("Erro ao excluir a conta de autenticação do Firebase: ", error);
    });
  }).catch((error) => {
    console.error("Erro ao excluir o usuário: ", error);
  });
}

  function limparHome () {
    document.getElementById("homeform").reset();
    firebase.auth()
}

