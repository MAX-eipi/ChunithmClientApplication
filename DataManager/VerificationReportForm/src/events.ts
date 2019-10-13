import { notifyUnverified } from "./operations";

function onNotifyUnverified() {
    let now = new Date();
    let hours = now.getHours();
    if (hours == 9 || hours == 17) {
        notifyUnverified();
    }
}