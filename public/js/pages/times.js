
jQuery(function () {
    App.initHelpers(['select2']);
});

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

function CriarTime() {
    var time = $('#val-nomeTime').val();
    if (time == "") {
        Command: toastr["warning"]("Informe o nome do time", "Atenção!")
        return
    }
    else {

        Swal.fire({
            title: "Atenção!",
            text: `Tem certeza que deseja criar o time: ${time}?`,
            icon: "info",
            showCancelButton: true,
            cancelButtonText: "Voltar",
            cancelButtonColor: "#3085d6",
            confirmButtonColor: "#2a754a",
            confirmButtonText: "Criar"
        }).then((result) => {
            if (result.isConfirmed) {
                NovoTime(time);
            }
        });
    }

}

function NovoTime(time) {

    $(`.body-loader`).show();

    $.ajax({
        type: "POST",
        url: "Times/novoTime",
        data: {
            "Time": time,
        },
        success: function (r) {

            $(`.body-loader`).hide();

            if (r.resultado == "criado") {
                Swal.fire({
                    title: "Novo time Inserido!",
                    text: "Confirme para recarregar a pagina",
                    icon: "success",
                    showConfirmButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            }
        },
        error: function (xhr, status, error) {

            $(`.body-loader`).hide();

            if (xhr.status == 400) {
                var resposta = JSON.parse(xhr.responseText);
                var mensagem = resposta.mensagem;
                Swal.fire({
                    title: "Algo deu Errado",
                    text: mensagem,
                    icon: "info",
                });
            } else {
                console.error("Erro na requisição:", error);
            }
        },
        dataType: "json"
    });
}

function ModalAlterarTime(idTime) {

    $.ajax({
        url: `/api/times/${idTime}`,
        method: 'GET',
        success: function (time) {

            $('#NomeTime').val(time.nome_time);
            $('#Situacao').val(time.ativo ? 1 : 2);
            $('#Situacao').trigger('change');
            $('#idAlterarEquipe').val(time.id_time)

        },
        error: function (e) {
            Swal.fire({
                title: "Algo deu Errado",
                text: e,
                icon: "info",
            });
        }
    });
    $('#ModalAlterarTime').modal('show');
}

function AlterarTime() {

    var time = $('#NomeTime').val();
    if (time == "") {
        Command: toastr["warning"]("Informe o nome do time", "Atenção!")
        return
    }
    else {
        Swal.fire({
            title: "Atenção!",
            text: "Tem certeza que deseja alterar o time?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Voltar",
            cancelButtonColor: "#3085d6",
            confirmButtonColor: "#f3b760",
            confirmButtonText: "Alterar"
        }).then((result) => {

            if (result.isConfirmed) {

                $(`.body-loader`).show();

                var novoTime = {
                    nome_time: $('#NomeTime').val(),
                    ativo: $('#Situacao').val() == 1 ? true : false,
                }
                
                var id_time = $('#idAlterarEquipe').val()
                $.ajax({
                    type: "PATCH",
                    url: `/Times/${id_time}`,
                    contentType: 'application/json',
                    data: JSON.stringify({ Time: novoTime }),
                    success: function (r) {

                        if (r.resultado == "alterado") {

                            $(`.body-loader`).hide();

                            Swal.fire({
                                title: "Time Alterado!",
                                text: "Confirme para recarregar a pagina",
                                icon: "success",
                                showConfirmButton: true,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                }
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        if (xhr.status == 400) {
                            $(`.body-loader`).hide();

                            var resposta = JSON.parse(xhr.responseText);
                            var mensagem = resposta.mensagem;
                            Swal.fire({
                                title: "Algo deu Errado",
                                text: mensagem,
                                icon: "info",
                            });
                        } else {
                            console.error("Erro na requisição:", error);
                        }
                    },
                    dataType: "json"
                });
            }
        });
    }
}

function RemoverTime(IdTime) {

    Swal.fire({
        title: "Atenção!",
        text: "Tem certeza que deseja remover o Time?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Voltar",
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Remover"
    }).then((result) => {
        if (result.isConfirmed) {

            $(`.body-loader`).show();

            $.ajax({
                type: "DELETE",
                url: `/Times/${IdTime}`,
                contentType: 'application/json',
                success: function (r) {
                    if (r.resultado == "removido") {
                        $(`.body-loader`).hide();
                        Swal.fire({
                            title: "Time Removido!",
                            text: "Confirme para recarregar a pagina",
                            icon: "success",
                            showConfirmButton: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.status == 400) {
                        $(`.body-loader`).hide();
                        var resposta = JSON.parse(xhr.responseText);
                        var mensagem = resposta.mensagem;
                        Swal.fire({
                            title: "Algo deu Errado",
                            text: mensagem,
                            icon: "info",
                        });
                    } else {
                        console.error("Erro na requisição:", error);
                    }
                },
                dataType: "json"
            });
        }
    });
}

function RemoverIntegrante(idIntegrante) {
    var nome = $(`#${idIntegrante}`)[0].cells[0].innerText;

    Swal.fire({
        title: "Atenção!",
        text: `Tem certeza que deseja remover o integrante ${nome}?`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Voltar",
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Remover"
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                type: "DELETE",
                url: `/Colaboradores/${idIntegrante}`,
                contentType: 'application/json',
                success: function (r) {
                    if (r.resultado == "removido") {
                        $(`.body-loader`).hide();

                        Swal.fire({
                            title: "Colaborador Removido!",
                            text: "Confirme para recarregar a pagina",
                            icon: "success",
                            showConfirmButton: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.status == 400) {
                        $(`.body-loader`).hide();

                        var resposta = JSON.parse(xhr.responseText);
                        var mensagem = resposta.mensagem;
                        Swal.fire({
                            title: "Algo deu Errado",
                            text: mensagem,
                            icon: "info",
                        });
                    } else {
                        console.error("Erro na requisição:", error);
                    }
                },
                dataType: "json"
            });


        }
    });
}

function ModalInserirIntegrante(idTime) {
    $('#NovoIntegranteIdEquipe').val(idTime);
    $('#ModalNovoIntegrante').modal('show');
}

function NovoIntegrante() {

    var erros = [];
    var nome = $('#NovoIntegranteNome').val();
    nome == "" ? erros.push("Informe o Nome do Integrante") : "";
    var email = $('#NovoIntegranteEmail').val();
    email == "" ? erros.push("Informe o E-mail do Integrante") : "";
    var funcao = $('#NovoIntegranteFuncao').val();
    funcao == "" ? erros.push("Informe a função do Integrante") : "";

    if (erros.length == 0) {

        Swal.fire({
            title: "Atenção!",
            text: "Tem certeza que deseja inserir um novo colaborador?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Voltar",
            cancelButtonColor: "#3085d6",
            confirmButtonColor: "#46c37b",
            confirmButtonText: "Inserir"
        }).then((result) => {
            if (result.isConfirmed) {

                $(`.body-loader`).show();
                var novoColaborador = {
                    nome_clb: nome,
                    email_clb: email,
                    funcao_clb: funcao,
                    id_time: $('#NovoIntegranteIdEquipe').val()
                }

                $.ajax({
                    type: "POST",
                    url: `/Colaboradores/novoColaborador`,
                    contentType: 'application/json',
                    data: JSON.stringify({ Colaborador: novoColaborador }),
                    success: function (r) {

                        if (r.resultado == "criado") {

                            $(`.body-loader`).hide();

                            Swal.fire({
                                title: "Colaborador Adicionado!",
                                text: "Confirme para recarregar a pagina",
                                icon: "success",
                                showConfirmButton: true,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                }
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        if (xhr.status == 400) {
                            $(`.body-loader`).hide();

                            var resposta = JSON.parse(xhr.responseText);
                            var mensagem = resposta.mensagem;
                            Swal.fire({
                                title: "Algo deu Errado",
                                text: mensagem,
                                icon: "info",
                            });
                        } else {
                            console.error("Erro na requisição:", error);
                        }
                    },
                    dataType: "json"
                });
            }
        })

    } else {
        erros.forEach(e => {
            Command: toastr["warning"](e);
        });
    }
}

function ModalAlterarIntegrante(idIntegrante) {

    $.ajax({
        url: `/api/colaboradores/${idIntegrante}`,
        method: 'GET',
        success: function (clb) {
            $('#NomeAlterarIntegrante').val(clb.nome_clb);
            $('#EmailAlterarIntegrante').val(clb.email_clb);
            $('#FuncaoAlterarIntegrante').val(clb.funcao_clb);
            $('#idEquipeAlterarIntegrante').val(clb.id_time);
            $('#idAlterarIntegrante').val(clb.id_clb)
        },
        error: function (e) {
            Swal.fire({
                title: "Algo deu Errado",
                text: e,
                icon: "info",
            });
        }
    });

    $('#ModalAlterarIntegrante').modal('show');
}

function AlterarIntegrante() {
    var erros = [];

    var nome = $('#NomeAlterarIntegrante').val();
    nome == "" ? erros.push("Informe o Nome do Integrante") : "";
    var email = $('#EmailAlterarIntegrante').val();
    email == "" ? erros.push("Informe o E-mail do Integrante") : "";
    var funcao = $('#FuncaoAlterarIntegrante').val();
    funcao == "" ? erros.push("Informe a função do Integrante") : "";

    if (erros.length == 0) {

        Swal.fire({
            title: "Atenção!",
            text: "Tem certeza que deseja alterar o colaborador?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Voltar",
            cancelButtonColor: "#3085d6",
            confirmButtonColor: "#46c37b",
            confirmButtonText: "Alterar"
        }).then((result) => {
            if (result.isConfirmed) {

                $(`.body-loader`).show();
                var alterarColaborador = {
                    nome_clb: nome,
                    email_clb: email,
                    funcao_clb: funcao,
                    id_time: $('#idEquipeAlterarIntegrante').val()
                }
                var id_clb = $('#idAlterarIntegrante').val();

                $.ajax({
                    type: "PATCH",
                    url: `/Colaboradores/${id_clb}`,
                    contentType: 'application/json',
                    data: JSON.stringify({ Colaborador: alterarColaborador }),
                    success: function (r) {

                        if (r.resultado == "alterado") {

                            $(`.body-loader`).hide();

                            Swal.fire({
                                title: "Colaborador Adicionado!",
                                text: "Confirme para recarregar a pagina",
                                icon: "success",
                                showConfirmButton: true,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                }
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        if (xhr.status == 400) {
                            $(`.body-loader`).hide();

                            var resposta = JSON.parse(xhr.responseText);
                            var mensagem = resposta.mensagem;
                            Swal.fire({
                                title: "Algo deu Errado",
                                text: mensagem,
                                icon: "info",
                            });
                        } else {
                            console.error("Erro na requisição:", error);
                        }
                    },
                    dataType: "json"
                });
            }
        })

    } else {
        erros.forEach(e => {
            Command: toastr["warning"](e);
        });
    }
}
