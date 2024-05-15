Feature: TC100_TC103_TC104_TC107_TC108 Errores Controlado Tipificacion coordinadora codigo remision
  Como usuario del sistema de gestión dinámica de envíos,
  Quiero contar con escenarios automatizados
  Para verificar la funcionalidad de modificación, inserción y anulación del recaudo de una guía antes y después de su recogida.
    #? *************************************************************************Scenario 1***********************************************************

  @CodigoRemision
  Scenario Outline: "GUIA ENTREGADA" Tipificacion coordinadora (codigo remision)
    Given que se Entregó una guía y se quiere generar el cambio de valor en el siguiente servicio <CP> <Usuario> <Contrasena>
    When envío el proceso con la autenticación <CodigoRemision>
    Then el sistema debe generar el siguiente mensaje y la siguiente respuesta <respuestaDelServicio> <StatusCode>

    Examples:
      | CP                         | Usuario         | Contrasena   | CodigoRemision | respuestaDelServicio                                           | StatusCode |
      | "Tc100 Mensaje Controlado" | "pruebas.admin" | "Admin26200" | "73940833471"  | "Guia entregada, no se puede modificar"                        |        400 |
      | "Tc100 Caracteres Vacios"  | "pruebas.admin" | "Admin26200" | ""             | "Verificar datos de entrada, los enviados no corresponden"     |        400 |
      | "Tc100 Simbolos"           | "pruebas.admin" | "Admin26200" | "&%$#"         | "Verificar datos de entrada, los enviados no corresponden"     |        400 |
      | "TC103 Mensaje Controlado" | "pruebas.admin" | "Admin26200" | "73940714264"  | "No se puede realizar el cambio, la guia ya ha sido recaudada" |        400 |
      | "TC104 Mensaje Controlado" | "pruebas.admin" | "Admin26200" | "73940714264"  | "No se puede realizar el cambio, la guia ya ha sido recaudada" |        400 |
      | "TC107 Mensaje Controlado" | "venndelo.ws"   | "Vju6590!g"  | "56810419621"  | "Guia devuelta, no se puede modificar"                         |        400 |
      | "TC108 Caracteres Vacios"  | "pruebas.admin" | "Admin26200" | ""             | "Verificar datos de entrada, los enviados no corresponden"     |        400 |
      | "TC108 Simbolos"           | "pruebas.admin" | "Admin26200" | "&%$#$%"       | "Verificar datos de entrada, los enviados no corresponden"     |        400 |
      # | "Tc100 Mensaje Controlado" | "pruebas.admin" | "Admin26200" | "73940732805"  | "El nivel de servicio enviado en la guía, no puede ser usado con recaudo contra entrega" |        400 |
    # | "TC108 Mensaje Controlado" | "pruebas.admin"  | "Admin26200" | "56810419739" | "Estamos procesando su solicitud, por favor intente en 5 minutos Y UNA VEZ PASEN LOS 5 MINUTOS VOLVER A ENVIAR LA PETICION PARA QUE SE GENERE EL CAMBIO" | 400 |
    #? *************************************************************************Scenario 2***********************************************************

  @tipificacionUps
  Scenario Outline: "GUIA ENTREGADA" Tipificación UPS (referencia/referencia detalle)
    Given que se Entrego una guía y se requiere generar las validaciones correspondientes a tipificacion Ups <CP2> <Usuario2> <Contrasena2>
    When realizo la peticion al servicio <Referencia> <ReferenciaDetalle>
    Then el sistema debe retornar la siguiente respuesta <respuestaDelServicio2> <StatusCode2>

    Examples:
      | CP2                        | Usuario2   | Contrasena2 | Referencia    | ReferenciaDetalle      | respuestaDelServicio2                   | StatusCode2 |
      | "TC101 Mensaje Controlado" | "upsse.ws" | "Us67!hy"   | "X1101XTTBDB" | ["1ZX1101X0494946076"] | "Guia entregada, no se puede modificar" |         400 |
    #? *************************************************************************Scenario 3***********************************************************

  @tipificacionCuerosVelez
  Scenario Outline: GUIA ENTREGADA , GUIA CON RECAUDO ANTICIPADO, Tipificación CUEROS VELEZ (referencia)
    Given que se Entrego una guía y se requiere generar las validaciones correspondientes a tipificacion Cueros Velez <CP3> <Usuario3> <Contrasena3>
    When realize la correcta peticion al servicio <Referencia1>
    Then el sistema debe retornarme las siguientes respuestas <respuestaDelServicio3> <StatusCode3>

    Examples:
      | CP3                                 | Usuario3         | Contrasena3 | Referencia1 | respuestaDelServicio3                                          | StatusCode3 |
      | "TC102 Mensaje Controlado"          | "cvecommerce.ws" | "Kli3$89h"  | "78784578"  | "Guia entregada, no se puede modificar"                        |         400 |
      | "TC105 GUIA CON RECAUDO ANTICIPADO" | "cvecommerce.ws" | "Kli3$89h"  | "CAC456"    | "No se puede realizar el cambio, la guia ya ha sido recaudada" |         400 |
    #  | "TC106 GUIA CON RECAUDO" | "cvecommerce.ws" | "Kli3$89h" | "71273038" | "No se puede realizar el cambio, la guia ya ha sido recaudada" | 400  |
