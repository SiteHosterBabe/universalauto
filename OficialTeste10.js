(function universalAutoScript() {

    // ============================================================
    // CONFIGURACOES
    // ============================================================
    const WHATSAPP_NUMBER  = '5511958934922';
    const URL_JSON = 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/misterio21.json';
    const ACRESCIMO = 3000;
    const LOADER_TIMEOUT_MS = 8000;   // 8 segundos
    const WHATSAPP_BASE_MESSAGE = 'Olá! Vi o Hyundai HB20 no site da loja e tenho interesse. Ainda está disponível? Poderia me passar mais detalhes e condições?';

    console.log('[UA] Script v44 - Fale conosco FAQ → modal UA + bloqueio PWA/app reforçado');

    // ============================================================
    // VARIÁVEIS GLOBAIS DO LOADER
    // ============================================================
    let loaderElement = null;
    let loaderCreatedAt = null;
    let loaderRemovalScheduled = false;
    let removalTimeout = null;
    let protectionObserver = null;

    // ============================================================
    // FUNÇÃO PARA CRIAR O ELEMENTO LOADER (sem inserir ainda)
    // ============================================================
    function createLoaderElement() {
        const PRIMARY_COLOR = "#0A66C2";
        const SOFT_BLUE_BG = "#EFF6FF";
        const FRASES = [
            "Conectando oportunidades, viabilizando negócios.",
            "Carregando catálogo de automóveis",
            "Preparando ofertas exclusivas para você",
            "Quase lá! Finalizando os melhores negócios",
            "Sua experiência premium está pronta"
        ];
        
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'premium-loader';
        loadingDiv.style.cssText = `
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            z-index:9999999;
            display:flex;
            justify-content:center;
            align-items:center;
            flex-direction:column;
            background-color:#FFFFFF;
            background-image:repeating-linear-gradient(45deg, rgba(10,102,194,0.03) 0px, rgba(10,102,194,0.03) 2px, transparent 2px, transparent 8px),
            linear-gradient(135deg, #FFFFFF 0%, ${SOFT_BLUE_BG} 100%);
            will-change:transform;
            backface-visibility:hidden;
        `;
        
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 178 40");
        svg.setAttribute("width", "600");
        svg.setAttribute("height", "135");
        svg.style.maxWidth = "90vw";
        svg.style.height = "auto";
        svg.style.filter = "drop-shadow(0 20px 30px rgba(0,0,0,0.15))";
        svg.style.marginBottom = "40px";
        svg.innerHTML = '<defs><filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="2"/><feMerge><feMergeNode in="offsetblur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'
            + '<path class="air" d="M 46 16.5 h -20 a 8 8 0 0 1 0 -16" fill="none" stroke="' + PRIMARY_COLOR + '" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" filter="url(#glow)"></path>'
            + '<g id="car"><svg viewBox="0 0 118 28.125" x="30" y="11.725" width="118" height="28.125">'
            + '<defs><circle id="circle" cx="0" cy="0" r="1"></circle>'
            + '<g id="wheel"><use href="#circle" fill="#1E191A" transform="scale(10)"></use><use href="#circle" fill="#fff" transform="scale(5)"></use>'
            + '<path fill="#1E191A" stroke="#1E191A" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.2" d="M -3.5 0 a 4 4 0 0 1 7 0 a 3.5 3.5 0 0 0 -7 0"></path>'
            + '<use href="#circle" fill="#1E191A" transform="scale(1.5)"></use>'
            + '<path class="wheel-stripe" fill="none" stroke="#F9B35C" stroke-width="0.75" stroke-linecap="round" stroke-dasharray="20 14 8 5" d="M 0 -7.5 a 7.5 7.5 0 0 1 0 15 a 7.5 7.5 0 0 1 0 -15"></path>'
            + '<path fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity="0.15" d="M -6.5 -6.25 a 10 10 0 0 1 13 0 a 9 9 0 0 0 -13 0"></path>'
            + '</g></defs>'
            + '<g transform="translate(51.5 11.125)"><path stroke-width="2" stroke="#1E191A" fill="' + PRIMARY_COLOR + '" d="M 0 0 v -2 a 4.5 4.5 0 0 1 9 0 v 2"></path><rect fill="#1E191A" x="3.25" y="-3" width="5" height="3"></rect></g>'
            + '<g transform="translate(10 24.125)"><g transform="translate(59 0)"><path id="shadow" opacity="0.7" fill="#1E191A" d="M -64 0 l -4 4 h 9 l 8 -1.5 h 100 l -3.5 -2.5"></path></g>'
            + '<path fill="#fff" stroke="#1E191A" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" d="M 0 0 v -10 l 35 -13 v 5 l 4 0.5 l 0.5 4.5 h 35.5 l 30 13"></path>'
            + '<g fill="#fff" stroke="#1E191A" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M -6 0 v -22 h 10 z"></path><path d="M 105 0 h -3 l -12 -5.2 v 6.2 h 12"></path></g>'
            + '<g fill="#949699" opacity="0.7"><rect x="16" y="-6" width="55" height="6"></rect><path d="M 24 -14 l 13 -1.85 v 1.85"></path></g>'
            + '<g fill="none" stroke="#1E191A" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path stroke-dasharray="30 7 42" d="M 90 0 h -78"></path><path d="M 39.5 -13 h -15"></path></g>'
            + '<path fill="#fff" stroke="#1E191A" stroke-width="2.25" stroke-linejoin="round" d="M 48.125 -6 h -29 v 6 h 29"></path>'
            + '<rect x="48" y="-7.125" width="6.125" height="7.125" fill="#1E191A"></rect>'
            + '<g fill="#1E191A"><rect x="60" y="-15" width="1" height="6"></rect><rect x="56.5" y="-17.5" width="6" height="2.5"></rect></g>'
            + '</g>'
            + '<g class="wheels" transform="translate(0 18.125)"><g transform="translate(10 0)"><use href="#wheel"></use></g><g transform="translate(87 0)"><use class="right-wheel-stripe" href="#wheel" stroke-dashoffset="-22"></use></g></g>'
            + '</svg></g>'
            + '<g fill="none" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">'
            + '<path class="air" stroke="' + PRIMARY_COLOR + '" d="M 177.5 34 h -10 q -16 0 -32 -8"></path>'
            + '<path class="air" stroke="#B8D0F0" d="M 167 28.5 c -18 -2 -22 -8 -37 -10.75"></path>'
            + '<path class="air" stroke="#B8D0F0" d="M 153 20 q -4 -1.7 -8 -3"></path>'
            + '<path class="air" stroke="' + PRIMARY_COLOR + '" d="M 117 16.85 c -12 0 -12 16 -24 16 h -8"></path>'
            + '<path class="air" stroke="#B8D0F0" d="M 65 12 q -5 3 -12 3.8"></path>'
            + '<path class="air" stroke="#B8D0F0" stroke-dasharray="9 10" d="M 30 13.5 h -2.5 q -5 0 -5 -5"></path>'
            + '<path class="air" stroke="#B8D0F0" d="M 31 33 h -10"></path>'
            + '<path class="air" stroke="#B8D0F0" d="M 29.5 23 h -12"></path>'
            + '<path class="air" stroke="#B8D0F0" d="M 13.5 23 h -6"></path>'
            + '<path class="air" stroke="' + PRIMARY_COLOR + '" d="M 28 28 h -27.5"></path>'
            + '</g>';
        loadingDiv.appendChild(svg);
        
        const textWrapper = document.createElement('div');
        textWrapper.style.cssText = 'text-align:center;margin:20px 0 30px 0;width:80%;max-width:700px;';
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = `
            font-family:'Playfair Display','Cormorant Garamond','Georgia',serif;
            font-size:1.8rem;
            font-weight:500;
            letter-spacing:-0.2px;
            color:${PRIMARY_COLOR};
            padding:12px 24px;
            border-radius:60px;
            background-color:rgba(255,255,255,0.5);
            backdrop-filter:blur(8px);
            border:1px solid ${PRIMARY_COLOR}20;
            transition:opacity 0.4s ease;
        `;
        statusDiv.textContent = FRASES[0];
        textWrapper.appendChild(statusDiv);
        loadingDiv.appendChild(textWrapper);
        
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = 'width:60%;max-width:500px;height:4px;background-color:rgba(10,102,194,0.2);border-radius:10px;margin:20px auto 0 auto;overflow:hidden;';
        const progressBar = document.createElement('div');
        progressBar.style.cssText = 'width:0%;height:100%;background-color:' + PRIMARY_COLOR + ';border-radius:10px;transition:width 0.3s linear;';
        progressContainer.appendChild(progressBar);
        loadingDiv.appendChild(progressContainer);
        
        // Animação de frases
        let fraseIndex = 1;
        const intervalFrases = setInterval(() => {
            if (!document.getElementById('premium-loader')) return;
            statusDiv.style.opacity = "0";
            setTimeout(() => {
                if (!document.getElementById('premium-loader')) return;
                statusDiv.textContent = FRASES[fraseIndex];
                statusDiv.style.opacity = "1";
                fraseIndex = (fraseIndex + 1) % FRASES.length;
            }, 200);
        }, 2800);
        
        // Barra de progresso
        let progress = 0;
        const progressInterval = setInterval(() => {
            if (!document.getElementById('premium-loader')) return;
            if (progress < 100) {
                progress += 100 / (LOADER_TIMEOUT_MS / 50);
                if (progress > 100) progress = 100;
                progressBar.style.width = progress + "%";
            }
        }, 50);
        setTimeout(() => {
            if (document.getElementById('premium-loader')) progressBar.style.width = "100%";
        }, LOADER_TIMEOUT_MS - 200);
        
        // Animações do carro
        const carGroup = document.getElementById('car');
        const shadowPath = document.getElementById('shadow');
        const airPaths = Array.from(svg.querySelectorAll('.air'));
        let pathsData = [];
        let currentTimeouts = [];
        let carAnimation, shadowAnimation, wheelRotationRAF, restartTimeout;
        let isCycling = false;
        let loaderInternalRemoved = false;
        
        function clearAllDashTimeouts() { currentTimeouts.forEach(t => clearTimeout(t)); currentTimeouts = []; }
        function resetDashPathsToHidden() {
            for (let i = 0; i < pathsData.length; i++) {
                const p = pathsData[i].element;
                const len = pathsData[i].length;
                if (!p) continue;
                p.style.transition = '';
                p.style.strokeDashoffset = len;
                p.setAttribute('stroke-dashoffset', len);
                p.setAttribute('stroke-dasharray', len);
            }
        }
        function initAirPaths() {
            for (let i = 0; i < airPaths.length; i++) {
                const p = airPaths[i];
                const len = p.getTotalLength();
                pathsData.push({ element: p, length: len });
                p.style.strokeDasharray = len;
                p.style.strokeDashoffset = len;
                p.setAttribute('stroke-dasharray', len);
                p.setAttribute('stroke-dashoffset', len);
            }
        }
        function startDashDrawingSequence(staggerDelayMs = 80, drawDurationMs = 500) {
            if (loaderInternalRemoved) return;
            clearAllDashTimeouts();
            for (let i = 0; i < pathsData.length; i++) {
                (function(data, idx) {
                    const pathEl = data.element;
                    const totalLen = data.length;
                    if (totalLen <= 0) return;
                    pathEl.style.transition = '';
                    pathEl.style.strokeDashoffset = totalLen;
                    void pathEl.offsetHeight;
                    const tid = setTimeout(() => {
                        if (loaderInternalRemoved) return;
                        pathEl.style.transition = `stroke-dashoffset ${drawDurationMs}ms cubic-bezier(0.2,0.9,0.4,1.1)`;
                        pathEl.style.strokeDashoffset = '0';
                        pathEl.setAttribute('stroke-dashoffset', '0');
                    }, idx * staggerDelayMs);
                    currentTimeouts.push(tid);
                })(pathsData[i], i);
            }
        }
        function resetCarAndShadowTransform() {
            if (carGroup) carGroup.style.transform = 'translateX(0px)';
            if (shadowPath) {
                shadowPath.style.transform = 'skewX(0deg)';
                shadowPath.style.transformOrigin = '0% 0%';
            }
        }
        function startCarMovementAndShadow(durationMs = 2500) {
            if (loaderInternalRemoved) return;
            if (carAnimation) carAnimation.cancel();
            if (shadowAnimation) shadowAnimation.cancel();
            resetCarAndShadowTransform();
            if (carGroup) {
                carAnimation = carGroup.animate(
                    [{ transform: 'translateX(0px)' }, { transform: 'translateX(72px)' }],
                    { duration: durationMs, easing: 'cubic-bezier(0.25,0.46,0.45,0.94)', fill: 'forwards' }
                );
            }
            if (shadowPath) {
                shadowAnimation = shadowPath.animate(
                    [{ transform: 'skewX(0deg)' }, { transform: 'skewX(16deg)' }],
                    { duration: durationMs, easing: 'cubic-bezier(0.2,0.9,0.4,1.2)', fill: 'forwards' }
                );
            }
        }
        function initWheelStripeRotation() {
            const allStripes = svg.querySelectorAll('.wheel-stripe');
            if (!allStripes.length) return;
            let stripeOffsets = [];
            let circumferences = [];
            for (let i = 0; i < allStripes.length; i++) {
                const stripe = allStripes[i];
                let totalLen = 47;
                const dashArr = stripe.getAttribute('stroke-dasharray');
                if (dashArr) {
                    const parts = dashArr.split(/\s+/).map(Number);
                    totalLen = parts.reduce((a,b) => a+b, 0);
                }
                circumferences.push(totalLen);
                let initOffset = 0;
                if (stripe.closest('g') && stripe.closest('g').getAttribute('transform') === 'translate(87 0)') initOffset = -22;
                stripeOffsets.push(initOffset);
                stripe.style.strokeDashoffset = initOffset;
            }
            function rotateStripes() {
                if (loaderInternalRemoved) return;
                for (let idx = 0; idx < allStripes.length; idx++) {
                    let newOffset = stripeOffsets[idx] - 0.38;
                    newOffset = ((newOffset % circumferences[idx]) + circumferences[idx]) % circumferences[idx];
                    stripeOffsets[idx] = newOffset;
                    allStripes[idx].style.strokeDashoffset = newOffset;
                }
                wheelRotationRAF = requestAnimationFrame(rotateStripes);
            }
            if (wheelRotationRAF) cancelAnimationFrame(wheelRotationRAF);
            wheelRotationRAF = requestAnimationFrame(rotateStripes);
        }
        function runFullLoadingCycle() {
            if (loaderInternalRemoved || isCycling) return;
            isCycling = true;
            if (restartTimeout) clearTimeout(restartTimeout);
            resetDashPathsToHidden();
            resetCarAndShadowTransform();
            startCarMovementAndShadow(2500);
            startDashDrawingSequence(70, 480);
            restartTimeout = setTimeout(() => {
                if (!loaderInternalRemoved) {
                    isCycling = false;
                    runFullLoadingCycle();
                }
            }, 3000);
        }
        initAirPaths();
        initWheelStripeRotation();
        runFullLoadingCycle();
        
        // Armazenar intervals e timeouts para limpeza futura
        loadingDiv._intervals = { intervalFrases, progressInterval };
        loadingDiv._timeouts = { restartTimeout };
        
        return loadingDiv;
    }

    // ============================================================
    // INICIALIZAÇÃO DO LOADER COM PROTEÇÃO (reinserção)
    // ============================================================
    function initLoader() {
        if (loaderElement) return;
        loaderElement = createLoaderElement();
        loaderCreatedAt = Date.now();
        console.log('[UA] Loader criado em:', new Date(loaderCreatedAt).toLocaleTimeString(), 'será removido em', LOADER_TIMEOUT_MS/1000, 'segundos');
        
        // Inserir no body como primeiro filho
        if (document.body) {
            document.body.insertBefore(loaderElement, document.body.firstChild);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.insertBefore(loaderElement, document.body.firstChild);
            });
        }
        
        // Configurar MutationObserver para proteger o loader contra remoção
        if (protectionObserver) protectionObserver.disconnect();
        protectionObserver = new MutationObserver((mutations) => {
            if (loaderRemovalScheduled) return; // Remoção legítima em curso, não reinsere
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.removedNodes.length) {
                    for (const node of mutation.removedNodes) {
                        if (node === loaderElement || (node.nodeType === 1 && node.id === 'premium-loader')) {
                            // O loader foi removido prematuramente! Reinserir SINCRONAMENTE
                            console.warn('[UA] Loader removido do DOM! Reinserindo...');
                            if (document.body && !document.body.contains(loaderElement)) {
                                // Reinserção síncrona (antes do próximo paint) para evitar flicker
                                document.body.insertBefore(loaderElement, document.body.firstChild);
                                console.log('[UA] Loader reinserido com sucesso.');
                            }
                            break;
                        }
                    }
                }
            }
        });
        protectionObserver.observe(document.body, { childList: true, subtree: false });
    }
    
    function removeLoader() {
        if (loaderRemovalScheduled) return;
        const elapsed = Date.now() - loaderCreatedAt;
        // Garantia: loader NUNCA é removido antes dos 14 segundos
        if (elapsed < LOADER_TIMEOUT_MS - 200) {
            const remaining = LOADER_TIMEOUT_MS - elapsed;
            console.log('[UA] Tentativa prematura de remoção. Reagendando daqui a', remaining, 'ms');
            setTimeout(removeLoader, remaining);
            return;
        }
        loaderRemovalScheduled = true;
        if (loaderElement && loaderElement.parentNode) {
            // Limpar intervals e timeouts para evitar memory leak
            if (loaderElement._intervals) {
                clearInterval(loaderElement._intervals.intervalFrases);
                clearInterval(loaderElement._intervals.progressInterval);
            }
            if (loaderElement._timeouts && loaderElement._timeouts.restartTimeout) clearTimeout(loaderElement._timeouts.restartTimeout);
            loaderElement.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            loaderElement.style.opacity = '0';
            loaderElement.addEventListener('transitionend', () => {
                if (loaderElement && loaderElement.parentNode) loaderElement.parentNode.removeChild(loaderElement);
                if (protectionObserver) protectionObserver.disconnect();
            });
            setTimeout(() => {
                if (loaderElement && loaderElement.parentNode) loaderElement.parentNode.removeChild(loaderElement);
                if (protectionObserver) protectionObserver.disconnect();
            }, 700);
        } else {
            console.warn('[UA] Loader não encontrado para remoção');
            if (protectionObserver) protectionObserver.disconnect();
        }
    }
    
    // ============================================================
    // VARIÁVEIS DE DADOS (declaradas antes do loader para acesso imediato)
    // ============================================================
    let todosVeiculos = [];
    let precoPorId = new Map();
    let dadosCarregados = false;

    // Iniciar loader
    initLoader();
    // Agendar remoção após 14 segundos com garantia de tempo mínimo
    removalTimeout = setTimeout(removeLoader, LOADER_TIMEOUT_MS);
    console.log('[UA] Remoção do loader agendada para daqui a', LOADER_TIMEOUT_MS/1000, 'segundos');

    // ============================================================
    // CARREGAMENTO DOS DADOS (JSON) - NÃO BLOQUEANTE
    // Fetch corre em paralelo, sem bloquear as modificações do DOM
    // ============================================================
    fetch(URL_JSON)
        .then(function(res) { return res.ok ? res.json() : Promise.reject('HTTP ' + res.status); })
        .then(function(data) {
            todosVeiculos = data;
            todosVeiculos.forEach(function(v) {
                if (v.id && v.priceFor) precoPorId.set(v.id, v.priceFor + ACRESCIMO);
            });
            dadosCarregados = true;
            console.log('[UA] JSON carregado com sucesso,', todosVeiculos.length, 'veículos');
            // Aplica listagem agora que os dados estão prontos
            try { applyAllTransformations(); } catch(e) {}
        })
        .catch(function(err) {
            console.error('[UA] Erro ao carregar JSON:', err);
        });

    // ============================================================
    // MODAIS COM LOADING
    // ============================================================
    function createModal(title, contentElement, width = '900px') {
        const existingModal = document.querySelector('.ua-custom-modal');
        if (existingModal) existingModal.remove();
        const isMobile = window.innerWidth < 768;

        const modalContainer = document.createElement('div');
        modalContainer.className = 'LdsDialog-module_lds-dialog-container__Br8cE ua-custom-modal';
        modalContainer.setAttribute('tabindex', '-1');
        modalContainer.style.cssText = `
            position:fixed;top:0;left:0;width:100%;height:100%;
            background-color:rgba(0,0,0,0.5);z-index:9999999;
            display:flex;align-items:${isMobile ? 'flex-end' : 'center'};justify-content:center;
            padding:0;box-sizing:border-box;
        `;

        const dialog = document.createElement('div');
        dialog.className = 'LdsDialog-module_lds-dialog__sX04I LdsDialog-module_lds-dialog--md__eeh2-';
        if (isMobile) {
            dialog.style.cssText = `
                width:100%;max-width:100%;
                height:95vh;max-height:95vh;
                border-radius:16px 16px 0 0;
                display:flex;flex-direction:column;
                overflow:hidden;box-sizing:border-box;
            `;
        } else {
            dialog.style.cssText = `
                width:${width};max-width:95vw;
                max-height:92vh;
                display:flex;flex-direction:column;
                overflow:hidden;box-sizing:border-box;
            `;
        }

        const header = document.createElement('div');
        header.className = 'LdsDialog-module_lds-dialog__header__RO9-z LdsDialog-module_lds-dialog__title__p4lEy';
        header.style.cssText = `flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:${isMobile ? '12px 16px' : ''};`;
        const titleEl = document.createElement('h2');
        titleEl.className = 'LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--heading-lg__-4owW';
        titleEl.textContent = title;
        if (isMobile) titleEl.style.fontSize = '18px';
        const closeDiv = document.createElement('div');
        closeDiv.className = 'LdsDialog-module_lds-dialog__close-button__nX6PB';
        closeDiv.setAttribute('data-testid', 'close-button');
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'base-Button-root LdsIconButton-module_lds-icon-button__aW974 LdsIconButton-module_lds-icon-button--basic-neutral__o1i7p';
        closeBtn.style.cssText = 'width:40px;height:40px;min-width:40px;min-height:40px;';
        closeBtn.setAttribute('aria-label', 'fechar');
        const iconSpan = document.createElement('span');
        iconSpan.className = 'LdsIconButton-module_lds-icon-container__lz4mz';
        iconSpan.innerHTML = '<svg width="24" height="24" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" role="presentation"><path d="M17.7372 7.5364C18.0886 7.18492 18.0886 6.61508 17.7372 6.2636C17.3857 5.91213 16.8159 5.91213 16.4644 6.2636L12.0004 10.7276L7.5364 6.2636C7.18492 5.91213 6.61508 5.91213 6.2636 6.2636C5.91213 6.61508 5.91213 7.18492 6.2636 7.5364L10.7276 12.0004L6.2636 16.4644C5.91213 16.8159 5.91213 17.3857 6.2636 17.7372C6.61508 18.0886 7.18492 18.0886 7.5364 17.7372L12.0004 13.2732L16.4644 17.7372C16.8159 18.0886 17.3857 18.0886 17.7372 17.7372C18.0886 17.3857 18.0886 16.8159 17.7372 16.4644L13.2732 12.0004L17.7372 7.5364Z" fill="currentColor"></path></svg>';
        closeBtn.appendChild(iconSpan);
        closeDiv.appendChild(closeBtn);
        header.appendChild(titleEl);
        header.appendChild(closeDiv);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'LdsDialog-module_lds-dialog__content__Tqh0O';
        contentDiv.style.cssText = `flex:1;overflow-y:auto;overflow-x:hidden;${isMobile ? 'padding:0;' : ''}`;
        contentDiv.appendChild(contentElement);

        dialog.appendChild(header);
        dialog.appendChild(contentDiv);
        modalContainer.appendChild(dialog);
        document.body.appendChild(modalContainer);
        const closeModal = () => modalContainer.remove();
        closeBtn.addEventListener('click', closeModal);
        modalContainer.addEventListener('click', (e) => { if (e.target === modalContainer) closeModal(); });
    }

    function showPdfModal(pdfUrl) {
        const isMobile = window.innerWidth < 768;
        const container = document.createElement('div');
        container.className = 'ReportPDFButton_pdfContainer__EQLEK';
        container.style.cssText = `position:relative;width:100%;height:100%;min-height:${isMobile ? '300px' : '400px'};`;
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'pdf-loading';
        loadingDiv.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;color:#0A66C2;font-family:sans-serif;display:block;';
        loadingDiv.innerHTML = '<div style="border:4px solid #f3f3f3;border-top:4px solid #0A66C2;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;margin:0 auto 10px;"></div><p>Carregando laudo...</p><style>@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}</style>';
        container.appendChild(loadingDiv);
        const iframe = document.createElement('iframe');
        iframe.src = pdfUrl;
        iframe.className = 'ReportPDFButton_pdfIframe__V9uxH';
        iframe.style.cssText = `width:100%;height:${isMobile ? 'calc(95vh - 70px)' : '70vh'};border:none;display:none;`;
        iframe.onload = () => { loadingDiv.style.display = 'none'; iframe.style.display = 'block'; };
        container.appendChild(iframe);
        createModal('Laudo do Veículo', container);
    }

    function showVideoModal(videoUrl) {
        const isMobile = window.innerWidth < 768;
        const video = document.createElement('video');
        video.setAttribute('width', '100%');
        video.controls = true;
        video.className = 'ReportVideoButton_video__HrKaY';
        video.style.cssText = `display:block;width:100%;max-height:${isMobile ? '55vh' : '60vh'};background:#000;`;
        const source = document.createElement('source');
        source.src = videoUrl;
        source.type = 'video/mp4';
        video.appendChild(source);
        video.appendChild(document.createElement('track'));
        const videoContainer = document.createElement('div');
        videoContainer.className = 'ReportVideoButton_videoContainer__HghOH';
        videoContainer.style.cssText = 'width:100%;background:#000;';
        videoContainer.appendChild(video);
        const infoContainer = document.createElement('div');
        infoContainer.className = 'ReportVideoButton_infoContainer__rc9QW';
        if (isMobile) infoContainer.style.cssText = 'padding:12px 16px;font-size:14px;';
        infoContainer.innerHTML = `
            <svg width="24" height="24" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" role="presentation">
                <path d="M12 8.10004C12.4971 8.10004 12.9 8.50299 12.9 9.00004V13C12.9 13.4971 12.4971 13.9 12 13.9C11.503 13.9 11.1 13.4971 11.1 13V9.00004C11.1 8.50299 11.503 8.10004 12 8.10004Z" fill="#0B4260"></path>
                <path d="M12 15.1C11.503 15.1 11.1 15.503 11.1 16C11.1 16.4971 11.503 16.9 12 16.9H12.01C12.5071 16.9 12.91 16.4971 12.91 16C12.91 15.503 12.5071 15.1 12.01 15.1H12Z" fill="#0B4260"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.6188 2.13011C11.0404 1.8926 11.5161 1.76782 12 1.76782C12.4839 1.76782 12.9596 1.8926 13.3812 2.13011C13.8028 2.36762 14.156 2.70983 14.4068 3.12369L14.4092 3.12764L22.5152 16.6636L22.5227 16.6765C22.768 17.1019 22.8977 17.5841 22.8989 18.0752C22.9002 18.5663 22.7728 19.0491 22.5296 19.4757C22.2864 19.9024 21.9358 20.2579 21.5127 20.5071C21.0895 20.7562 20.6085 20.8903 20.1174 20.896L20.107 20.8961L3.88291 20.896C3.39164 20.8905 2.91038 20.7564 2.487 20.5072C2.06361 20.258 1.71285 19.9022 1.46961 19.4754C1.22638 19.0485 1.09913 18.5654 1.10054 18.0741C1.10194 17.5828 1.23195 17.1004 1.47763 16.675L1.48492 16.6626L9.57573 3.15396C9.58137 3.14377 9.58722 3.13368 9.59327 3.12369C9.84401 2.70983 10.1972 2.36762 10.6188 2.13011ZM12 3.56782C11.8257 3.56782 11.6542 3.61279 11.5023 3.69837C11.3567 3.78039 11.2338 3.89706 11.1443 4.0379L11.1351 4.05348L3.0334 17.5804C2.94682 17.7324 2.90103 17.9042 2.90053 18.0793C2.90002 18.2563 2.94587 18.4304 3.03352 18.5842C3.12117 18.738 3.24757 18.8662 3.40013 18.956C3.55146 19.0451 3.72331 19.0933 3.89885 19.096H20.101C20.2764 19.0933 20.4482 19.045 20.5994 18.956C20.7519 18.8662 20.8782 18.7381 20.9659 18.5843C21.0535 18.4306 21.0994 18.2566 21.0989 18.0796C21.0985 17.9048 21.0529 17.7331 20.9665 17.5811L12.8673 4.0564L12.8663 4.0548C12.776 3.90639 12.6491 3.78365 12.4977 3.69837C12.3458 3.61279 12.1744 3.56782 12 3.56782Z" fill="#0B4260"></path>
            </svg>
            <div>
                <div class="ReportVideoButton_infoTitle__kbbiM">
                    <h4 class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--heading-sm__5NKKy ReportVideoButton_infoText__kODm0"> Sobre este vídeo</h4>
                </div>
                <p class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--body-md__KI9TK ReportVideoButton_infoText__kODm0">Este vídeo foi gravado durante a inspeção técnica do veículo e mostra o estado atual de conservação,</p>
                <p class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--body-md__KI9TK ReportVideoButton_infoText__kODm0">incluindo possíveis avarias, desgastes e condições gerais da lataria, interior e componentes visíveis.</p>
            </div>
        `;
        const mainContainer = document.createElement('div');
        mainContainer.appendChild(videoContainer);
        mainContainer.appendChild(infoContainer);
        createModal('Vídeo do laudo', mainContainer);
    }

    // ============================================================
    // FUNÇÕES AUXILIARES DE TRANSFORMAÇÃO
    // ============================================================
    const UA_LOGO_URL = 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/logoprincipal1.png';
    const UA_REDIRECT  = 'https://universalautorepasse.com/carros';

    function buildUALogoHTML() {
        return `
            <div style="display:flex;align-items:center;gap:8px;">
                <img src="${UA_LOGO_URL}" alt="Universal Auto" style="height:36px;width:auto;object-fit:contain;display:block;">
                <div style="display:flex;flex-direction:column;line-height:1.15;">
                    <span style="font-size:10px;color:#1565C0;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Repasses</span>
                    <span style="font-size:17px;color:#0D3B8C;font-weight:800;letter-spacing:0.5px;">Universal Auto</span>
                </div>
            </div>
        `.trim();
    }

    function replaceLocalizaNavbarLogo() {
        const navLinks = document.querySelectorAll('a[title="Seminovos Localiza"][data-testid="home-page"], a.Navbar_logoLink__6znXv');
        navLinks.forEach(link => {
            if (link.hasAttribute('data-ua-logo-replaced')) return;
            link.setAttribute('data-ua-logo-replaced', 'true');
            link.setAttribute('title', 'Universal Auto');
            link.setAttribute('href', UA_REDIRECT);
            link.removeAttribute('data-testid');
            link.innerHTML = buildUALogoHTML();
            const cloned = link.cloneNode(true);
            link.parentNode.replaceChild(cloned, link);
            cloned.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = UA_REDIRECT;
            });
        });
    }

    function replaceLocalizaSVGInstances() {
        document.querySelectorAll('svg[viewBox="0 0 124 33"]').forEach(svg => {
            if (svg.hasAttribute('data-ua-svg-replaced')) return;
            if (svg.closest('#premium-loader')) return;
            svg.setAttribute('data-ua-svg-replaced', 'true');
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'display:flex;align-items:center;gap:8px;';
            wrapper.innerHTML = `
                <img src="${UA_LOGO_URL}" alt="Universal Auto" style="height:33px;width:auto;object-fit:contain;display:block;">
                <div style="display:flex;flex-direction:column;line-height:1.15;">
                    <span style="font-size:9px;color:#1565C0;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Repasses</span>
                    <span style="font-size:15px;color:#0D3B8C;font-weight:800;letter-spacing:0.5px;">Universal Auto</span>
                </div>
            `.trim();
            svg.parentNode.replaceChild(wrapper, svg);
        });
        document.querySelectorAll('svg[viewBox="0 0 149 39"]').forEach(svg => {
            if (svg.hasAttribute('data-ua-svg-replaced')) return;
            if (svg.closest('#premium-loader')) return;
            svg.setAttribute('data-ua-svg-replaced', 'true');
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'display:flex;align-items:center;gap:8px;';
            wrapper.innerHTML = `
                <img src="${UA_LOGO_URL}" alt="Universal Auto" style="height:39px;width:auto;object-fit:contain;display:block;">
                <div style="display:flex;flex-direction:column;line-height:1.15;">
                    <span style="font-size:10px;color:#1565C0;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Repasses</span>
                    <span style="font-size:17px;color:#0D3B8C;font-weight:800;letter-spacing:0.5px;">Universal Auto</span>
                </div>
            `.trim();
            svg.parentNode.replaceChild(wrapper, svg);
        });
    }

    function applyHero() {
        const hero = document.querySelector('.Hero_heroBackground__n2WjH');
        if (!hero) return;
        hero.style.position = 'relative';
        hero.style.setProperty('background', 'linear-gradient(135deg,#2563eb 0%,#1e40af 50%,#1e3a8a 100%)', 'important');
        if (!hero.querySelector('.custom-glow')) {
            const glow = document.createElement('div');
            glow.className = 'custom-glow';
            Object.assign(glow.style, { position:'absolute', top:'-100px', left:'-100px', width:'400px', height:'400px', background:'rgba(59,130,246,0.4)', filter:'blur(120px)', borderRadius:'50%', pointerEvents:'none' });
            hero.appendChild(glow);
        }
    }

    function replaceHeroImage() {
        const heroImg = document.querySelector('img.Hero_heroImage__14M5B[alt="Hero Image"]');
        if (heroImg && heroImg.src && heroImg.src.includes('/home/computer.webp') && heroImg.src !== 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/banerzaoinicial.png') {
            heroImg.src = 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/banerzaoinicial.png';
        }
    }

    function modifyCadastroButton() {
        const heroContainer = document.querySelector('.Hero_heroTextContainer__o_LrP');
        if (!heroContainer) return;
        const selectorHero = [
            'button.LdsButton-module_lds-button--contained-primary__6r3Mk',
            'button.LdsButton-module_lds-button--contained-tertiary__VqzE3',
            'button[class*="lds-button--contained-tertiary"]',
            'button[class*="lds-button--contained-secondary"]'
        ].join(',');
        heroContainer.querySelectorAll(selectorHero).forEach(btn => {
            const span = btn.querySelector('span');
            if (!span) return;
            const texto = span.innerText.trim();
            if ((texto === 'Cadastre-se agora' || texto === 'Veja o nosso catálogo') && !btn.dataset.uaHeroDone) {
                span.innerText = 'Veja o nosso catálogo';
                const novoBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(novoBtn, btn);
                novoBtn.dataset.uaHeroDone = '1';
                novoBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); window.location.href = 'https://universalautorepasse.com/carros'; });
            }
        });
    }

    function replaceCadastroParagraph() {
        document.querySelectorAll('p.LdsTypography-module_lds-typography__-DOlx.LdsTypography-module_lds-typography--body-md__KI9TK').forEach(p => {
            if (p.innerText.trim() === 'Cadastre-se para acessar nossos veículos!' && p.innerText !== 'Descubra viaturas únicas: galeria de fotos exclusiva e especificações completas.') {
                p.innerText = 'Descubra viaturas únicas: galeria de fotos exclusiva e especificações completas.';
            }
        });
    }

    function replaceMainTitle() {
        document.querySelectorAll('h1.LdsTypography-module_lds-typography__-DOlx.LdsTypography-module_lds-typography--heading-xl__xfa9y').forEach(titulo => {
            if (titulo.innerText.trim() === 'Diversos modelos, com todas as vantagens Localiza!') titulo.innerText = 'Seu próximo carro está aqui. Conheça as vantagens do nosso estoque.';
        });
    }

    function modifyVerMaisCarrosButton() {
        document.querySelectorAll('button.LdsButton-module_lds-button--outlined-primary__ZxRfx').forEach(btn => {
            const span = btn.querySelector('span');
            if (span && span.innerText.trim() === 'Ver mais carros') {
                const novoBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(novoBtn, btn);
                novoBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); window.location.href = 'https://universalautorepasse.com/carros'; });
            }
        });
    }

    function modifyHowItWorksBackground() {
        const section = document.querySelector('section.HowItWorks_container__IYMRX');
        if (section) section.style.setProperty('background', 'linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(30, 64, 175) 50%, rgb(30, 58, 138) 100%)', 'important');
    }

    function modifySeparatorsBackground() {
        const targetGradient = 'linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(30, 64, 175) 50%, rgb(30, 58, 138) 100%)';
        document.querySelectorAll('.HowItWorks_leftBorder__P6mDf,.HowItWorks_rightBorder__JevRe').forEach(el => { el.style.setProperty('background', targetGradient, 'important'); });
    }

    function modifyHowItWorksCadastroButton() {
        const selectorHiW = [
            'button.LdsButton-module_lds-button--contained-primary__6r3Mk',
            'button[class*="lds-button--contained-tertiary"]',
            'button[class*="lds-button--contained-secondary"]'
        ].join(',');
        document.querySelectorAll('section.HowItWorks_container__IYMRX ' + selectorHiW).forEach(btn => {
            const span = btn.querySelector('span');
            if (!span) return;
            const texto = span.innerText.trim();
            if ((texto === 'Cadatre-se agora' || texto === 'Cadastre-se agora' || texto === 'Nosso Catálogo') && span.innerText !== 'Nosso Catálogo') {
                span.innerText = 'Nosso Catálogo';
                const novoBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(novoBtn, btn);
                novoBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); window.location.href = 'https://universalautorepasse.com/carros'; });
            }
        });
    }

    function replaceHowItWorksTexts() {
        const steps = [
            { h2Text: 'Faça seu cadastro', newH2: 'Acesse o nosso catálogo', pText: 'Cadastre seu negócio e representantes gratuitamente!', newP: 'Faça a sua pesquisa e veja por que somos a escolha inteligente. Compare e poupe.' },
            { h2Text: 'Acesse o portal', newH2: 'Conheça os detalhes', pText: 'Faça o login e descubra todas as funcionalidades da plataforma.', newP: 'Clique no modelo e acesse os dados vitais do veículo: quilometragem, laudo cautelar, estado de conservação e todos os acessórios.' },
            { h2Text: 'Escolha seus carros', newH2: 'Entre em contato', pText: 'Ampla variedade de modelos e marcas para o seu negócio.', newP: 'Esclareça as suas dúvidas sobre crédito, especificações técnicas ou agende uma visita. A nossa equipa está pronta para o ajudar em todas as etapas da sua compra.' },
            { h2Text: 'Compre online', newH2: 'Agendar visita', pText: 'Ampla variedade de modelos e marcas para o seu negócio.Todo o processo de compra 100% online e seguro!', newP: 'Solicite um agendamento personalizado com os nossos especialistas e venha avaliar, em detalhe e presencialmente, toda a qualidade dos nossos veículos.' }
        ];
        steps.forEach(step => {
            document.querySelectorAll('h2.LdsTypography-module_lds-typography__-DOlx.LdsTypography-module_lds-typography--heading-md__QVgP4').forEach(h2 => { if (h2.innerText.trim() === step.h2Text && h2.innerText !== step.newH2) h2.innerText = step.newH2; });
            document.querySelectorAll('p.LdsTypography-module_lds-typography__-DOlx.LdsTypography-module_lds-typography--body-md__KI9TK').forEach(p => { if (p.innerText.trim() === step.pText && p.innerText !== step.newP) p.innerText = step.newP; });
        });
    }

    function modifyEquipeEspecializadaBackground() {
        const div = document.querySelector('.EfficiencyForBusiness_teamContainer__8bJzm');
        if (div) div.style.setProperty('background', 'linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(30, 64, 175) 50%, rgb(30, 58, 138) 100%)', 'important');
    }

    function modifyFAQSection() {
        const faqDiv = document.querySelector('.FAQ_banner__7TtUF');
        if (!faqDiv) return;
        faqDiv.style.setProperty('background', 'linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(30, 64, 175) 50%, rgb(30, 58, 138) 100%)', 'important');
        const h2 = faqDiv.querySelector('h2.LdsTypography-module_lds-typography--heading-md__QVgP4');
        if (h2 && h2.innerText.trim() === 'Não possui CNPJ e quer um Seminovo Localiza?') h2.innerText = 'Gostaria de conhecer as viaturas disponíveis em exposição?';
        const p = faqDiv.querySelector('p.LdsTypography-module_lds-typography--body-md__KI9TK');
        if (p) {
            const textoAtual = p.innerText.trim();
            const novoTexto = 'A Universal Auto é para todo mundo! Seja você um lojista ou uma pessoa física em busca do seu próximo carro';
            const novoTexto2 = 'Nosso estoque completo está a apenas um clique de distância. Confira as ofertas pelo link abaixo!';
            // Texto original do site
            if (textoAtual === 'O Universal Auto é de uso exclusivo de empresas revendedoras de carros. Se você é uma pessoa física e quer comprar um Seminovo Localiza, acesse nosso estoque pelo link abaixo!') {
                p.innerHTML = novoTexto + '<br>' + novoTexto2;
            }
            // Texto já modificado nas versões anteriores do script
            if (!p.innerHTML.includes(novoTexto) && (
                p.innerHTML.includes('O Universal Auto') ||
                p.innerHTML.includes('Universal Auto é de uso') ||
                p.innerHTML.includes('Universal Auto possui loja') ||
                p.innerHTML.includes('Seminovo')
            )) {
                p.innerHTML = novoTexto + '<br>' + novoTexto2;
            }
        }
        const linkP = faqDiv.querySelector('a p.LdsTypography-module_lds-typography--body-md__KI9TK');
        if (linkP && linkP.innerText.trim() === 'https://seminovos.localiza.com/') linkP.innerText = 'https://universalautorepasse.com.br/';
        const link = faqDiv.querySelector('a');
        if (link && link.getAttribute('href') === 'https://seminovos.localiza.com/') link.setAttribute('href', 'https://universalautorepasse.com.br/');
    }

    function modifyFaqCadastroButton() {
        const faqButtons = document.querySelector('.FAQ_buttons__XTKyw');
        if (!faqButtons) return;
        const selectorFaq = [
            'button.LdsButton-module_lds-button--contained-primary__6r3Mk',
            'button[class*="lds-button--contained-tertiary"]',
            'button[class*="lds-button--contained-secondary"]'
        ].join(',');
        faqButtons.querySelectorAll(selectorFaq).forEach(btn => {
            const span = btn.querySelector('span');
            if (span && (span.innerText.trim() === 'Cadastre-se agora' || span.innerText.trim() === 'Cadatre-se agora') && !btn.dataset.uaFaqDone) {
                span.innerText = 'Nosso Contacto';
                const novoBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(novoBtn, btn);
                novoBtn.dataset.uaFaqDone = '1';
                novoBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); window.location.href = 'mailto:contato@universalautorepasse.com.br'; });
            }
        });
    }

    function modifyLoginDialog() {
        const dialog = document.querySelector('.LdsDialog-module_lds-dialog-container__Br8cE');
        if (!dialog) return;
        const content = dialog.querySelector('.Catalog_dialogContent__WQLIT');
        if (!content) return;
        const p = content.querySelector('p.LdsTypography-module_lds-typography--body-md__KI9TK');
        if (p && p.innerText.trim() === 'Faça o Login ou cadastre-se para ter acesso a todas nossas ofertas') p.innerText = 'Consulte o nosso catálogo e utilize os filtros ou a barra de pesquisa para localizar as melhores oportunidades desta marca.';
        const loginBtn = content.querySelector('button.LdsButton-module_lds-button--basic-primary__Nv8Ii');
        if (loginBtn && loginBtn.innerText.includes('Já possui conta? Faça o login')) loginBtn.remove();
        const cadastroBtn = content.querySelector('button.LdsButton-module_lds-button--contained-primary__6r3Mk');
        if (cadastroBtn) {
            const span = cadastroBtn.querySelector('span');
            if (span && span.innerText.trim() === 'Cadastre-se') {
                span.innerText = 'Preço Único';
                const novoBtn = cadastroBtn.cloneNode(true);
                cadastroBtn.parentNode.replaceChild(novoBtn, cadastroBtn);
                novoBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); window.location.href = 'https://universalautorepasse.com/carros'; });
            }
        }
    }

    function modifyContatoButton() {
        document.querySelectorAll('button.LdsButton-module_lds-button--contained-primary__6r3Mk').forEach(btn => {
            if (btn.closest('.Hero_heroTextContainer__o_LrP')) return;
            if (btn.closest('.FAQ_buttons__XTKyw')) return;
            if (btn.dataset.uaHeroDone || btn.dataset.uaFaqDone || btn.dataset.uaContatoDone) return;
            const span = btn.querySelector('span');
            if (span && span.innerText.trim() === 'Veja o nosso catálogo') {
                span.innerText = 'Nosso Contacto';
                const novoBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(novoBtn, btn);
                novoBtn.dataset.uaContatoDone = '1';
                novoBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); window.location.href = 'mailto:contato@universalautorepasse.com.br'; });
            }
        });
    }

    function modifyHowItWorksTitle() {
        const titleElement = document.querySelector('h1.LdsTypography-module_lds-typography__-DOlx.LdsTypography-module_lds-typography--heading-lg__-4owW.HowItWorks_titleText__5z83G');
        if (titleElement && titleElement.innerHTML !== 'Como funciona? <br> Veja como é <span>rápido</span> <br> e <span>simples</span> comprar na universal.') {
            titleElement.innerHTML = 'Como funciona? <br> Veja como é <span>rápido</span> <br> e <span>simples</span> comprar na universal.';
        }
    }

    const titulosMapping = [
        { original: "Qual é o benefício de realizar o cadastro no Universal Auto?", novo: "O que significa comprar um carro de \"repasse\"?" },
        { original: "Posso realizar o cadastro de empresas de qualquer segmento?", novo: "Os veículos possuem garantia de motor e câmbio?" },
        { original: "Como posso ter acesso às ofertas disponíveis?", novo: "É possível financiar um carro de repasse na loja?" },
        { original: "Sou pessoa física. Consigo comprar no Universal Auto?", novo: "Como posso verificar a procedência e documentação do carro?" },
        { original: "Consigo fazer compras 100% online?", novo: "Posso dar o meu carro atual como entrada na troca?" },
        { original: "Quais são as formas de pagamento?", novo: "Onde a loja física está localizada e qual o horário de atendimento?" }
    ];
    const respostasMapping = [
        { original: "Após realizar o cadastro, você passará a ter acesso completo ao catálogo", novo: "Comprar um carro de repasse significa adquirir um veículo no estado em que ele se encontra, geralmente proveniente de trocas em grandes concessionárias. Esses carros são vendidos por valores significativamente abaixo da tabela FIPE porque a loja não realiza revisões estéticas ou mecânicas completas antes da venda, repassando a margem de lucro e a responsabilidade de manutenção para o comprador." },
        { original: "Você poderá cadastrar apenas empresas que possuam um CNAE principal", novo: "Nesta modalidade específica de negócio, os veículos são vendidos sem garantia de mecânica ou estética. O comprador assume o carro \"no estado\", ciente de que o preço reduzido compensa eventuais manutenções que precisem ser feitas. Por isso, recomendamos sempre levar um mecânico de confiança para avaliar o veículo no pátio antes de fechar o negócio." },
        { original: "Para acessar as ofertas disponíveis é necessário que você realize o cadastro", novo: "Sim, a Universal Auto Repasse costuma trabalhar com parcerias bancárias para facilitar o pagamento. No entanto, por serem carros com preços promocionais, as condições de financiamento e a aprovação de crédito dependem do ano do veículo e do perfil do CPF do cliente. Também é comum aceitarem cartões de crédito para parcelamento da entrada ou do valor total." },
        { original: "Não, se você é uma pessoa física e deseja comprar um veículo seminovo", novo: "Todos os veículos comercializados passam por uma verificação de procedência. No momento da compra, o cliente tem acesso às informações sobre multas, IPVA e restrições. A transferência de propriedade segue o rito padrão do DETRAN, e a loja fornece o suporte necessário para que o documento seja transferido corretamente para o novo proprietário após a quitação." },
        { original: "Sim, você poderá comprar o seu veículo totalmente online e sem sair de casa", novo: "Sim, a loja avalia veículos como parte do pagamento. Vale lembrar que, como a Universal trabalha com margens de repasse, a avaliação do seu usado também seguirá uma métrica de mercado para revenda rápida, permitindo que você saia com um modelo mais novo ou de categoria superior utilizando seu crédito atual." },
        { original: "O pagamento pode ser realizado via PIX à vista ou boleto bancário", novo: "A sede física fica em Santo André - SP, na Avenida Pereira Barreto, 42 - Vila Gilda. O atendimento ocorre de segunda a sexta, das 9h às 16h, e aos sábados também das 9h às 16h. É recomendável agendar uma visita ou consultar o estoque atual via WhatsApp antes de se deslocar, devido à alta rotatividade dos veículos." }
    ];

    function replaceFaqTitles() {
        document.querySelectorAll('.LdsAccordionItem-module_lds-accordion-item--title__n6Vx5 span').forEach(span => {
            const current = span.innerText.trim();
            for (let item of titulosMapping) {
                if (current === item.original && span.innerText !== item.novo) {
                    span.innerText = item.novo;
                    break;
                }
            }
        });
    }

    function replaceFaqAnswers() {
        document.querySelectorAll('.LdsAccordionItem-module_lds-accordion-item--content__ns-Tz p.LdsTypography-module_lds-typography--body-md__KI9TK').forEach(p => {
            const current = p.innerText.trim();
            for (let item of respostasMapping) {
                if (current === item.original || current.startsWith(item.original)) {
                    if (p.innerText !== item.novo) p.innerText = item.novo;
                    break;
                }
            }
        });
    }

    function modifyAccordionFaq() {
        replaceFaqTitles();
        replaceFaqAnswers();
        document.querySelectorAll('a[href="https://seminovos.localiza.com/"]').forEach(link => link.remove());
        document.querySelectorAll('p.LdsTypography-module_lds-typography--body-md__KI9TK').forEach(p => {
            if (p.innerText.trim() === 'Os melhores preços para a sua empresa, com flexibilidade de negociação.') p.innerText = 'Os melhores preços do mercado, com flexibilidade de negociação.';
        });
    }

    function observeAccordionExpansion() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mut => {
                if (mut.type !== 'attributes' || mut.attributeName !== 'open') return;
                const details = mut.target;
                if (!details.matches('details[data-testid="accordion-item"]')) return;
                if (!details.hasAttribute('open')) return;
                const content = details.querySelector('.LdsAccordionItem-module_lds-accordion-item--content__ns-Tz');
                if (content) content.style.setProperty('display', 'none', 'important');
                replaceFaqTitles();
                replaceFaqAnswers();
                setTimeout(() => { if (content) content.style.removeProperty('display'); }, 10);
            });
        });
        observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['open'] });
    }

    function watchFaqPermanently() {
        const observer = new MutationObserver(mutations => {
            let needsReplace = false;
            for (const mut of mutations) {
                if (mut.addedNodes.length) {
                    for (const node of mut.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.matches && (node.matches('.LdsAccordionItem-module_lds-accordion-item--title__n6Vx5 span') || node.matches('.LdsAccordionItem-module_lds-accordion-item--content__ns-Tz p'))) needsReplace = true;
                            else if (node.querySelector && (node.querySelector('.LdsAccordionItem-module_lds-accordion-item--title__n6Vx5 span') || node.querySelector('.LdsAccordionItem-module_lds-accordion-item--content__ns-Tz p'))) needsReplace = true;
                        }
                    }
                }
                if (mut.type === 'characterData' && mut.target.parentNode) {
                    const parentTitle = mut.target.parentNode.closest?.('span');
                    const parentPara = mut.target.parentNode.closest?.('p');
                    if ((parentTitle && parentTitle.closest('.LdsAccordionItem-module_lds-accordion-item--title__n6Vx5')) || (parentPara && parentPara.closest('.LdsAccordionItem-module_lds-accordion-item--content__ns-Tz'))) needsReplace = true;
                }
            }
            if (needsReplace) { replaceFaqTitles(); replaceFaqAnswers(); }
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true, characterDataOldValue: false });
    }

    function observeModalInstant() {
        const observerModal = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes && mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.matches && node.matches('.LdsDialog-module_lds-dialog-container__Br8cE')) modifyLoginDialog();
                        else if (node.nodeType === 1 && node.querySelector) {
                            const inner = node.querySelector('.LdsDialog-module_lds-dialog-container__Br8cE');
                            if (inner) modifyLoginDialog();
                        }
                    });
                }
            });
        });
        observerModal.observe(document.body, { childList: true, subtree: true });
    }

    function replacePortalText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = node.nodeValue.replace(/Portal do Lojista/gi, 'Universal Auto');
        } else {
            node.childNodes.forEach(replacePortalText);
        }
    }

    // ============================================================
    // FUNÇÃO PRINCIPAL DE LISTAGEM
    // ============================================================
    let isApplying = false;

    function applyListagem() {
        if (!dadosCarregados || isApplying) return;
        isApplying = true;
        try {
            const cards = document.querySelectorAll('[class*="VehicleCard"]');
            cards.forEach(card => {
                const link = card.querySelector('a[href*="/carro/"]');
                if (!link) return;
                const match = link.getAttribute('href').match(/-(\d+)$/);
                if (!match) return;
                const id = parseInt(match[1], 10);
                const veiculo = todosVeiculos.find(v => v.id === id);
                if (!veiculo) return;

                if (precoPorId.has(id)) {
                    const precoFinal = precoPorId.get(id);
                    const precoElem = card.querySelector('[class*="blurred"]');
                    if (precoElem && !precoElem.innerText.includes(precoFinal.toLocaleString('pt-BR'))) {
                        precoElem.innerText = 'R$ ' + precoFinal.toLocaleString('pt-BR');
                        precoElem.style.filter = 'none';
                        precoElem.style.opacity = '1';
                    }
                }

                const features = veiculo.features || [];
                let badgeContainer = card.querySelector('.VehicleCard_badgePosition__C2OEq');
                if (!badgeContainer) {
                    const imageContainer = card.querySelector('.VehicleCard_imageContainer__GNlHd');
                    if (imageContainer) {
                        badgeContainer = document.createElement('div');
                        badgeContainer.className = 'VehicleCard_badgePosition__C2OEq';
                        imageContainer.appendChild(badgeContainer);
                    }
                }
                if (badgeContainer && features.length > 0 && !badgeContainer.hasAttribute('data-ua-badge-processed')) {
                    badgeContainer.setAttribute('data-ua-badge-processed', 'true');
                    badgeContainer.innerHTML = '';
                    features.forEach(feat => {
                        const desc = feat.description;
                        if (desc === 'Acabou de chegar') {
                            badgeContainer.innerHTML += '<div class="Badge_container__eLOMO" style="background-color: var(--lds-color-accent-critical-emphasis-lower); color: var(--lds-color-accent-critical-emphasis-high);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 7.00004C8.16667 5.27337 7 2.91671 6.41667 2.33337C6.41667 4.10554 5.38242 5.09896 4.66667 5.83337C3.9515 6.56837 3.5 7.72337 3.5 8.75004C3.5 9.6783 3.86875 10.5685 4.52513 11.2249C5.1815 11.8813 6.07174 12.25 7 12.25C7.92826 12.25 8.8185 11.8813 9.47487 11.2249C10.1313 10.5685 10.5 9.6783 10.5 8.75004C10.5 7.85637 9.884 6.45171 9.33333 5.83337C8.2915 7.58337 7.70525 7.58337 7 7.00004Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>Acabou de chegar</div>';
                        } else if (desc === 'Garantia de Fábrica') {
                            badgeContainer.innerHTML += '<div class="Badge_container__eLOMO" style="background-color: var(--lds-color-accent-info-emphasis-lower); color: var(--lds-color-accent-info-emphasis-high);"><svg width="14" height="14" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" role="presentation"><path d="M12.24 2.004L12 2L11.76 2.004C9.94609 2.06623 8.22726 2.83056 6.96607 4.13577C5.70489 5.44098 4.99997 7.18502 5 9L5.006 9.292L5.03 9.657L5.069 9.98L5.089 10.119L5.138 10.39L5.198 10.661C5.22606 10.7764 5.25707 10.8911 5.291 11.005L5.386 11.299L5.466 11.516L5.518 11.649L5.648 11.946C6.2088 13.1545 7.10276 14.1779 8.22492 14.896C9.34708 15.614 10.6508 15.9971 11.9831 16C13.3153 16.0029 14.6208 15.6257 15.7461 14.9125C16.8714 14.1994 17.7699 13.18 18.336 11.974L18.489 11.626L18.605 11.318C18.7501 10.9062 18.8562 10.4816 18.922 10.05L18.946 9.872L18.972 9.63L18.99 9.385L18.997 9.193L19 9C19 7.18502 18.2951 5.44098 17.0339 4.13577C15.7727 2.83056 14.0539 2.06623 12.24 2.004Z" fill="currentColor"></path><path d="M11.43 17.9821L9.46398 21.3901C9.38432 21.5281 9.27283 21.6452 9.1388 21.7315C9.00477 21.8177 8.85207 21.8708 8.6934 21.8861C8.53474 21.9015 8.3747 21.8787 8.22661 21.8197C8.07852 21.7608 7.94665 21.6673 7.84198 21.5471L7.76598 21.4471L7.70198 21.3331L6.39798 18.6981L3.46698 18.8881C3.30553 18.8984 3.14397 18.8695 2.99613 18.8038C2.8483 18.7381 2.71859 18.6375 2.61813 18.5107C2.51766 18.3839 2.44943 18.2346 2.41927 18.0757C2.38912 17.9167 2.39794 17.7528 2.44498 17.5981L2.48498 17.4911L2.53498 17.3911L4.50298 13.9821C5.27066 15.1382 6.29546 16.101 7.49718 16.7951C8.69891 17.4892 10.045 17.8948 11.43 17.9821Z" fill="currentColor"></path><path d="M19.4959 13.983L21.4619 17.389C21.5428 17.5293 21.5885 17.687 21.595 17.8488C21.6016 18.0106 21.5688 18.1715 21.4995 18.3178C21.4301 18.4641 21.3264 18.5915 21.197 18.6889C21.0677 18.7862 20.9167 18.8508 20.7569 18.877L20.6439 18.888L20.5319 18.887L17.5989 18.697L16.2959 21.333C16.2252 21.4758 16.1214 21.5996 15.9932 21.6941C15.865 21.7887 15.7161 21.8513 15.5588 21.8767C15.4015 21.9021 15.2405 21.8896 15.089 21.8403C14.9375 21.791 14.8 21.7062 14.6879 21.593L14.6059 21.499L14.5339 21.389L12.5659 17.982C13.9513 17.8954 15.2978 17.4894 16.5001 16.7956C17.7024 16.1018 18.7277 15.1392 19.4959 13.983Z" fill="currentColor"></path></svg>Garantia de fábrica</div>';
                        }
                    });
                }

                const report = veiculo.inspectionReport || {};
                const hasPdf = report.pdfUrl && report.pdfUrl.trim() !== "";
                const hasVideo = report.videoUrl && report.videoUrl.trim() !== "";
                const existingContainer = card.querySelector('.VehicleCard_badgeContainer__v1N5b');
                if (existingContainer && existingContainer.hasAttribute('data-ua-processed')) return;
                if (existingContainer) existingContainer.remove();
                if (hasPdf || hasVideo) {
                    const newContainer = document.createElement('div');
                    newContainer.className = 'VehicleCard_badgeContainer__v1N5b';
                    newContainer.setAttribute('data-ua-processed', 'true');
                    newContainer.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;';
                    if (hasPdf) {
                        const pdfBtn = document.createElement('button');
                        pdfBtn.type = 'button';
                        pdfBtn.className = 'base-Button-root LdsButton-module_lds-button__tSDnh LdsButton-module_lds-button--contained-primary__6r3Mk LdsButton-module_lds-button--md__PfuKT LdsButton-module_lds-states__PuVrv LdsButton-module_lds-states--contained__vVTBv ReportPDFButton_buttonReportPDF__s2Ze3';
                        pdfBtn.innerHTML = '<span class="LdsButton-module_lds-button__content__mtkkN"><div class="ReportPDFButton_buttonReportWrapperContent__C6ikM"><svg width="16" height="16" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" role="presentation"><g fill="currentColor"><path d="m7.0001 2.09998c-.76913 0-1.50676.30553-2.05061.84939-.54386.54385-.84939 1.28148-.84939 2.05061v14.00002c0 .7691.30553 1.5067.84939 2.0506.54385.5438 1.28148.8494 2.05061.8494h10c.7691 0 1.5068-.3056 2.0506-.8494.5439-.5439.8494-1.2815.8494-2.0506v-10.10002h-4.9c-.5039 0-.9872-.20018-1.3435-.5565s-.5565-.83959-.5565-1.3435v-4.9zm8.6364 11.53642-4 4c-.3515.3514-.9213.3514-1.2728 0l-2-2c-.35147-.3515-.35147-.9213 0-1.2728s.92132-.3515 1.27279 0l1.36361 1.3636 3.3636-3.3636c.3515-.3515.9213-.3515 1.2728 0s.3515.9213 0 1.2728z"></path><path d="m14.9001 2.62718 4.4728 4.4728h-4.3728c-.0265 0-.052-.01054-.0707-.02929-.0188-.01876-.0293-.04419-.0293-.07071z"></path></g></svg><span>Laudo</span></div></span>';
                        pdfBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); showPdfModal(report.pdfUrl); return false; });
                        newContainer.appendChild(pdfBtn);
                    }
                    if (hasVideo) {
                        const videoBtn = document.createElement('button');
                        videoBtn.type = 'button';
                        videoBtn.className = 'base-Button-root LdsButton-module_lds-button__tSDnh LdsButton-module_lds-button--contained-primary__6r3Mk LdsButton-module_lds-button--md__PfuKT LdsButton-module_lds-states__PuVrv LdsButton-module_lds-states--contained__vVTBv ReportVideoButton_buttonReportVideo__lPhz3';
                        videoBtn.innerHTML = '<span class="LdsButton-module_lds-button__content__mtkkN"><div class="ReportVideoButton_buttonReportWrapperContent__pFcd9"><svg width="16" height="16" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" role="presentation"><path d="M6.56055 3.21395C6.84516 3.05491 7.194 3.06263 7.47168 3.23348L20.4717 11.2335C20.7378 11.3973 20.9004 11.6876 20.9004 12.0001C20.9004 12.3126 20.7378 12.6029 20.4717 12.7667L7.47168 20.7667C7.19402 20.9375 6.84514 20.9452 6.56055 20.7862C6.27602 20.6272 6.09964 20.3261 6.09961 20.0001V4.00008C6.09961 3.67409 6.27601 3.37302 6.56055 3.21395Z" fill="currentColor"></path></svg><span>Vídeo</span></div></span>';
                        videoBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); showVideoModal(report.videoUrl); return false; });
                        newContainer.appendChild(videoBtn);
                    }
                    const isMobileCard = window.innerWidth < 768;
                    if (isMobileCard) {
                        newContainer.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;padding:0 8px 8px 0px;';
                        // Insere os botões DENTRO do footer, antes do botão de interesse
                        const footerDiv = card.querySelector('.VehicleCard_footer___2ZiN');
                        if (footerDiv) {
                            footerDiv.insertBefore(newContainer, footerDiv.firstChild);
                        } else {
                            card.appendChild(newContainer);
                        }
                    } else {
                        if (!card.style.position) card.style.position = 'relative';
                        newContainer.style.position = 'absolute';
                        const infoContainer = link.querySelector('.VehicleCard_infoContainer__Fr3Ak');
                        if (infoContainer) {
                            const infoRect = infoContainer.getBoundingClientRect();
                            const cardRect = card.getBoundingClientRect();
                            const topRelative = infoRect.bottom - cardRect.top - 3;
                            newContainer.style.top = topRelative + 'px';
                            newContainer.style.left = '6px';
                            newContainer.style.zIndex = '2';
                        }
                        card.appendChild(newContainer);
                    }
                }

                const fipe = veiculo.fipe || {};
                const novoPrecoCard = veiculo.priceFor + ACRESCIMO;
                const novaMargemCard = (fipe.price && fipe.price > novoPrecoCard) ? ((fipe.price - novoPrecoCard) / fipe.price) * 100 : 0;
                if (novaMargemCard > 0) {
                    const footerDiv = card.querySelector('.VehicleCard_footer___2ZiN');
                    if (footerDiv) {
                        let priceContainer = footerDiv.querySelector('.Price_priceContainer__UFleO');
                        if (!priceContainer) {
                            const priceDiv = footerDiv.querySelector('div > div > h2, div > div > h3');
                            if (priceDiv && priceDiv.closest('div')) {
                                priceContainer = priceDiv.closest('div');
                                if (priceContainer && !priceContainer.classList.contains('Price_priceContainer__UFleO')) priceContainer.classList.add('Price_priceContainer__UFleO');
                            }
                        }
                        if (priceContainer) {
                            const fipePercent = novaMargemCard.toFixed(2).replace('.', ',');
                            const novoConteudo = '<svg width="16" height="16" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" role="presentation"><path d="m12.9001 5.0001c0-.49706-.4029-.9-.9-.9s-.9.40294-.9.9v11.8272l-4.46361-4.4636c-.35147-.3515-.92132-.3515-1.27279 0s-.35147.9213 0 1.2728l6 6c.1688.1688.3977.2636.6364.2636s.4676-.0948.6364-.2636l6-6c.3515-.3515.3515-.9213 0-1.2728s-.9213-.3515-1.2728 0l-4.4636 4.4636z" fill="currentColor"></path></svg> ' + fipePercent + '% FIPE';
                            const existingFipe = priceContainer.querySelector('.Price_fipeContainer__t6NfV');
                            if (existingFipe) {
                                // Actualiza o elemento já existente (renderizado pelo site original com valor antigo)
                                if (existingFipe.getAttribute('data-ua-fipe-card') !== fipePercent) {
                                    existingFipe.innerHTML = novoConteudo;
                                    existingFipe.setAttribute('data-ua-fipe-card', fipePercent);
                                }
                            } else {
                                const fipeHtml = document.createElement('div');
                                fipeHtml.className = 'Price_fipeContainer__t6NfV';
                                fipeHtml.innerHTML = novoConteudo;
                                fipeHtml.setAttribute('data-ua-fipe-card', fipePercent);
                                priceContainer.appendChild(fipeHtml);
                            }
                        }
                    }
                }

                const botoes = card.querySelectorAll('button');
                for (let i = 0; i < botoes.length; i++) {
                    const btn = botoes[i];
                    if (btn.innerText.includes('Ver mais informações')) {
                        if (!btn.classList.contains('botao-personalizado')) {
                            btn.classList.remove('LdsButton-module_lds-button--outlined-primary__ZxRfx','LdsButton-module_lds-states--outlined__4D3s7');
                            btn.classList.add('LdsButton-module_lds-button--contained-primary__6r3Mk','LdsButton-module_lds-states--contained__vVTBv','botao-personalizado');
                            btn.innerText = 'Tenho interesse';
                            const novoBotao = btn.cloneNode(true);
                            btn.parentNode.replaceChild(novoBotao, btn);
                            (function(nb, lnk) {
                                nb.addEventListener('click', (e) => {
                                    e.preventDefault(); e.stopPropagation();
                                    window.location.href = lnk.href;
                                });
                            })(novoBotao, link);
                        }
                        break;
                    }
                }
            });
        } finally {
            isApplying = false;
        }
    }

    // ============================================================
    // SIDEBAR (PÁGINA DE DETALHES)
    // ============================================================
    function applySidebar(carroData) {
        const rightSidebar = document.querySelector('.DesktopPage_rightSide__uZfet');
        if (!rightSidebar || !carroData) return;
        const container = rightSidebar.querySelector('.DesktopPage_container__eiImn');
        if (!container) return;
        if (container.hasAttribute('data-ua-sidebar-processed')) return;
        container.setAttribute('data-ua-sidebar-processed', 'true');
        const novoPreco = carroData.priceFor + ACRESCIMO;
        const precoFormatado = novoPreco.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
        const nomeLoja = (carroData.store && carroData.store.name) ? carroData.store.name : 'Loja não informada';
        const cidade = (carroData.store && carroData.store.city && carroData.store.state) ? carroData.store.city + ' - ' + carroData.store.state : 'Fortaleza - CE';
        const km = carroData.odometer.toLocaleString('pt-BR');
        const features = carroData.features || [];
        let badgesHtml = '';
        features.forEach(feat => {
            if (feat.description === 'Acabou de chegar') {
                badgesHtml += '<div class="Badge_container__eLOMO" style="background-color: var(--lds-color-accent-critical-emphasis-lower); color: var(--lds-color-accent-critical-emphasis-high); margin-top: 8px; display: inline-block; margin-right: 8px;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 7.00004C8.16667 5.27337 7 2.91671 6.41667 2.33337C6.41667 4.10554 5.38242 5.09896 4.66667 5.83337C3.9515 6.56837 3.5 7.72337 3.5 8.75004C3.5 9.6783 3.86875 10.5685 4.52513 11.2249C5.1815 11.8813 6.07174 12.25 7 12.25C7.92826 12.25 8.8185 11.8813 9.47487 11.2249C10.1313 10.5685 10.5 9.6783 10.5 8.75004C10.5 7.85637 9.884 6.45171 9.33333 5.83337C8.2915 7.58337 7.70525 7.58337 7 7.00004Z" fill="var(--lds-color-accent-critical-emphasis-high)" stroke="var(--lds-color-accent-critical-emphasis-high)" stroke-linecap="round" stroke-linejoin="round"></path></svg>Acabou de chegar</div>';
            } else if (feat.description === 'Garantia de Fábrica') {
                badgesHtml += '<div class="Badge_container__eLOMO" style="background-color: var(--lds-color-accent-info-emphasis-lower); color: var(--lds-color-accent-info-emphasis-high); margin-top: 8px; display: inline-block; margin-right: 8px;"><svg width="14" height="14" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" role="presentation"><path d="M12.24 2.004L12 2L11.76 2.004C9.94609 2.06623 8.22726 2.83056 6.96607 4.13577C5.70489 5.44098 4.99997 7.18502 5 9L5.006 9.292L5.03 9.657L5.069 9.98L5.089 10.119L5.138 10.39L5.198 10.661C5.22606 10.7764 5.25707 10.8911 5.291 11.005L5.386 11.299L5.466 11.516L5.518 11.649L5.648 11.946C6.2088 13.1545 7.10276 14.1779 8.22492 14.896C9.34708 15.614 10.6508 15.9971 11.9831 16C13.3153 16.0029 14.6208 15.6257 15.7461 14.9125C16.8714 14.1994 17.7699 13.18 18.336 11.974L18.489 11.626L18.605 11.318C18.7501 10.9062 18.8562 10.4816 18.922 10.05L18.946 9.872L18.972 9.63L18.99 9.385L18.997 9.193L19 9C19 7.18502 18.2951 5.44098 17.0339 4.13577C15.7727 2.83056 14.0539 2.06623 12.24 2.004Z" fill="currentColor"></path><path d="M11.43 17.9821L9.46398 21.3901C9.38432 21.5281 9.27283 21.6452 9.1388 21.7315C9.00477 21.8177 8.85207 21.8708 8.6934 21.8861C8.53474 21.9015 8.3747 21.8787 8.22661 21.8197C8.07852 21.7608 7.94665 21.6673 7.84198 21.5471L7.76598 21.4471L7.70198 21.3331L6.39798 18.6981L3.46698 18.8881C3.30553 18.8984 3.14397 18.8695 2.99613 18.8038C2.8483 18.7381 2.71859 18.6375 2.61813 18.5107C2.51766 18.3839 2.44943 18.2346 2.41927 18.0757C2.38912 17.9167 2.39794 17.7528 2.44498 17.5981L2.48498 17.4911L2.53498 17.3911L4.50298 13.9821C5.27066 15.1382 6.29546 16.101 7.49718 16.7951C8.69891 17.4892 10.045 17.8948 11.43 17.9821Z" fill="currentColor"></path><path d="M19.4959 13.983L21.4619 17.389C21.5428 17.5293 21.5885 17.687 21.595 17.8488C21.6016 18.0106 21.5688 18.1715 21.4995 18.3178C21.4301 18.4641 21.3264 18.5915 21.197 18.6889C21.0677 18.7862 20.9167 18.8508 20.7569 18.877L20.6439 18.888L20.5319 18.887L17.5989 18.697L16.2959 21.333C16.2252 21.4758 16.1214 21.5996 15.9932 21.6941C15.865 21.7887 15.7161 21.8513 15.5588 21.8767C15.4015 21.9021 15.2405 21.8896 15.089 21.8403C14.9375 21.791 14.8 21.7062 14.6879 21.593L14.6059 21.499L14.5339 21.389L12.5659 17.982C13.9513 17.8954 15.2978 17.4894 16.5001 16.7956C17.7024 16.1018 18.7277 15.1392 19.4959 13.983Z" fill="currentColor"></path></svg>Garantia de fábrica</div>';
            }
        });
        const report = carroData.inspectionReport || {};
        const hasPdf = report.pdfUrl && report.pdfUrl.trim() !== "";
        const hasVideo = report.videoUrl && report.videoUrl.trim() !== "";
        let reportsHtml = '';
        if (hasPdf) {
            reportsHtml += '<button type="button" class="base-Button-root LdsButton-module_lds-button__tSDnh LdsButton-module_lds-button--contained-primary__6r3Mk LdsButton-module_lds-button--md__PfuKT LdsButton-module_lds-states__PuVrv LdsButton-module_lds-states--contained__vVTBv ReportPDFButton_buttonReportPDF__s2Ze3" style="margin-right: 8px;"><span class="LdsButton-module_lds-button__content__mtkkN"><div class="ReportPDFButton_buttonReportWrapperContent__C6ikM"><svg width="16" height="16" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" role="presentation"><g fill="currentColor"><path d="m7.0001 2.09998c-.76913 0-1.50676.30553-2.05061.84939-.54386.54385-.84939 1.28148-.84939 2.05061v14.00002c0 .7691.30553 1.5067.84939 2.0506.54385.5438 1.28148.8494 2.05061.8494h10c.7691 0 1.5068-.3056 2.0506-.8494.5439-.5439.8494-1.2815.8494-2.0506v-10.10002h-4.9c-.5039 0-.9872-.20018-1.3435-.5565s-.5565-.83959-.5565-1.3435v-4.9zm8.6364 11.53642-4 4c-.3515.3514-.9213.3514-1.2728 0l-2-2c-.35147-.3515-.35147-.9213 0-1.2728s.92132-.3515 1.27279 0l1.36361 1.3636 3.3636-3.3636c.3515-.3515.9213-.3515 1.2728 0s.3515.9213 0 1.2728z"></path><path d="m14.9001 2.62718 4.4728 4.4728h-4.3728c-.0265 0-.052-.01054-.0707-.02929-.0188-.01876-.0293-.04419-.0293-.07071z"></path></g></svg><span>Laudo</span></div></span></button>';
        }
        if (hasVideo) {
            reportsHtml += '<button type="button" class="base-Button-root LdsButton-module_lds-button__tSDnh LdsButton-module_lds-button--contained-primary__6r3Mk LdsButton-module_lds-button--md__PfuKT LdsButton-module_lds-states__PuVrv LdsButton-module_lds-states--contained__vVTBv ReportVideoButton_buttonReportVideo__lPhz3"><span class="LdsButton-module_lds-button__content__mtkkN"><div class="ReportVideoButton_buttonReportWrapperContent__pFcd9"><svg width="16" height="16" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" role="presentation"><path d="M6.56055 3.21395C6.84516 3.05491 7.194 3.06263 7.47168 3.23348L20.4717 11.2335C20.7378 11.3973 20.9004 11.6876 20.9004 12.0001C20.9004 12.3126 20.7378 12.6029 20.4717 12.7667L7.47168 20.7667C7.19402 20.9375 6.84514 20.9452 6.56055 20.7862C6.27602 20.6272 6.09964 20.3261 6.09961 20.0001V4.00008C6.09961 3.67409 6.27601 3.37302 6.56055 3.21395Z" fill="currentColor"></path></svg><span>Vídeo</span></div></span></button>';
        }
        const fipe = carroData.fipe || {};
        // Recalcula distancia e margem FIPE com base no novo preço (priceFor + ACRESCIMO)
        const novaDistanciaSide = fipe.price ? (fipe.price - novoPreco) : null;
        const novaMargemSide = (fipe.price && novaDistanciaSide !== null) ? (novaDistanciaSide / fipe.price) * 100 : null;
        let fipePercentHtml = '';
        if (novaMargemSide && novaMargemSide > 0) {
            const percent = novaMargemSide.toFixed(2).replace('.', ',');
            fipePercentHtml = '<div class="Price_fipeContainer__t6NfV"><svg width="16" height="16" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" role="presentation"><path d="m12.9001 5.0001c0-.49706-.4029-.9-.9-.9s-.9.40294-.9.9v11.8272l-4.46361-4.4636c-.35147-.3515-.92132-.3515-1.27279 0s-.35147.9213 0 1.2728l6 6c.1688.1688.3977.2636.6364.2636s.4676-.0948.6364-.2636l6-6c.3515-.3515.3515-.9213 0-1.2728s-.9213-.3515-1.2728 0l-4.4636 4.4636z" fill="currentColor"></path></svg>' + percent + '% abaixo FIPE</div>';
        }
        const fipePrice = fipe.price ? fipe.price.toLocaleString('pt-BR', { style:'currency', currency:'BRL' }) : 'N/A';
        const distance = (novaDistanciaSide !== null && novaDistanciaSide > 0) ? novaDistanciaSide.toLocaleString('pt-BR', { style:'currency', currency:'BRL' }) : 'N/A';
        const marginPercent = (novaMargemSide !== null && novaMargemSide > 0) ? novaMargemSide.toFixed(2).replace('.', ',') + ' %' : 'N/A';
        const comparisonTableHtml = `
            <div class="VehicleFipeComparison_container__lUmIU LdsPaper-module_lds-paper__Jhi1y">
                <div><p class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--body-md__KI9TK VehicleFipeComparison_comparePrices__WgCZ9">Compare os preços</p></div>
                <div class="VehicleFipeComparison_pricesRow__HkQOh">
                    <p class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--body-md__KI9TK VehicleFipeComparison_comparePrices__WgCZ9">Preço FIPE</p>
                    <p class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--body-md__KI9TK VehicleFipeComparison_comparePrices__WgCZ9">${fipePrice}</p>
                </div>
                <div style="background-color: var(--divider-color); height: 1px; width: 100%;"></div>
                <div class="VehicleFipeComparison_valueRow__s31Bd">
                    <div><small>Distancia FIPE</small><h3 class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--heading-md__QVgP4">${distance}</h3></div>
                    <div><small>Margem FIPE</small><h3 class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--heading-md__QVgP4 VehicleFipeComparison_negativeMargin__LLmU6"><svg width="20" height="20" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" role="presentation"><path d="m12.9001 5.0001c0-.49706-.4029-.9-.9-.9s-.9.40294-.9.9v11.8272l-4.46361-4.4636c-.35147-.3515-.92132-.3515-1.27279 0s-.35147.9213 0 1.2728l6 6c.1688.1688.3977.2636.6364.2636s.4676-.0948.6364-.2636l6-6c.3515-.3515.3515-.9213 0-1.2728s-.9213-.3515-1.2728 0l-4.4636 4.4636z" fill="var(--lds-color-accent-success-emphasis-high)"></path></svg>${marginPercent}</h3></div>
                </div>
            </div>
        `;
        const finalHtml = `
            <div class="VehicleTitle_container__mDy6V">
                <div class="VehicleTitle_header__bZBhS">
                    <h4 class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--heading-sm__5NKKy VehicleTitle_version__d4gVg">${carroData.brand}</h4>
                </div>
                <h2 class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--heading-lg__-4owW VehicleTitle_model__Ec3VK"><strong>${carroData.modelFamilyDescription}</strong> ${carroData.model}</h2>
                <p class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--body-md__KI9TK">${carroData.manufactureYear}/${carroData.modelYear}&nbsp;&nbsp;&nbsp;&nbsp;${km} km</p>
                ${badgesHtml ? '<div style="margin-top: 8px;">' + badgesHtml + '</div>' : ''}
            </div>
            <div class="VehicleReports_container__qAkuy">${reportsHtml}</div>
            <div style="background-color:var(--divider-color);height:1px;width:100%"></div>
            <div class="VehicleLocation_container__m8i4B">
                <svg width="20" height="20" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" role="presentation" class="location-icon"><path d="m5.0001 2.09998c-.3409 0-.65253.1926-.80499.4975l-2 4c-.06248.12497-.09501.26278-.09501.4025v1c0 1.03434.41089 2.02632 1.14228 2.75772.25691.2569.54597.4743.85772.6482v8.6941h-1.1c-.49706 0-.9.4029-.9.9 0 .497.40294.9.9.9h18c.4971 0 .9-.403.9-.9 0-.4971-.4029-.9-.9-.9h-1.1v-8.6941c.3117-.1739.6008-.3913.8577-.6482.7314-.7314 1.1423-1.72338 1.1423-2.75772v-1c0-.13972-.0325-.27753-.095-.4025l-2-4c-.1525-.3049-.4641-.4975-.805-.4975zm.9 18.00002v-8.2013c.03328.0008.06662.0013.1.0013 1.03434 0 2.02632-.4109 2.75771-1.1423.08516-.0852.16597-.1738.24229-.2657.07632.0919.15713.1805.24228.2657.73139.7314 1.72342 1.1423 2.75772 1.1423s2.0263-.4109 2.7577-1.1423c.0852-.0852.166-.1738.2423-.2657.0763.0919.1571.1805.2423.2657.7314.7314 1.7234 1.1423 2.7577 1.1423.0334 0 .0667-.0005.1-.0013v8.2013h-2.2v-3.1c0-.7692-.3055-1.5068-.8494-2.0506-.5438-.5439-1.2815-.8494-2.0506-.8494h-2c-.7691 0-1.50676.3055-2.05061.8494-.54386.5438-.84939 1.2814-.84939 2.0506v3.1zm4.6151-10.6151c-.3939-.39383-.6151-.92797-.6151-1.48492v-.1h4.2v.1c0 .55695-.2213 1.09109-.6151 1.48492s-.9279.6151-1.4849.6151-1.0911-.22127-1.4849-.6151zm-2.4151-1.48492c0 .55695-.22125 1.09109-.61508 1.48492-.39382.39383-.92797.6151-1.48492.6151-.55696 0-1.0911-.22127-1.48493-.6151-.39382-.39383-.61507-.92797-.61507-1.48492v-.1h4.2zm-3.64377-1.9 1.1-2.2h12.88757l1.1 2.2zm11.44377 1.8h4.2v.1c0 .55695-.2213 1.09109-.6151 1.48492s-.9279.6151-1.4849.6151-1.0911-.22127-1.4849-.6151c-.3939-.39383-.6151-.92797-.6151-1.48492zm-4.9 8.00002h2c.2917 0 .5715.1159.7778.3222.2063.2062.3222.486.3222.7778v3.1h-4.2v-3.1c0-.2918.1159-.5716.3222-.7778.2063-.2063.4861-.3222.7778-.3222z" fill="currentColor"></path></svg>
                <p class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--body-sm__7uR1-">${nomeLoja}<br><span class="VehicleLocation_opacity__7fAgZ">${cidade}</span></p>
            </div>
            <div style="background-color:var(--divider-color);height:1px;width:100%"></div>
            <div class="VehiclePrice_container__myGEh">
                <div class="Price_priceContainer__UFleO">
                    <div><h2 class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--heading-lg__-4owW">${precoFormatado}</h2></div>
                    ${fipePercentHtml}
                </div>
            </div>
            <div class="whatsapp-button-wrapper" style="margin-bottom:24px;">
                <button type="button" id="whatsapp-button-script" class="whatsapp-button-custom">
                    <span class="whatsapp-icon" style="font-size:24px; margin-right:8px;">💬</span>
                    <span>WhatsApp</span>
                </button>
            </div>
            ${comparisonTableHtml}
        `;
        container.innerHTML = finalHtml;
        if (hasPdf) {
            const pdfBtn = container.querySelector('.ReportPDFButton_buttonReportPDF__s2Ze3');
            if (pdfBtn) pdfBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); showPdfModal(report.pdfUrl); });
        }
        if (hasVideo) {
            const videoBtn = container.querySelector('.ReportVideoButton_buttonReportVideo__lPhz3');
            if (videoBtn) videoBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); showVideoModal(report.videoUrl); });
        }
    }

    // ============================================================
    // PÁGINA DE DETALHES - MOBILE
    // ============================================================
    function applyMobileDetailPage(carroData) {
        if (!carroData) return;
        const report = carroData.inspectionReport || {};
        const hasPdf   = report.pdfUrl  && report.pdfUrl.trim()  !== "";
        const hasVideo = report.videoUrl && report.videoUrl.trim() !== "";
        const fipe     = carroData.fipe || {};
        const features = carroData.features || [];
        document.querySelectorAll('.VehicleTitle_container__mDy6V').forEach(tc => {
            if (tc.hasAttribute('data-ua-mobile-badge')) return;
            if (tc.closest('.DesktopPage_rightSide__uZfet')) return;
            tc.setAttribute('data-ua-mobile-badge', 'true');
            if (features.length > 0) {
                const badgesDiv = document.createElement('div');
                badgesDiv.style.marginTop = '8px';
                features.forEach(feat => {
                    if (feat.description === 'Acabou de chegar') {
                        badgesDiv.innerHTML += '<div class="Badge_container__eLOMO" style="background-color:var(--lds-color-accent-critical-emphasis-lower);color:var(--lds-color-accent-critical-emphasis-high);display:inline-block;margin-right:8px;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 7.00004C8.16667 5.27337 7 2.91671 6.41667 2.33337C6.41667 4.10554 5.38242 5.09896 4.66667 5.83337C3.9515 6.56837 3.5 7.72337 3.5 8.75004C3.5 9.6783 3.86875 10.5685 4.52513 11.2249C5.1815 11.8813 6.07174 12.25 7 12.25C7.92826 12.25 8.8185 11.8813 9.47487 11.2249C10.1313 10.5685 10.5 9.6783 10.5 8.75004C10.5 7.85637 9.884 6.45171 9.33333 5.83337C8.2915 7.58337 7.70525 7.58337 7 7.00004Z" fill="var(--lds-color-accent-critical-emphasis-high)" stroke="var(--lds-color-accent-critical-emphasis-high)" stroke-linecap="round" stroke-linejoin="round"></path></svg>Acabou de chegar</div>';
                    } else if (feat.description === 'Garantia de Fábrica') {
                        badgesDiv.innerHTML += '<div class="Badge_container__eLOMO" style="background-color:var(--lds-color-accent-info-emphasis-lower);color:var(--lds-color-accent-info-emphasis-high);display:inline-block;margin-right:8px;">Garantia de fábrica</div>';
                    }
                });
                tc.appendChild(badgesDiv);
            }
            if ((hasPdf || hasVideo) && !tc.nextElementSibling?.hasAttribute('data-ua-mobile-reports')) {
                const mobileReports = document.createElement('div');
                mobileReports.className = 'VehicleReports_container__qAkuy';
                mobileReports.setAttribute('data-ua-mobile-reports', 'true');
                mobileReports.style.cssText = 'display:flex;gap:8px;padding:8px 0;';
                if (hasPdf) {
                    const pdfBtn2 = document.createElement('button');
                    pdfBtn2.type = 'button';
                    pdfBtn2.className = 'base-Button-root LdsButton-module_lds-button__tSDnh LdsButton-module_lds-button--contained-primary__6r3Mk LdsButton-module_lds-button--md__PfuKT LdsButton-module_lds-states__PuVrv LdsButton-module_lds-states--contained__vVTBv ReportPDFButton_buttonReportPDF__s2Ze3';
                    pdfBtn2.innerHTML = '<span class="LdsButton-module_lds-button__content__mtkkN"><div class="ReportPDFButton_buttonReportWrapperContent__C6ikM"><svg width="16" height="16" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" role="presentation"><g fill="currentColor"><path d="m7.0001 2.09998c-.76913 0-1.50676.30553-2.05061.84939-.54386.54385-.84939 1.28148-.84939 2.05061v14.00002c0 .7691.30553 1.5067.84939 2.0506.54385.5438 1.28148.8494 2.05061.8494h10c.7691 0 1.5068-.3056 2.0506-.8494.5439-.5439.8494-1.2815.8494-2.0506v-10.10002h-4.9c-.5039 0-.9872-.20018-1.3435-.5565s-.5565-.83959-.5565-1.3435v-4.9zm8.6364 11.53642-4 4c-.3515.3514-.9213.3514-1.2728 0l-2-2c-.35147-.3515-.35147-.9213 0-1.2728s.92132-.3515 1.27279 0l1.36361 1.3636 3.3636-3.3636c.3515-.3515.9213-.3515 1.2728 0s.3515.9213 0 1.2728z"></path><path d="m14.9001 2.62718 4.4728 4.4728h-4.3728c-.0265 0-.052-.01054-.0707-.02929-.0188-.01876-.0293-.04419-.0293-.07071z"></path></g></svg><span>Laudo</span></div></span>';
                    pdfBtn2.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); showPdfModal(report.pdfUrl); });
                    mobileReports.appendChild(pdfBtn2);
                }
                if (hasVideo) {
                    const videoBtn2 = document.createElement('button');
                    videoBtn2.type = 'button';
                    videoBtn2.className = 'base-Button-root LdsButton-module_lds-button__tSDnh LdsButton-module_lds-button--contained-primary__6r3Mk LdsButton-module_lds-button--md__PfuKT LdsButton-module_lds-states__PuVrv LdsButton-module_lds-states--contained__vVTBv ReportVideoButton_buttonReportVideo__lPhz3';
                    videoBtn2.innerHTML = '<span class="LdsButton-module_lds-button__content__mtkkN"><div class="ReportVideoButton_buttonReportWrapperContent__pFcd9"><svg width="16" height="16" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" role="presentation"><path d="M6.56055 3.21395C6.84516 3.05491 7.194 3.06263 7.47168 3.23348L20.4717 11.2335C20.7378 11.3973 20.9004 11.6876 20.9004 12.0001C20.9004 12.3126 20.7378 12.6029 20.4717 12.7667L7.47168 20.7667C7.19402 20.9375 6.84514 20.9452 6.56055 20.7862C6.27602 20.6272 6.09964 20.3261 6.09961 20.0001V4.00008C6.09961 3.67409 6.27601 3.37302 6.56055 3.21395Z" fill="currentColor"></path></svg><span>Vídeo</span></div></span>';
                    videoBtn2.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); showVideoModal(report.videoUrl); });
                    mobileReports.appendChild(videoBtn2);
                }
                tc.parentNode.insertBefore(mobileReports, tc.nextSibling);
            }
        });
        if (!fipe.price) return;
        const novoPrecoMobile = carroData.priceFor + ACRESCIMO;
        const novaDistanciaMobile = fipe.price - novoPrecoMobile;
        const novaMargemMobile = (novaDistanciaMobile / fipe.price) * 100;
        const fipePrice = fipe.price.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
        const fipeDistance = novaDistanciaMobile > 0 ? novaDistanciaMobile.toLocaleString('pt-BR', { style:'currency', currency:'BRL' }) : 'N/A';
        const fipeMargin   = novaMargemMobile > 0 ? novaMargemMobile.toFixed(2).replace('.', ',') + ' %' : 'N/A';
        document.querySelectorAll('.MobilePage_contentInterest__dY5dv').forEach(div => {
            if (div.hasAttribute('data-ua-fipe-mobile')) return;
            div.setAttribute('data-ua-fipe-mobile', 'true');
            const tableEl = document.createElement('div');
            tableEl.className = 'VehicleFipeComparison_container__lUmIU LdsPaper-module_lds-paper__Jhi1y';
            tableEl.innerHTML = `
                <div><p class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--body-md__KI9TK VehicleFipeComparison_comparePrices__WgCZ9">Compare os preços</p></div>
                <div class="VehicleFipeComparison_pricesRow__HkQOh">
                    <p class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--body-md__KI9TK VehicleFipeComparison_comparePrices__WgCZ9">Preço FIPE</p>
                    <p class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--body-md__KI9TK VehicleFipeComparison_comparePrices__WgCZ9">${fipePrice}</p>
                </div>
                <div style="background-color:var(--divider-color);height:1px;width:100%;"></div>
                <div class="VehicleFipeComparison_valueRow__s31Bd">
                    <div><small>Distancia FIPE</small><h3 class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--heading-md__QVgP4">${fipeDistance}</h3></div>
                    <div><small>Margem FIPE</small><h3 class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--heading-md__QVgP4 VehicleFipeComparison_negativeMargin__LLmU6"><svg width="20" height="20" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" role="presentation"><path d="m12.9001 5.0001c0-.49706-.4029-.9-.9-.9s-.9.40294-.9.9v11.8272l-4.46361-4.4636c-.35147-.3515-.92132-.3515-1.27279 0s-.35147.9213 0 1.2728l6 6c.1688.1688.3977.2636.6364.2636s.4676-.0948.6364-.2636l6-6c.3515-.3515.3515-.9213 0-1.2728s-.9213-.3515-1.2728 0l-4.4636 4.4636z" fill="var(--lds-color-accent-success-emphasis-high)"></path></svg>${fipeMargin}</h3></div>
                </div>
            `;
            div.appendChild(tableEl);
        });
    }

    // ============================================================
    // DEMAIS FUNÇÕES (header, footer, etc.)
    // ============================================================
    function applyHeaderButtons() {
        document.querySelectorAll('button').forEach(btn => { if (btn.innerText.trim() === 'Cadastrar' && !btn.closest('.VehiclesFilters_buttonsContainer__lY4oa')) btn.remove(); });
        const entrarHeader = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Entrar' && !b.closest('.VehiclesFilters_buttonsContainer__lY4oa'));
        if (entrarHeader && entrarHeader.innerText !== 'Nossos Carros') {
            entrarHeader.innerText = 'Nossos Carros';
            entrarHeader.style.borderColor = '#0055a4';
            entrarHeader.style.color = '#0055a4';
            const clone = entrarHeader.cloneNode(true);
            clone.setAttribute('data-ua-keep-blue', '1');
            entrarHeader.parentNode.replaceChild(clone, entrarHeader);
            clone.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'https://universalautorepasse.com/carros'; });
        }
        // Re-aplica o azul se o botão já existir (loop RAF pode re-encontrá-lo sem o innerText "Entrar")
        const nossosCarrosBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Nossos Carros' && !b.closest('.VehiclesFilters_buttonsContainer__lY4oa'));
        if (nossosCarrosBtn && !nossosCarrosBtn.hasAttribute('data-ua-keep-blue')) {
            nossosCarrosBtn.setAttribute('data-ua-keep-blue', '1');
            nossosCarrosBtn.style.setProperty('border-color', '#0055a4', 'important');
            nossosCarrosBtn.style.setProperty('color', '#0055a4', 'important');
            nossosCarrosBtn.style.setProperty('background-color', 'transparent', 'important');
        }
        const filterCadastrar = document.querySelector('.VehiclesFilters_buttonsContainer__lY4oa button.LdsButton-module_lds-button--contained-primary__6r3Mk');
        if (filterCadastrar && filterCadastrar.innerText.trim() === 'Cadastrar') filterCadastrar.remove();
        const filterEntrar = document.querySelector('.VehiclesFilters_buttonsContainer__lY4oa button.LdsButton-module_lds-button--outlined-primary__ZxRfx');
        if (filterEntrar && filterEntrar.innerText.trim() === 'Entrar' && filterEntrar.innerText !== 'Fale conosco / Contato') {
            filterEntrar.innerText = 'Fale conosco / Contato';
            filterEntrar.style.borderColor = '#0055a4';
            filterEntrar.style.color = '#0055a4';
            const clone2 = filterEntrar.cloneNode(true);
            clone2.setAttribute('data-ua-keep-blue', '1');
            filterEntrar.parentNode.replaceChild(clone2, filterEntrar);
            clone2.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'mailto:contato@universalautorepasse.com.br'; });
        }
    }

    function applyFooter() {
        const lnkLocaliza = document.querySelector('a[href="https://www.localiza.com/"]'); if (lnkLocaliza) { const p1 = lnkLocaliza.closest('.Footer_product__RLAJk'); if(p1) p1.remove(); }
        const lnkZarp = document.querySelector('a[href="https://zarp.localiza.com/"]'); if (lnkZarp) { const p2 = lnkZarp.closest('.Footer_product__RLAJk'); if(p2) p2.remove(); }
        document.querySelectorAll('.Footer_product__RLAJk').forEach(div => { if (div.innerText.trim() === '' && div.children.length === 0) div.remove(); });
        const lnkMeoo = document.querySelector('a[href="https://meoo.localiza.com"]'); const meoo = lnkMeoo ? lnkMeoo.closest('.Footer_product__RLAJk') : null;
        if (meoo && !meoo.querySelector('img[alt="Instagram"]')) { meoo.innerHTML = '<a href="https://www.instagram.com/universalautosp" target="_blank" style="display:flex;align-items:center;gap:8px;text-decoration:none;"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/960px-Instagram_logo_2016.svg.png" alt="Instagram" style="height:24px;width:24px;object-fit:contain;"><div style="display:flex;flex-direction:column;line-height:1.2;"><span style="font-size:16px;font-weight:700;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Instagram</span><p class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--body-md__KI9TK" style="margin:0;color:#888;font-size:11px;">Redes Sociais</p></div></a>'; }
        const lnkFrotas = document.querySelector('a[href="https://frotas.localiza.com/"]'); const frotas = lnkFrotas ? lnkFrotas.closest('.Footer_product__RLAJk') : null;
        if (frotas && !frotas.querySelector('img[alt="Universal Auto Repasse"]')) { frotas.innerHTML = '<a href="https://universalautorepasse.com.br/" target="_blank" style="display:flex;align-items:center;gap:8px;text-decoration:none;"><img src="https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/logouniversall.png" alt="Universal Auto Repasse" style="height:24px;width:auto;object-fit:contain;"><div style="display:flex;flex-direction:column;line-height:1.2;"><span style="font-size:16px;font-weight:700;color:#1A3C6E;letter-spacing:0.3px;">Universal</span><p class="LdsTypography-module_lds-typography__-DOlx LdsTypography-module_lds-typography--body-md__KI9TK" style="margin:0;color:#888;font-size:11px;">Gestão de frotas</p></div></a>'; }
    }

    function applyTextReplacements() {
        const replacements = [
            ['Av. Bernardo Vasconcelos, 377, Cachoeirinha 31150-000 - Belo Horizonte/MG', 'Av. Pereira Barreto, 42\nVila Gilda, Santo André – SP'],
            ['CNPJ nº 16.670.085/0001-55', 'CEP: 09190-210'],
            ['LOCALIZA Rent a Car S/A', 'UNIVERSAL Auto Repasse S/A'],
            ['© Localiza - Todos os direitos reservados.', '© Universal - Todos os direitos reservados.']
        ];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        for (let n = 0; n < nodes.length; n++) {
            let node = nodes[n];
            let text = node.nodeValue;
            let changed = false;
            for (let r = 0; r < replacements.length; r++) {
                if (text.includes(replacements[r][0])) {
                    text = text.replace(new RegExp(replacements[r][0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacements[r][1]);
                    changed = true;
                }
            }
            if (changed) node.nodeValue = text;
        }
    }

    function applyLogo() {
        document.querySelectorAll('.DisplayContent_displayContent__I14hU.DisplayContent_hideMobile__K13cl.DisplayContent_hideTablet__ISpUr.DisplayContent_hideLargeTablet__jiADA').forEach(div => {
            const svgEl = div.querySelector('svg');
            if (svgEl && svgEl.getAttribute('viewBox') === '0 0 149 39' && div.innerHTML.includes('#FF8026') && !div.querySelector('img')) {
                div.innerHTML = `<div style="display:flex;align-items:center;gap:8px;"><img src="${UA_LOGO_URL}" alt="Universal Repasses" style="height:39px;width:auto;object-fit:contain;"><div style="display:flex;flex-direction:column;line-height:1.15;"><span style="font-size:10px;color:#1565C0;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Repasses</span><span style="font-size:17px;color:#0D3B8C;font-weight:800;letter-spacing:0.5px;">Universal Auto</span></div></div>`;
            }
        });
        replaceLocalizaSVGInstances();
        replaceLocalizaNavbarLogo();
    }

    function applyCarouselDots() {
        const activeDot = document.querySelector('.Carousel_circle__nA3ia.Carousel_active__Hg2HB');
        if (activeDot) { activeDot.style.backgroundColor = '#0055a4'; activeDot.style.borderColor = '#0055a4'; }
    }

    function injectGlobalCSS() {
        if (document.getElementById('universal-auto-styles')) return;
        const style = document.createElement('style');
        style.id = 'universal-auto-styles';
        style.textContent = `
            .VehicleTitle_version__d4gVg{color:#0055a4!important;}
            .VehicleLocation_container__m8i4B svg,.StoreLocation_phone__Ewa4F svg,.StoreLocation_addressLink__gGjfy svg{color:#0055a4!important;}
            .whatsapp-button-custom{display:flex;align-items:center;justify-content:center;width:100%;background-color:#25D366;border:none;border-radius:8px;padding:12px 16px;font-size:18px;font-weight:bold;color:white;cursor:pointer;transition:background-color 0.2s ease;box-shadow:0 2px 5px rgba(0,0,0,0.2);animation:ua-pulse 2s ease-in-out infinite;}
            .whatsapp-button-custom:hover{background-color:#20b859;}
            @keyframes ua-pulse{0%,100%{box-shadow:0 2px 5px rgba(0,0,0,0.2),0 0 0 0 rgba(37,211,102,0.5);}50%{box-shadow:0 2px 5px rgba(0,0,0,0.2),0 0 0 8px rgba(37,211,102,0);}}
            .Navbar_title__9x_zb{border-left-color:#0055a4!important;}
            .Navbar_title__9x_zb,.Navbar_title__9x_zb h3{background-color:transparent!important;color:inherit!important;}
            .botao-personalizado{background-color:#1e40af!important;border-color:#1e40af!important;color:#ffffff!important;font-weight:600!important;}
            [class*="blurred"]{filter:none!important;opacity:1!important;}

            /* === CORRECÇÃO DE CORES VERDES → LARANJA (#fc8422) === */
            /* contained-primary (novo hash de classe do site atualizado) — excluindo badges Laudo/Vídeo */
            [class*="lds-button--contained-primary"]:not(.botao-personalizado):not([class*="ReportPDFButton"]):not([class*="ReportVideoButton"]){background-color:#fc8422!important;border-color:#fc8422!important;color:#000000!important;}
            [class*="lds-button--contained-primary"]:not(.botao-personalizado):not([class*="ReportPDFButton"]):not([class*="ReportVideoButton"]):hover{background-color:#e0731a!important;border-color:#e0731a!important;}
            /* basic-primary (botão de ordenação "Maior margem FIPE") → borda laranja, texto preto */
            [class*="lds-button--basic-primary"]{color:#000000!important;border-color:#fc8422!important;}
            [class*="lds-button--basic-primary"]:hover{background-color:rgba(252,132,34,0.08)!important;}
            /* Slider de filtro (fill/handle verde → laranja) */
            [class*="lds-slider__fill"]{background-color:#fc8422!important;}
            [class*="lds-slider__handle"]{border-color:#fc8422!important;background-color:#fc8422!important;}
            [class*="lds-slider__handle"]:focus,[class*="lds-slider__handle"]:active{box-shadow:0 0 0 3px rgba(252,132,34,0.3)!important;}
            /* Dropdown filtro activo — borda/linha verde → laranja */
            [class*="DropDownFilter_active"]{border-color:#fc8422!important;}
            /* Input fields focus verde → laranja */
            [class*="lds-text-field"]:focus-within,[class*="lds-input"]:focus-within{border-color:#fc8422!important;box-shadow:0 0 0 2px rgba(252,132,34,0.2)!important;}
            /* contained-tertiary */
            [class*="lds-button--contained-tertiary"]{background-color:#fc8422!important;border-color:#fc8422!important;color:#000000!important;}
            [class*="lds-button--contained-tertiary"]:hover{background-color:#e0731a!important;border-color:#e0731a!important;}
            /* contained-secondary */
            [class*="lds-button--contained-secondary"]{background-color:#fc8422!important;border-color:#fc8422!important;color:#000000!important;}
            [class*="lds-button--contained-secondary"]:hover{background-color:#e0731a!important;border-color:#e0731a!important;}
            /* outlined-primary (borda ainda verde → laranja) — excluindo botões azuis preservados */
            [class*="lds-button--outlined-primary"]:not([data-ua-keep-blue]){border-color:#fc8422!important;color:#000000!important;}
            [class*="lds-button--outlined-primary"]:not([data-ua-keep-blue]):hover{background-color:rgba(252,132,34,0.08)!important;}
            /* Botões azuis preservados (Nossos Carros, Fale conosco) */
            [data-ua-keep-blue]{border-color:#0055a4!important;color:#0055a4!important;background-color:transparent!important;}
            /* outlined-tertiary e outlined-secondary */
            [class*="lds-button--outlined-tertiary"]{border-color:#fc8422!important;color:#000000!important;}
            [class*="lds-button--outlined-secondary"]{border-color:#fc8422!important;color:#000000!important;}
            /* Accordion FAQ - sobrescreve variáveis APENAS dentro do accordion */
            [class*="lds-accordion-item--container"]{--lds-state-focused-color:#fc8422!important;--lds-state-focused-inverse-color:#ffe5c7!important;}
            [class*="lds-accordion-item--header-outlined"]{border-color:#fc8422!important;}
            [class*="lds-accordion-item--header-outlined"]:hover,[class*="lds-accordion-item--header-outlined"]:focus,[class*="lds-accordion-item--header-outlined"]:focus-within{border-color:#fc8422!important;outline-color:#fc8422!important;box-shadow:0 0 0 2px rgba(252,132,34,0.3)!important;}
            details[open] [class*="lds-accordion-item--header-outlined"],details[open]>[class*="lds-accordion-item--summary"] [class*="lds-accordion-item--header-outlined"]{border-color:#fc8422!important;box-shadow:0 0 0 2px rgba(252,132,34,0.3)!important;}
            [class*="lds-accordion-item--container"][open]>[class*="lds-accordion-item--summary"]:focus{outline-color:#fc8422!important;}
            [class*="lds-accordion-item--header-outlined"]::before,[class*="lds-accordion-item--header-outlined"]::after{border-color:#fc8422!important;}
            /* Paginação — botão de página activa (verde → laranja) */
            [class*="lds-pagination--item-active"]{background-color:rgba(252,132,34,0.15)!important;color:#000000!important;}
            [class*="lds-pagination--item-active"]:hover{background-color:rgba(252,132,34,0.25)!important;}
            /* Setas de paginação (basic-primary icon button) */
            [class*="lds-icon-button--basic-primary"]{color:#000000!important;}
            /* Números dos passos no HowItWorks */
            [class*="HowItWorks_stepNumber"]{color:#fc8422!important;}
            [class*="Hero_colorOrange"]{color:#fc8422!important;}
            /* Texto verde do nome do carro no modal (ex: "Jeep Renegade") */
            [class*="Catalog_colorPrimary"]{color:#fc8422!important;}
            /* Botão flutuante ContactUs (LdsIconButton com contained-primary) */
            [class*="ContactUs_buttonFixed"] button,[class*="lds-icon-button--contained-primary"]{background-color:#fc8422!important;border-color:#fc8422!important;color:#000000!important;}
        `;
        document.head.appendChild(style);
    }

    function applyMobileNavLogo() {
        document.querySelectorAll('.DisplayContent_displayContent__I14hU.DisplayContent_hideDesktop__hlDJO').forEach(div => {
            const svgEl = div.querySelector('svg[viewBox="0 0 39 39"], svg[viewBox="0 0 32 32"]');
            if (!svgEl) return;
            if (div.querySelector('img[data-ua-mobile-logo]')) return;
            const parentLink = div.closest('a');
            if (parentLink) {
                parentLink.setAttribute('href', UA_REDIRECT);
                parentLink.setAttribute('title', 'Universal Auto');
                parentLink.removeAttribute('data-testid');
                const clonedLink = parentLink.cloneNode(true);
                parentLink.parentNode.replaceChild(clonedLink, parentLink);
                clonedLink.addEventListener('click', (e) => { e.preventDefault(); window.location.href = UA_REDIRECT; });
                const newDiv = clonedLink.querySelector('.DisplayContent_hideDesktop__hlDJO');
                if (newDiv) newDiv.innerHTML = `<img data-ua-mobile-logo="1" src="${UA_LOGO_URL}" alt="Universal Auto" style="height:39px;width:auto;object-fit:contain;display:block;">`;
            } else {
                div.innerHTML = `<img data-ua-mobile-logo="1" src="${UA_LOGO_URL}" alt="Universal Auto" style="height:39px;width:auto;object-fit:contain;display:block;">`;
            }
        });
    }

    function applyMobileInterestSection() {
        const interestDivs = document.querySelectorAll('.MobilePage_contentInterest__dY5dv');
        if (!interestDivs.length) return;
        const idMatch = window.location.href.match(/-(\d+)(?:\/|$)/);
        const carroId = idMatch ? parseInt(idMatch[1]) : null;
        interestDivs.forEach(div => {
            if (div.querySelector('.whatsapp-button-custom')) return;
            let precoHtml = '';
            if (carroId && dadosCarregados && precoPorId.has(carroId)) {
                const preco = precoPorId.get(carroId);
                const precoFormatado = preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                precoHtml = `<div style="text-align:center;margin-bottom:10px;font-size:26px;font-weight:800;color:#1e40af;letter-spacing:-0.5px;">${precoFormatado}</div>`;
            }
            div.innerHTML = precoHtml + '<button type="button" class="whatsapp-button-custom"><span class="whatsapp-icon" style="font-size:24px; margin-right:8px;">💬</span><span>WhatsApp</span></button>';
        });
    }

    function applyMobileHeroImage() {
        const mobileHero = document.querySelector('img.Hero_heroImageMobile__TXyFn');
        if (!mobileHero) return;
        const src = mobileHero.getAttribute('src') || mobileHero.src || '';
        if (src.includes('computer-mobile.webp') || src === '/home/computer-mobile.webp') {
            mobileHero.src = 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/banerzaoinicial.png';
            mobileHero.removeAttribute('srcset');
        }
    }

    function removeHamburgerMenu() {
        const hamburger = document.querySelector('button[aria-label="abrir menu"]');
        if (hamburger) hamburger.remove();
    }

    function removeEntrarFromFilterModal() {
        document.querySelectorAll('.VehiclesFilters_buttonsContainer__lY4oa').forEach(container => {
            container.querySelectorAll('button').forEach(btn => {
                const txt = btn.innerText.trim();
                if (txt === 'Entrar' || txt === 'Cadastrar') btn.remove();
            });
        });
    }

    function observeFilterModal() {
        const obs = new MutationObserver(mutations => {
            mutations.forEach(mut => {
                if (!mut.addedNodes.length) return;
                mut.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    if ((node.classList && node.classList.contains('VehiclesFilters_buttonsContainer__lY4oa')) || (node.querySelector && node.querySelector('.VehiclesFilters_buttonsContainer__lY4oa'))) {
                        const containers = node.classList && node.classList.contains('VehiclesFilters_buttonsContainer__lY4oa') ? [node] : Array.from(node.querySelectorAll('.VehiclesFilters_buttonsContainer__lY4oa'));
                        containers.forEach(c => { c.style.setProperty('visibility', 'hidden', 'important'); });
                        requestAnimationFrame(() => {
                            removeEntrarFromFilterModal();
                            containers.forEach(c => { c.style.removeProperty('visibility'); });
                        });
                    }
                });
            });
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }

    function updatePageTitle() { if (document.title !== 'Universal Auto') document.title = 'Universal Auto'; }
    function updateMetaDescription() {
        const newDescription = 'Com sede em Santo André, a Universal Auto atua no mercado automotivo oferecendo soluções de compra e venda de veículos com foco no custo-benefício. Nossa missão é facilitar o acesso a automóveis de qualidade através do modelo de repasse e comércio varejista, garantindo uma negociação ágil e segura para nossos clientes. Seja para uso pessoal ou revenda, temos o veículo ideal para o seu perfil.';
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        if (metaDesc.getAttribute('content') !== newDescription) metaDesc.setAttribute('content', newDescription);
    }
    function updateOpenGraphTags() {
        // Substitui as meta tags Open Graph para que o WhatsApp, Facebook, etc.
        // mostrem as informações da Universal Auto em vez do Portal do Lojista
        const ogData = [
            { property: 'og:title',       content: 'Universal Auto – Repasses de Veículos' },
            { property: 'og:description', content: 'Mais de 10.000 veículos com preços abaixo da FIPE. Compre com segurança na Universal Auto.' },
            { property: 'og:site_name',   content: 'Universal Auto' },
            { property: 'og:url',         content: window.location.href },
            { property: 'og:image',       content: 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/logo_ua.png' },
            { property: 'og:type',        content: 'website' },
            { name: 'twitter:title',      content: 'Universal Auto – Repasses de Veículos' },
            { name: 'twitter:description',content: 'Mais de 10.000 veículos com preços abaixo da FIPE. Compre com segurança na Universal Auto.' },
            { name: 'twitter:image',      content: 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/logo_ua.png' },
        ];
        ogData.forEach(item => {
            const attr = item.property ? 'property' : 'name';
            const val  = item.property || item.name;
            let tag = document.querySelector('meta[' + attr + '="' + val + '"]');
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute(attr, val);
                document.head.appendChild(tag);
            }
            if (tag.getAttribute('content') !== item.content) tag.setAttribute('content', item.content);
        });
        // Remove tags de verificação do site original que possam vazar informações
        document.querySelectorAll('meta[name="application-name"]').forEach(t => { if (t.content && t.content.toLowerCase().includes('localiza')) t.setAttribute('content', 'Universal Auto'); });
    }

    function updateFavicon() {
        const newFaviconUrl = UA_LOGO_URL;
        // Apanha qualquer variante de favicon, incluindo /favicon.svg
        const selectors = [
            'link[rel="shortcut icon"]',
            'link[rel="icon"]',
            'link[href="/favicon.svg"]'
        ];
        let found = false;
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(link => {
                if (link.getAttribute('href') !== newFaviconUrl) {
                    link.setAttribute('href', newFaviconUrl);
                    link.setAttribute('type', 'image/png');
                }
                found = true;
            });
        });
        if (!found) {
            const newLink = document.createElement('link');
            newLink.rel = 'shortcut icon';
            newLink.href = newFaviconUrl;
            newLink.type = 'image/png';
            document.head.appendChild(newLink);
        }
    }

    function preventModalOnCardClick() {
        document.body.addEventListener('click', (e) => {
            // Ignorar cliques em botões de Laudo, Vídeo e outros controlos internos do card
            if (e.target.closest('[class*="ReportPDFButton"]') ||
                e.target.closest('[class*="ReportVideoButton"]') ||
                e.target.closest('.VehicleCard_badgeContainer__v1N5b') ||
                e.target.closest('.whatsapp-button-custom')) return;
            let target = e.target.closest('a[href*="/carro/"]');
            if (!target) return;
            if (target.getAttribute('target') === '_blank') return;
            e.preventDefault();
            e.stopPropagation();
            const url = target.getAttribute('href');
            if (url) window.location.href = url;
        }, true);
    }

    // ============================================================
    // REMOVE BOTÃO "COLABORADOR"
    // ============================================================
    function removeColaboradorButton() {
        document.querySelectorAll('button.LdsButton-module_lds-button--basic-primary__Nv8Ii').forEach(btn => {
            const span = btn.querySelector('span.LdsButton-module_lds-button__content__mtkkN');
            if (span && span.innerText.trim() === 'Colaborador') btn.remove();
        });
    }

    // ============================================================
    // SUBSTITUI IMAGENS DO CATÁLOGO DE CARROS
    // ============================================================
    const CAR_IMAGE_MAP = [
        { file: '/home/cars/t-cross.png',  replacement: 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/t-cross1.png' },
        { file: '/home/cars/renegade.png', replacement: 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/renegade1.png' },
        { file: '/home/cars/toro.png',     replacement: 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/toro1.png' },
        { file: '/home/cars/tracker.png',  replacement: 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/tracker1.png' },
        { file: '/home/cars/argo.png',     replacement: 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/argo1.png' },
        { file: '/home/cars/gol.png',      replacement: 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/gol1.png' },
        { file: '/home/cars/uno.png',      replacement: 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/uno1.png' },
        { file: '/home/cars/ka.png',       replacement: 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/ka1.png' },
        { file: '/home/cars/onix.png',     replacement: 'https://raw.githubusercontent.com/SiteHosterBabe/universalauto/refs/heads/main/onix1.png' },
    ];

    function replaceCatalogCarImages() {
        document.querySelectorAll('img.Catalog_carImage___kh4H').forEach(img => {
            const src = img.getAttribute('src') || '';
            for (let i = 0; i < CAR_IMAGE_MAP.length; i++) {
                if (src === CAR_IMAGE_MAP[i].file) {
                    img.setAttribute('src', CAR_IMAGE_MAP[i].replacement);
                    img.removeAttribute('srcset'); // evita que o Next.js sobrescreva com srcset
                    break;
                }
            }
        });
    }

    function replaceGreenSvgFills() {
        // Substitui fills de SVG inline que usam variáveis de cor verde do site original → laranja #fc8422
        const greenVars = ['var(--lds-color-accent-primary-default)', 'var(--lds-color-accent-tertiary-default)'];
        document.querySelectorAll('svg path[fill], svg circle[fill], svg rect[fill]').forEach(el => {
            const fillVal = el.getAttribute('fill');
            if (fillVal && greenVars.includes(fillVal) && !el.closest('#premium-loader') && !el.closest('.Navbar_navbarWrapper__gIkKd')) {
                el.setAttribute('fill', '#fc8422');
            }
        });
        // Corrige também cor inline de elementos de texto verde (ex: span com color via style)
        document.querySelectorAll('[style*="--lds-color-accent-primary-default"],[style*="--lds-color-accent-tertiary-default"]').forEach(el => {
            if (!el.closest('#premium-loader') && !el.closest('.Navbar_navbarWrapper__gIkKd')) {
                el.style.color = '#fc8422';
            }
        });
    }

    function removeCookiePopup() {
        // Remove o popup de cookies (cc-window) e injeta CSS para o suprimir imediatamente
        document.querySelectorAll('.cc-window').forEach(el => el.remove());
        // CSS de bloqueio imediato caso o popup ainda não esteja no DOM
        if (!document.getElementById('ua-no-cookie-popup')) {
            const s = document.createElement('style');
            s.id = 'ua-no-cookie-popup';
            s.textContent = '.cc-window{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}';
            document.head.appendChild(s);
        }
    }

    function removeCookieSettingsAndPrivacy() {
        // Remove o botão "Configurações de Cookies"
        document.querySelectorAll('button[type="button"]').forEach(btn => {
            if (btn.textContent.trim() === 'Configurações de Cookies') btn.remove();
        });
        // Remove o link "Política de privacidade" da Localiza
        document.querySelectorAll('a[href="https://www.localiza.com/privacidade"]').forEach(a => a.remove());
    }

    // ============================================================
    // APLICA TODAS AS TRANSFORMAÇÕES (executado imediatamente)
    // ============================================================
    function applyAllTransformations() {
        try {
            replacePortalText(document.body);
            applyHero();
            if (dadosCarregados) applyListagem();
            applyHeaderButtons();
            applyFooter();
            applyTextReplacements();
            applyLogo();
            applyCarouselDots();
            injectGlobalCSS();
            replaceHeroImage();
            modifyCadastroButton();
            replaceCadastroParagraph();
            replaceMainTitle();
            modifyVerMaisCarrosButton();
            modifyHowItWorksBackground();
            modifySeparatorsBackground();
            modifyHowItWorksCadastroButton();
            replaceHowItWorksTexts();
            modifyEquipeEspecializadaBackground();
            modifyFAQSection();
            modifyFaqCadastroButton();
            modifyLoginDialog();
            modifyContatoButton();
            modifyAccordionFaq();
            modifyHowItWorksTitle();
            applyMobileNavLogo();
            applyMobileHeroImage();
            applyMobileInterestSection();
            removeHamburgerMenu();
            removeEntrarFromFilterModal();
            removeColaboradorButton();
            replaceCatalogCarImages();
            removeCookiePopup();
            removeCookieSettingsAndPrivacy();
            replaceGreenSvgFills();
            updatePageTitle();
            updateMetaDescription();
            updateOpenGraphTags();
            updateFavicon();
            const idMatch = window.location.href.match(/-(\d+)(?:\/|$)/);
            const carroId = idMatch ? parseInt(idMatch[1]) : null;
            if (carroId && todosVeiculos.length) {
                const carroData = todosVeiculos.find(c => c.id === carroId);
                if (carroData) { applySidebar(carroData); applyMobileDetailPage(carroData); }
            }
        } catch(e) { console.warn('[UA] Erro não crítico:', e); }
    }

    // ============================================================
    // INICIALIZAÇÃO
    // ============================================================
    observeModalInstant();
    observeAccordionExpansion();
    watchFaqPermanently();
    observeFilterModal();
    preventModalOnCardClick();

    // ============================================================
    // BLOQUEAR DEEP LINKS / SMART APP BANNERS / APP INSTALL PROMPTS
    // ============================================================
    (function blockAppPrompts() {
        // --- 1. Remove meta tags que fazem iOS/Android sugerir abrir a app ---
        const appMetaNames = [
            'apple-itunes-app','google-play-app','application-name',
            'al:ios:app_store_id','al:ios:url','al:ios:app_name',
            'al:android:package','al:android:url','al:android:app_name',
            'al:web:url','twitter:app:id:iphone','twitter:app:id:googleplay',
            'twitter:app:url:iphone','twitter:app:url:googleplay',
        ];
        function removeAppMetas() {
            appMetaNames.forEach(name => {
                document.querySelectorAll('meta[name="'+name+'"],meta[property="'+name+'"]')
                    .forEach(m => m.remove());
            });
        }
        removeAppMetas();

        // --- 2. Remove link rel="manifest" (PWA install prompt) ---
        // e substitui por um manifest vazio que desactiva o install
        function removeManifest() {
            document.querySelectorAll('link[rel="manifest"]').forEach(l => l.remove());
        }
        removeManifest();

        // --- 3. Bloqueia o evento beforeinstallprompt (banner "Instalar app") ---
        window.addEventListener('beforeinstallprompt', e => {
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        }, true);

        // --- 4. Bloqueia appinstalled para evitar callbacks de instalação ---
        window.addEventListener('appinstalled', e => {
            e.stopImmediatePropagation();
        }, true);

        // --- 5. Bloqueia applinks / deep-links ao clicar em elementos com schema externo ---
        document.addEventListener('click', e => {
            const a = e.target.closest('a[href]');
            if (!a) return;
            const href = a.getAttribute('href') || '';
            if (/^(portaldolojista|localiza|intent|market|app):/.test(href)) {
                e.preventDefault(); e.stopImmediatePropagation();
            }
        }, true);

        // --- 6. Remove Smart App Banners do iOS (<meta name="apple-itunes-app">) ---
        // e suprime qualquer tag <link rel="apple-touch-icon"> que revele o bundle da app
        document.querySelectorAll('link[rel*="apple-touch"]').forEach(l => l.remove());

        // --- 7. MutationObserver para apanhar meta tags injectadas dinamicamente pelo Next.js/React ---
        const appBlockObserver = new MutationObserver(() => {
            removeAppMetas();
            removeManifest();
            document.querySelectorAll('link[rel*="apple-touch"]').forEach(l => l.remove());
        });
        appBlockObserver.observe(document.head, { childList: true, subtree: false });

        // --- 8. Sobrescreve ServiceWorker para impedir cache/install da PWA original ---
        if ('serviceWorker' in navigator) {
            // Cancela o registo de todos os service workers existentes
            navigator.serviceWorker.getRegistrations().then(regs => {
                regs.forEach(reg => reg.unregister());
            }).catch(() => {});
            // Bloqueia futuros registos
            const origRegister = navigator.serviceWorker.register.bind(navigator.serviceWorker);
            navigator.serviceWorker.register = function() {
                console.log('[UA] ServiceWorker register bloqueado.');
                return Promise.reject(new Error('SW registration blocked by UA script'));
            };
        }
    })();

    // ============================================================
    // MODAL DE SUPORTE PERSONALIZADO (substitui o modal original)
    // ============================================================
    (function setupContactModal() {
        const WA_NUMBER = WHATSAPP_NUMBER;

        const TOPICOS = [
            { id: 'compra',     label: ' Dúvida sobre compra de veículo' },
            { id: 'preco',      label: ' Informações sobre preço / FIPE' },
            { id: 'laudo',      label: ' Laudo e documentação do carro' },
            { id: 'entrega',    label: ' Prazo e logística de entrega' },
            { id: 'pagamento',  label: ' Formas de pagamento' },
            { id: 'outro',      label: ' Outro assunto' },
        ];

        // --- Injecta CSS do modal ---
        if (!document.getElementById('ua-modal-styles')) {
            const s = document.createElement('style');
            s.id = 'ua-modal-styles';
            s.textContent = `
                #ua-contact-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;}
                #ua-contact-modal{background:#fff;border-radius:16px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.25);font-family:'Inter',Arial,sans-serif;position:relative;}
                #ua-contact-modal .ua-modal-header{background:linear-gradient(135deg,#fc8422,#e0731a);padding:24px 24px 20px;border-radius:16px 16px 0 0;color:#fff;}
                #ua-contact-modal .ua-modal-header h2{margin:0 0 4px;font-size:1.3rem;font-weight:700;}
                #ua-contact-modal .ua-modal-header p{margin:0;font-size:.875rem;opacity:.9;}
                #ua-contact-modal .ua-modal-close{position:absolute;top:16px;right:16px;background:rgba(255,255,255,.25);border:none;color:#fff;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;font-weight:700;}
                #ua-contact-modal .ua-modal-close:hover{background:rgba(255,255,255,.4);}
                #ua-contact-modal .ua-modal-body{padding:24px;}
                #ua-contact-modal .ua-field-label{display:block;font-size:.875rem;font-weight:600;color:#374151;margin-bottom:6px;}
                #ua-contact-modal .ua-field-group{margin-bottom:18px;}
                #ua-contact-modal .ua-select, #ua-contact-modal .ua-input, #ua-contact-modal .ua-textarea{width:100%;box-sizing:border-box;border:1.5px solid #e5e7eb;border-radius:10px;padding:10px 14px;font-size:.95rem;font-family:inherit;color:#111;outline:none;transition:border-color .2s;}
                #ua-contact-modal .ua-select:focus, #ua-contact-modal .ua-input:focus, #ua-contact-modal .ua-textarea:focus{border-color:#fc8422;}
                #ua-contact-modal .ua-textarea{resize:vertical;min-height:90px;}
                #ua-contact-modal .ua-submit{width:100%;background:#25D366;color:#fff;border:none;border-radius:12px;padding:14px;font-size:1rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:background .2s;}
                #ua-contact-modal .ua-submit:hover{background:#1ebe5c;}
                #ua-contact-modal .ua-submit svg{flex-shrink:0;}
                #ua-contact-modal .ua-divider{border:none;border-top:1px solid #f0f0f0;margin:0 24px 20px;}
                @media(max-width:520px){#ua-contact-modal{border-radius:12px;}#ua-contact-modal .ua-modal-header{padding:20px 20px 16px;}}
            `;
            document.head.appendChild(s);
        }

        // --- Cria o modal no DOM ---
        function buildModal() {
            if (document.getElementById('ua-contact-modal-backdrop')) return;
            const backdrop = document.createElement('div');
            backdrop.id = 'ua-contact-modal-backdrop';
            backdrop.innerHTML = `
                <div id="ua-contact-modal" role="dialog" aria-modal="true" aria-label="Fale com a Universal Auto">
                    <div class="ua-modal-header">
                        <button class="ua-modal-close" aria-label="Fechar" id="ua-modal-close-btn">✕</button>
                        <h2>💬 Fale com a Universal Auto</h2>
                        <p>Responderemos pelo WhatsApp em instantes!</p>
                    </div>
                    <hr class="ua-divider">
                    <div class="ua-modal-body">
                        <div class="ua-field-group">
                            <label class="ua-field-label" for="ua-topic">Sobre o que você quer falar?</label>
                            <select class="ua-select" id="ua-topic">
                                <option value="">Selecione um assunto…</option>
                                ${TOPICOS.map(t => `<option value="${t.id}">${t.label}</option>`).join('')}
                            </select>
                        </div>
                        <div class="ua-field-group">
                            <label class="ua-field-label" for="ua-name">Seu nome</label>
                            <input class="ua-input" id="ua-name" type="text" placeholder="Ex: João Silva" maxlength="60"/>
                        </div>
                        <div class="ua-field-group">
                            <label class="ua-field-label" for="ua-message">Mensagem / dúvida</label>
                            <textarea class="ua-textarea" id="ua-message" placeholder="Descreva a sua dúvida ou pedido…" maxlength="500"></textarea>
                        </div>
                        <button class="ua-submit" id="ua-modal-submit">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.004 2C6.478 2 2 6.478 2 12.004c0 1.76.463 3.413 1.268 4.852L2.05 22l5.294-1.203A10.015 10.015 0 0012.004 22C17.522 22 22 17.522 22 12.004 22 6.478 17.522 2 12.004 2zm0 18.357a8.34 8.34 0 01-4.26-1.166l-.305-.18-3.143.715.737-3.072-.199-.314A8.355 8.355 0 013.643 12c0-4.61 3.751-8.357 8.361-8.357 4.612 0 8.357 3.747 8.357 8.357 0 4.612-3.745 8.357-8.357 8.357z"/></svg>
                            Enviar pelo WhatsApp
                        </button>
                    </div>
                </div>`;
            document.body.appendChild(backdrop);

            // Fechar ao clicar fora
            backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
            document.getElementById('ua-modal-close-btn').addEventListener('click', closeModal);

            // Submeter
            document.getElementById('ua-modal-submit').addEventListener('click', () => {
                const topicId  = document.getElementById('ua-topic').value;
                const topicLbl = TOPICOS.find(t => t.id === topicId)?.label || 'Outro assunto';
                const name     = (document.getElementById('ua-name').value || '').trim();
                const msg      = (document.getElementById('ua-message').value || '').trim();

                if (!topicId) { alert('Por favor, selecione um assunto.'); return; }
                if (!msg)     { alert('Por favor, escreva a sua dúvida.'); return; }

                let waMsg = `*Olá, Universal Auto!* 👋\n\n`;
                if (name) waMsg += `*Nome:* ${name}\n`;
                waMsg += `*Assunto:* ${topicLbl}\n`;
                waMsg += `*Mensagem:* ${msg}\n\n`;
                waMsg += `_Mensagem enviada pelo site universalautorepasse.com_`;

                const encoded = encodeURIComponent(waMsg);
                window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
                closeModal();
            });
        }

        function closeModal() {
            const b = document.getElementById('ua-contact-modal-backdrop');
            if (b) b.remove();
        }

        // --- Intercepta o clique no botão original (ContactUs fixo + botão "Fale conosco" do FAQ) ---
        document.addEventListener('click', e => {
            // Botão fixo de suporte (canto da página)
            const isFixedBtn = !!e.target.closest('[class*="ContactUs_buttonFixed"] button, [aria-label="Fale conosco"]');

            // Botão "Fale conosco" dentro da secção FAQ
            let isFaqContactBtn = false;
            const btn = e.target.closest('button');
            if (btn) {
                const span = btn.querySelector('span');
                const txt = (span ? span.innerText : btn.innerText || '').trim();
                if (txt === 'Fale conosco' && btn.closest('.FAQ_buttons__XTKyw')) {
                    isFaqContactBtn = true;
                }
            }

            if (!isFixedBtn && !isFaqContactBtn) return;
            e.preventDefault();
            e.stopImmediatePropagation();
            // Fecha o modal original se abrir
            setTimeout(() => {
                document.querySelectorAll('[class*="lds-dialog-root"],[class*="LdsDialog-module_lds-dialog-root"]').forEach(d => d.remove());
                document.querySelectorAll('[class*="lds-backdrop"],[class*="LdsBackdrop"]').forEach(d => d.remove());
            }, 50);
            buildModal();
        }, true);

    })();

    // ✅ APLICA TRANSFORMAÇÕES IMEDIATAMENTE (enquanto loader está visível)
    // O loader tapa a página enquanto estas modificações acontecem por baixo
    applyAllTransformations();

    // ✅ LOOP CONTÍNUO COM requestAnimationFrame
    // Garante que todas as alterações são aplicadas ANTES do loader desaparecer
    // ~60fps durante os 14 segundos de loading
    let rafLoopActive = true;
    let rafLastTime = 0;
    const RAF_INTERVAL = 150; // ms entre cada aplicação (não é necessário 60fps real, 150ms é suficiente e menos pesado)
    function rafModLoop(timestamp) {
        if (!rafLoopActive) return;
        if (timestamp - rafLastTime >= RAF_INTERVAL) {
            rafLastTime = timestamp;
            try { applyAllTransformations(); } catch(e) {}
        }
        requestAnimationFrame(rafModLoop);
    }
    requestAnimationFrame(rafModLoop);

    // Para o loop RAF quando o loader for removido (após 14s)
    const originalRemoveLoader = removeLoader;

    // ✅ DOMContentLoaded e window.load para garantir cobertura total
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applyMobileNavLogo(); applyMobileHeroImage(); applyMobileInterestSection();
            removeHamburgerMenu(); removeEntrarFromFilterModal(); applyAllTransformations();
        });
    } else {
        applyMobileNavLogo(); applyMobileHeroImage(); applyMobileInterestSection();
        removeHamburgerMenu(); removeEntrarFromFilterModal();
    }

    window.addEventListener('load', () => {
        applyMobileNavLogo(); applyMobileHeroImage(); applyMobileInterestSection();
        removeHamburgerMenu(); removeEntrarFromFilterModal(); applyAllTransformations();
    });

    // ✅ MutationObserver para capturar mudanças do Next.js/React após hidratação
    let debounceTimer;
    const observer = new MutationObserver(() => {
        if (isApplying) return;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => { if (!isApplying) applyAllTransformations(); }, 80);
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

    // Após os 14s, para o loop RAF (site já modificado, observer continua a monitorar)
    setTimeout(() => {
        rafLoopActive = false;
        console.log('[UA] Loop RAF parado após 14s. MutationObserver continua ativo.');
    }, LOADER_TIMEOUT_MS + 1000);

    document.body.addEventListener('click', (e) => {
        const whatsappBtn = e.target.closest('.whatsapp-button-custom, #whatsapp-button-script');
        if (whatsappBtn) {
            e.preventDefault(); e.stopPropagation();
            const currentUrl = encodeURIComponent(window.location.href);
            const fullMessage = `${WHATSAPP_BASE_MESSAGE} ${currentUrl}`;
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${fullMessage}`, '_blank');
        }
    });

})();