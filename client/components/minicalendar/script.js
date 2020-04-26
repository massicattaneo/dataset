import style from './style.css';
import template from './template.html';
import { connect, create } from '../../../modules/reactive/Reactive';
import { addCssClass, hasCssClass, removeCssClass } from '../../../modules/html/html';

const mixin = (element, { store }) => {
    const weekdayFormatter = new Intl.DateTimeFormat(store.language.get(), { weekday: 'short' });
    const monthFormatter = new Intl.DateTimeFormat(store.language.get(), { month: 'long', year: 'numeric' });
    const month = element.querySelector('.month');
    const headerDays = element.querySelectorAll('table .header-day');
    const days = element.querySelectorAll('table .day');
    const cmpStore = create({
        selected: Date.now()
    });

    const disconnect = connect({
        today: store.timestamp,
        selected: cmpStore.selected
    }, ({ today, selected }) => {
        const todayDate = new Date(today);
        const selectedDate = new Date(selected);
        const firstDayOfMonth = new Date(new Date().setDate(1));
        const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        month.innerText = monthFormatter.format(selectedDate);
        headerDays.forEach((child, index) => {
            child.innerText = weekdayFormatter.format((86400000 * (4 + index)));
        });
        days.forEach((child, index) => {
            const date = index + 2 - firstDayOfMonth.getDay();
            child.style.display = 'table-cell';
            removeCssClass(child, 'today');
            if (todayDate.getDate() === date
                && todayDate.getMonth() === selectedDate.getMonth()
                && todayDate.getFullYear() === selectedDate.getFullYear()
            ) {
                addCssClass(child, 'today');
            }
            if (date > 0 && date <= lastDayOfMonth.getDate()) {
                child.innerText = date;
            } else if (date > lastDayOfMonth.getDate()) {
                child.style.display = 'none';
            }
        });
    });

    element.addEventListener('click', event => {
        if (hasCssClass(event.target, 'prev-month')) {
            const date = new Date(cmpStore.selected.get());
            date.setMonth(date.getMonth() - 1);
            cmpStore.selected.set(date.getTime());
        }
        if (hasCssClass(event.target, 'next-month')) {
            const date = new Date(cmpStore.selected.get());
            date.setMonth(date.getMonth() + 1);
            cmpStore.selected.set(date.getTime());
        }
    });

    return () => {
        disconnect();
    };
};

const exports = { tagName: 'iminicalendar', selector: `.${style.local}`, mixin, template };
export default exports;
