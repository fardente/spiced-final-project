import { useState } from "react";

export default function useActive() {
    const [active, setActive] = useState(false);

    function onClickActive() {
        setActive(!active);
        console.log("clicked active");
    }

    return [active ? "is-active" : "", onClickActive];
}
