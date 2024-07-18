$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const timeParam = urlParams.get('Time');

    if (timeParam) {
        TarefasComPrazoTime(timeParam);
    } else {
        TarefasComPrazo();
    }
});

jQuery(function () {
    App.initHelpers(['select2']);
});

$('.js-draggable-items > .draggable-column').sortable({
    connectWith: '.draggable-column',
    items: '.draggable-item',
    dropOnEmpty: true,
    opacity: .75,
    handle: '.draggable-handler',
    placeholder: 'draggable-placeholder',
    tolerance: 'pointer',
    start: function (e, ui) {
        ui.placeholder.css({
            'height': ui.item.outerHeight(),
            'margin-bottom': ui.item.css('margin-bottom')
        });
    },
    receive: function (event, ui) {
        var droppedItem = ui.item;
        var membro = $(this).attr("id");
        var item = droppedItem.attr("id");

        AtribuirTarefa(item, membro);
    },

}).disableSelection();

$('#btn-tarefas').click();

function AtribuirTarefa(item, membro) {

    var nome = $(`#${membro}`).attr('nome');

    if (membro != 'Tarefas') {

        Swal.fire({
            title: "Atenção!",
            text: `Atribuir a tarefa ao membro: ${nome} ?`,
            icon: "info",
            showCancelButton: true,
            cancelButtonText: "Voltar",
            cancelButtonColor: "#3085d6",
            confirmButtonColor: "#008000",
            confirmButtonText: "Confirmar"
        }).then((result) => {
            if (result.isConfirmed) {

                $(`.body-loader`).show();

                const dados_clb = $(`#${membro}`).attr('id-clb').split(',');
                const idTarefa = $(`#${item}`).attr('id-tarefa');

                const dados = {
                    id_clb: dados_clb[0],
                    id_time: dados_clb[1],
                }
                
                $.ajax({
                    type: "PATCH",
                    url: `/AtribuicaoDeTarefas/${idTarefa}`,
                    contentType: 'application/json',
                    data: JSON.stringify({ Tarefa: dados }),
                    success: function (r) {

                        if (r.resultado == "alterado") {
                            $(`.body-loader`).hide();
                            Swal.fire({
                                title: "Tarefa Atribuida!",
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
            else {
                location.reload();
            }
        });
    }
    else {
        Swal.fire({
            title: "Atenção!",
            text: `Deseja Retornar a tarefa ao Painel?`,
            icon: "info",
            showCancelButton: true,
            cancelButtonText: "Voltar",
            cancelButtonColor: "#3085d6",
            confirmButtonColor: "#008000",
            confirmButtonText: "Confirmar"
        }).then((result) => {
            if (result.isConfirmed) {

                const idTarefa = $(`#${item}`).attr('id-tarefa');
                const dados = {
                    id_clb: null,
                    id_time: null,
                }

                $.ajax({
                    type: "PATCH",
                    url: `/AtribuicaoDeTarefas/${idTarefa}`,
                    contentType: 'application/json',
                    data: JSON.stringify({ Tarefa: dados }),
                    success: function (r) {

                        if (r.resultado == "alterado") {
                            $(`.body-loader`).hide();
                            Swal.fire({
                                title: "Tarefa retornada ao Painel",
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

function AbreTarefa(idTarefa) {

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

function ArquivarTarefa() {

    Swal.fire({
        title: "Atenção!",
        text: "Tem certeza que deseja arquivar a tarefa?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Voltar",
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Arquivar"
    }).then((result) => {
        if (result.isConfirmed) {
            const idTarefa = $('#ConsultaIdTarefa').text();
            const dados = { situacao_tarefa: "Arquivado"}

            $(`.body-loader`).show();

            $.ajax({
                type: "PATCH",
                url: `/AtribuicaoDeTarefas/${idTarefa}`,
                contentType: 'application/json',
                data: JSON.stringify({ Tarefa : dados }),
                success: function (r) {
                    if (r.resultado == "alterado") {
                        $(`.body-loader`).hide();
                        Swal.fire({
                            title: "Tarefa Atualizada!",
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

function ConcluirTarefa() {
    Swal.fire({
        title: "Atenção!",
        text: "Confirme a conclusão da Tarefa",
        icon: "info",
        showCancelButton: true,
        cancelButtonText: "Voltar",
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#008000",
        confirmButtonText: "Concluir"
    }).then((result) => {
        if (result.isConfirmed) {

            const idTarefa = $('#ConsultaIdTarefa').text();
            const dados = { situacao_tarefa: "Concluido"}

            $.ajax({
                type: "PATCH",
                url: `/AtribuicaoDeTarefas/${idTarefa}`,
                contentType: 'application/json',
                data: JSON.stringify({ Tarefa : dados }),
                success: function (r) {

                    if (r.resultado == "alterado") {

                        $(`.body-loader`).hide();

                        Swal.fire({
                            title: "Tarefa Atualizada!",
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

function PesquisarTime() {
    var time = $('#TimeSelecionado').val();
    if (time == "") {
        Command: toastr["warning"]("Informe o nome do time", "Atenção!")
        return
    }
    else {
        url = `/AtribuicaoDeTarefas?Time=${time}`
    }
    window.location.href = url;
}

function formatarHora(hora) {
    const [horaPart, minutoPart] = hora.split(':'); return `${horaPart}h${minutoPart}min`;
}
function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0'); const
        mes = String(data.getMonth() + 1).padStart(2, '0'); const
            ano = data.getFullYear(); return `${dia}/${mes}/${ano}`;
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

function TarefasComPrazo(){

   toastr.options = {
        'closeButton': true,
        'debug': false,
        'newestOnTop': true,
        'progressBar': false,
        'positionClass': 'toast-top-right',
        'preventDuplicates': false,
        'showDuration': '1000',
        'hideDuration': '1000',
        "timeOut": 0,
        "extendedTimeOut": 0,
        'showEasing': 'swing',
        'hideEasing': 'linear',
        'showMethod': 'fadeIn',
        'hideMethod': 'fadeOut',
    }

    toastr.options.closeHtml = '<button class="closebtn"><i class="si si-close"></i></button>';

    $.ajax({
        type: "GET",
        url: `/api/prazo`,
        contentType: 'application/json',
        success: function (r) {    
            if (r != null) {
                r.forEach(async t => {
                    const equipe = await RecuperarEquipe(t.id_time);
                    toastr.warning(
                        `<br><strong>Assunto: </strong>${t.assunto_tarefa}` +
                        `<br><strong>Prioridade: </strong><strong class="${t.prioridade_tarefa}">${t.prioridade_tarefa}</strong>` +
                        `<br><strong>Equipe Responsavel:</strong>${equipe}` +
                        `<br><strong>Prazo: </strong>${t.prazo_tarefa}`,'Existem tarefas proximas a data de entrega!');
                });
            } 
        },
        dataType: "json"
    });
}
function TarefasComPrazoTime(time){

   toastr.options = {
        'closeButton': true,
        'debug': false,
        'newestOnTop': true,
        'progressBar': false,
        'positionClass': 'toast-top-right',
        'preventDuplicates': false,
        'showDuration': '1000',
        'hideDuration': '1000',
        "timeOut": 0,
        "extendedTimeOut": 0,
        'showEasing': 'swing',
        'hideEasing': 'linear',
        'showMethod': 'fadeIn',
        'hideMethod': 'fadeOut',
    }

    toastr.options.closeHtml = '<button class="closebtn"><i class="si si-close"></i></button>';

    $.ajax({
        type: "GET",
        url: `/api/tarefas/prazo/${time}`,
        contentType: 'application/json',
        success: function (r) {
            if (r != null) {
                r.forEach(async t => {
                    const equipe = await RecuperarEquipe(t.id_time);
                    toastr.warning(
                        `<br><strong>Assunto: </strong>${t.assunto_tarefa}` +
                        `<br><strong>Prioridade: </strong><strong class="${t.prioridade_tarefa}">${t.prioridade_tarefa}</strong>` +
                        `<br><strong>Equipe Responsavel:</strong>${equipe}` +
                        `<br><strong>Prazo: </strong>${t.prazo_tarefa}`,'Existem tarefas proximas a data de entrega!');
                });
            } 
        },
        dataType: "json"
    });
}
