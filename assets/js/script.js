/* 
    Nombre estudiante: Germán A. Riveros Sepúlveda.
    Generación: 14.
    Jornada: Vespertina.   
    Prueba: Fundamentos de programación en JavaScript
    Enlace del repositorio: https://github.com/german-rs/SuperHero
*/

$(function () {

    function obtenerModoDesdeCheckBox() {
        let estaSeleccionado = $('#modeSwitch').is(':checked');
        let modo;
        if (estaSeleccionado) {
            modo = 'dark2';
        } else {
            modo = 'light2';
        }
        return modo;
    }


    if (localStorage.getItem('theme') === 'dark') {
        $('body').addClass('dark-mode');
        $('.card').addClass('text-bg-dark');
        $('.list-group-item').addClass('text-bg-dark');
        $('#modeSwitch').prop('checked', true);
    } else {
        $('body').addClass('light-mode');
        $('.card').addClass('text-bg-light');
    }

    $('#modeSwitch').change(function () {

        if ($(this).is(':checked')) {
            $('body').removeClass('light-mode').addClass('dark-mode');
            $('.card').removeClass('text-bg-light').addClass('text-bg-dark');
            $('.list-group-item').removeClass('text-bg-light').addClass('text-bg-dark');
            localStorage.setItem('theme', 'dark');

        } else {
            $('body').removeClass('dark-mode').addClass('light-mode');
            $('.card').removeClass('text-bg-dark').addClass('text-bg-light');
            $('.list-group-item').removeClass('text-bg-dark').addClass('text-bg-light');
            localStorage.setItem('theme', 'light');
        }
    });


    $('.buscador__boton').on('click', function () {
        let numeroId = $('.buscador__campo').val();
        let resultado = validar(numeroId);
        if (resultado == true) {
            exito();
            realizarBusqueda(numeroId);
        }
    });


    function limpiarErrores() {
        $('.buscador__campo').val('');
    }


    function exito() {
        mostrarAlert('exito');
        limpiarErrores();
    }


    function mostrarAlert(estado) {
        const alert = document.createElement('div');
        let tipoAlert;
        let tipoMensaje;

        if (estado == 'exito') {
            tipoAlert = 'alert-success';
            tipoMensaje = '¡Número validado con éxito!';

        } else if (estado == 'error') {
            tipoAlert = 'alert-danger';
            tipoMensaje = '¡Error, por favor ingrese un número entre 1 y 731!';
        }

        alert.className = `alert ${tipoAlert} alert-dismissible fade show`;
        alert.role = 'alert';
        alert.innerHTML = `
                ${tipoMensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
        document.getElementById('alertContainer').appendChild(alert);
    }


    function validar(identificador) {
        let validacionId = /^\d+$/;
    
        if (!validacionId.test(identificador)) {
            mostrarAlert('error');
            limpiarErrores();
            return false;
        }
    
        let numero = parseInt(identificador, 10);
    
        if (numero <= 0 || numero > 731) {
            mostrarAlert('error');
            limpiarErrores();
            return false;
        }
    
        return true;
    }    


    function realizarBusqueda(id) {
        const token = 'fce271d63d6cd5411d02793e46d9cccf';

        $.ajax({
            url: `https://superheroapi.com/api/${token}/${id}`,
            type: 'GET',
            dataType: 'json',
            success: function (respuesta) {
                console.log(respuesta);
                mostrarDatosHeroe(respuesta);
                crearGrafico(respuesta);
            },
            error: function (error) {
                console.error(error);
            }
        });
    }


    function mostrarDatosHeroe(respuesta) {
        let heroe = respuesta;

        $('.resultado__img').attr('src', heroe.image['url']);
        $('.resultado__id').text(heroe.id);
        $('.resultado__nombre').text(heroe.name);
        $('.resultado__conexiones').text(heroe.connections['group-affiliation']);
        $('.resultado__publicacion').text(heroe.biography['publisher']);
        $('.resultado__ocupacion').text(heroe.work['occupation']);
        $('.resultado__aparicion').text(heroe.biography['first-appearance']);
        $('.resultado__altura').text(heroe.appearance['height']);
        $('.resultado__peso').text(heroe.appearance['weight']);
        $('.resultado__aliados').text(heroe.biography['aliases']);
    }


    function crearGrafico(respuesta) {
        let heroe = respuesta;
        $('.estadisticas__titulo-nombre').text(heroe.name);

        let estadisticasDePoder = [];

        let i = 0;
        $.each(heroe.powerstats, function (clave, valor) {
            console.log(`${clave}: ${valor}`);
            estadisticasDePoder[i] = valor;

            if (estadisticasDePoder[i] == 'null') {
                estadisticasDePoder[i] = 0;
            }

            i++;
        });

        let modo = obtenerModoDesdeCheckBox();
        var options = {
            title: {
                text: `Estadísticas de poder para ${heroe.name}`
            },
            theme: modo,
            animationEnabled: true,
            data: [{
                type: 'pie',
                startAngle: 40,
                toolTipContent: '<b>{label}</b>: {y}%',
                showInLegend: 'true',
                legendText: '{label}',
                indexLabelFontSize: 16,
                indexLabel: '{label} - ({y})',
                dataPoints: [
                    { y: estadisticasDePoder[0], label: 'Inteligencia' },
                    { y: estadisticasDePoder[1], label: 'Fuerza' },
                    { y: estadisticasDePoder[2], label: 'Velocidad' },
                    { y: estadisticasDePoder[3], label: 'Resistencia' },
                    { y: estadisticasDePoder[4], label: 'Poder' },
                    { y: estadisticasDePoder[5], label: 'Combate' }
                ]
            }]
        };
        $('#chartContainer').CanvasJSChart(options);
    }


});