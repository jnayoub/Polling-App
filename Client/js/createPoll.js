document.addEventListener('DOMContentLoaded', () => {
    const pollForm = document.getElementById('poll-form');
    const addOptionButton = document.getElementById('add-option');
    const optionsContainer = document.getElementById('options-container');

    let optionCount = 1;
    addOptionButton.addEventListener('click', () => {
        optionCount++;
        const newOptionDiv = document.createElement('div');
        newOptionDiv.classList.add('form-group');
        newOptionDiv.innerHTML = `
            <label for="option-${optionCount}">Option ${optionCount}</label>
            <input type="text" id="option-${optionCount}" class="form-control" required>
        `;
        optionsContainer.appendChild(newOptionDiv);
    });
    pollForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const question = document.getElementById('question').value;
        const options = [];
        for (let i = 1; i <= optionCount; i++) {
            const optionValue = document.getElementById(`option-${i}`).value;
            if (optionValue) {
                options.push(optionValue);
            }
        }

        const response = await fetch('/polls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question, options }),
        });

        if (response.ok) {
            alert('Poll created successfully!');
            document.location = '/'
        } else {
            alert('Error creating poll.');
        }
    });
});
