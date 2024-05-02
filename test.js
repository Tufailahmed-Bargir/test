const res = [
    {
        "code": "#include <iostream>\n#include <string>\n\nusing namespace std;\n\nint main() {\n string username, password;\n\n cout << \"Content-Type: text/html\" << endl;\n cout << endl;\n cout << \"<html>\" << endl;\n cout << \"<head><title>Login Page</title></head>\" << endl;\n cout << \"<body>\" << endl;\n cout << \"<h2>Login</h2>\" << endl;\n cout << \"<form method='post'>\" << endl;\n cout << \"Username: <input type='text' name='username'><br>\" << endl;\n cout << \"Password: <input type='password' name='password'><br>\" << endl;\n cout << \"<input type='submit' value='Login'>\" << endl;\n cout << \"</form>\" << endl;\n\n cin >> username >> password;\n\n if (username == \"admin\" && password == \"password\") {\n cout << \"Location: dashboard.html\" << endl; // Redirect to dashboard on successful login\n } else {\n cout << \"Invalid username or password. Please try again.\" << endl;\n }\n\n cout << \"</body>\" << endl;\n cout << \"</html>\" << endl;\n\n return 0;\n}"
    },
    {
        "documentation": "This C++ code replicates the functionality of the original COBOL program, handling user login with input validation and redirection. It employs the following key elements:\n\n1. **Headers:** `iostream` for input/output operations and `string` for string manipulation.\n2. **Main Function:** The entry point of the program.\n3. **Variable Declarations:** `username` and `password` strings to store user input, along with constant strings for valid credentials (not shown for brevity).\n4. **HTML Output:** The code generates HTML content for the login page, including a form for username and password input.\n5. **Input Processing:** It reads the user's input using `cin`.\n6. **Validation:** It checks if the entered credentials match the valid ones.\n7. **Redirection:** If the login is successful, it outputs a \"Location\" header to redirect the browser to \"dashboard.html\". Otherwise, an error message is displayed.\n8. **Closing HTML Tags:** The code outputs the closing HTML tags for the page.\n\nThis code provides a basic framework for user login functionality, demonstrating the conversion from COBOL to a modern language like C++."
    }
]
const final = [res]
// console.log(res);
console.log(res[0].code);
// console.log(res[0].code);
// console.log(res[1].documentation);
