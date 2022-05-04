require('dotenv').config();
import { checkForAppointments } from './check_for_appointments';

var minutes = 20,
  the_interval = minutes * 60 * 1000;

setInterval(async function () {
  await checkForAppointments();
}, the_interval);
