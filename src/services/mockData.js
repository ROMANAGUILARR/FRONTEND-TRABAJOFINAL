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

export const MOCK_RECOMENDACIONES = [
  'Separa los residuos organicos de los inorganicos antes de desecharlos. Usa bolsas de color verde para organicos y negras para el resto.',
  'Lava los envases de plastico antes de depositarlos en el contenedor de reciclaje para evitar contaminacion cruzada.',
  'Reduce el uso de plasticos de un solo uso llevando tu propia bolsa reutilizable al mercado.',
  'Composta los residuos organicos de tu cocina para abonar plantas y huertos caseros.',
  'Consulta el calendario de recoleccion de tu municipalidad para saber que dia se retira cada tipo de residuo.',
  'Participa en las jornadas de limpieza comunitaria organizadas por tu junta vecinal.',
]
