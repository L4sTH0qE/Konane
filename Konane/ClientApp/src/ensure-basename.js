const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');

if (!window.location.pathname.includes(baseUrl)) {
    window.history.replaceState(
        '',
        '',
        baseUrl + window.location.pathname
    );
}