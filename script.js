document.addEventListener('DOMContentLoaded', () => {
      
      // 1. Atualizar Ano do Rodapé Dinamicamente
      const yearSpan = document.getElementById('year-span');
      if (yearSpan) yearSpan.textContent = new Date().getFullYear();

      // 2. Menu Responsivo Mobile Toggle
      const menuToggleBtn = document.getElementById('menu-toggle');
      const mobileMenu = document.getElementById('mobile-menu');
      const iconOpen = document.getElementById('icon-open');
      const iconClose = document.getElementById('icon-close');

      if (menuToggleBtn && mobileMenu) {
        function setMenu(open) {
          mobileMenu.classList.toggle('hidden', !open);
          iconOpen.classList.toggle('hidden', open);
          iconClose.classList.toggle('hidden', !open);
          menuToggleBtn.setAttribute('aria-expanded', String(open));
          menuToggleBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        }

        menuToggleBtn.addEventListener('click', () => {
          setMenu(mobileMenu.classList.contains('hidden'));
        });

        // Fechar ao clicar num link
        mobileMenu.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => setMenu(false));
        });

        // Fechar com a tecla Esc
        document.addEventListener('keydown', (ev) => {
          if (ev.key === 'Escape' && !mobileMenu.classList.contains('hidden')) setMenu(false);
        });
      }

      // 2b. Imagem que não carregar: esconde o ícone quebrado e mantém o fundo do card
      document.querySelectorAll('img').forEach(img => {
        const hide = () => { img.style.visibility = 'hidden'; };
        img.addEventListener('error', hide);
        if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) hide();
      });

      // 3. Simulador Interativo do Quadro de Disjuntores
      const breakerButtons = document.querySelectorAll('.breaker-switch');
      const summaryText = document.getElementById('panel-summary-text');
      const panelStatusLed = document.getElementById('panel-status-led');
      const panelStatusText = document.getElementById('panel-status-text');
      const btnWhatsappPanel = document.getElementById('btn-whatsapp-panel');
      const btnPanelLabel = document.getElementById('btn-panel-label');

      const phone = "556696938483";

      function updatePanelState() {
        const selectedServices = [];
        breakerButtons.forEach(btn => {
          if (btn.classList.contains('active')) {
            selectedServices.push(btn.getAttribute('data-service'));
          }
        });

        if (selectedServices.length > 0) {
          panelStatusLed.className = "w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] status-pulse";
          panelStatusText.textContent = "LIGADO (" + selectedServices.length + ")";
          panelStatusText.className = "text-xs font-mono font-bold text-emerald-400";

          summaryText.textContent = '';
          const label = document.createElement('span');
          label.className = 'text-emerald-400 font-bold';
          label.textContent = 'Serviços Selecionados:';
          summaryText.append(label, ' ' + selectedServices.join(', ') + '.');

          // Criar mensagem customizada para o WhatsApp
          const message = encodeURIComponent(
            `Olá! Selecionei os seguintes serviços no site da Prime Automação e Elétrica:\n- ` + 
            selectedServices.join('\n- ') + 
            `\n\nGostaria de solicitar um orçamento!`
          );

          btnWhatsappPanel.href = `https://wa.me/${phone}?text=${message}`;
          btnPanelLabel.textContent = `Orçar ${selectedServices.length} Serviço(s) no WhatsApp`;
          btnWhatsappPanel.className = "w-full flex items-center justify-center gap-2 bg-prime-accent hover:bg-prime-accentHover text-prime-navy font-extrabold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-glow-yellow hover:scale-[1.02]";
        } else {
          panelStatusLed.className = "w-3.5 h-3.5 rounded-full bg-slate-600";
          panelStatusText.textContent = "DESLIGADO";
          panelStatusText.className = "text-xs font-mono text-slate-400";

          summaryText.textContent = '👉 Clique nos disjuntores acima para montar seu pedido personalizado.';

          const defaultMsg = encodeURIComponent("Olá! Vim pelo site da Prime Automação e Elétrica e gostaria de um orçamento.");
          btnWhatsappPanel.href = `https://wa.me/${phone}?text=${defaultMsg}`;
          btnPanelLabel.textContent = "Enviar Seleção via WhatsApp";
          btnWhatsappPanel.className = "w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 opacity-90 hover:opacity-100";
        }
      }

      breakerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          btn.classList.toggle('active');
          btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
          if (btn.classList.contains('active')) {
            btn.classList.remove('flash');
            void btn.offsetWidth; // reinicia a animação
            btn.classList.add('flash');
            setTimeout(() => btn.classList.remove('flash'), 650);
          }
          updatePanelState();
        });
      });

      // Inicializa estado
      updatePanelState();

      // 4. Animações: cabeçalho, barra de progresso e revelar ao rolar
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const header = document.getElementById('site-header');
      const progress = document.getElementById('scroll-progress');
      let ticking = false;

      function onScroll() {
        const y = window.scrollY || document.documentElement.scrollTop;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (header) header.classList.toggle('scrolled', y > 24);
        if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
        ticking = false;
      }
      window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
      }, { passive: true });
      onScroll();

      if (!reduceMotion && 'IntersectionObserver' in window) {
        const groups = [
          '#servicos .text-center > *',
          '#servicos .grid > div',
          '#como-funciona .text-center > *',
          '#como-funciona .grid > div:not(.flow-line)',
          '#diferenciais .lg\\:col-span-5 > *',
          '#diferenciais .lg\\:col-span-7 > div',
          '#duvidas .text-center > *',
          '#duvidas details',
          '#contato .grid > div'
        ];

        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add('in');
            io.unobserve(el);
            // Depois de aparecer, devolve o controle ao hover/transition originais do Tailwind
            setTimeout(() => el.classList.remove('reveal', 'in'), parseInt(el.dataset.delay || '0', 10) + 900);
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

        groups.forEach((selector) => {
          document.querySelectorAll(selector).forEach((el, i) => {
            const delay = Math.min(i, 5) * 90;
            el.dataset.delay = String(delay);
            el.style.setProperty('--d', delay + 'ms');
            el.classList.add('reveal');
            io.observe(el);
          });
        });
      }
    });
