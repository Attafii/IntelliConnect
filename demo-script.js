// Demo script for testing document analysis
// This can be run in the browser console when on the analytics-insights page

console.log("Document Analysis Demo Script");

// Function to create a test CSV file
function createTestCSV() {
  const csvContent = `Name,Department,Salary,Performance Score
John Smith,Engineering,85000,92
Jane Doe,Marketing,65000,88
Mike Johnson,Sales,70000,95
Sarah Wilson,Engineering,90000,89
Tom Brown,Marketing,60000,91`;

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const file = new File([blob], 'employee_data.csv', { type: 'text/csv' });
  
  console.log("Created test CSV file:", file);
  return file;
}

// Function to simulate file upload
function simulateFileUpload() {
  const testFile = createTestCSV();
  const fileInput = document.querySelector('#file-upload');
  
  if (fileInput) {
    // Create a new FileList containing our test file
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(testFile);
    fileInput.files = dataTransfer.files;
    
    // Trigger change event
    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);
    
    console.log("Simulated file upload with test CSV");
  } else {
    console.log("File input not found");
  }
}

// Test questions for document analysis
const testQuestions = [
  "What is the average salary by department?",
  "Who has the highest performance score?",
  "Identify any salary disparities or trends",
  "Provide recommendations for employee development"
];

console.log("Available test functions:");
console.log("- createTestCSV(): Creates a test CSV file");
console.log("- simulateFileUpload(): Simulates uploading the test file");
console.log("- testQuestions: Array of sample questions to ask");

// Make functions globally available
window.createTestCSV = createTestCSV;
window.simulateFileUpload = simulateFileUpload;
window.testQuestions = testQuestions;
