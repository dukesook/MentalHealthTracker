function darkmode() {
    const wasDarkmode = localStorage.getItem('darkmode') === 'true';
    localStorage.setItem('darkmode', !wasDarkmode);
    // The labels in the test section do not change like the rest of the
    // text does in darkmode, thus it must be done per label as below 
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