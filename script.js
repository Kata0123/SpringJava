(function () {
    var header = document.getElementById('header');
    if (!header) {
        console.warn('Header не найден: проверь id="header" в HTML');
        return;
    }

    var lastScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    var ticking = false;
    var HIDE_AFTER = 80;

    function updateHeader() {
        var currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

        if (currentScrollY > HIDE_AFTER) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        if (currentScrollY > lastScrollY && currentScrollY > HIDE_AFTER) {
            header.classList.add('header-hidden');
        } else if (currentScrollY < lastScrollY) {
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    updateHeader();
})();

(function () {
    var avatar = document.querySelector('.avatar-wrap .avatar');
    var menu = document.querySelector('.avatar-menu');
    if (!avatar || !menu) return;

    avatar.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        menu.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && !avatar.contains(e.target)) {
            menu.classList.remove('open');
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            menu.classList.remove('open');
        }
    });
})();