function darkmode() {
    const wasDarkmode = localStorage.getItem('darkmode') === 'true';
    localStorage.setItem('darkmode', !wasDarkmode);

    const isDark = !wasDarkmode;
    document.body.classList.toggle('dark-mode', isDark);
    document.querySelectorAll('label').forEach(label => {
        label.classList.toggle('dark-mode', isDark);
    });

    const icon = document.getElementById('mode-icon');
    icon.textContent = isDark ? '☀️' : '🌙';
}

function onload() {
    const isDark = localStorage.getItem('darkmode') === 'true';
    document.body.classList.toggle('dark-mode', isDark);
    document.querySelectorAll('label').forEach(label => {
        label.classList.toggle('dark-mode', isDark);
    });

    const icon = document.getElementById('mode-icon');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
}