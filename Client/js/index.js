document.addEventListener('DOMContentLoaded', () => {
    const pollsList = document.getElementById('polls-list');
    async function loadPolls() {
        const response = await fetch('/polls');
        const polls = await response.json();

        pollsList.innerHTML = '';
        polls.forEach((poll) => {
            const pollDiv = document.createElement('div');
            pollDiv.classList.add('poll');
            pollDiv.innerHTML = `
                <h3>${poll.question}</h3>
                <form class="poll-form" data-id="${poll.id}">
                    ${poll.options.map((option, index) => `
                        <label>
                            <input type="radio" name="option" value="${index}"> ${option} (${poll.votes[index]} votes)
                        </label><br>
                    `).join('')}
                    <button type="submit">Submit Vote</button>
                </form>
            `;
            pollsList.appendChild(pollDiv);
        });
        document.querySelectorAll('.poll-form').forEach((form) => {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const pollId = form.getAttribute('data-id');
                const optionIndex = form.querySelector('input[name="option"]:checked').value;

                const response = await fetch(`/polls/${pollId}/vote`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ optionIndex }),
                });

                if (response.ok) {
                    alert('Vote submitted successfully!');
                    loadPolls();
                } else {
                    alert('Error submitting vote.');
                }
            });
        });
    }
    loadPolls();
});
