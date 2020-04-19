import { API } from '../../../constants';
import { fetchGet } from '../../fetch-utils';

export default function () {
    return fetchGet(API.LOGIN_STATUS)
}
