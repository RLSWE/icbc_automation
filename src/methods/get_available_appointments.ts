import axios from 'axios';
import { defaultHeaders } from '../common/default_headers';

const getAvailableAppointmentsUrl =
  'https://onlinebusiness.icbc.com/deas-api/v1/web/getAvailableAppointments';

function getTomorrow(): Date {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

const getAvailableAppointmentsDefaultPayload = {
  aPosID: 275,
  examType: '5-R-1',
  examDate: getTomorrow().toLocaleDateString('en-CA'),
  ignoreReserveTime: false,
  prfDaysOfWeek: '[0,1,2,3,4,5,6]',
  prfPartsOfDay: '[0,1]', //Morning, evening
  lastName: process.env.LAST_NAME,
  licenseNumber: process.env.LICENSE_NUMBER,
};

export async function getAvailableAppointments(
  token: string,
  aPosID: number,
): Promise<any> {
  try {
    const { data } = await axios.post(
      getAvailableAppointmentsUrl,
      { ...getAvailableAppointmentsDefaultPayload, aPosID },
      {
        headers: { ...defaultHeaders, authorization: token },
      },
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error object: ', JSON.stringify(error));
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}
