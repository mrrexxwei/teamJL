// Centralized site functionality: year display and landing overlay
(function(){
    // Set current year in footer
    try{
        var yearEl = document.getElementById('year');
        if(yearEl) yearEl.textContent = new Date().getFullYear();
    }catch(e){ /* fail silently */ }

    // Landing overlay behaviour: hide on Enter click or Enter key
    var landing = document.getElementById('landing');
    var btn = document.getElementById('enter-btn');
    if(landing && btn){
            const main = document.querySelector('.site');
            function hideLanding(){
                landing.classList.add('land-hide');
                setTimeout(function(){ landing.style.display = 'none'; }, 320);
                if(main){ main.classList.remove('site-hidden'); main.removeAttribute('aria-hidden'); if(typeof main.focus === 'function') main.focus(); }
            }
            if(main){ main.classList.add('site-hidden'); main.setAttribute('aria-hidden','true'); }
        btn.addEventListener('click', hideLanding);
        btn.addEventListener('keyup', function(e){ if(e.key === 'Enter') hideLanding(); });
        document.addEventListener('keydown', function(e){ if(e.key === 'Enter' && document.activeElement === btn) hideLanding(); });
    }
})();

// Slide-view behaviour: show only a single 'slideable' section when users click quick links
(function(){
    var main = document.querySelector('.site');
    if(!main) return;

    var slideEls = Array.from(document.querySelectorAll('[data-slideable="true"]')) || [];
    var slideIds = slideEls.map(function(s){ return s.id; });
    var exitBtn = document.getElementById('exit-slide');
    var lastSlideId = null;
    var initiallyHidden = slideEls.filter(function(s){ return s.classList.contains('hidden-section'); }).map(function(s){ return s.id; });

    function enterSlide(id){
        if(!id) return;
        var target = document.getElementById(id);
        if(!target) return;
        // mark slide active
        main.classList.add('slide-active');
        // clear any previous slide-target
        document.querySelectorAll('.slide-target').forEach(function(el){ el.classList.remove('slide-target'); });
        target.classList.add('slide-target');
        // Remove any prior highlight/grid modifiers
        document.querySelectorAll('.about-highlight').forEach(function(el){ el.classList.remove('about-highlight'); });
        document.querySelectorAll('.collections-grid.grid-2x4').forEach(function(el){ el.classList.remove('grid-2x4'); });

        // Reveal the target if it was hidden, and ensure other initially-hidden sections remain hidden
        initiallyHidden.forEach(function(hid){
            var el = document.getElementById(hid);
            if(!el) return;
            if(hid === target.id){
                el.classList.remove('hidden-section');
            } else {
                el.classList.add('hidden-section');
            }
        });

        // If opening About, add highlight styling
        if(target.id === 'about-section'){
            target.classList.add('about-highlight');
        }
        // If opening Plants catalog, switch grid to 4 columns (2 rows of 4 when 8 items)
        if(target.id === 'Plant Catalog'){
            var grid = target.querySelector('.collections-grid');
            if(grid) grid.classList.add('grid-2x4');
        }
        // remember last opened slide
        lastSlideId = id;
        // accessibility: hide from assistive tech
        main.setAttribute('aria-hidden','false');
        target.setAttribute('tabindex','-1');
        target.focus();
        // show exit button
        if(exitBtn) exitBtn.style.display = 'inline-block';
        // scroll to top of viewport
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function exitSlide(){
        main.classList.remove('slide-active');
        document.querySelectorAll('.slide-target').forEach(function(el){ el.classList.remove('slide-target'); el.removeAttribute('tabindex'); });
        // cleanup styling modifications applied for specific slides
        document.querySelectorAll('.about-highlight').forEach(function(el){ el.classList.remove('about-highlight'); });
        document.querySelectorAll('.collections-grid.grid-2x4').forEach(function(el){ el.classList.remove('grid-2x4'); });
        // re-hide any sections that were hidden initially
        initiallyHidden.forEach(function(hid){ var el = document.getElementById(hid); if(el) el.classList.add('hidden-section'); });
        lastSlideId = null;
        if(exitBtn) exitBtn.style.display = 'none';
        // restore focus to top of page
        var header = document.querySelector('.topbar'); if(header) header.focus && header.focus();
    }

    // Intercept anchor clicks to slideable ids
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
        a.addEventListener('click', function(e){
            var href = a.getAttribute('href') || '';
            if(!href || href === '#') return;
            var id = href.replace(/^#/,'');
            if(slideIds.indexOf(id) !== -1){
                e.preventDefault();
                enterSlide(id);
            }
        });
    });

    // Exit button
    if(exitBtn){ exitBtn.addEventListener('click', exitSlide); }

    // Also respond to Escape key to exit slide
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && main.classList.contains('slide-active')) exitSlide(); });

})();
