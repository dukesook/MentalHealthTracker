function darkmode() {
    const wasDarkmode = localStorage.getItem('darkmode') === 'true';
    localStorage.setItem('darkmode', !wasDarkmode);
    const element = document.body;
    element.classList.toggle('dark-mode', !wasDarkmode);
    const labels = document.querySelectorAll('label');
    labels.forEach(label=>{
        label.classList.toggle('dark-mode', !wasDarkmode);
    });
   
}

function onload() {
    document.body.classList.toggle('dark-mode', localStorage.getItem('darkmode') === 'true');
    const labels = document.querySelectorAll('label');
    labels.forEach(label=>{
        label.classList.toggle('dark-mode',localStorage.getItem('darkmode') === 'true');
    });
}