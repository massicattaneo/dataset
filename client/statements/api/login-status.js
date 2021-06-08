import { API } from '../../../constants';
import { sendRequest } from '../../fetch-utils';

export default function (url, headers) {
    return sendRequest('GET', url, '', headers);
}
