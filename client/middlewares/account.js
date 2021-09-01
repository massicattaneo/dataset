import { connect, create } from '../../modules/reactive/Reactive';

export const updateMenuItems = (store, home) => {
    connect(({ logged: store.user.logged }), ({ logged }) => {
        home.querySelector('.menu a:nth-child(1)').style.display = logged.get() ? 'none' : 'inline-block';
        home.querySelector('.menu a:nth-child(2)').style.display = logged.get() ? 'inline-block' : 'none';
    });
}
