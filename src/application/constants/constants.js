const getWeek = (date = new Date()) => {
  const dayIndex = date.getDay();
  const diffToLastMonday = dayIndex !== 0 ? dayIndex - 1 : 6;
  const dateOfStart = new Date(date.setDate(date.getDate() - diffToLastMonday));
  const dateOfEnd = new Date(date.setDate(dateOfStart.getDate() + 6));
  return [dateOfStart, dateOfEnd];
};

const getMonth = (date = new Date()) => {
  const dateOfStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const dateOfEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return [dateOfStart, dateOfEnd];
};

const getListDate = (date = new Date()) => {
  const dateOfStart = date.getDate() - 1;
  const dateOfCenter = date.getDate();
  const dateOfEnd = date.getDate() + 1;
  return [dateOfStart, dateOfCenter, dateOfEnd];
};

const getToday = (newDate = new Date()) => {
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  const dateOfStart = `${year}-${
    month < 10 ? `0${month}` : `${month}`
  }-${date}`;
  const dateOfEnd = `${year}-${month < 10 ? `0${month}` : `${month}`}-${date}`;

  return [dateOfStart, dateOfEnd];
};

const getDateVal = (newDate = new Date()) => {
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  const dateOf = `${year}-${month < 10 ? `0${month}` : `${month}`}-${date}`;

  return [dateOf];
};

const getCurrentTime = (newDate = new Date()) => {
  let hours = (newDate.getHours() < 10 ? "0" : "") + newDate.getHours();
  let minutes = (newDate.getMinutes() < 10 ? "0" : "") + newDate.getMinutes();
  return hours + ":" + minutes;
};

const screens = {
  dashboard: "Inicio",
  profile: "Perfil",
};

const screensTraslado = {
  diario: "Diario",
  semanal: "Semanal",
  mensual: "Mensual",
};

const bottom_tabs = [
  {
    id: 0,
    label: screens.dashboard,
    icon: require("../../../assets/icons/home.png"),
  },
  {
    id: 1,
    label: screens.profile,
    icon: require("../../../assets/icons/profile.png"),
  },
];

const tabsTraslados = [
  {
    id: 0,
    label: screensTraslado.diario,
  },
  {
    id: 1,
    label: screensTraslado.semanal,
  },
  {
    id: 2,
    label: screensTraslado.mensual,
  },
];
const menu_buttons = [
  {
    id: 0,
    name: "Herramientas",
    subname: "Traslado",
    message: "2022-05-29 09:00:58",
    thumbnail: require("../../../assets/icons/tools.png"),
  },
  {
    id: 1,
    name: "Alcoholimetria",
    subname: "Toma de muestras",
    message: "2022-05-29 09:00:58",
    thumbnail: require("../../../assets/icons/health.png"),
  },
  {
    id: 2,
    name: "Ingresos",
    subname: "Registro de ingresos",
    message: "2022-05-29 09:00:58",
    thumbnail: require("../../../assets/icons/access.png"),
  },
];
const created_within = [
  {
    id: 0,
    label: "Hoy",
  },
  {
    id: 1,
    label: "Esta Semana",
  },
  {
    id: 2,
    label: "Este Mes",
  },
];

export default {
  screens,
  bottom_tabs,
  created_within,
  getWeek,
  getMonth,
  getToday,
  menu_buttons,
  getDateVal,
  getCurrentTime,
  getListDate,
  tabsTraslados,
  screensTraslado,
};
