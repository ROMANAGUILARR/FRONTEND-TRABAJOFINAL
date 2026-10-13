export const MOCK_PUNTOS = 0

export const MOCK_INSIGNIAS = [
  { idInsignia: 1, nombre: 'Primer reporte', descripcion: 'Has registrado tu primera incidencia y comenzado a transformar tu comunidad.', requisitoIncidencias: 1, recompensa: 'Bono de S/20 en tu billetera digital.', desbloqueada: false },
  { idInsignia: 2, nombre: 'Reportero activo', descripcion: 'Has registrado 5 incidencias. Tu compromiso es notable.', requisitoIncidencias: 5, recompensa: 'Bono de S/50 + recarga de 10 GB moviles.', desbloqueada: false },
  { idInsignia: 3, nombre: 'Guardian del barrio', descripcion: 'Has registrado 10 incidencias. Eres un referente ambiental.', requisitoIncidencias: 10, recompensa: 'Vale de S/100 en canasta familiar.', desbloqueada: false },
  { idInsignia: 4, nombre: 'EcoHeroe', descripcion: 'Has registrado 15 incidencias. Tu dedicacion es inspiradora.', requisitoIncidencias: 15, recompensa: 'Vale de S/200 + kit ecologico.', desbloqueada: false },
  { idInsignia: 5, nombre: 'Embajador EcoSolido', descripcion: 'Has registrado 20 incidencias. Eres un embajador del cambio.', requisitoIncidencias: 20, recompensa: 'Vale de S/500 + kit + certificado.', desbloqueada: false },
]

export const MOCK_METRICAS = {
  total: 0,
  enProceso: 0,
  pendientes: 0,
  resueltos: 0,
}

export const MOCK_INCIDENCIAS = []

export const MOCK_RECOMENDACIONES = {
  'Organicos': [
    'Separa los residuos organicos (carcascaras, restos de comida, huesos) en un balde con tapa para evitar malos olores y plagas.',
    'Composta los residuos organicos de tu cocina: alterna capas de restos humedos con hojas secas. En 2-3 meses tendras abono natural.',
    'No mezcles residuos organicos con plasticos o vidrio, ya que contamina el material y dificulta su procesamiento.',
    'Usa las carcascaras de huevo y cafe como fertilizante directo para tus plantas, aporta calcio y nitrogeno.',
    'Si no puedes composter, deposita los organicos en el contenedor verde indicado por tu municipalidad.',
  ],
  'Inorganicos no aprovechables': [
    'Los panales, toallas higienicas y colillas de cigarro van en el contenedor gris, nunca en el de reciclaje.',
    'Las pilas y baterias contienen metales pesados toxicos. Llevalas a puntos de recoleccion especiales, no las tires a la basura comun.',
    'Los residuos sanitarios como guantes y mascarillas deben ir en una bolsa cerrada antes de depositarlos en el contenedor.',
    'Los medicamentos vencidos no se deben botar al desague. Llevalos a las farmacias que tienen programas de recoleccion.',
    'La ceramica rota y los espejos no se reciclan. Envueltolos en papel antes de desecharlos para evitar cortes al personal de limpieza.',
  ],
  'Inorganicos aprovechables': [
    'Lava los envases de plasticos y latas antes de depositarlos en el contenedor de reciclaje para evitar contaminacion cruzada.',
    'Aplasta las botellas y cajas de carton para que ocupen menos espacio en el contenedor y faciliten el transporte.',
    'El papel y carton limpios se reciclan, pero si estan mojados o con grasa van al contenedor de no aprovechables.',
    'El vidrio se puede reciclar infinitas veces sin perder calidad. Separa por colores si es posible (transparente, verde, ambar).',
    'Las bolsas plasticas se pueden llevar a supermercados que tienen puntos de recoleccion especificos para su reciclaje.',
  ],
}

export const MOCK_RECOMENDACIONES_GENERICAS = [
  'Separa siempre tus residuos antes de depositarlos en los contenedores correspondientes.',
  'Reduce el consumo de productos con empaques innecesarios.',
  'Reutiliza envases y bolsas siempre que sea posible antes de desecharlos.',
  'Consulta el calendario de recoleccion de tu municipalidad.',
  'Participa en las jornadas de limpieza comunitaria de tu barrio.',
]

export const MOCK_USUARIOS = [
  { idUsuario: 1, nombreCompleto: 'Itzair', apellidoCompleto: 'Roman', dni: '72844283', telefono: '987654321', correoElectronico: 'itzairplus@gmail.com', nombreUsuario: 'GASPER', puntos: 100, rol: 'CIUDADANO', fechaRegistro: '2026-02-10' },
  { idUsuario: 2, nombreCompleto: 'Carlos', apellidoCompleto: 'Rodriguez Perez', dni: '72345678', telefono: '987123456', correoElectronico: 'carlos.rodriguez@email.com', nombreUsuario: 'carlos_rp', puntos: 20, rol: 'CIUDADANO', fechaRegistro: '2026-04-20' },
  { idUsuario: 3, nombreCompleto: 'Ana', apellidoCompleto: 'Martinez Silva', dni: '73456789', telefono: '986543210', correoElectronico: 'ana.martinez@email.com', nombreUsuario: 'ana_ms', puntos: 50, rol: 'CIUDADANO', fechaRegistro: '2026-02-10' },
  { idUsuario: 4, nombreCompleto: 'Luis', apellidoCompleto: 'Fernandez Torres', dni: '74567890', telefono: '985432109', correoElectronico: 'luis.fernandez@email.com', nombreUsuario: 'luis_ft', puntos: 10, rol: 'CIUDADANO', fechaRegistro: '2026-06-05' },
  { idUsuario: 5, nombreCompleto: 'Sofia', apellidoCompleto: 'Lopez Ramirez', dni: '75678901', telefono: '984321098', correoElectronico: 'sofia.lopez@email.com', nombreUsuario: 'sofia_lr', puntos: 30, rol: 'CIUDADANO', fechaRegistro: '2026-05-12' },
  { idUsuario: 6, nombreCompleto: 'Pedro', apellidoCompleto: 'Sanchez Diaz', dni: '76789012', telefono: '983210987', correoElectronico: 'pedro.sanchez@email.com', nombreUsuario: 'pedro_sd', puntos: 0, rol: 'CIUDADANO', fechaRegistro: '2026-08-01' },
  { idUsuario: 7, nombreCompleto: 'Laura', apellidoCompleto: 'Gomez Herrera', dni: '77890123', telefono: '982109876', correoElectronico: 'laura.gomez@email.com', nombreUsuario: 'laura_gh', puntos: 10, rol: 'CIUDADANO', fechaRegistro: '2026-07-18' },
  { idUsuario: 8, nombreCompleto: 'Ernesto', apellidoCompleto: 'Gutierrez', dni: '45123456', telefono: '999888777', correoElectronico: 'admin@ecosolido.com', nombreUsuario: 'admin', puntos: 0, rol: 'ADMIN', fechaRegistro: '2026-01-01' },
]

export const MOCK_INCIDENCIAS_POR_USUARIO = {}