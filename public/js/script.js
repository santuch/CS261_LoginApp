const togglePassword = document.getElementById("togglePassword");
const passwordField = document.getElementById("password");

const eyeVisible = "image/eye-view-interface-symbol-svgrepo-com.svg";
const eyeHidden = "image/eye-password-hide-svgrepo-com.svg";

// Toggle password visibility
togglePassword.addEventListener("click", function () {
    const type =
        passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);

    togglePassword.src = type === "password" ? eyeVisible : eyeHidden;
    togglePassword.alt =
        type === "password" ? "Show Password" : "Hide Password";
});

document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const role = document.getElementById("role").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!role || !username || !password) {
            alert("Please fill in all the fields.");
            return;
        }

        const apiKey = "Your_Actual_API_key"; // replace with your own API key
        const requestBody = { UserName: username, PassWord: password };

        fetch("https://restapi.tu.ac.th/api/v1/auth/Ad/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Application-Key": apiKey,
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 400) {
                        throw new Error(
                            "Incorrect username or password. Please try again."
                        );
                    } else if (response.status === 401) {
                        throw new Error(
                            "Unauthorized. Please check your API key."
                        );
                    } else {
                        throw new Error(
                            `Error: Could not login. HTTP status: ${response.status}`
                        );
                    }
                }
                return response.json();
            })
            .then((data) => {
                if (!data.status) {
                    throw new Error("Authentication failed. Please try again.");
                }

                // Check if the selected role matches the user's actual role from the API
                if (data.type !== role) {
                    alert(
                        `Role mismatch! You selected "${role}", but you are logged in as a "${data.type}".`
                    );
                    return;
                }
                // Store user information in session storage
                sessionStorage.setItem("username", data.username);
                sessionStorage.setItem("fullNameTh", data.displayname_th);
                sessionStorage.setItem("fullNameEn", data.displayname_en);
                sessionStorage.setItem("email", data.email);
                sessionStorage.setItem("department", data.department);
                sessionStorage.setItem(
                    "facultyOrOrg",
                    data.faculty || data.organization
                );
                sessionStorage.setItem("type", data.type); // Store user type for later use

                if (data.type === "student") {
                    sessionStorage.setItem("tuStatus", data.tu_status);
                } else if (data.type === "employee") {
                    sessionStorage.setItem("workStatus", data.StatusWork);
                    sessionStorage.setItem("employeeStatus", data.StatusEmp);
                }

                // Redirect to user information page
                window.location.href = "userInfo.html";
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message);
            });
    });
