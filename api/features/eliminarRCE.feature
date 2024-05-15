Feature: HU39455 Crear los diferentes escenarios para automatizar las pruebas

  @Eliminacion
  Scenario Outline: Casos de prueba Eliminación RCE Guias recogidas por Coordinadora
    Given Eliminar que soy un usuario de GDE tipificado con codigo_remision <cp> <usuario> <contrasena>
    When Eliminar en la api cambio de valor de GDE, envio una guia con nivel de servicio veintidos estado diferente a recibir por coordinadora, antes de autorizar a carga de trabajo, con el campo valor igual a cero <codigo_remision> <valor> <automatizada>
    Then Eliminar se realiza el respectivo proceso de agregarle el anulado a la guia en la tabla recaudos quedando el campo anulado v true y el registro de la guia permanece intacto a excepcion de ese campo anulado que se modifica, se cambia el nivel de servicio a 1 en la tabla remesas_niveles_servicio campo nivel_servicio y se modifica la guia en la tabla generacion_rotulos cambiando el campo codigo_nivel_servicio por 1, el campo nivel_servicio por vacio y el campo recaudo por 0, estas 3 tablas pertenecientes a la base de datos CM Testing ciento veinte a su vez se inserta la guia en la coleccion llamada cambios_valor_agw del proyecto cm_guias_test de firestore con el campo llamado estado igual a pendiente y cuando el reloj marque un minuto terminado en cero o en cinco se correra una tarea que realizara la eliminacion del registro de la guia en la tabla agw_recaudos se modifica el nivel de servicio en la tabla agw_remisiones_niveles_servicio dejando el nivel de servicio 1 en el campo nivel_servicio estas 2 tablas pertenecientes a la base de datos de sandbox_agw reflejando por ultimo una respuesta de con el estado Recaudo eliminado el valorAnterior del RCE y el Valor Nuevo Si el cliente esta tipificado codigo_remision devuelve el campo codigoRemision con el numero de guia y los campos referencia y referenciaDetalle vacios si el cliente es tipificado referencia devuelve el campo codigoRemision con el numero de guia el campo referencia con la referencia de la guia la cual se envia en el body de la api y el campo referenciaDetalle vacio si el cliente es tipificado referencia y referenciaDetalle devuelve el campo codigoRemision con el numero de guia el campo referencia con la referencia que se envia en el body de la api y el campo referenciaDetalle con la referenciaDetalle que se envia en el body de la api <mensaje> <status>

    Examples:
      | cp                                                                                               | usuario         | contrasena   | codigo_remision | valor | mensaje             | status | automatizada |
      | "TC1. Verificar que se elimine el RCE a una guia con nivel de servicio 22 - Antes de autorizar"  | "pruebas.admin" | "Admin26200" | "73940727232"   |     0 | "Recaudo eliminado" |    200 |            0 |
      | "TC2. Verificar que se elimine el RCE a una guia con nivel de servicio 105 - Antes de autorizar" | "pruebas.admin" | "Admin26200" | "73940700596"   |     0 | "Recaudo eliminado" |    200 |            0 |
      | "TC3. Verificar que se elimine el RCE a una guia con nivel de servicio 106 - Antes de autorizar" | "pruebas.admin" | "Admin26200" | "73940722634"   |     0 | "Recaudo eliminado" |    200 |            0 |
      | "TC4. Verificar que se elimine el RCE a una guia con nivel de servicio 22 - Autorizada"          | "pruebas.admin" | "Admin26200" | "73940727225"   |     0 | "Recaudo eliminado" |    200 |            1 |
      | "TC5. Verificar que se elimine el RCE a una guia con nivel de servicio 105 - Autorizada"         | "pruebas.admin" | "Admin26200" | "73940722581"   |     0 | "Recaudo eliminado" |    200 |            1 |
      | "TC6. Verificar que se elimine el RCE a una guia con nivel de servicio 106 - Autorizada"         | "pruebas.admin" | "Admin26200" | "73940722636"   |     0 | "Recaudo eliminado" |    200 |            1 |
