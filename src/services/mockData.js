export const MOCK_PUNTOS = 75

export const MOCK_INSIGNIAS = [
  { idInsignia: 1, nombre: 'Primer reporte', descripcion: 'Has registrado tu primera incidencia y comenzado a transformar tu comunidad.', requisitoIncidencias: 1, recompensa: 'Bono de S/20 en tu billetera digital.', desbloqueada: true },
  { idInsignia: 2, nombre: 'Reportero activo', descripcion: 'Has registrado 5 incidencias. Tu compromiso es notable.', requisitoIncidencias: 5, recompensa: 'Bono de S/50 + recarga de 10 GB moviles.', desbloqueada: true },
  { idInsignia: 3, nombre: 'Guardian del barrio', descripcion: 'Has registrado 10 incidencias. Eres un referente ambiental.', requisitoIncidencias: 10, recompensa: 'Vale de S/100 en canasta familiar.', desbloqueada: false },
  { idInsignia: 4, nombre: 'EcoHeroe', descripcion: 'Has registrado 15 incidencias. Tu dedicacion es inspiradora.', requisitoIncidencias: 15, recompensa: 'Vale de S/200 + kit ecologico.', desbloqueada: false },
  { idInsignia: 5, nombre: 'Embajador EcoSolido', descripcion: 'Has registrado 20 incidencias. Eres un embajador del cambio.', requisitoIncidencias: 20, recompensa: 'Vale de S/500 + kit + certificado.', desbloqueada: false },
]

export const MOCK_METRICAS = {
  total: 8,
  enProceso: 3,
  pendientes: 2,
  resueltos: 3,
}

export const MOCK_INCIDENCIAS = [
  { id: 1, categoria: 'Acumulacion de basura', descripcion: 'Acumulacion de residuos en la esquina de Av. Principal con Jr. Los Olivos', estado: 'RESUELTO', fecha: '2026-09-10', direccionTexto: 'Av. Principal 123' },
  { id: 2, categoria: 'Contaminacion del agua', descripcion: 'Vertido de aguas residuales en el canal del barrio San Martin', estado: 'EN_PROCESO', fecha: '2026-09-11', direccionTexto: 'Jr. San Martin 456' },
  { id: 3, categoria: 'Quema de residuos', descripcion: 'Quema ilegal de basura en terreno baldio cerca del colegio', estado: 'PENDIENTE', fecha: '2026-09-12', direccionTexto: 'Calle Los Cedros 789' },
  { id: 4, categoria: 'Arbol caido', descripcion: 'Arbol caido bloquea la vereda despues de temporal', estado: 'RESUELTO', fecha: '2026-09-12', direccionTexto: 'Av. Grau 321' },
  { id: 5, categoria: 'Derrame de petroleo', descripcion: 'Pequeno derrame de aceite en la pista principal', estado: 'EN_PROCESO', fecha: '2026-09-13', direccionTexto: 'Panamericana Sur km 15' },
  { id: 6, categoria: 'Falta de papelera', descripcion: 'No hay papeleras en el parque del barrio Las Flores', estado: 'PENDIENTE', fecha: '2026-09-13', direccionTexto: 'Parque Las Flores' },
  { id: 7, categoria: 'Acumulacion de basura', descripcion: 'Basura acumulada frente al mercado municipal', estado: 'RESUELTO', fecha: '2026-09-14', direccionTexto: 'Mercado Municipal' },
  { id: 8, categoria: 'Contaminacion del aire', descripcion: 'Humo negro proveniente de fabrica textil', estado: 'EN_PROCESO', fecha: '2026-09-14', direccionTexto: 'Zona Industrial' },
]

