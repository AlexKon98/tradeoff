const scene = document.getElementById('scene');
const parallaxInstance = new Parallax(scene);

window.onload = function () {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');
    setTimeout(async function () {
        const shows = document.querySelectorAll('.show-on-load');
        for (let index = 0; index < shows.length; index++) {
            const delay = index * 1;
            shows[index].style.cssText += `transition-delay:${delay}ms;`
            shows[index].classList.add('active');
        }
    }, 500);


    const particles = new Particles();

    window.addEventListener('resize', function () {
        particles.resize();
    });
};