import { API } from '../../../core/constants';
import { fetchGet } from '../../utils';

export default function () {
    return fetchGet(API.LOGIN_STATUS)
}