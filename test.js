// Assuming data contains the string with wrappers
const data = `\`\`\`javascript
 result = [
  {
    "code": \`function HelloWorld() {
  alert("Hello, World!");
}\`
  },
  {
    "documentation": "This function displays a message box with the text 'Hello, World!'."
  }
]`;

console.log('jio');
 console.log('the original data is \n'+data);
 let removed = data.replace('```javascript','')
 console.log('the removed data is \n'+removed);

 console.log('the code part is');
 console.log(removed.res);
// console.log(removed);
