var sidebar = document.getElementById('sfSidebar');
  var backdrop = document.getElementById('sfSidebarBackdrop');
  var toggleBtn = document.getElementById('sfSidebarToggle');
  function closeSidebar(){ sidebar.classList.remove('show'); backdrop.classList.remove('show'); }
  toggleBtn.addEventListener('click', function(){ sidebar.classList.toggle('show'); backdrop.classList.toggle('show'); });
  backdrop.addEventListener('click', closeSidebar);

  // ---------- Deposit modal elements ----------
  var depositModalEl   = document.getElementById('depositModal');
  var depositForm       = document.getElementById('depositForm');
  var depositAlert      = document.getElementById('depositAlert');
  var depositAmount     = document.getElementById('depositAmount');
  var depositPhone      = document.getElementById('depositPhone');
  var phoneFieldWrap    = document.getElementById('phoneFieldWrap');
  var submitBtn         = document.getElementById('depositSubmitBtn');
  var submitBtnLabel    = submitBtn.querySelector('.btn-label');
  var methodOptions     = document.querySelectorAll('.method-option');
  var amountQuickBtns   = document.querySelectorAll('.amount-quick-btn');
  var walletBalanceValue = document.getElementById('walletBalanceValue');

  // ---------- Payment method selection ----------
  function setSelectedMethod(method) {
    methodOptions.forEach(function (opt) {
      opt.classList.toggle('selected', opt.dataset.method === method);
    });
    // Bank transfer haihitaji namba ya simu
    phoneFieldWrap.style.display = method === 'bank' ? 'none' : 'block';
  }
  methodOptions.forEach(function (opt) {
    opt.addEventListener('click', function () {
      opt.querySelector('input').checked = true;
      setSelectedMethod(opt.dataset.method);
    });
  });
  setSelectedMethod('mpesa'); // default

  // ---------- Quick amount buttons ----------
  amountQuickBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      depositAmount.value = btn.dataset.amount;
      amountQuickBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      depositAmount.classList.remove('field-error');
      hideAlert();
    });
  });

  // ---------- Alert helper (sawa na login/otp/register) ----------
  function showAlert(type, message) {
    depositAlert.classList.remove('d-none', 'auth-alert-success', 'auth-alert-error', 'auth-alert-warning');
    var cls = type === 'success' ? 'auth-alert-success'
            : type === 'warning' ? 'auth-alert-warning'
            : 'auth-alert-error';
    var icon = type === 'success' ? 'bi-check-circle-fill'
             : type === 'warning' ? 'bi-exclamation-circle-fill'
             : 'bi-exclamation-triangle-fill';
    depositAlert.classList.add(cls);
    depositAlert.innerHTML = '<i class="bi ' + icon + '"></i><span>' + message + '</span>';
  }
  function hideAlert() { depositAlert.classList.add('d-none'); }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
      submitBtnLabel.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Inathibitisha...';
    } else {
      submitBtnLabel.textContent = 'Confirm Deposit';
    }
  }

  function getCookie(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  [depositAmount, depositPhone].forEach(function (input) {
    input.addEventListener('input', function () {
      input.classList.remove('field-error');
      hideAlert();
    });
  });

  // Reset form kila modal inapofunguliwa upya
  depositModalEl.addEventListener('show.bs.modal', function () {
    depositForm.reset();
    setSelectedMethod('mpesa');
    hideAlert();
    amountQuickBtns.forEach(function (b) { b.classList.remove('active'); });
    depositAmount.classList.remove('field-error');
    depositPhone.classList.remove('field-error');
    setLoading(false);
  });

  // ---------- Submit ----------
  depositForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    var selectedMethod = document.querySelector('input[name="depositMethod"]:checked').value;
    var amount = parseFloat(depositAmount.value);
    var phone = depositPhone.value.trim();

    depositAmount.classList.remove('field-error');
    depositPhone.classList.remove('field-error');

    // ---------- Validation ----------
    if (!depositAmount.value || isNaN(amount) || amount < 1000) {
      depositAmount.classList.add('field-error');
      showAlert('warning', 'Weka kiasi sahihi (angalau TSh 1,000).');
      return;
    }

    if (selectedMethod !== 'bank') {
      var phonePattern = /^(\+?255|0)[67]\d{8}$/;
      if (!phone || !phonePattern.test(phone.replace(/\s/g, ''))) {
        depositPhone.classList.add('field-error');
        showAlert('warning', 'Weka namba sahihi ya simu (mf. +255 6XX XXX XXX).');
        return;
      }
    }

    hideAlert();
    setLoading(true);

    try {
      // Badilisha na jina la url la Django endpoint yako ya deposit
      const response = await fetch("{% url 'wallet_deposit_api' %}", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          method: selectedMethod,
          amount: amount,
          phone: selectedMethod !== 'bank' ? phone : null
        })
      });

      const data = await response.json();

      if (data.success) {
        showAlert('success', data.message || 'Deposit request imetumwa. Subiri uthibitisho.');
        setLoading(false);
        // Update balance kama backend imerudisha balance mpya
        if (typeof data.new_balance !== 'undefined') {
          walletBalanceValue.textContent = 'TSh ' + Number(data.new_balance).toLocaleString();
        }
        setTimeout(function () {
          var modalInstance = bootstrap.Modal.getInstance(depositModalEl);
          modalInstance.hide();
        }, 1400);
      } else {
        showAlert('error', data.message || 'Imeshindikana kufanya deposit. Jaribu tena.');
        setLoading(false);
      }
    } catch (err) {
      showAlert('error', 'Hitilafu ya mtandao imetokea. Tafadhali jaribu tena.');
      setLoading(false);
    }
  });