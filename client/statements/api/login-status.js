import { API } from '../../../constants';
import { fetchGetJSON } from '../../fetch-utils';

export default function () {
    return fetchGetJSON(API.ACCOUNT.STATUS)
}