export const MOCK_RECOMENDACIONES = {
  'Orgánicos': [
    'Separa los residuos orgánicos (cáscaras, restos de comida, huesos) en un balde con tapa para evitar malos olores y plagas.',
    'Composta los residuos orgánicos de tu cocina: alterna capas de restos húmedos con hojas secas. En 2-3 meses tendrás abono natural.',
    'No mezcles residuos orgánicos con plásticos o vidrio, ya que contamina el material y dificulta su procesamiento.',
    'Usa las cáscaras de huevo y café como fertilizante directo para tus plantas, aportan calcio y nitrógeno.',
    'Si no puedes composter, deposita los orgánicos en el contenedor verde indicado por tu municipalidad.',
  ],
  'Inorgánicos no aprovechables': [
    'Los pañales, toallas higiénicas y colillas de cigarro van en el contenedor gris, nunca en el de reciclaje.',
    'Las pilas y baterías contienen metales pesados tóxicos. Llévalas a puntos de recolección especiales, no las tires a la basura común.',
    'Los residuos sanitarios como guantes y mascarillas deben ir en una bolsa cerrada antes de depositarlos en el contenedor.',
    'Los medicamentos vencidos no se deben botar al desagüe. Llévalos a las farmacias que tienen programas de recolección.',
    'La cerámica rota y los espejos no se reciclan. Envuélvelos en papel antes de desecharlos para evitar cortes al personal de limpieza.',
  ],
  'Inorgánicos aprovechables': [
    'Lava los envases de plástico y latas antes de depositarlos en el contenedor de reciclaje para evitar contaminación cruzada.',
    'Aplasta las botellas y cajas de cartón para que ocupen menos espacio en el contenedor y faciliten el transporte.',
    'El papel y cartón limpios se reciclan, pero si están mojados o con grasa van al contenedor de no aprovechables.',
    'El vidrio se puede reciclar infinitas veces sin perder calidad. Separa por colores si es posible (transparente, verde, ámbar).',
    'Las bolsas plásticas se pueden llevar a supermercados que tienen puntos de recolección específicos para su reciclaje.',
  ],
}

export const MOCK_RECOMENDACIONES_GENERICAS = [
  'Separa siempre tus residuos antes de depositarlos en los contenedores correspondientes.',
  'Reduce el consumo de productos con empaques innecesarios.',
  'Reutiliza envases y bolsas siempre que sea posible antes de desecharlos.',
  'Consulta el calendario de recolección de tu municipalidad.',
  'Participa en las jornadas de limpieza comunitaria de tu barrio.',
]

export const MOCK_USUARIOS = [
  { idUsuario: 1, nombreCompleto: 'Maria', apellidoCompleto: 'Garcia Lopez', dni: '71234567', telefono: '987654321', correoElectronico: 'maria.garcia@email.com', nombreUsuario: 'maria_gl', puntos: 150, rol: 'CIUDADANO' },
  { idUsuario: 2, nombreCompleto: 'Carlos', apellidoCompleto: 'Rodriguez Perez', dni: '72345678', telefono: '987123456', correoElectronico: 'carlos.rodriguez@email.com', nombreUsuario: 'carlos_rp', puntos: 85, rol: 'CIUDADANO' },
  { idUsuario: 3, nombreCompleto: 'Ana', apellidoCompleto: 'Martinez Silva', dni: '73456789', telefono: '986543210', correoElectronico: 'ana.martinez@email.com', nombreUsuario: 'ana_ms', puntos: 200, rol: 'CIUDADANO' },
  { idUsuario: 4, nombreCompleto: 'Luis', apellidoCompleto: 'Fernandez Torres', dni: '74567890', telefono: '985432109', correoElectronico: 'luis.fernandez@email.com', nombreUsuario: 'luis_ft', puntos: 30, rol: 'CIUDADANO' },
  { idUsuario: 5, nombreCompleto: 'Sofia', apellidoCompleto: 'Lopez Ramirez', dni: '75678901', telefono: '984321098', correoElectronico: 'sofia.lopez@email.com', nombreUsuario: 'sofia_lr', puntos: 120, rol: 'CIUDADANO' },
  { idUsuario: 6, nombreCompleto: 'Pedro', apellidoCompleto: 'Sanchez Diaz', dni: '76789012', telefono: '983210987', correoElectronico: 'pedro.sanchez@email.com', nombreUsuario: 'pedro_sd', puntos: 0, rol: 'CIUDADANO' },
  { idUsuario: 7, nombreCompleto: 'Laura', apellidoCompleto: 'Gomez Herrera', dni: '77890123', telefono: '982109876', correoElectronico: 'laura.gomez@email.com', nombreUsuario: 'laura_gh', puntos: 60, rol: 'CIUDADANO' },
  { idUsuario: 8, nombreCompleto: 'Admin', apellidoCompleto: 'EcoSolido', dni: '12345678', telefono: '999888777', correoElectronico: 'admin@ecosolido.com', nombreUsuario: 'admin', puntos: 0, rol: 'ADMIN' },
]

