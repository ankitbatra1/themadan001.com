document.getElementById('registrationForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const message = document.getElementById('formMessage');

  if (name && email && phone) {
    message.textContent = `🎉 Yay! ${name}, you’re all set! We'll ping you soon.`;
    message.style.color = '#007700';
    this.reset();
  } else {
    message.textContent = 'Oops! Please fill out all the fields.';
    message.style.color = '#ff4444';
  }
});
