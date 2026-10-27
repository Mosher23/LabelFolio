(() => {
  const dialog = document.querySelector('#screenshot-modal');
  const image = document.querySelector('#screenshot-modal-image');
  const title = document.querySelector('#screenshot-modal-title');
  const counter = document.querySelector('#screenshot-modal-counter');
  const triggers = [...document.querySelectorAll('[data-screenshot]')];
  if (!dialog || !image || !triggers.length) return;

  const items = [...document.querySelectorAll('#screenshots figure')].map(figure => ({
    src: figure.querySelector('[data-screenshot]').getAttribute('href'),
    alt: figure.querySelector('img').alt,
    title: figure.querySelector('h3').textContent
  }));
  let selected = 0;
  let opener;
  const zoom = dialog.querySelector(".lightbox-zoom");
  function setZoom(zoomed) {
    dialog.classList.toggle("is-zoomed", zoomed);
    zoom.setAttribute("aria-pressed", String(zoomed));
    zoom.setAttribute("aria-label", zoomed ? "Fit screenshot to popup" : "Zoom screenshot to actual size");
    zoom.textContent = zoomed ? "Fit image" : "Zoom in";
    const wrap = dialog.querySelector(".lightbox-image-wrap");
    wrap.scrollTop = 0; wrap.scrollLeft = 0;
  }
  zoom.addEventListener("click", () => setZoom(!dialog.classList.contains("is-zoomed")));

  function show(index) {
    setZoom(false);
    selected = (index + items.length) % items.length;
    const item = items[selected];
    image.src = item.src;
    image.alt = item.alt;
    title.textContent = item.title;
    counter.textContent = `${selected + 1} of ${items.length}`;
  }

  for (const trigger of triggers) {
    trigger.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = trigger;
      show(items.findIndex(item => item.src === trigger.getAttribute('href')));
      dialog.showModal();
      document.documentElement.classList.add('screenshot-open');
    });
  }

  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  for (const button of dialog.querySelectorAll('[data-direction]')) {
    button.addEventListener('click', () => show(selected + Number(button.dataset.direction)));
  }
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      show(selected + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('screenshot-open');
    image.removeAttribute('src');
    opener?.focus({ preventScroll: true });
  });
})();
