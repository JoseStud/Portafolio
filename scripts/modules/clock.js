// Refreshes the small middle-left clock. It updates every 30 seconds because
// seconds are not displayed, keeping DOM writes low while minutes stay current.
export function initClock() {
  const clock = document.getElementById('clock');
  if (!clock) return;

  const tick = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    const displayHours = (hours % 12) || 12;

    clock.innerHTML = `${displayHours}:${String(minutes).padStart(2, '0')} ${meridiem}<br>New York, NY`;
  };

  tick();
  setInterval(tick, 30000);
}
