$('input[id="menu-toggle"]').on('change',function(e) {
    if ($(this).prop('checked')) {
        $('body').css('overflow', 'hidden');
    } else {
        $('body').css('overflow', 'auto');
    };
});

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

const setLanguage = (language) => {
    const selectedLanguage = language === 'en' ? 'en' : 'nl';
    document.body.classList.toggle('lang-nl', selectedLanguage === 'nl');
    document.body.classList.toggle('lang-en', selectedLanguage === 'en');
    document.documentElement.setAttribute('lang', selectedLanguage);
    document.querySelectorAll('[data-lang-choice]').forEach((button) => {
        button.setAttribute('aria-pressed', button.dataset.langChoice === selectedLanguage ? 'true' : 'false');
    });
    try {
        window.localStorage.setItem('preferred-language', selectedLanguage);
    } catch (error) {
        // The switch still works when storage is unavailable.
    }
};

let preferredLanguage = 'nl';
try {
    preferredLanguage = window.localStorage.getItem('preferred-language') || 'nl';
} catch (error) {
    preferredLanguage = 'nl';
}
setLanguage(preferredLanguage);

document.querySelectorAll('[data-lang-choice]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.langChoice));
});
