module.exports = {
    credenciales: {
        user: "bi_sistemas@corporacionlife.com.pe", // generated ethereal user
        pass: "dmz196a8n6" // generated ethereal password
    },
    smtp: {
        port: 465,
        host: "mail.corporacionlife.com.pe",
        secure: true
    },
    message: {
        from: 'ClifeCloud - Recupera tu contraseña 👻 <bi_sistemas@corporacionlife.com.pe>',
        subject: 'Envio enlace de recuperación',
        text: '',
        html: '<!DOCTYPE html><html><head>	<title></title></head><body>	<table style="width:100 % ; border - collapse:collapse; border - width:0; font - family:Verdana; ">		<thead></thead>		<tbody>			<tr>				<td rowspan="2" style="vertical - align:bottom; background - color:#4caf50; " width="25 % "><img src="http://webpedidos.corporacionlife.com.pe/reporter/images/clife-logo-light.png" style="margin:16px;width:75%;"></td> < td width = "75%" style = "height:240px;padding:8px 16px;vertical-align:top;" > <h3>Planillas de cobranza</h3> < p style = "margin:0 0 10px;padding:0;" > A continuación, se adjunta un informe de planillas cuyo depósito aún no ha sido realizado.Tome en cuenta que el plazo para realizar dichos depósitos ya se ha vencido.</p><p style="margin:0 0 10px;padding:0;">Buen día < /p>				</td > </tr>			<tr> < td style = "background-color:#e8e8e8;padding:8px 16px;" ><p style="margin:0;padding:5px;text-align:right;">&copy; 2018 Corporación Life.<br>Por favor, no respondas este correo.</p></td> < /tr>		</tbody > </table></body></html>'
    }
};