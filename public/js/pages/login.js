
function Deslogar(){
    $(`.body-loader`).show();

    $.ajax({
        type: "POST",
        url: "/Login/Logout",
        contentType: 'application/json',
        success: function (r) {
            if (r.resultado === "Deslogado") {
                window.location.href = "/Login";
            } else {
                Swal.fire({
                    title: "Algo deu Errado",
                    text: r.mensagem,
                    icon: "info",
                });
            }
        },
        error: function (err) {
            Swal.fire({
                title: "Erro",
                text: "Não foi possível deslogar",
                icon: "error",
            });
        },
        dataType: "json"
    });
    $('.body-loader').hide();
}

function AutenticarLogin() {

    Carregamento();

    let email = $('#emailLogin').val();
    let senha = $('#passwordLogin').val();

    if (email == "" || senha == "") {

        Carregamento();

        Swal.fire({
            title: "Login e/ou senha não informado",
            text: "Verifique seus dados e tente novamente",
            icon: "info"
        });
        return
    }

    GetLogin(email, senha);
}

function NovoUsuario() {

    $(`.body-loader`).show();

    let nome = $("#NewName").val();
    let email = $('#NewEmail').val();
    let senha = $('#NewPassword').val();

    if (email == "" || senha == "" || nome == "") {

    $('.body-loader').hide();
        Swal.fire({
            title: "Existem campos não preenchidos",
            text: "Verifique os dados e tente novamente",
            icon: "info"
        });

        return
    }
    PostLogin(nome, email, senha);
}

function GetLogin(email, senha) {
    $.ajax({

        type: "POST",
        url: "/api/login",
        contentType: 'application/json',
        data: JSON.stringify({ Usuario : {usu_email:email,usu_senha:senha}}),
        success: function (r) {

            if (r.resultado == "Invalido") {
                Swal.fire({
                    title: "Login e/ou senha invalidos",
                    text: "Verifique seus dados e tente novamente",
                    icon: "info"
                });

                Carregamento();
            }
            if (r.resultado == "Logado") {
                window.location.href = "/gestor";
            }

        },
        dataType: "json"
    });

}

function PostLogin(nome, email, senha) {

    $.ajax({
        type: "POST",
        url: "/Login/InserirUsuario",
        contentType: 'application/json',
        data: JSON.stringify({ Usuario : {usu_nome:nome,usu_email:email,usu_senha:senha}}),
        success: function (r) {

            if (r.resultado == "criado") {

                $('.body-loader').hide();

                $('#novo_cadastro')[0].reset();
                $('#modal-cadastro').modal('toggle');

                Swal.fire({
                    title: "Usuario criado com sucesso",
                    text: "Prossiga com o acesso a plataforma",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });

            }
            else {
                $('.body-loader').hide();

                Swal.fire({
                    title: "Algo deu Errado",
                    text: r.mensagem,
                    icon: "info",
                });
            }

        },
        dataType: "json"
    });
}

function Carregamento() {
    $('.body-loader').toggle();
}