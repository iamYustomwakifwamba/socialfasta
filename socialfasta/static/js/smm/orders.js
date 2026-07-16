

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

  // ---------- Huduma za SMM kwa kila platform ----------
  // rate = bei ya TSh kwa kila oda 1,000 (bei ya mfano - badilisha kulingana na pricing yako halisi)
  var SERVICES = {
    instagram: [
      { id: 'ig_followers', name: 'Instagram Followers', rate: 5000, min: 100, max: 10000 },
      { id: 'ig_likes',     name: 'Instagram Likes',     rate: 1500, min: 50,  max: 5000  },
      { id: 'ig_views',     name: 'Instagram Views (Reels/IGTV)', rate: 400, min: 100, max: 50000 },
      { id: 'ig_comments',  name: 'Instagram Comments (Custom)',  rate: 12000, min: 10, max: 500 }
    ],
    tiktok: [
      { id: 'tt_followers', name: 'TikTok Followers', rate: 4500, min: 100, max: 20000 },
      { id: 'tt_likes',     name: 'TikTok Likes',     rate: 1200, min: 50,  max: 10000 },
      { id: 'tt_views',     name: 'TikTok Views',     rate: 200,  min: 1000, max: 1000000 },
      { id: 'tt_shares',    name: 'TikTok Shares',    rate: 3000, min: 50,  max: 5000 }
    ],
    youtube: [
      { id: 'yt_subs',  name: 'YouTube Subscribers', rate: 15000, min: 50,  max: 5000 },
      { id: 'yt_views', name: 'YouTube Views',       rate: 800,   min: 500, max: 100000 },
      { id: 'yt_likes', name: 'YouTube Likes',       rate: 2000,  min: 50,  max: 5000 }
    ],
    facebook: [
      { id: 'fb_page_likes', name: 'Facebook Page Likes', rate: 6000, min: 100, max: 10000 },
      { id: 'fb_post_likes', name: 'Facebook Post Likes', rate: 2500, min: 50,  max: 5000 },
      { id: 'fb_followers',  name: 'Facebook Followers',  rate: 5500, min: 100, max: 10000 }
    ]
  };

  // ---------- Element refs ----------
  var platformOptions   = document.querySelectorAll('#platformPicker .method-option');
  var serviceSelect      = document.getElementById('serviceSelect');
  var serviceHint        = document.getElementById('serviceHint');
  var orderLink           = document.getElementById('orderLink');
  var orderQuantity       = document.getElementById('orderQuantity');
  var quantityHint        = document.getElementById('quantityHint');
  var summaryRate         = document.getElementById('summaryRate');
  var summaryQty          = document.getElementById('summaryQty');
  var summaryTotal        = document.getElementById('summaryTotal');
  var newOrderForm        = document.getElementById('newOrderForm');
  var newOrderModalEl     = document.getElementById('newOrderModal');
  var orderAlert          = document.getElementById('orderAlert');
  var submitBtn           = document.getElementById('orderSubmitBtn');
  var submitBtnLabel      = submitBtn.querySelector('.btn-label');
  var ordersTableBody     = document.getElementById('ordersTableBody');

  function fmtMoney(n) { return 'TSh ' + Number(n).toLocaleString(); }

  function currentPlatform() {
    return document.querySelector('input[name="platform"]:checked').value;
  }

  function currentService() {
    var platform = currentPlatform();
    var list = SERVICES[platform] || [];
    return list.find(function (s) { return s.id === serviceSelect.value; });
  }

  // ---------- Jaza dropdown ya services kulingana na platform ----------
  function populateServices(platform) {
    var list = SERVICES[platform] || [];
    serviceSelect.innerHTML = '';
    list.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.name + ' — TSh ' + s.rate.toLocaleString() + '/1000';
      serviceSelect.appendChild(opt);
    });
    updateServiceHint();
    updateSummary();
  }

  function updateServiceHint() {
    var svc = currentService();
    if (!svc) return;
    serviceHint.textContent = 'Min: ' + svc.min.toLocaleString() + '  •  Max: ' + svc.max.toLocaleString();
    quantityHint.textContent = 'Weka kati ya ' + svc.min.toLocaleString() + ' na ' + svc.max.toLocaleString();
  }

  // ---------- Chagua platform (cards) ----------
  platformOptions.forEach(function (opt) {
    opt.addEventListener('click', function () {
      opt.querySelector('input').checked = true;
      platformOptions.forEach(function (o) { o.classList.toggle('selected', o === opt); });
      populateServices(opt.dataset.platform);
    });
  });

  serviceSelect.addEventListener('change', function () {
    updateServiceHint();
    orderQuantity.classList.remove('field-error');
    hideAlert();
    updateSummary();
  });

  // ---------- Hesabu bei live kadri quantity inavyobadilika ----------
  function updateSummary() {
    var svc = currentService();
    var qty = parseInt(orderQuantity.value, 10) || 0;
    var rate = svc ? svc.rate : 0;
    var total = (qty / 1000) * rate;

    summaryRate.textContent = fmtMoney(rate);
    summaryQty.textContent = qty.toLocaleString();
    summaryTotal.textContent = fmtMoney(Math.round(total));
  }
  orderQuantity.addEventListener('input', function () {
    orderQuantity.classList.remove('field-error');
    hideAlert();
    updateSummary();
  });
  orderLink.addEventListener('input', function () {
    orderLink.classList.remove('field-error');
    hideAlert();
  });

  // ---------- Alert helper (sawa na login/otp/register/deposit) ----------
  function showAlert(type, message) {
    orderAlert.classList.remove('d-none', 'auth-alert-success', 'auth-alert-error', 'auth-alert-warning');
    var cls = type === 'success' ? 'auth-alert-success'
            : type === 'warning' ? 'auth-alert-warning'
            : 'auth-alert-error';
    var icon = type === 'success' ? 'bi-check-circle-fill'
             : type === 'warning' ? 'bi-exclamation-circle-fill'
             : 'bi-exclamation-triangle-fill';
    orderAlert.classList.add(cls);
    orderAlert.innerHTML = '<i class="bi ' + icon + '"></i><span>' + message + '</span>';
  }
  function hideAlert() { orderAlert.classList.add('d-none'); }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
      submitBtnLabel.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Inatuma Order...';
    } else {
      submitBtnLabel.textContent = 'Place Order';
    }
  }

  function getCookie(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Reset + jaza services default kila modal inapofunguliwa
  newOrderModalEl.addEventListener('show.bs.modal', function () {
    newOrderForm.reset();
    platformOptions.forEach(function (o, idx) { o.classList.toggle('selected', idx === 0); });
    populateServices('instagram');
    hideAlert();
    orderLink.classList.remove('field-error');
    orderQuantity.classList.remove('field-error');
    setLoading(false);
  });

  // ---------- Submit ----------
  newOrderForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    var platform = currentPlatform();
    var svc = currentService();
    var link = orderLink.value.trim();
    var quantity = parseInt(orderQuantity.value, 10);

    orderLink.classList.remove('field-error');
    orderQuantity.classList.remove('field-error');

    // ---------- Validation ----------
    var urlPattern = /^https?:\/\/.+/i;
    if (!link || !urlPattern.test(link)) {
      orderLink.classList.add('field-error');
      showAlert('warning', 'Weka link sahihi (ianze na https:// au http://).');
      return;
    }

    if (!orderQuantity.value || isNaN(quantity) || quantity < svc.min || quantity > svc.max) {
      orderQuantity.classList.add('field-error');
      showAlert('warning', 'Quantity iwe kati ya ' + svc.min.toLocaleString() + ' na ' + svc.max.toLocaleString() + '.');
      return;
    }

    var charge = Math.round((quantity / 1000) * svc.rate);

    hideAlert();
    setLoading(true);

    try {
      // Badilisha na jina la url la Django endpoint yako ya smm order
      const response = await fetch("{% url 'smm_order_api' %}", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          platform: platform,
          service_id: svc.id,
          service_name: svc.name,
          link: link,
          quantity: quantity,
          charge: charge
        })
      });

      const data = await response.json();

      if (data.success) {
        showAlert('success', data.message || 'Order imetumwa kikamilifu.');
        setLoading(false);

        // Ongeza row mpya juu ya jedwali bila kureload page
        var row = document.createElement('tr');
        row.innerHTML =
          '<td><span class="service-icon-sm"><i class="bi bi-' + (platform === 'instagram' ? 'instagram text-danger' : platform === 'youtube' ? 'youtube text-danger' : platform) + '"></i></span>' + svc.name + '</td>' +
          '<td><a href="' + link + '" target="_blank" class="order-link-cell" title="' + link + '">' + link + '</a></td>' +
          '<td class="text-secondary">' + quantity.toLocaleString() + '</td>' +
          '<td class="fw-semibold">' + fmtMoney(charge) + '</td>' +
          '<td><span class="status-pill status-pending">Pending</span></td>' +
          '<td class="text-secondary">' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + '</td>';
        ordersTableBody.prepend(row);

        setTimeout(function () {
          var modalInstance = bootstrap.Modal.getInstance(newOrderModalEl);
          modalInstance.hide();
        }, 1200);
      } else {
        showAlert('error', data.message || 'Imeshindikana kutuma order. Jaribu tena.');
        setLoading(false);
      }
    } catch (err) {
      showAlert('error', 'Hitilafu ya mtandao imetokea. Tafadhali jaribu tena.');
      setLoading(false);
    }
  });

  // ---------- Initialize on load ----------
  populateServices('instagram');