// Debug script to check localStorage for saved pairs
console.log('=== Checking localStorage for saved pairs ===');
const reduxState = localStorage.getItem('redux_localstorage_simple_user');
if (reduxState) {
  const parsed = JSON.parse(reduxState);
  console.log('User state:', JSON.stringify(parsed, null, 2));
} else {
  console.log('No redux state found in localStorage');
}
