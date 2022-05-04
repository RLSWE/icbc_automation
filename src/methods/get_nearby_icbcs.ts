import axios from 'axios';
import { defaultHeaders } from '../common/default_headers';

const getNearbyIcbcsUrl =
  'https://onlinebusiness.icbc.com/deas-api/v1/web/getNearestPos';
const getNearbyIcbcsPayload = {
  // Default coords used by the web client when selecting Vancouver
  lat: 49.2608333,
  lng: -123.1138889,
  startDate: new Date().toLocaleDateString('en-CA'),
  examType: '5-R-1',
};

export async function getNearbyIcbcs(token: string): Promise<any> {
  try {
    const { data } = await axios.put(getNearbyIcbcsUrl, getNearbyIcbcsPayload, {
      headers: { ...defaultHeaders, authorization: token },
    });

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
