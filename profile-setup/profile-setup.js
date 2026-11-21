const courseCards = document.querySelectorAll('.course-card');

courseCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove 'selected' state from all cards
        courseCards.forEach(c => c.classList.remove('selected'));
        
        // Highlight clicked card
        card.classList.add('selected');
        
        const selectedTrack = card.getAttribute('data-course');
        console.log("Selected Track:", selectedTrack);
        
        // Save to localStorage so Step 3 (Review) can display it
        localStorage.setItem('selectedTrack', selectedTrack);

        // Transition smoothly to Step 2 (Student Information)
        setTimeout(() => {
            window.location.href = '../student-information/student-info.html';
        }, 300);
    });
});