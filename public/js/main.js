document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const html = document.documentElement;

    // Theme Toggle Logic
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        
        if (newTheme === 'dark') {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    });

    // Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.waitlist-form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${target}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Form Submission Logic
    const handleFormSubmit = async (e, type) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Joining...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`/api/waitlist/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                document.getElementById('form-container').classList.add('hidden');
                document.querySelector('.hero').classList.add('hidden');
                document.getElementById('success-message').classList.remove('hidden');
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error connecting to server.');
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    };

    document.getElementById('individual-form').addEventListener('submit', (e) => handleFormSubmit(e, 'individual'));
    document.getElementById('business-form').addEventListener('submit', (e) => handleFormSubmit(e, 'business'));

    // Reset Button Logic
    document.getElementById('reset-btn').addEventListener('click', () => {
        document.getElementById('form-container').classList.remove('hidden');
        document.querySelector('.hero').classList.remove('hidden');
        document.getElementById('success-message').classList.add('hidden');
        document.getElementById('individual-form').reset();
        document.getElementById('business-form').reset();
    });
});
