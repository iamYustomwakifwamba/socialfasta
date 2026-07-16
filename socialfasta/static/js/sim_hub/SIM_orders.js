var sidebar = document.getElementById('sfSidebar');
  var backdrop = document.getElementById('sfSidebarBackdrop');
  var toggleBtn = document.getElementById('sfSidebarToggle');
  function closeSidebar(){ sidebar.classList.remove('show'); backdrop.classList.remove('show'); }
  toggleBtn.addEventListener('click', function(){ sidebar.classList.toggle('show'); backdrop.classList.toggle('show'); });
  backdrop.addEventListener('click', closeSidebar);

  // ---------- Filter pills (visual only kwa sasa) ----------
  document.querySelectorAll('.order-filter-pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.order-filter-pill').forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');
    });
  });

  // ---------- Copy number to clipboard ----------
  document.querySelectorAll('.number-copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var numberText = btn.closest('.number-copy-cell').childNodes[0].textContent.trim();
      navigator.clipboard.writeText(numberText).then(function () {
        var icon = btn.querySelector('i');
        icon.className = 'bi bi-check-lg';
        setTimeout(function () { icon.className = 'bi bi-clipboard'; }, 1500);
      });
    });
  });

  // ---------- Nchi na huduma ----------
  // multiplier huongeza/hupunguza bei kulingana na nchi (baadhi ya nchi ni ghali zaidi kwenye soko la SMS)
  var COUNTRIES = {
    usa:    { name: 'United States',  flag: '🇺🇸', multiplier: 1 },
    canada: { name: 'Canada',         flag: '🇨🇦', multiplier: 1.15 },
    uk:     { name: 'United Kingdom', flag: '🇬🇧', multiplier: 1.3 }
  };

  // base = bei ya msingi ya TSh kabla ya kuzidishwa na multiplier ya nchi
  var SMS_SERVICES = [
    { id: 'whatsapp',  name: 'WhatsApp',       icon: 'bi-whatsapp',  color: '#25D366', base: 3500 },
    { id: 'telegram',  name: 'Telegram',       icon: 'bi-telegram',  color: '#229ED9', base: 2000 },
    { id: 'google',    name: 'Google / Gmail', icon: 'bi-google',    color: '#EA4335', base: 2500 },
    { id: 'facebook',  name: 'Facebook',       icon: 'bi-facebook',  color: '#1877F2', base: 2200 },
    { id: 'instagram', name: 'Instagram',      icon: 'bi-instagram', color: '#E1306C', base: 2200 },
    { id: 'tiktok',    name: 'TikTok',         icon: 'bi-tiktok',    color: '#000000', base: 2800 },
    { id: 'twitter',   name: 'Twitter / X',    icon: 'bi-twitter-x', color: '#000000', base: 2600 },
    { id: 'discord',   name: 'Discord',        icon: 'bi-discord',   color: '#5865F2', base: 1800 }
  ];

  // ---------- Element refs ----------
  var countryOptions   = document.querySelectorAll('#countryPicker .country-option');
  var serviceSelect      = document.getElementById('serviceSelect');
  var summaryCountry      = document.getElementById('summaryCountry');
  var summaryService      = document.getElementById('summaryService');
  var summaryPrice         = document.getElementById('summaryPrice');
  var buyNumberForm        = document.getElementById('buyNumberForm');
  var buyNumberModalEl     = document.getElementById('buyNumberModal');
  var numberAlert          = document.getElementById('numberAlert');
  var submitBtn            = document.getElementById('numberSubmitBtn');
  var submitBtnLabel       = submitBtn.querySelector('.btn-label');
  var numbersTableBody     = document.getElementById('numbersTableBody');

  function fmtMoney(n) { return 'TSh ' + Number(Math.round(n)).toLocaleString(); }

  function currentCountry() {
    var key = document.querySelector('input[name="country"]:checked').value;
    return { key: key, data: COUNTRIES[key] };
  }

  function currentService() {
    return SMS_SERVICES.find(function (s) { return s.id === serviceSelect.value; });
  }

  // ---------- Jaza dropdown ya huduma (sawa kwa nchi zote, bei ndiyo inabadilika) ----------
  function populateServices() {
    serviceSelect.innerHTML = '';
    SMS_SERVICES.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.name;
      serviceSelect.appendChild(opt);
    });
    updateSummary();
  }

  function updateSummary() {
    var country = currentCountry();
    var svc = currentService();
    if (!svc) return;
    var price = svc.base * country.data.multiplier;

    summaryCountry.textContent = country.data.flag + ' ' + country.data.name;
    summaryService.textContent = svc.name;
    summaryPrice.textContent = fmtMoney(price);
  }

  countryOptions.forEach(function (opt) {
    opt.addEventListener('click', function () {
      opt.querySelector('input').checked = true;
      countryOptions.forEach(function (o) { o.classList.toggle('selected', o === opt); });
      updateSummary();
      hideAlert();
    });
  });
  serviceSelect.addEventListener('change', function () {
    updateSummary();
    hideAlert();
  });

  // ---------- Alert helper (sawa na kurasa nyingine zote) ----------
  function showAlert(type, message) {
    numberAlert.classList.remove('d-none', 'auth-alert-success', 'auth-alert-error', 'auth-alert-warning');
    var cls = type === 'success' ? 'auth-alert-success'
            : type === 'warning' ? 'auth-alert-warning'
            : 'auth-alert-error';
    var icon = type === 'success' ? 'bi-check-circle-fill'
             : type === 'warning' ? 'bi-exclamation-circle-fill'
             : 'bi-exclamation-triangle-fill';
    numberAlert.classList.add(cls);
    numberAlert.innerHTML = '<i class="bi ' + icon + '"></i><span>' + message + '</span>';
  }
  function hideAlert() { numberAlert.classList.add('d-none'); }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
      submitBtnLabel.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Inanunua namba...';
    } else {
      submitBtnLabel.textContent = 'Buy Number';
    }
  }

  function getCookie(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Reset default kila modal inapofunguliwa
  buyNumberModalEl.addEventListener('show.bs.modal', function () {
    buyNumberForm.reset();
    countryOptions.forEach(function (o, idx) { o.classList.toggle('selected', idx === 0); });
    populateServices();
    hideAlert();
    setLoading(false);
  });

  // ---------- Submit ----------
  buyNumberForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    var country = currentCountry();
    var svc = currentService();
    var price = Math.round(svc.base * country.data.multiplier);

    hideAlert();
    setLoading(true);

    try {
      // Badilisha na jina la url la Django endpoint yako ya kununua namba
      const response = await fetch("{% url 'sms_number_buy_api' %}", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          country: country.key,
          service_id: svc.id,
          service_name: svc.name,
          price: price
        })
      });

      const data = await response.json();

      if (data.success) {
        showAlert('success', data.message || 'Namba imenunuliwa kikamilifu.');
        setLoading(false);

        // Ongeza row mpya juu ya jedwali - namba halisi inatoka kwa data.number kutoka backend
        var numberText = data.number || '+--- --- ----';
        var row = document.createElement('tr');
        row.innerHTML =
          '<td><span class="service-icon-sm"><i class="bi ' + svc.icon + '" style="color:' + svc.color + ';"></i></span>' + svc.name + '</td>' +
          '<td>' + country.data.flag + ' ' + country.data.name + '</td>' +
          '<td><span class="number-copy-cell">' + numberText + '<button class="number-copy-btn" type="button" title="Copy"><i class="bi bi-clipboard"></i></button></span></td>' +
          '<td class="fw-semibold">' + fmtMoney(price) + '</td>' +
          '<td><span class="status-pill status-waiting">Waiting for SMS</span></td>' +
          '<td class="text-secondary">' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + '</td>' +
          '<td><button class="table-action-btn cancel" type="button">Cancel</button></td>';
        numbersTableBody.prepend(row);

        // Wire copy button ya row mpya
        row.querySelector('.number-copy-btn').addEventListener('click', function () {
          var text = row.querySelector('.number-copy-cell').childNodes[0].textContent.trim();
          navigator.clipboard.writeText(text);
        });

        setTimeout(function () {
          var modalInstance = bootstrap.Modal.getInstance(buyNumberModalEl);
          modalInstance.hide();
        }, 1200);
      } else {
        showAlert('error', data.message || 'Imeshindikana kununua namba. Jaribu tena.');
        setLoading(false);
      }
    } catch (err) {
      showAlert('error', 'Hitilafu ya mtandao imetokea. Tafadhali jaribu tena.');
      setLoading(false);
    }
  });

  // ---------- Initialize on load ----------
  populateServices();