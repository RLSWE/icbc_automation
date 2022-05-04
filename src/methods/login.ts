import axios from 'axios';
import { defaultHeaders } from '../common/default_headers';

const loginUrl =
  'https://onlinebusiness.icbc.com/deas-api/v1/webLogin/webLogin';

const loginPayload = {
  drvrLastName: process.env.LAST_NAME,
  licenceNumber: process.env.LICENSE_NUMBER,
  keyword: process.env.KEYWORD,
};

export async function login(): Promise<any> {
  try {
    const { data, headers } = await axios.put(loginUrl, loginPayload, {
      headers: defaultHeaders,
    });

    return { data, headers };
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
