// --- 1. Custom Dropdowns (Gender & State of Residence) ---
document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
    const selected = wrapper.querySelector('.select-selected');
    const items = wrapper.querySelector('.select-items');
    const options = items.querySelectorAll(':scope > div');

    selected.addEventListener('click', (e) => {
        e.stopPropagation();
        const cal = document.getElementById('calendarDropdown');
        if (cal) cal.classList.add('hidden');

        document.querySelectorAll('.select-items').forEach(i => {
            if (i !== items) i.classList.add('select-hide');
        });
        items.classList.toggle('select-hide');
    });

    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            options.forEach(opt => opt.classList.remove('active-option'));
            option.classList.add('active-option');

            selected.textContent = option.getAttribute('data-value') || option.textContent.trim();
            selected.style.color = '#111111';
            items.classList.add('select-hide');
        });
    });
});

// --- 2. Custom Searchable Month & Year Popovers + Calendar ---
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const YEARS = Array.from({ length: 67 }, (_, i) => String(2026 - i)); // 2026 down to 1960

const dobInput = document.getElementById('dob');
const dobInputBox = document.getElementById('dobInputBox');
const calendarDropdown = document.getElementById('calendarDropdown');
const calendarDaysContainer = document.getElementById('calendarDays');
const calendarNextBtn = document.getElementById('calendarNextBtn');

// Month Popover Elements
const monthTrigger = document.getElementById('monthTrigger');
const monthDisplay = document.getElementById('monthDisplay');
const monthPopover = document.getElementById('monthPopover');
const monthSearchInput = document.getElementById('monthSearchInput');
const monthList = document.getElementById('monthList');
const applyMonthBtn = document.getElementById('applyMonthBtn');

// Year Popover Elements
const yearTrigger = document.getElementById('yearTrigger');
const yearDisplay = document.getElementById('yearDisplay');
const yearPopover = document.getElementById('yearPopover');
const yearSearchInput = document.getElementById('yearSearchInput');
const yearList = document.getElementById('yearList');
const applyYearBtn = document.getElementById('applyYearBtn');

let selectedDay = 17;
let currentMonth = 0; // January
let currentYear = 2000;
let pendingMonth = 0;
let pendingYear = 2000;

function renderPopoverList(container, items, activeValue, onSelect) {
    container.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'popover-item' + (item === activeValue ? ' active' : '');
        div.textContent = item;
        div.addEventListener('click', () => {
            container.querySelectorAll('.popover-item').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            onSelect(item);
        });
        container.appendChild(div);
    });
}

function renderCalendar(month, year) {
    if (!calendarDaysContainer) return;
    calendarDaysContainer.innerHTML = '';

    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const span = document.createElement('span');
        span.className = 'day muted';
        span.textContent = daysInPrevMonth - i;
        calendarDaysContainer.appendChild(span);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const span = document.createElement('span');
        span.className = 'day';
        if (d === selectedDay) span.classList.add('selected');
        span.textContent = d;

        span.addEventListener('click', () => {
            calendarDaysContainer.querySelectorAll('.day').forEach(el => el.classList.remove('selected'));
            span.classList.add('selected');
            selectedDay = d;
        });

        calendarDaysContainer.appendChild(span);
    }
}

if (dobInputBox && calendarDropdown) {
    renderCalendar(currentMonth, currentYear);

    // Toggle Calendar
    dobInputBox.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.select-items').forEach(i => i.classList.add('select-hide'));
        calendarDropdown.classList.toggle('hidden');
        monthPopover.classList.add('hidden');
        yearPopover.classList.add('hidden');
    });

    calendarDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Open Month Popover
    monthTrigger.addEventListener('click', () => {
        yearPopover.classList.add('hidden');
        pendingMonth = currentMonth;
        monthSearchInput.value = '';
        renderPopoverList(monthList, MONTHS, MONTHS[pendingMonth], (val) => {
            pendingMonth = MONTHS.indexOf(val);
        });
        monthPopover.classList.toggle('hidden');
    });

    // Filter Month List
    monthSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = MONTHS.filter(m => m.toLowerCase().includes(query));
        renderPopoverList(monthList, filtered, MONTHS[pendingMonth], (val) => {
            pendingMonth = MONTHS.indexOf(val);
        });
    });

    // Apply Month Selection
    applyMonthBtn.addEventListener('click', () => {
        currentMonth = pendingMonth;
        monthDisplay.textContent = MONTHS[currentMonth];
        renderCalendar(currentMonth, currentYear);
        monthPopover.classList.add('hidden');
    });

    // Open Year Popover
    yearTrigger.addEventListener('click', () => {
        monthPopover.classList.add('hidden');
        pendingYear = currentYear;
        yearSearchInput.value = '';
        renderPopoverList(yearList, YEARS, String(pendingYear), (val) => {
            pendingYear = parseInt(val, 10);
        });
        yearPopover.classList.toggle('hidden');
    });

    // Filter Year List
    yearSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        const filtered = YEARS.filter(y => y.includes(query));
        renderPopoverList(yearList, filtered, String(pendingYear), (val) => {
            pendingYear = parseInt(val, 10);
        });
    });

    // Apply Year Selection
    applyYearBtn.addEventListener('click', () => {
        currentYear = pendingYear;
        yearDisplay.textContent = String(currentYear);
        renderCalendar(currentMonth, currentYear);
        yearPopover.classList.add('hidden');
    });

    // Confirm Date of Birth with "Next"
    calendarNextBtn.addEventListener('click', () => {
        const dd = String(selectedDay).padStart(2, '0');
        const mm = String(currentMonth + 1).padStart(2, '0');
        dobInput.value = `${dd} / ${mm} / ${currentYear}`;
        calendarDropdown.classList.add('hidden');
    });
}

// Close all popovers when clicking outside
window.addEventListener('click', () => {
    document.querySelectorAll('.select-items').forEach(i => i.classList.add('select-hide'));
    if (calendarDropdown) calendarDropdown.classList.add('hidden');
    if (monthPopover) monthPopover.classList.add('hidden');
    if (yearPopover) yearPopover.classList.add('hidden');
});

// Form Submission
const studentInfoForm = document.getElementById('studentInfoForm');
if (studentInfoForm) {
    studentInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Optional loader before transitioning to review.html
        window.location.href = 'review.html';
    });
}