Feature: Control de errores con tipificacion coordinadora, cueros velez o ups
#? 1 - Errores controlados con tipificacion UPS

  @ErroresControlados
  Scenario Outline: Errores controlados con tipificacion UPS
    Given que se entrego una guia con referencia y se quiere verificar un error controlado <error> <usuario> <contrasena>
    When se realiza la consulta de la guia con referencia <referencia> <valor>
    Then se debe mostrar el error controlado <res> <status>

    Examples:
      | error                                        | usuario          | contrasena | referencia     | valor | res                                                                                      | status |
      | "DIVI 03-POBLACION NO tiene autorizado  RCE" | "cvecommerce.ws" | "Kli3$89h" | "poblacion_no" | 900   | "Población no valida para recaudo contra entrega"                                        | 400    |
      | "DIVI 01-Sin acuerdo de RCE"                 | "cvecommerce.ws" | "Kli3$89h" | "Diego_01"     | 900   | "El servicio complementario Recaudo Contra Entrega no está activo para el NIT 800191700" | 400    |