export const MOCK_INCIDENCIAS_POR_USUARIO = {
  1: [
    { id: 1, categoria: 'Acumulacion de basura', descripcion: 'Basura acumulada en la esquina de Av. Principal', estado: 'RESUELTO', fecha: '2026-09-10', direccionTexto: 'Av. Principal 123' },
    { id: 2, categoria: 'Contaminacion del agua', descripcion: 'Vertido de aguas residuales en el canal', estado: 'EN_PROCESO', fecha: '2026-09-12', direccionTexto: 'Jr. San Martin 456' },
    { id: 3, categoria: 'Quema de residuos', descripcion: 'Quema ilegal de basura en terreno baldio', estado: 'PENDIENTE', fecha: '2026-09-14', direccionTexto: 'Calle Los Cedros 789' },
  ],
  2: [
    { id: 4, categoria: 'Arbol caido', descripcion: 'Arbol bloquea la vereda despues del temporal', estado: 'RESUELTO', fecha: '2026-09-08', direccionTexto: 'Av. Grau 321' },
    { id: 5, categoria: 'Falta de papelera', descripcion: 'No hay papeleras en el parque del barrio', estado: 'PENDIENTE', fecha: '2026-09-11', direccionTexto: 'Parque Las Flores' },
  ],
  3: [
    { id: 6, categoria: 'Derrame de petroleo', descripcion: 'Derrame de aceite en la pista principal', estado: 'EN_PROCESO', fecha: '2026-09-07', direccionTexto: 'Panamericana Sur km 15' },
    { id: 7, categoria: 'Acumulacion de basura', descripcion: 'Basura frente al mercado municipal', estado: 'RESUELTO', fecha: '2026-09-09', direccionTexto: 'Mercado Municipal' },
    { id: 8, categoria: 'Contaminacion del aire', descripcion: 'Humo negro de fabrica textil', estado: 'EN_PROCESO', fecha: '2026-09-13', direccionTexto: 'Zona Industrial' },
    { id: 9, categoria: 'Quema de residuos', descripcion: 'Quema de hojas secas en via publica', estado: 'PENDIENTE', fecha: '2026-09-15', direccionTexto: 'Jr. Las Palmeras' },
  ],
  4: [
    { id: 10, categoria: 'Acumulacion de basura', descripcion: 'Residuos abandonados en terreno', estado: 'PENDIENTE', fecha: '2026-09-14', direccionTexto: 'Av. Argentina' },
  ],
  5: [
    { id: 11, categoria: 'Contaminacion del agua', descripcion: 'Agua turbia en acequia del barrio', estado: 'EN_PROCESO', fecha: '2026-09-10', direccionTexto: 'Jr. Los Pinos' },
    { id: 12, categoria: 'Arbol caido', descripcion: 'Arbol caido sobre vehiculo estacionado', estado: 'RESUELTO', fecha: '2026-09-12', direccionTexto: 'Calle Los Olivos' },
  ],
  6: [],
  7: [
    { id: 13, categoria: 'Falta de papelera', descripcion: 'Sin papeleras en cuadra completa', estado: 'PENDIENTE', fecha: '2026-09-13', direccionTexto: 'Jr. Bolivar' },
  ],
}
