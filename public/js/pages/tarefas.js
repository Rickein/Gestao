jQuery(function () {
    App.initHelpers(['select2', 'masked-inputs', 'datetimepicker']);
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

$('#table-1').DataTable({
    language: {
        url: '/public/js/core/dataTable2.0/pt-bt.json',
    },
});

$('#btn-filtros').click();

function ModalAbrirTarefa(idTarefa) {

    $.ajax({
        url: `/api/tarefas/${idTarefa}`,
        method: 'GET',
        success: function (e) {
            RecuperarEquipe(e.id_time).then(nome => {
                $('#ConsultaEquipe').text(nome);
                $('#ConsultaIdTarefa').text(e.id_tarefa);
                $('#ConsultaSolicitante').text(e.solicitante_tarefa);
                $('#ConsultaPrioridade').text(e.prioridade_tarefa);
                $('#ConsultaTempoEstimado').text(formatarHora(e.tempo_estimado_tarefa));
                $('#ConsultaPrazo').text(e.prazo_tarefa);
                $('#ConsultaAssunto').text(e.assunto_tarefa);
                $('#ConsultaDescricao').text(e.descricao_tarefa);
                $('#ConsultaSituacao').text(e.situacao_tarefa);

                var classe = "";
                var flag = "";
                if (e.prioridade_tarefa.toLowerCase() == 'alta') {
                    classe = 'fa fa fa-flag text-city';
                    flag = 'block-content block-content-full block-content-mini text-center text-white bg-city';
                } else if (e.prioridade_tarefa.toLowerCase() == 'media') {
                    classe = 'fa fa fa-flag text-warning';
                    flag = 'block-content block-content-full block-content-mini text-center text-white bg-warning';
                } else {
                    classe = 'fa fa fa-flag text-modern';
                    flag = 'block-content block-content-full block-content-mini text-center text-white bg-modern';
                }
                $('#cardFlag')[0].className = flag;
                $('#flag')[0].className = classe;
                $('#ModalVerificarTarefa').modal("show");
            }).catch(err => {
                Swal.fire({
                    title: "Algo deu Errado",
                    text: err,
                    icon: "info",
                });
            });
        },
        error: function (e) {
            Swal.fire({
                title: "Algo deu Errado",
                text: e,
                icon: "info",
            });
        }
    });
}
function AbrirNovaTarefa() {
    LimpaCampos();
    $('#ModalNovaTarefa').modal("show");
}
function NovaTarefa() {
    var listaDeErros = [];

    var solicitante = $("#SolicitanteNovo").val();
    if (solicitante == "") {
        listaDeErros.push("Informe o Solicitante");
    }

    var assunto = $("#AssuntoNovo").val();
    if (assunto == "") {
        listaDeErros.push("Informe o Assunto");
    }

    var descricao = $("#DescricaoNovo").val();
    if (descricao == "") {
        listaDeErros.push("Informe a Descrição");
    }

    var prioridade = $("#PrioridadeNovo").val();
    if (prioridade == "") {
        listaDeErros.push("Informe a Prioridade");
    }

    var tempoEstimado = $("#TempoEstimadoNovo").val();
    if (tempoEstimado == "") {
        listaDeErros.push("Informe o Tempo Estimado");
    }

    var prazo = $("#PrazoNovo").val();
    if (prazo == "") {
        listaDeErros.push("Informe Prazo final");
    }

    listaDeErros.forEach(element => {
        Command: toastr["warning"](element, "Atenção!")
    });

    if (listaDeErros.length > 0) {
        return
    }
    else {
        var Tarefas = {
            solicitante_tarefa: solicitante,
            assunto_tarefa: assunto,
            descricao_tarefa: descricao, prioridade_tarefa: prioridade,
            tempo_estimado_tarefa: tempoEstimado, prazo_tarefa: prazo
        }
        InserirTarefa(Tarefas);
    }
}
function InserirTarefa(listaTarefas) {
    Swal.fire({
        title: "Atenção!",
        text: "Tem certeza que deseja criar a tarefa?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Voltar",
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#f3b760",
        confirmButtonText: "Criar"
    }).then((result) => {
        if (result.isConfirmed) {

            $(`.body-loader`).show();

            $.ajax({
                type: "POST",
                url: `/tarefas/inserirTarefa`,
                contentType: 'application/json',
                data: JSON.stringify({ Tarefa: listaTarefas }),
                success: function (r) {

                    if (r.resultado == "criado") {

                        $(`.body-loader`).hide();

                        Swal.fire({
                            title: "Tarefa Alterada!",
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
function ModalEditarTarefa() {
    $('#ModalVerificarTarefa').modal('hide');
    var tarefa = $('#ConsultaIdTarefa').text();
    $(`.body-loader`).show();

    $.ajax({
        url: `/api/tarefas/${tarefa}`,
        method: 'GET',
        success: function (e) {
            $('#SolicitanteEditar').val(e.solicitante_tarefa);
            $('#AssuntoEditar').val(e.assunto_tarefa);
            $('#DescricaoEditar').val(e.descricao_tarefa);
            $('#TempoEstimadoEditar').val(e.tempo_estimado_tarefa);
            $('#PrioridadeEditar').val(e.prioridade_tarefa);
            $('#PrazoEditar').val((e.prazo_tarefa));
            $('#idTarefaEditar').text(e.id_tarefa);
        },
        error: function (e) {
            Swal.fire({
                title: "Algo deu Errado",
                text: e,
                icon: "info",
            });
        }
    });

    setTimeout(function () {
        $(`.body-loader`).hide();
        $('#ModalEditarTarefa').modal('show');
    }, 400);
}
function EditarTarefa() {
    var listaDeErros = [];

    var solicitante = $("#SolicitanteEditar").val();
    if (solicitante == "") {
        listaDeErros.push("Informe o Solicitante");
    }

    var assunto = $("#AssuntoEditar").val();
    if (assunto == "") {
        listaDeErros.push("Informe o Assunto");
    }

    var descricao = $("#DescricaoEditar").val();
    if (descricao == "") {
        listaDeErros.push("Informe a Descrição");
    }

    var prioridade = $("#PrioridadeEditar").val();
    if (prioridade == "") {
        listaDeErros.push("Informe a Prioridade");
    }

    var tempoEstimado = $("#TempoEstimadoEditar").val();
    if (tempoEstimado == "") {
        listaDeErros.push("Informe o Tempo Estimado");
    }

    var prazo = $("#PrazoEditar").val();
    if (prazo == "") {
        listaDeErros.push("Informe Prazo final");
    }

    listaDeErros.forEach(element => {
        Command: toastr["warning"](element, "Atenção!")
    });

    if (listaDeErros.length > 0) {
        return
    }

    else {
        var IdTarefa = $("#idTarefaEditar").text();
        var Tarefas = {
            solicitante_tarefa: solicitante,
            assunto_tarefa: assunto,
            descricao_tarefa: descricao, prioridade_tarefa: prioridade,
            tempo_estimado_tarefa: tempoEstimado, prazo_tarefa: prazo,
            id_tarefa: IdTarefa
        }

        AlterarTarefa(Tarefas, IdTarefa);
    }
}
function AlterarTarefa(listaTarefa, ID) {

    Swal.fire({
        title: "Atenção!",
        text: "Tem certeza que deseja alterar a tarefa?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Voltar",
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#f3b760",
        confirmButtonText: "Alterar"
    }).then((result) => {
        if (result.isConfirmed) {

            $(`.body-loader`).show();

            $.ajax({
                type: "PATCH",
                url: `/tarefas/${ID}`,
                contentType: 'application/json',
                data: JSON.stringify({ Tarefa: listaTarefa }),
                success: function (r) {

                    if (r.resultado == "alterado") {

                        $(`.body-loader`).hide();

                        Swal.fire({
                            title: "Tarefa Alterada!",
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

function RemoverTarefa() {
    Swal.fire({
        title: "Atenção!",
        text: "Tem certeza que deseja remover a tarefa?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Voltar",
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#f36060",
        confirmButtonText: "Remover"
    }).then((result) => {
        if (result.isConfirmed) {

            var IdTarefa = $('#ConsultaIdTarefa').text();
            $(`.body-loader`).show();

            $.ajax({
                type: "DELETE",
                url: `/tarefas/${IdTarefa}`,
                contentType: 'application/json',
                success: function (r) {

                    if (r.resultado == "removido") {

                        $(`.body-loader`).hide();

                        Swal.fire({
                            title: "Tarefa Removida!",
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


function LimpaCampos() {
    $("#SolicitanteNovo").val("");
    $("#AssuntoNovo").val("");
    $("#DescricaoNovo").val("");
    $("#PrioridadeNovo").val("");
    $("#TempoEstimadoNovo").val("");
    $("#PrazoNovo").val("");
}
function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0'); const
        mes = String(data.getMonth() + 1).padStart(2, '0'); const
            ano = data.getFullYear(); return `${dia}/${mes}/${ano}`;
}
function formatarHora(hora) {
    const [horaPart, minutoPart] = hora.split(':'); return `${horaPart}h${minutoPart}min`;
}
function formatarDataHora(dataISO) {
    var data = new Date(dataISO);
    var dia = String(data.getDate()).padStart(2, '0');
    var mes = String(data.getMonth() + 1).padStart(2, '0');
    var ano = data.getFullYear();
    var horas = String(data.getHours()).padStart(2, '0');
    var minutos = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}
async function RecuperarEquipe(idEquipe) {
    if (!idEquipe) {
        return "Não Atribuido";
    }

    try {
        const response = await $.ajax({
            url: `/api/times/${idEquipe}`,
            method: 'GET'
        });
        return response.nome_time;
    } catch (error) {
        return "Não Atribuido";
    }
}
function AplicarFiltros() {
    var Prioridades = [];
    if ($('#checkBoxBaixa').is(':checked')) Prioridades.push("Baixa");
    if ($('#checkBoxMedia').is(':checked')) Prioridades.push("Media");
    if ($('#checkBoxAlta').is(':checked')) Prioridades.push("Alta");

    var Filtros = [];
    if ($('#checkBoxConcluido').is(':checked')) Filtros.push("Concluido");
    if ($('#checkBoxEmAberto').is(':checked')) Filtros.push("Em Aberto");
    if ($('#checkBoxArquivado').is(':checked')) Filtros.push("Arquivado");

    var url = ""
    if (Prioridades.length == 0 & Filtros.length == 0) {
        url = `/tarefas`;
    } else {
        url = `/tarefas?Prioridades=${encodeURIComponent(Prioridades.join(','))}&Filtros=${encodeURIComponent(Filtros.join(','))}`;
    }

    window.location.href = url;
}