// Wszystkie wartości bezpieczne do edycji znajdują się w tym pliku config.js
// Proszę o zostawienie innych plików samym sobie, edytując je można coś uszkodzić.
//
// UWAGA! Wszystkie podane w tym pliku zmienne należy poprawnie uzupełnić, w innym
// wypadku grozi to wystąpieniem pewnych błędów. Szczególną ostrożność należy zachować
// przy podawaniu tokenu od bota oraz ID wszystkich wymaganych roli.



// Podaj prefix dla wykonywanych komend
exports.prefix = '?';

// Podaj ID wybranej prez siebie rangi. Wszyscy użytkownicy z tą rolą będą mogli np. zbanować użytkownika albo kogoś uciszyć
exports.modRole = '';

// Podaj ID rangi która ma być przyznawana osobie wyciszonej (pokaranej komendą mute)
// Ranga ta powinna być skonfigurowana tak, aby blokowała możliwość pisania na czacie
// i mówienia na kanale głosowym. Możesz również dodać swoje dodatkowe ograniczenia, jednak
// podane 2 powinny się tu znaleźć, reszta zależy od Ciebie.
exports.muteRole = '';

// Podaj ID właściciela, właściciel jest automatycznie zaliczany jako moderator, więc obojętnie od rangi i tak dostanie uprawnienia do np. wyrzucenia kogoś z serwera
exports.ownerID = '';

// Podaj TOKEN dla bota, jest to takie pseudo-hasło jakim logują się boty na serwery Discord. UWAGA! Nigdy nie udostępniaj nikomu tego kodu!
exports.botToken = '';

// Podaj ID aplikacji bota, jest to pseudo-login, coś jak TAG dla użytkownika. Ten element jest akurat bezpieczny i można go komuś wysłać.
exports.botClientID = '';

// Podaj ID kanału na którym mają być rejestrowane elementy zdarzeń. Rejestrowane jest kiedy:
//
// Ktoś skorzysta z komendy 'ban', 'kick', 'purge', 'mute', 'unban' lub 'unmute'
//
// Wpisz 'FALSE' w miejsce ID na modLogChannel aby wyłączyć funkcje rejestrowania zdarzeń.
// PS: Polecam ustawić kanał od tego jako publiczny, aby inni użytkownicy wiedzieli kto
// został np. zbanowany oraz aby wiedzeń że administracja nie śpi
exports.modLogChannel = 'FALSE';

// Podaj ID kanału na którym mają być rejestrowane elementy zdarzeń. Rejestrowane jest kiedy:
//
// Ktoś dołączy lub wyjdzie z serwera
//
// Wpisz 'FALSE' w miejsce ID na gatewayChannel aby wyłączyć funkcje rejestrowania zdarzeń.
// PS: Polecam ustawić kanał od tego jako publiczny.
exports.gatewayChannel = `FALSE`;
