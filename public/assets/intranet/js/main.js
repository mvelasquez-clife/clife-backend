MuestraIndicadorCarga = _ => {
    if (document.getElementById('dv-loader')) {
        $('#dv-loader').remove();
    }
    const loader = $('<div>').append(
        $('<table>').append(
            $('<tbody>').append(
                $('<tr>').append(
                    $('<td>').append(
                        $('<img>').attr('src', '/assets/intranet/images/ic-loader.svg').css('height', '32px')
                    )
                ).append(
                    $('<td>').append(
                        $('<p>').addClass('mb-0').text('Cargando datos. Por favor, espere...')
                    )
                )
            )
        )
    ).attr('id', 'dv-loader').hide();
    $('body').append(loader);
    $('#dv-loader').fadeIn(250);
}
OcultaIndicadorCarga = _ => {
    $('#dv-loader').fadeIn(250, _ => {
        $('#dv-loader').remove();
    });
}
IniciarComponentes = _ => {
    $('#sidebar-toggler').on('click', _ => {
        $('#sidenav').toggleClass('sidenav-show');
    });
    document.getElementById('sidenav-nombre').innerHTML = sesion.ncomercial;
    document.getElementById('sidenav-cargo').innerHTML = 'Analista de planillas';
    document.getElementById('nom-usuario').innerHTML = sesion.ncomercial;
    document.getElementById('img-profile').setAttribute('src', '/assets/intranet/pictures/profile-pics/' + sesion.codigo + '.jpg');
}

$(IniciarComponentes);