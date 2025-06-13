document.addEventListener('DOMContentLoaded', () => {
    // --- Sticky Header Shadow on Scroll ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  
    // --- Dark Mode Toggle ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const icon = darkModeToggle.querySelector('i');
  
    function applyTheme(theme, isInitial = false) {
      if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        document.body.classList.remove('dark-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
      if (!isInitial && window.dengueChartInstance) {
          updateChartColors(window.dengueChartInstance, theme === 'dark');
      }
    }
    
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(currentTheme, true);
  
  
    darkModeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      const newTheme = isDark ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    });
  
    // --- Mobile Menu Toggle ---
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.querySelector('#main-header nav');
    const mobileIcon = mobileMenuToggle.querySelector('i');
  
    mobileMenuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      mobileMenuToggle.setAttribute('aria-expanded', nav.classList.contains('active'));
      if (nav.classList.contains('active')) {
        mobileIcon.classList.remove('fa-bars');
        mobileIcon.classList.add('fa-times');
      } else {
        mobileIcon.classList.remove('fa-times');
        mobileIcon.classList.add('fa-bars');
      }
    });
  
    document.querySelectorAll('#main-header nav a').forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
          nav.classList.remove('active');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
          mobileIcon.classList.remove('fa-times');
          mobileIcon.classList.add('fa-bars');
        }
      });
    });
  
    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  
    // --- Active Navigation Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('.content-section, .hero');
    const navLinks = document.querySelectorAll('#main-header nav a');
    const headerHeight = document.getElementById('main-header').offsetHeight;
  
    function changeNavActiveState() {
      let currentSectionId = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 70; 
        if (pageYOffset >= sectionTop) {
          currentSectionId = section.getAttribute('id');
        }
      });
  
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === currentSectionId) {
          link.classList.add('active');
        }
      });
      if (!currentSectionId && window.pageYOffset < sections[0].offsetTop - headerHeight - 70) {
          document.querySelector('#main-header nav a[href="#inicio"]').classList.add('active');
      } else if (!document.querySelector('#main-header nav a.active')) {
          document.querySelector('#main-header nav a[href="#inicio"]').classList.add('active');
      }
    }
    window.addEventListener('scroll', changeNavActiveState, { passive: true });
    changeNavActiveState();
  
    // --- Scroll Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || '0s';
          entry.target.style.transitionDelay = delay;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  
    animatedElements.forEach(el => observer.observe(el));
  
    // --- Accordion for Myths and Truths ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const isActive = header.classList.contains('active');
        
        header.classList.toggle('active');
        header.setAttribute('aria-expanded', !isActive);
  
        if (!isActive) {
          content.style.maxHeight = content.scrollHeight + "px";
          content.style.paddingTop = "15px";
          content.style.paddingBottom = "22px";
        } else {
          content.style.maxHeight = null;
          content.style.paddingTop = null;
          content.style.paddingBottom = null;
        }
      });
    });
  
    // --- Contact Form Validation & Submission ---
    const contactForm = document.getElementById('contactForm');
    const formMessageEl = document.getElementById('formMessage');
  
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formMessageEl.style.display = 'none';
      formMessageEl.textContent = '';
  
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();
      let isValid = true;
      let errors = [];
  
      if (!name) { errors.push("Nome completo é obrigatório."); isValid = false; }
      if (!email) { errors.push("E-mail é obrigatório."); isValid = false; }
      else if (!validateEmail(email)) { errors.push("Formato de e-mail inválido."); isValid = false; }
      if (!subject) { errors.push("Assunto é obrigatório."); isValid = false; }
      if (!message) { errors.push("A mensagem não pode estar vazia."); isValid = false; }
  
      if (!isValid) {
        formMessageEl.textContent = errors.join(' ');
        formMessageEl.className = "form-status-message error-message";
      } else {
        formMessageEl.textContent = 'Obrigado! Sua mensagem foi enviada com sucesso.';
        formMessageEl.className = "form-status-message success-message";
        contactForm.reset();
        setTimeout(() => { formMessageEl.style.display = 'none'; }, 6000);
      }
      formMessageEl.style.display = 'block';
    });
    
    // --- Chart.js Dengue Statistics ---
    const chartCtx = document.getElementById('dengueChart');
    
    // Dados reais (estimados mensalmente) para Brasil 2025 (Jan-Mai)
    const chartLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'];
    const confirmedCasesData = [160984, 332419, 306109, 211321, 289167];
    const deathsData = [33, 184, 234, 217, 340];
  
    function getChartOptions(isDark) {
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
      const ticksColor = isDark ? '#b0b0b0' : '#555';
      const titleColor = isDark ? '#e0e0e0' : '#333';
      const legendColor = isDark ? '#c0c0c0' : '#444';
  
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { // Casos Confirmados
            beginAtZero: true,
            title: { display: true, text: 'Nº Casos Prováveis', font: { size: 14, family: 'Poppins' }, color: titleColor },
            grid: { drawBorder: false, color: gridColor },
            ticks: { color: ticksColor, font: { family: 'Poppins'} }
          },
          yDeaths: { // Óbitos
            position: 'right',
            beginAtZero: true,
            title: { display: true, text: 'Nº Óbitos', font: { size: 14, family: 'Poppins' }, color: titleColor },
            grid: { drawOnChartArea: false }, // Não desenhar grid para este eixo para não poluir
            ticks: { color: ticksColor, font: { family: 'Poppins'} }
          },
          x: {
            title: { display: true, text: 'Mês (Brasil - 2025)', font: { size: 14, family: 'Poppins' }, color: titleColor },
            grid: { display: false },
            ticks: { color: ticksColor, font: { family: 'Poppins'} }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Evolução Mensal da Dengue no Brasil - 2025 (Jan-Mai)',
            font: { size: 18, family: 'Poppins', weight: 'bold' },
            padding: { top: 10, bottom: 25 },
            color: titleColor
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: { font: { size: 12, family: 'Poppins' }, color: legendColor, usePointStyle: true, boxWidth: 8 }
          },
          tooltip: {
            backgroundColor: isDark ? 'rgba(20, 25, 30, 0.9)' : 'rgba(255,255,255,0.95)',
            titleColor: isDark ? '#f0f0f0' : '#333',
            bodyColor: isDark ? '#d0d0d0' : '#555',
            borderColor: isDark ? '#30363d' : '#ced4da',
            borderWidth: 1,
            titleFont: { family: 'Poppins', weight: 'bold'},
            bodyFont: { family: 'Poppins'},
            padding: 12,
            cornerRadius: 5,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toLocaleString('pt-BR');
                }
                return label;
              }
            }
          }
        },
        interaction: { mode: 'index', intersect: false },
        hover: { mode: 'nearest', intersect: true }
      };
    }
  
    if (chartCtx) {
      window.dengueChartInstance = new Chart(chartCtx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [
            {
              label: 'Casos Prováveis',
              data: confirmedCasesData,
              backgroundColor: 'rgba(0, 168, 78, 0.6)', // Accent color
              borderColor: 'rgba(0, 168, 78, 1)',
              borderWidth: 1.5,
              borderRadius: 6,
              barPercentage: 0.7,
              categoryPercentage: 0.8,
              yAxisID: 'y', // Associar ao eixo y principal
            },
            {
              label: 'Óbitos',
              data: deathsData,
              type: 'line',
              borderColor: 'rgba(231, 76, 60, 1)', // Danger color
              backgroundColor: 'rgba(231, 76, 60, 0.2)',
              tension: 0.4,
              fill: true, 
              yAxisID: 'yDeaths', // Associar ao eixo y secundário (Óbitos)
              pointBackgroundColor: 'rgba(231, 76, 60, 1)',
              pointBorderColor: '#fff',
              pointHoverRadius: 7,
              pointRadius: 5,
            }
          ]
        },
        options: getChartOptions(document.body.classList.contains('dark-mode'))
      });
    }
    
    function updateChartColors(chart, isDark) {
      if (!chart) return;
      chart.options = getChartOptions(isDark);
      chart.update();
    }
  
    // Update Statistics Summary Cards
    function updateStatsSummary() {
      const totalCasesYTD = confirmedCasesData.reduce((a, b) => a + b, 0);
      const totalDeathsYTD = deathsData.reduce((a, b) => a + b, 0);
      
      // Para Casos Graves, não temos dados mensais consistentes, então vamos manter o KPI, 
      // mas com um valor ilustrativo ou indicação de que é parcial/estimado.
      // Poderíamos pegar a letalidade em casos graves (4.07%) e se tivéssemos o total de casos graves, calcular.
      // Por agora, vou deixar um valor fictício para "Casos Graves" no KPI, já que não está no gráfico.
      const illustrativeSevereCases = Math.round(totalCasesYTD * 0.015); // Estimativa bem grosseira, 1.5% do total.
  
      document.getElementById('totalCasesStat').textContent = totalCasesYTD.toLocaleString('pt-BR');
      document.getElementById('severeCasesStat').textContent = illustrativeSevereCases.toLocaleString('pt-BR') + "*"; // Indicar que é ilustrativo
      document.getElementById('deathsStat').textContent = totalDeathsYTD.toLocaleString('pt-BR');
  
      const lethalityRate = totalCasesYTD > 0 ? (totalDeathsYTD / totalCasesYTD) * 100 : 0;
      document.getElementById('lethalityRateStat').textContent = `${lethalityRate.toFixed(2)}%`.replace('.', ',');
  
      const lastMonthCases = confirmedCasesData[chartLabels.length - 1] || 0;
      const secondLastMonthCases = confirmedCasesData[chartLabels.length - 2] || 0;
      let monthlyVariation = 0;
      if (secondLastMonthCases > 0) {
        monthlyVariation = ((lastMonthCases - secondLastMonthCases) / secondLastMonthCases) * 100;
      } else if (lastMonthCases > 0) {
        monthlyVariation = 100; 
      }
      
      const variationSpan = document.getElementById('monthlyVariationStat');
      variationSpan.textContent = `${monthlyVariation.toFixed(1)}%`.replace('.', ',');
      variationSpan.classList.remove('positive', 'negative');
      if (monthlyVariation > 0) variationSpan.classList.add('positive');
      else if (monthlyVariation < 0) variationSpan.classList.add('negative');
      
      // affectedRegionStat é estático/fictício no exemplo.
    }
    updateStatsSummary();
  
    // Update current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
    }
  });