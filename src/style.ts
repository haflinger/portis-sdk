export const css = `
.wrapper {
    display: none;
    position: fixed;
    top: 10px;
    right: 20px;
    height: 525px;
    width: 390px;
    border-radius: 8px;
    z-index: 2147483647;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 5px 40px;
    animation: portis-entrance 250ms ease-in-out forwards;
    opacity: 0;
}

.iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 8px;
}

.mobile-wrapper {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 2147483647;
}

.mobile-iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: none;
}

@keyframes portis-entrance {
    100% { opacity: 1; top: 20px; }
}
`
