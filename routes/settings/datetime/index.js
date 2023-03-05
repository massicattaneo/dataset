import { initClock } from "../../../modules/canvas-clock";
import { connect } from "../../../modules/reactive/Reactive";

export default async function () {
    const { frame } = this;
    const { store } = this.sharedContext;
    initClock(frame.querySelector("canvas"));
    const disconnect = connect(
        {
            language: store.language,
            timestamp: store.timestamp,
        },
        ({ language, timestamp }) => {
            frame.querySelector(".date").innerText = new Intl.DateTimeFormat(
                language.get(),
                {
                    weekday: "long",
                    year: "numeric",
                    day: "numeric",
                    month: "long",
                }
            ).format(timestamp.get());
        }
    );
    return () => {
        disconnect();
    };
}
