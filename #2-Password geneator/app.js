const STORAGE_KEY = 'savedPasswords';

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  special: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

const els = {
  length: document.getElementById('password-length'),
  uppercase: document.getElementById('uppercase'),
  lowercase: document.getElementById('lowercase'),
  numbers: document.getElementById('numbers'),
  special: document.getElementById('special'),
  password: document.getElementById('generated-password'),
  strengthBadge: document.getElementById('strength-badge'),
  error: document.getElementById('error-message'),
  generateBtn: document.getElementById('generate-btn'),
  copyBtn: document.getElementById('copy-btn'),
  saveBtn: document.getElementById('save-btn'),
  label: document.getElementById('password-label'),
  search: document.getElementById('search-input'),
  list: document.getElementById('password-list'),
  emptyState: document.getElementById('empty-state'),
  toast: document.getElementById('toast'),
};

function showError(message) {
  els.error.textContent = message;
  els.error.classList.remove('hidden');
}

function hideError() {
  els.error.classList.add('hidden');
  els.error.textContent = '';
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove('hidden');
  setTimeout(() => els.toast.classList.add('hidden'), 2500);
}

function getSelectedOptions() {
  return {
    uppercase: els.uppercase.checked,
    lowercase: els.lowercase.checked,
    numbers: els.numbers.checked,
    special: els.special.checked,
  };
}

function validateLength() {
  const length = parseInt(els.length.value, 10);

  if (Number.isNaN(length)) {
    showError('Please enter a valid password length.');
    return null;
  }
  if (length < 4) {
    showError('Password length must be at least 4.');
    return null;
  }
  if (length > 50) {
    showError('Password length cannot exceed 50.');
    return null;
  }
  return length;
}

function buildCharset(options) {
  let charset = '';
  const activeSets = [];

  if (options.uppercase) {
    charset += CHAR_SETS.uppercase;
    activeSets.push(CHAR_SETS.uppercase);
  }
  if (options.lowercase) {
    charset += CHAR_SETS.lowercase;
    activeSets.push(CHAR_SETS.lowercase);
  }
  if (options.numbers) {
    charset += CHAR_SETS.numbers;
    activeSets.push(CHAR_SETS.numbers);
  }
  if (options.special) {
    charset += CHAR_SETS.special;
    activeSets.push(CHAR_SETS.special);
  }

  return { charset, activeSets };
}

function getRandomChar(str) {
  return str[Math.floor(Math.random() * str.length)];
}

function generatePassword(length, options) {
  const { charset, activeSets } = buildCharset(options);

  if (!charset) return null;

  const passwordChars = [];

  for (const set of activeSets) {
    passwordChars.push(getRandomChar(set));
  }

  while (passwordChars.length < length) {
    passwordChars.push(getRandomChar(charset));
  }

  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join('');
}

function checkStrength(password, options) {
  let score = 0;
  const len = password.length;

  if (len >= 8) score += 1;
  if (len >= 12) score += 1;
  if (len >= 16) score += 1;

  const typesUsed = [
    options.uppercase,
    options.lowercase,
    options.numbers,
    options.special,
  ].filter(Boolean).length;

  score += typesUsed - 1;

  if (options.special) score += 1;

  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
}

function updateStrengthBadge(strength) {
  const labels = { weak: 'Weak', medium: 'Medium', strong: 'Strong' };
  els.strengthBadge.textContent = labels[strength];
  els.strengthBadge.className = `strength-badge ${strength}`;
  els.strengthBadge.classList.remove('hidden');
}

function handleGenerate() {
  hideError();

  const length = validateLength();
  if (length === null) return;

  const options = getSelectedOptions();
  const hasOption = Object.values(options).some(Boolean);

  if (!hasOption) {
    showError('Select at least one character type.');
    return;
  }

  const password = generatePassword(length, options);

  if (!password || password.length !== length) {
    showError('Failed to generate password. Please try again.');
    return;
  }

  els.password.value = password;
  els.copyBtn.disabled = false;
  els.saveBtn.disabled = false;

  const strength = checkStrength(password, options);
  updateStrengthBadge(strength);
}

async function handleCopy() {
  const password = els.password.value;
  if (!password) return;

  try {
    await navigator.clipboard.writeText(password);
    showToast('Password copied to clipboard!');
  } catch {
    els.password.select();
    document.execCommand('copy');
    showToast('Password copied to clipboard!');
  }
}

function getSavedPasswords() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function savePasswords(passwords) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(passwords));
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString();
}

function renderPasswordList(filter = '') {
  const passwords = getSavedPasswords();
  const query = filter.trim().toLowerCase();

  const filtered = passwords.filter((item) => {
    if (!query) return true;
    const label = (item.label || '').toLowerCase();
    const pwd = item.password.toLowerCase();
    return label.includes(query) || pwd.includes(query);
  });

  els.list.innerHTML = '';

  if (filtered.length === 0) {
    els.emptyState.classList.remove('hidden');
    els.emptyState.textContent = query
      ? 'No passwords match your search.'
      : 'No saved passwords yet.';
    return;
  }






  els.emptyState.classList.add('hidden');

  filtered.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'password-item';
    li.innerHTML = `
      <div class="password-item-header">
        <span class="password-item-label">${escapeHtml(item.label || 'No label')}</span>
        <span class="password-item-date">${formatDate(item.createdAt)}</span>
      </div>
      <div class="password-item-value">${escapeHtml(item.password)}</div>
      <button type="button" class="btn-delete" data-id="${item.id}">Delete</button>
    `;
    els.list.appendChild(li);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function handleSave() {
  hideError();
  const password = els.password.value.trim();

  if (!password) {
    showError('Generate a password before saving.');
    return;
  }

  const passwords = getSavedPasswords();
  const isDuplicate = passwords.some((p) => p.password === password);

  if (isDuplicate) {
    showError('This password is already saved.');
    return;
  }

  const entry = {
    id: crypto.randomUUID(),
    password,
    label: els.label.value.trim(),
    createdAt: new Date().toISOString(),
  };

  passwords.unshift(entry);
  savePasswords(passwords);
  els.label.value = '';
  renderPasswordList(els.search.value);
  showToast('Password saved!');
}

function handleDelete(id) {
  const passwords = getSavedPasswords().filter((p) => p.id !== id);
  savePasswords(passwords);
  renderPasswordList(els.search.value);
  showToast('Password deleted.');
}

els.generateBtn.addEventListener('click', handleGenerate);
els.copyBtn.addEventListener('click', handleCopy);
els.saveBtn.addEventListener('click', handleSave);
els.search.addEventListener('input', (e) => renderPasswordList(e.target.value));

els.list.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-delete')) {
    handleDelete(e.target.dataset.id);
  }
});

els.length.addEventListener('input', hideError);

renderPasswordList();
