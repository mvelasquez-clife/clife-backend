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