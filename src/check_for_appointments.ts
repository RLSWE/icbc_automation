import { login } from './methods/login';
import { getNearbyIcbcs } from './methods/get_nearby_icbcs';
import { getAvailableAppointments } from './methods/get_available_appointments';
import { numDaysBetween } from './utils/number_of_days_between';
import { CourierClient } from '@trycourier/courier';

process.env.TZ = 'America/Vancouver';
const email = process.env.EMAIL;
const threshold = 30; // Days

export async function checkForAppointments(): Promise<void> {
  const { headers } = await login();
  const token = headers['authorization'];

  const nearbyIcbcs: Record<string, any>[] = await getNearbyIcbcs(token);

  const icbcsPosIdsToName = nearbyIcbcs.reduce(function (obj, icbcObject) {
    obj[
      icbcObject['pos']['posId']
    ] = `${icbcObject['pos']['agency']}, ${icbcObject['pos']['address']}`;
    return obj;
  }, {});

  console.log(
    `${
      Object.keys(icbcsPosIdsToName).length
    } Nearby ICBCs found: ${JSON.stringify(icbcsPosIdsToName)}`,
  );

  const icbcsPosIds = nearbyIcbcs.map((icbcObject: Record<string, any>) => {
    return icbcObject['pos']['posId'];
  });

  var availableAppointmentsByPos: Record<number, Record<string, any>[]> = {};

  for (const posId of icbcsPosIds) {
    console.log(`Retrieving available appointments for POS id: ${posId}...`);
    const availableAppointments: Record<string, any>[] =
      await getAvailableAppointments(token, posId);
    console.log(
      `Found ${availableAppointments.length} available appointments for POS id: ${posId}`,
    );
    availableAppointmentsByPos[posId] = availableAppointments;
  }

  var allAppointments: Record<string, any>[] = [];
  for (const key in availableAppointmentsByPos) {
    const appointmentsForPos = availableAppointmentsByPos[key];
    const mapped = appointmentsForPos.map((appointment) => {
      return { posID: key, ...appointment };
    });
    allAppointments.push(...mapped);
  }

  const appointmentsInThreshold = allAppointments.filter((appointment) => {
    const appointmentDate = new Date(appointment['appointmentDt']['date']);
    const now = new Date();
    const daysBetween = numDaysBetween(now, appointmentDate);
    return daysBetween < threshold;
  });

  if (appointmentsInThreshold.length == 0) {
    // Find earliest
    const earliestAppointment = allAppointments.reduce((a, b) => {
      const aDate = new Date(a['appointmentDt']['date']);
      const bDate = new Date(b['appointmentDt']['date']);
      return aDate < bDate ? a : b;
    });
    const earliestAppointmentDate = new Date(
      earliestAppointment['appointmentDt']['date'],
    );
    const now = new Date();
    const earliestAppointmentDaysFromNow = numDaysBetween(
      now,
      earliestAppointmentDate,
    );
    console.log(
      `Could not find appointments in the threshold of ${threshold} days. Earliest found is in ${earliestAppointmentDaysFromNow} days on the ${earliestAppointmentDate}`,
    );
  } else {
    console.log(`🎊 Found ${appointmentsInThreshold.length} appointments 🎊:`);
    const appointmentsMessages = appointmentsInThreshold.map((appointment) => {
      const place = icbcsPosIdsToName[appointment['posID']];
      const date = appointment['appointmentDt']['date'];
      const day = appointment['appointmentDt']['dayOfWeek'];
      const time = appointment['startTm'];
      return `${place} | ${date}, ${day}, ${time}`;
    });

    appointmentsMessages.forEach((message) => console.log(message));
    console.log(appointmentsMessages);

    const availableAppointmentsContent = appointmentsMessages.join('\r\n\n');

    const courier = CourierClient({
      authorizationToken: 'pk_prod_59RBEYH59F4Y1CM9FHS5Z1VVVNYJ',
    });

    const { requestId } = await courier.send({
      message: {
        to: {
          email,
        },
        template: '0CXYDEANWQ4S2END57GRFQBR08N8',
        data: {
          appointments_count: appointmentsInThreshold.length,
          threshold,
          available_appointments: availableAppointmentsContent,
        },
      },
    });
    console.log(`Successfully sent email to ${email}: ${requestId}`);
  }
}
