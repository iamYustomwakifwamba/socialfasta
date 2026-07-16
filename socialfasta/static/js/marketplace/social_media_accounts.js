var sidebar = document.getElementById('sfSidebar');
  var backdrop = document.getElementById('sfSidebarBackdrop');
  var toggleBtn = document.getElementById('sfSidebarToggle');
  function closeSidebar(){ sidebar.classList.remove('show'); backdrop.classList.remove('show'); }
  toggleBtn.addEventListener('click', function(){ sidebar.classList.toggle('show'); backdrop.classList.toggle('show'); });
  backdrop.addEventListener('click', closeSidebar);

  // ---------- Meta ya platform (icon, rangi, jina) ----------
  var PLATFORM_META = {
    tiktok:    { name: 'TikTok',    icon: 'bi-tiktok',    color: '#000000', followerLabel: 'Followers' },
    youtube:   { name: 'YouTube',   icon: 'bi-youtube',   color: '#FF0000', followerLabel: 'Subscribers' },
    instagram: { name: 'Instagram', icon: 'bi-instagram', color: '#E1306C', followerLabel: 'Followers' },
    twitch:    { name: 'Twitch',    icon: 'bi-twitch',    color: '#9146FF', followerLabel: 'Followers' }
  };

  // ---------- Data ya accounts (badilisha na data halisi kutoka Django/DB) ----------
  var ACCOUNTS = [
    { id: 'acc_1', platform: 'tiktok', handle: '@growth.demo1', followers: 12500, earning: 'Creator Fund eligible', monetized: true, age: '45+ days', price: 72000, status: 'available' },
    { id: 'acc_2', platform: 'youtube', handle: 'TechReviews TZ', followers: 3400, earning: 'Monetized (AdSense)', monetized: true, age: '6+ months', price: 145000, status: 'available' },
    { id: 'acc_3', platform: 'instagram', handle: '@fashion.hub254', followers: 8900, earning: 'Avg 4.2% engagement', monetized: false, age: '1+ year', price: 98000, status: 'reserved' },
    { id: 'acc_4', platform: 'twitch', handle: 'GamerZoneKE', followers: 1200, earning: 'Affiliate Program', monetized: true, age: '3+ months', price: 56000, status: 'available' },
    { id: 'acc_5', platform: 'tiktok', handle: '@viral.clips.ke', followers: 34000, earning: 'Creator Fund + Live Gifts', monetized: true, age: '8+ months', price: 165000, status: 'available' },
    { id: 'acc_6', platform: 'youtube', handle: 'DailyVlogsAfrica', followers: 980, earning: 'Not monetized yet', monetized: false, age: '2+ months', price: 38000, status: 'available' },
    { id: 'acc_7', platform: 'instagram', handle: '@foodie.dar', followers: 15600, earning: 'Brand deals active', monetized: true, age: '2+ years', price: 210000, status: 'sold' },
    { id: 'acc_8', platform: 'twitch', handle: 'ChessMasterTZ', followers: 640, earning: 'Not monetized yet', monetized: false, age: '1+ month', price: 25000, status: 'available' }
  ];

  var accountsTableBody = document.getElementById('accountsTableBody');
  var platformFilterRow = document.getElementById('platformFilterRow');
  var activePlatformFilter = 'all';

  function fmtMoney(n) { return 'TSh ' + Number(n).toLocaleString(); }
  function fmtFollowers(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  }

  function statusPillHtml(status) {
    if (status === 'available') return '<span class="status-pill status-available">Available</span>';
    if (status === 'reserved') return '<span class="status-pill status-reserved">Reserved</span>';
    return '<span class="status-pill status-sold">Sold</span>';
  }

  function actionButtonHtml(account) {
    if (account.status === 'sold') {
      return '<button class="table-action-btn" disabled>Sold Out</button>';
    }
    if (account.status === 'reserved') {
      return '<button class="table-action-btn" disabled>Reserved</button>';
    }
    return '<button class="table-action-btn buy-account-btn" type="button" data-id="' + account.id + '">Buy Now</button>';
  }

  function renderAccounts() {
    accountsTableBody.innerHTML = '';
    var filtered = ACCOUNTS.filter(function (a) {
      return activePlatformFilter === 'all' || a.platform === activePlatformFilter;
    });

    if (filtered.length === 0) {
      accountsTableBody.innerHTML = '<tr><td colspan="7" class="text-center text-secondary py-4">Hakuna accounts kwa filter hii kwa sasa.</td></tr>';
      return;
    }

    filtered.forEach(function (a) {
      var meta = PLATFORM_META[a.platform];
      var row = document.createElement('tr');
      row.innerHTML =
        '<td>' +
          '<span class="platform-icon-sm"><i class="bi ' + meta.icon + '" style="color:' + meta.color + ';"></i></span>' +
          '<span class="account-handle">' + a.handle + '<span class="account-sub">' + meta.name + '</span></span>' +
        '</td>' +
        '<td><span class="followers-value">' + fmtFollowers(a.followers) + '</span><span class="followers-label">' + meta.followerLabel + '</span></td>' +
        '<td><span class="earning-pill' + (a.monetized ? '' : ' not-monetized') + '">' + a.earning + '</span></td>' +
        '<td class="text-secondary">' + a.age + '</td>' +
        '<td class="fw-semibold">' + fmtMoney(a.price) + '</td>' +
        '<td>' + statusPillHtml(a.status) + '</td>' +
        '<td>' + actionButtonHtml(a) + '</td>';
      accountsTableBody.appendChild(row);
    });

    // Wire "Buy Now" buttons upya kila baada ya render
    document.querySelectorAll('.buy-account-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openBuyModal(btn.dataset.id);
      });
    });
  }

  // ---------- Platform filter pills ----------
  platformFilterRow.querySelectorAll('.order-filter-pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      platformFilterRow.querySelectorAll('.order-filter-pill').forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');
      activePlatformFilter = pill.dataset.platform;
      renderAccounts();
    });
  });

  // ---------- Modal elements ----------
  var buyAccountModalEl = document.getElementById('buyAccountModal');
  var buyAccountForm     = document.getElementById('buyAccountForm');
  var modalAlert         = document.getElementById('modalAlert');
  var previewIcon         = document.getElementById('previewIcon');
  var previewHandle       = document.getElementById('previewHandle');
  var previewMeta         = document.getElementById('previewMeta');
  var modalFollowers      = document.getElementById('modalFollowers');
  var modalEarning        = document.getElementById('modalEarning');
  var modalPrice          = document.getElementById('modalPrice');
  var modalAccountId      = document.getElementById('modalAccountId');
  var submitBtn           = document.getElementById('buyAccountSubmitBtn');
  var submitBtnLabel      = submitBtn.querySelector('.btn-label');
  var pageAlert           = document.getElementById('pageAlert');

  function openBuyModal(accountId) {
    var account = ACCOUNTS.find(function (a) { return a.id === accountId; });
    if (!account) return;
    var meta = PLATFORM_META[account.platform];

    previewIcon.className = 'bi ' + meta.icon;
    previewIcon.style.color = meta.color;
    previewHandle.textContent = account.handle;
    previewMeta.textContent = meta.name + ' • ' + account.age;
    modalFollowers.textContent = fmtFollowers(account.followers) + ' ' + meta.followerLabel;
    modalEarning.textContent = account.earning;
    modalPrice.textContent = fmtMoney(account.price);
    modalAccountId.value = account.id;

    hideModalAlert();
    setLoading(false);

    var modalInstance = bootstrap.Modal.getOrCreateInstance(buyAccountModalEl);
    modalInstance.show();
  }

  // ---------- Alert helpers (sawa na kurasa nyingine zote) ----------
  function buildAlertHtml(type, message) {
    var icon = type === 'success' ? 'bi-check-circle-fill'
             : type === 'warning' ? 'bi-exclamation-circle-fill'
             : 'bi-exclamation-triangle-fill';
    return '<i class="bi ' + icon + '"></i><span>' + message + '</span>';
  }
  function showModalAlert(type, message) {
    modalAlert.classList.remove('d-none', 'auth-alert-success', 'auth-alert-error', 'auth-alert-warning');
    modalAlert.classList.add(type === 'success' ? 'auth-alert-success' : type === 'warning' ? 'auth-alert-warning' : 'auth-alert-error');
    modalAlert.innerHTML = buildAlertHtml(type, message);
  }
  function hideModalAlert() { modalAlert.classList.add('d-none'); }

  function showPageAlert(type, message) {
    pageAlert.classList.remove('d-none', 'auth-alert-success', 'auth-alert-error', 'auth-alert-warning');
    pageAlert.classList.add(type === 'success' ? 'auth-alert-success' : type === 'warning' ? 'auth-alert-warning' : 'auth-alert-error');
    pageAlert.innerHTML = buildAlertHtml(type, message);
    pageAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
      submitBtnLabel.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Inathibitisha...';
    } else {
      submitBtnLabel.textContent = 'Confirm & Buy';
    }
  }

  function getCookie(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // ---------- Submit purchase ----------
  buyAccountForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    var accountId = modalAccountId.value;
    var account = ACCOUNTS.find(function (a) { return a.id === accountId; });
    if (!account) return;

    hideModalAlert();
    setLoading(true);

    try {
      // Badilisha na jina la url la Django endpoint yako ya kununua social account
      const response = await fetch("{% url 'social_account_buy_api' %}", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          account_id: account.id,
          platform: account.platform,
          price: account.price
        })
      });

      const data = await response.json();

      if (data.success) {
        showModalAlert('success', data.message || 'Umenunua account kikamilifu.');
        account.status = 'sold';
        renderAccounts();
        setLoading(false);

        setTimeout(function () {
          var modalInstance = bootstrap.Modal.getInstance(buyAccountModalEl);
          modalInstance.hide();
          showPageAlert('success', 'Umenunua ' + account.handle + ' (' + PLATFORM_META[account.platform].name + '). Taarifa za login zitatumwa dashboard na email yako.');
        }, 1200);
      } else {
        showModalAlert('error', data.message || 'Imeshindikana kununua account. Jaribu tena.');
        setLoading(false);
      }
    } catch (err) {
      showModalAlert('error', 'Hitilafu ya mtandao imetokea. Tafadhali jaribu tena.');
      setLoading(false);
    }
  });

  // ---------- Initialize ----------
  renderAccounts();